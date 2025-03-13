// Define action types as an enum to ensure consistency and prevent typos
export enum ActionTypes {
  INPUT_UPDATED = "INPUT_UPDATED",
  NOTE_UPDATED = "NOTE_UPDATED",
  ADD_CLICKED = "ADD_CLICKED",
  REMOVE_CLICKED = "REMOVE_CLICKED",
  PREVIEW_XML_CLICKED = "PREVIEW_XML_CLICKED",
  IMPORT_XML_ADDED = "IMPORT_XML_ADDED",
  IMPORT_OPML_CLICKED = "IMPORT_OPML_CLICKED",
}

type InputUpdate = {
  textInput: string;
  id: string;
};

export type InputUpdatedAction = {
  type: ActionTypes.INPUT_UPDATED;
  payload: InputUpdate;
};

export type NoteUpdatedAction = {
  type: ActionTypes.NOTE_UPDATED;
  payload: InputUpdate;
};

export type AddClickedAction = {
  type: ActionTypes.ADD_CLICKED;
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

// Define a union type Actions to represent all possible action types
export type Actions =
  | InputUpdatedAction
  | NoteUpdatedAction
  | AddClickedAction
  | RemoveClickedAction
  | PreviewXmlCLickedAction
  | ImportXmlAddedAction
  | ImportOpmlClickedAction;
