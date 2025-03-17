import { normalize, normalizeMultiple, unbeautifyXml } from "./functions";
import { ActionTypes, Actions } from "./actions";
import {
  NormalizedOutline,
  OPlanState,
  Outline,
  OutlineMap,
  OutlineRaw,
} from "./types";
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
    // ["0"]: buildNewOutlineWithChild("0", "01"),
    // ["01"]: buildNewOutline("01"),
    ["1"]: buildNewOutline("1"),
  },
  showXml: true,
  importXml: null,
  importEnabled: true,
};

function calculateNewId(outline: NormalizedOutline): string {
  if (outline.items.length === 0) {
    return (outline.id + 1).toString();
  }
  return (outline.id + (outline.items.length + 1)).toString();
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
    case ActionTypes.ADD_CLICKED:
      console.log("ADD_CLICKED", action.payload);

      const outlineToAddChild = state.outlines[action.payload];
      const newId = calculateNewId(outlineToAddChild);
      state.outlines[action.payload] = {
        ...outlineToAddChild,
        items: [...outlineToAddChild.items, newId],
      };
      const newOutline = buildNewOutline(newId);
      state.outlines[newId] = newOutline;

      setTimeout(() => {
        let a = document.getElementById(newId);
        a?.focus();
      }, 200);

      return {
        ...state,
        outlines: { ...state.outlines },
      };

    case ActionTypes.REMOVE_CLICKED: {
      const outlineId = action.payload;
      const outlineToRemove = state.outlines[outlineId];
      if (outlineToRemove.items.length === 0) {
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
          stateAfter = { ...state, importEnabled: false };
        } else {
          // console.log("subs size: ", parseResult.opml.body.subs.length);
          const multipleOutlinesWithIds = addIdsMultiple(
            parseResult.opml.body.subs
          );
          console.log("multipleOutlinesWithIds: ", multipleOutlinesWithIds);

          const normalizedMultiples = normalizeMultiple(
            multipleOutlinesWithIds as Outline[]
          );
          console.log("normalizedMultiples: ", normalizedMultiples);

          // console.log("normalizedMultiples: ", normalizedMultiples);
          // console.log(
          //   "json: ",
          //   JSON.stringify(parseResult.opml.body.subs[0], null, "\t")
          // );
          let enrichedOutline = parseResult.opml.body.subs[0];
          enrichedOutline = addIds(enrichedOutline, "0");
          stateAfter = {
            ...state,
            outlines: normalizedMultiples,
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
