import "../App.css";
import { Box, TextareaAutosize } from "@mui/material";
import { useAppContext } from "../state/useAppContext";
import { Outline } from "../state/types";
import { Actions, ActionTypes } from "../state/actions";
import { ChangeEvent } from "react";
import OutlineLeftButtons from "./OutlineLeftButtons";

interface OutlineProps {
  outline: Outline;
  parentOutlineId: string | null;
  dispatch: React.Dispatch<Actions>;
}

function OutlineComponent({
  outline,
  parentOutlineId,
  dispatch,
}: OutlineProps) {
  function onAddSiblingClicked() {
    dispatch({
      type: ActionTypes.ADD_SIBLING_CLICKED,
      payload: { outlineId: outline.id, parentOutlineId: parentOutlineId },
    });
  }

  function onAddChildClicked(id: string) {
    return () => {
      dispatch({
        type: ActionTypes.ADD_CHILD_CLICKED,
        payload: id,
      });
    };
  }

  function onInputUpdate(event: ChangeEvent<HTMLTextAreaElement>) {
    dispatch({
      type: ActionTypes.INPUT_UPDATED,
      payload: { textInput: event.target.value, id: event.target.id },
    });
  }

  function onNoteUpdate(event: ChangeEvent<HTMLTextAreaElement>) {
    dispatch({
      type: ActionTypes.NOTE_UPDATED,
      payload: { textInput: event.target.value, id: event.target.id },
    });
  }

  function onKeyDown(event: KeyboardEventHandler<HTMLTextAreaElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      onAddSiblingClicked();
    }
    if (event.key === "Tab") {
      event.preventDefault();
      onAddChildClicked(outline.id)();
    }
  }

  return (
    <div
      style={{
        padding: "6px 0px 6px 6px",
        display: "flex",
        justifyContent: "start",
        flexDirection: "column",
        minHeight: "70px",
      }}
    >
      {outline && (
        <div
          style={{
            display: "flex",
            justifyContent: "start",
            flexDirection: "row",
            paddingLeft: "12px",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <TextareaAutosize
              style={{
                minHeight: "20px",
                minWidth: "600px",
                fontSize: "20px",
              }}
              aria-label="empty textarea"
              placeholder=">"
              value={outline.text}
              id={outline.id}
              onChange={onInputUpdate}
              onKeyDown={onKeyDown}
            />
            <TextareaAutosize
              style={{
                width: "600px",
                background: "#6d7271",
                fontSize: "16px",
              }}
              aria-label="empty textarea"
              placeholder=""
              value={outline._note}
              id={outline.id + "_note"}
              onChange={onNoteUpdate}
              onKeyDown={onKeyDown}
            />
          </Box>
          <OutlineLeftButtons
            outline={outline}
            parentOutlineId={parentOutlineId}
            dispatch={dispatch}
          />
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
        }}
      >
        {outline &&
          outline.subs != undefined &&
          outline.subs.length != 0 &&
          outline.subs
            .sort(
              (o1, o2) =>
                outline.items.indexOf(Number(o2.id)) -
                outline.items.indexOf(Number(o1.id))
            )
            .map((sub) => (
              <OutlineComponent
                key={sub.id}
                outline={sub}
                parentOutlineId={outline.id}
              />
            ))}
      </div>
    </div>
  );
}

export default OutlineComponent;
