import { normalize, unbeautifyXml } from "./functions";
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
  topOutlineOrder: [1],
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
        const outlineIndex = topOrder.indexOf(Number(outId));
        topOrder.splice(outlineIndex + 1, 0, Number(newOutlineId));
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
    default:
      return state;
  }
}
