import {
  asOpmlJson,
  denormalize,
  normalize,
  unbeautifyXml,
  updatePosition,
  toXml,
} from "./functions";
import { ActionTypes, Actions } from "./actions";
import { NormalizedOutline, OPlanState, OutlineMap, OutlineRaw } from "./types";
import opml from "opml";

function buildNewOutline(id: string): NormalizedOutline {
  return {
    id: id,
    text: "",
    _note: "",
    items: [],
  };
}

function buildNewOutlineWithChild(
  id: string,
  childId: string
): NormalizedOutline {
  return {
    id: id,
    text: "",
    _note: "",
    items: [childId],
  };
}

export const initialState: OPlanState = {
  outlines: {
    ["1"]: buildNewOutline("1"),
    // ["3"]: buildNewOutlineWithChild("3", "31"),
    // ["31"]: buildNewOutline("31"),
  },
  showXml: true,
  topOutlineOrder: ["1"],
  title: "",
  importXml: null,
  importEnabled: true,
};

function calculateNewId(outlines: OutlineMap): string {
  const outlineIds = Object.keys(outlines).sort(
    (o1, o2) => Number(o1) - Number(o2)
  );
  const lastId = outlineIds.pop();
  const nextId = lastId ? Number(lastId) + 1 : 0;
  return nextId.toString();
}

function addIds(outline: OutlineRaw, indexStart: string): any {
  if (!outline.id) {
    outline.id = indexStart;
  }
  return {
    ...outline,
    subs: outline.subs
      ? outline.subs.map((s, index) => addIds(s, indexStart + index))
      : [],
    items: outline.subs ? outline.subs.map((sub) => sub.id) : [],
  };
}

function addIdsMultiple(outlines: OutlineRaw[]): OutlineRaw[] {
  return outlines.map((outline, index) => addIds(outline, index.toString()));
}

export function reducer(state: OPlanState, action: Actions) {
  switch (action.type) {
    case ActionTypes.TITLE_CHANGED:
      return {
        ...state,
        title: action.payload.textInput,
      };

    case ActionTypes.INPUT_UPDATED: {
      const outlineId = action.payload.id;
      const outlineToUpdate = state.outlines[outlineId];
      outlineToUpdate.text = action.payload.textInput;
      return {
        ...state,
        outlines: { ...state.outlines },
      };
    }
    case ActionTypes.NOTE_UPDATED: {
      const outlineId = action.payload.id.replace("_note", "");
      const outlineToUpdate = state.outlines[outlineId];
      outlineToUpdate._note = action.payload.textInput;
      return {
        ...state,
        outlines: { ...state.outlines },
      };
    }
    case ActionTypes.ADD_SIBLING_CLICKED: {
      const newOutlineId = calculateNewId(state.outlines);
      const newOutline = buildNewOutline(newOutlineId);
      state.outlines[newOutlineId] = newOutline;

      const outId = action.payload.outlineId;
      let topOrder = state.topOutlineOrder;
      if (action.payload.parentOutlineId === null) {
        const outlineIndex = topOrder.indexOf(outId);
        topOrder.splice(outlineIndex + 1, 0, newOutlineId);
      } else {
        const parentOutline = state.outlines[action.payload.parentOutlineId];
        const outlineIndex = parentOutline.items.indexOf(outId);
        parentOutline.items.splice(outlineIndex + 1, 0, newOutlineId);
        state.outlines[action.payload.parentOutlineId] = {
          ...parentOutline,
        };
      }
      setTimeout(() => {
        let a = document.getElementById(newOutlineId);
        a?.focus();
      }, 200);

      return {
        ...state,
        outlines: { ...state.outlines },
        topOutlineOrder: topOrder,
      };
    }
    case ActionTypes.ADD_CHILD_CLICKED:
      const targetOutlineId = action.payload;
      const newOutlineId = calculateNewId(state.outlines);
      const targetOutline = state.outlines[targetOutlineId];
      state.outlines[targetOutlineId] = {
        ...targetOutline,
        items: [...targetOutline.items, newOutlineId],
      };
      const newOutline = buildNewOutline(newOutlineId);
      state.outlines[newOutlineId] = newOutline;

      setTimeout(() => {
        let a = document.getElementById(newOutlineId);
        a?.focus();
      }, 200);

      return {
        ...state,
        outlines: { ...state.outlines },
      };
    case ActionTypes.REMOVE_CLICKED: {
      const outlineId = action.payload;
      const outlineToRemove = state.outlines[outlineId];
      const isLastOutline = Object.values(state.outlines).length === 1;
      if (!isLastOutline && outlineToRemove.items.length === 0) {
        delete state.outlines[outlineId];
        Object.entries(state.outlines).map(([k, v]) => {
          if (v.items.includes(outlineId)) {
            v.items.splice(v.items.indexOf(outlineId), 1);
            return [k, { ...v, items: v.items }];
          }
          return [k, { ...v, items: v.items }];
        });
        return {
          ...state,
          outlines: { ...state.outlines },
        };
      }
      return {
        ...state,
        outlines: { ...state.outlines },
      };
    }
    case ActionTypes.IMPORT_XML_ADDED: {
      return {
        ...state,
        importXml: unbeautifyXml(action.payload),
        importEnabled: true,
      };
    }
    case ActionTypes.IMPORT_OPML_CLICKED: {
      let stateAfter = state;
      opml.parse(stateAfter.importXml, (error, parseResult) => {
        if (error !== undefined) {
          console.log("error parsing opml: ", error);
          stateAfter = { ...state, importEnabled: false };
        } else {
          const outlinesTreeWithIds = addIdsMultiple(
            parseResult.opml.body.subs
          );
          const normalizedMultiples = outlinesTreeWithIds.map(normalize);
          const outlinesMap = new Object();
          normalizedMultiples.map((outlineKeyValue) =>
            Object.entries(outlineKeyValue).map((outMap) => {
              return Object.assign(outlinesMap, {
                [outMap[0].toString()]: outMap[1],
              });
            })
          );
          let enrichedOutline = parseResult.opml.body.subs[0];
          enrichedOutline = addIds(enrichedOutline, "0");
          stateAfter = {
            ...state,
            outlines: outlinesMap as any as OutlineMap,
            title: parseResult.opml.head.title,
            importXml: null,
            importEnabled: true,
          };
        }
      });
      return {
        ...stateAfter,
      };
    }
    case ActionTypes.PREVIEW_XML_CLICKED: {
      return { ...state, showXml: !state.showXml };
    }
    case ActionTypes.SAVE_CLICKED: {
      const saveName = "Save_" + action.payload;
      try {
        const outlines = denormalize(state.outlines);
        const json = asOpmlJson(state.title, outlines);
        const xml = toXml(json);
        const encodedXml = btoa(xml);
        localStorage.setItem(saveName, encodedXml);
      } catch (e) {
        console.log("Unable to save: ", e);
      }

      return { ...state };
    }
    case ActionTypes.LOAD_SAVE_CLICKED: {
      const saveContents = localStorage.getItem(action.payload);
      if (saveContents) {
        const xml = atob(saveContents);
        let stateAfter = state;
        opml.parse(xml, (error, parseResult) => {
          if (error !== undefined) {
            console.log("Error opening save: ", error);
            stateAfter = { ...state };
          } else {
            const outlinesTreeWithIds = addIdsMultiple(
              parseResult.opml.body.subs
            );
            const normalizedMultiples = outlinesTreeWithIds.map(normalize);
            const outlinesMap = new Object();
            normalizedMultiples.map((outlineKeyValue) =>
              Object.entries(outlineKeyValue).map((outMap) => {
                return Object.assign(outlinesMap, {
                  [outMap[0].toString()]: outMap[1],
                });
              })
            );
            let enrichedOutline = parseResult.opml.body.subs[0];
            enrichedOutline = addIds(enrichedOutline, "0");
            stateAfter = {
              ...state,
              outlines: outlinesMap as any as OutlineMap,
              title: parseResult.opml.head.title,
            };
          }
        });

        return {
          ...stateAfter,
        };
      }
      return { ...state };
    }
    case ActionTypes.REMOVE_SAVE_CLICKED: {
      localStorage.removeItem(action.payload);
      return { ...state };
    }
    case ActionTypes.MOVE_UP_CLICKED: {
      if (action.payload.parentOutlineId === null) {
        const currentIndex = state.topOutlineOrder.indexOf(
          action.payload.outlineId
        );
        console.log(currentIndex);
        const targetIndex = currentIndex > 0 ? currentIndex - 1 : 0;
        const newTopOutlineOrder = updatePosition(
          state.topOutlineOrder,
          targetIndex,
          action.payload.outlineId
        );
        console.log(newTopOutlineOrder);
        return { ...state, topOutlineOrder: newTopOutlineOrder };
      } else {
        const parentOutline = state.outlines[action.payload.parentOutlineId];
        const currentIndex = parentOutline.items.indexOf(
          action.payload.outlineId
        );
        const targetIndex = currentIndex > 0 ? currentIndex - 1 : 0;
        const newItemsOrder = updatePosition(
          parentOutline.items,
          currentIndex,
          targetIndex.toString()
        );
        state.outlines[action.payload.parentOutlineId] = {
          ...parentOutline,
          items: [...newItemsOrder],
        };
        console.log(newItemsOrder);

        return { ...state };
      }
    }
    case ActionTypes.MOVE_DOWN_CLICKED: {
      console.log(action.payload);
      if (action.payload.parentOutlineId === null) {
        const currentIndex = state.topOutlineOrder.indexOf(
          action.payload.outlineId
        );
        const targetIndex =
          currentIndex < state.topOutlineOrder.length
            ? currentIndex + 1
            : state.topOutlineOrder.length;
        const newTopOutlineOrder = updatePosition(
          state.topOutlineOrder,
          currentIndex,
          targetIndex.toString()
        );
        return { ...state, topOutlineOrder: newTopOutlineOrder };
      } else {
        const parentOutline = state.outlines[action.payload.parentOutlineId];
        const currentIndex = parentOutline.items.indexOf(
          action.payload.outlineId
        );
        const targetIndex =
          currentIndex < state.topOutlineOrder.length
            ? currentIndex + 1
            : state.topOutlineOrder.length;
        const newItemsOrder = updatePosition(
          parentOutline.items,
          currentIndex,
          targetIndex.toString()
        );
        state.outlines[action.payload.parentOutlineId] = {
          ...parentOutline,
          items: [...newItemsOrder],
        };
        return { ...state };
      }
    }
    case ActionTypes.MOVE_OUT_CLICKED: {
      if (action.payload.parentOutlineId !== null) {
        const parentOutline = state.outlines[action.payload.parentOutlineId];
        const topParentIndex = state.topOutlineOrder.indexOf(parentOutline.id);
        if (topParentIndex === -1) {
          const updatedParentItems = parentOutline.items.filter(
            (item) => item !== action.payload.outlineId
          );
          state.outlines[action.payload.parentOutlineId] = {
            ...parentOutline,
            items: updatedParentItems,
          };
          const outlines = Object.keys(state.outlines).map(function (key) {
            return state.outlines[key];
          });
          const parentsParentId = outlines.filter(
            (outline) => outline.items.indexOf(parentOutline.id) !== -1
          )[0].id;
          const parentsParent = state.outlines[parentsParentId];
          const currentParentIndexInParentsParent = parentsParent.items.indexOf(
            parentOutline.id
          );
          const indexToPutOutlineOnParentsParentItems =
            currentParentIndexInParentsParent > 0
              ? currentParentIndexInParentsParent - 1
              : 0;
          const newparentsParentItemsOrder = updatePosition(
            parentsParent.items,
            indexToPutOutlineOnParentsParentItems,
            action.payload.outlineId
          );
          state.outlines[parentsParent.id] = {
            ...parentsParent,
            items: newparentsParentItemsOrder,
          };
          return { ...state };
        } else {
          const targetIndex = topParentIndex > 0 ? topParentIndex - 1 : 0;
          const newTopOutlineOrder: string[] = updatePosition(
            state.topOutlineOrder.map(String),
            targetIndex,
            action.payload.outlineId
          );
          const updatedParentItems = parentOutline.items.filter(
            (item) => item !== action.payload.outlineId
          );
          state.outlines[action.payload.parentOutlineId] = {
            ...parentOutline,
            items: updatedParentItems,
          };
          return { ...state, topOutlineOrder: newTopOutlineOrder };
        }
      }
      return { ...state };
    }
    case ActionTypes.MOVE_IN_CLICKED: {
      console.log(action.payload);
      if (action.payload.parentOutlineId === null) {
        const currentIndex = state.topOutlineOrder.indexOf(
          action.payload.outlineId
        );
        const targetIndex =
          currentIndex < state.topOutlineOrder.length
            ? currentIndex + 1
            : state.topOutlineOrder.length;
        const newTopOutlineOrder = updatePosition(
          state.topOutlineOrder,
          currentIndex,
          targetIndex.toString()
        );
        return { ...state, topOutlineOrder: newTopOutlineOrder };
      } else {
        const parentOutline = state.outlines[action.payload.parentOutlineId];
        const currentIndex = parentOutline.items.indexOf(
          action.payload.outlineId
        );
        const targetIndex =
          currentIndex < state.topOutlineOrder.length
            ? currentIndex + 1
            : state.topOutlineOrder.length;
        const newItemsOrder = updatePosition(
          parentOutline.items,
          currentIndex,
          targetIndex.toString()
        );
        state.outlines[action.payload.parentOutlineId] = {
          ...parentOutline,
          items: [...newItemsOrder],
        };
        return { ...state };
      }
    }
    default:
      return state;
  }
}
