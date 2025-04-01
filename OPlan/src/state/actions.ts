// Define action types as an enum to ensure consistency and prevent typos
export enum ActionTypes {
  TITLE_CHANGED = "TITLE_CHANGED",
  INPUT_UPDATED = "INPUT_UPDATED",
  NOTE_UPDATED = "NOTE_UPDATED",
  ADD_SIBLING_CLICKED = "ADD_SIBLING_CLICKED",
  ADD_CHILD_CLICKED = "ADD_CHILD_CLICKED",
  REMOVE_CLICKED = "REMOVE_CLICKED",
  PREVIEW_XML_CLICKED = "PREVIEW_XML_CLICKED",
  IMPORT_XML_ADDED = "IMPORT_XML_ADDED",
  IMPORT_OPML_CLICKED = "IMPORT_OPML_CLICKED",
  SAVE_CLICKED = "SAVE_CLICKED",
  LOAD_SAVE_CLICKED = "LOAD_SAVE_CLICKED",
  REMOVE_SAVE_CLICKED = "REMOVE_SAVE_CLICKED",
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

export type ImportXmlAddedAction = {
  type: ActionTypes.IMPORT_XML_ADDED;
  payload: string;
};

export type ImportOpmlClickedAction = {
  type: ActionTypes.IMPORT_OPML_CLICKED;
};

export type SaveClickedAction = {
  type: ActionTypes.SAVE_CLICKED;
  payload: string;
};

export type LoadSavedClickedAction = {
  type: ActionTypes.LOAD_SAVE_CLICKED;
  payload: string;
};

export type RemoveSaveClickedAction = {
  type: ActionTypes.REMOVE_SAVE_CLICKED;
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
  | ImportXmlAddedAction
  | ImportOpmlClickedAction
  | SaveClickedAction
  | LoadSavedClickedAction
  | RemoveSaveClickedAction;
