import { ActionTypes, Actions } from "./actions";
import { NormalizedOutline, OPlanState } from "./types";

function buildNewOutline(id: string): NormalizedOutline {
  return {
    id: id,
    text: "",
    items: [],
  };
}

export const initialState: OPlanState = {
  outlines: { ["0"]: buildNewOutline("0") },
  defaultSaveName: new Date().toISOString().slice(0, -5),
  customSaveNames: [],
  showXml: true,
};

function calculateNewId(outline: NormalizedOutline): string {
  if (outline.items.length === 0) {
    return (outline.id + 1).toString();
  }
  return (outline.id + (outline.items.length + 1)).toString();
}

export function reducer(state: OPlanState, action: Actions) {
  switch (action.type) {
    case ActionTypes.TITLE_CHANGED:
      return {
        ...state,
        title: action.payload.textInput,
      };

    case ActionTypes.INPUT_UPDATED:
      const outlineId = action.payload.id;
      const outlineToUpdate = state.outlines[outlineId];
      outlineToUpdate.text = action.payload.textInput;
      return {
        ...state,
        outlines: { ...state.outlines },
      };

    case ActionTypes.ADD_CLICKED:
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

    case ActionTypes.PREVIEW_XML_CLICKED: {
      return { ...state, showXml: !state.showXml };
    }
    default:
      return state;
  }
}
