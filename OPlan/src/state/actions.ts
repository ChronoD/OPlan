// Define action types as an enum to ensure consistency and prevent typos
export enum ActionTypes {
  TITLE_CHANGED = "TITLE_CHANGED",
  INPUT_UPDATED = "INPUT_UPDATED",
  NOTE_UPDATED = "NOTE_UPDATED",
  ADD_SIBLING_CLICKED = "ADD_SIBLING_CLICKED",
  ADD_CHILD_CLICKED = "ADD_CHILD_CLICKED",
  REMOVE_CLICKED = "REMOVE_CLICKED",
  PREVIEW_XML_CLICKED = "PREVIEW_XML_CLICKED",
  SET_XML = "SET_XML",
}

type InputUpdate = {
  textInput: string;
  id: string;
};

export type TitleChangedAction = {
  type: ActionTypes.TITLE_CHANGED;
  payload: InputUpdate;
};

export type InputUpdatedAction = {
  type: ActionTypes.INPUT_UPDATED;
  payload: InputUpdate;
};

export type NoteUpdatedAction = {
  type: ActionTypes.NOTE_UPDATED;
  payload: InputUpdate;
};

export type AddSiblingClickedAction = {
  type: ActionTypes.ADD_SIBLING_CLICKED;
  payload: { outlineId: string; parentOutlineId: string | null };
};

export type AddChildClickedAction = {
  type: ActionTypes.ADD_CHILD_CLICKED;
  payload: string;
};

export type RemoveClickedAction = {
  type: ActionTypes.REMOVE_CLICKED;
  payload: string;
};

export type PreviewXmlCLickedAction = {
  type: ActionTypes.PREVIEW_XML_CLICKED;
};

export type SetXmlAction = {
  type: ActionTypes.SET_XML;
  payload: string;
};

// Define a union type Actions to represent all possible action types
export type Actions =
  | TitleChangedAction
  | InputUpdatedAction
  | NoteUpdatedAction
  | AddSiblingClickedAction
  | AddChildClickedAction
  | RemoveClickedAction
  | PreviewXmlCLickedAction
  | SetXmlAction;
