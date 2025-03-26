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
  outline: Outline;
  parentOutlineId: string | null;
}

function OutlineComponent({ outline, parentOutlineId }: OutlineProps) {
  const { dispatch } = useAppContext();

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

  function onRemoveClicked(id: string) {
    return () => {
      if (outline.subs.length === 0)
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
      onAddSiblingClicked();
    }
    if (event.key === "Tab") {
      event.preventDefault();
      onAddChildClicked(outline.id)();
    }
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
              disabled={outline.subs.length !== 0}
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
            <IconButton style={{ padding: 0 }} onClick={onAddSiblingClicked}>
              <AddIcon />
            </IconButton>
            <IconButton
              style={{ padding: 0 }}
              onClick={onAddChildClicked(outline.id)}
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
    </>
  );
}

export default OutlineComponent;
