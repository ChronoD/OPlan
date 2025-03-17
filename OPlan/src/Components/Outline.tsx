import "../App.css";
import { Box, IconButton, TextareaAutosize } from "@mui/material";
import { useAppContext } from "../state/useAppContext";
import { Outline } from "../state/types";
import { ActionTypes } from "../state/actions";
import { ChangeEvent } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";

interface OutlineProps {
  outline: Outline | undefined;
  addSibling: () => void;
}

function OutlineComponent({ outline, addSibling }: OutlineProps) {
  const { dispatch } = useAppContext();

  function onAddClicked(id: string) {
    return () => {
      dispatch({
        type: ActionTypes.ADD_CLICKED,
        payload: id,
      });
    };
  }
  function onRemoveClicked(id: string) {
    return () => {
      if (id !== "01")
        dispatch({
          type: ActionTypes.REMOVE_CLICKED,
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
      addSibling();
    }
    if (event.key === "Tab") {
      event.preventDefault();
      onAddClicked(outline ? outline.id : "id")();
    }
  }

  if (!outline || !outline.subs) {
    // console.log(outline);
  }
  return (
    <>
      <div
        style={{
          padding: "6px 0px 6px 6px",
          display: "flex",
          justifyContent: "start",
          flexDirection: "column",
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
            <IconButton
              style={{ padding: 0 }}
              color="secondary"
              disabled={outline.id === "01" || outline.subs.length !== 0}
              onClick={onRemoveClicked(outline.id)}
            >
              <RemoveIcon />
            </IconButton>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <TextareaAutosize
                style={{
                  minHeight: "20px",
                  minWidth: "600px",
                  fontSize: "20px",
                  backgroundColor: "#596169",
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
            <IconButton style={{ padding: 0 }} onClick={addSibling}>
              <AddIcon />
            </IconButton>
            <IconButton
              style={{ padding: 0 }}
              onClick={onAddClicked(outline.id)}
            >
              <SubdirectoryArrowRightIcon />
            </IconButton>
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
            outline.subs.map((sub) => (
              <OutlineComponent
                key={sub.id}
                outline={sub}
                addSibling={onAddClicked(outline.id)}
              />
            ))}
        </div>
      </div>
    </>
  );
}

export default OutlineComponent;
