// Define action types as an enum to ensure consistency and prevent typos
export enum ActionTypes {
  TITLE_CHANGED = "TITLE_CHANGED",
  INPUT_UPDATED = "INPUT_UPDATED",
  ADD_CLICKED = "ADD_CLICKED",
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

export type SetXmlAction = {
  type: ActionTypes.SET_XML;
  payload: string;
};

// Define a union type Actions to represent all possible action types
export type Actions =
  | TitleChangedAction
  | InputUpdatedAction
  | AddClickedAction
  | RemoveClickedAction
  | PreviewXmlCLickedAction
  | SetXmlAction;
