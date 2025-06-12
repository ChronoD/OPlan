import React, { ChangeEvent, ChangeEventHandler, useReducer } from "react";
import "../App.css";
import { useAppContext } from "../state/useAppContext";
import OutlineComponent from "./Outline";
import { ActionTypes } from "../state/actions";
import Preview from "./Preview";
import {
  Grid2,
  Switch,
  TextareaAutosize,
  FormGroup,
  FormControlLabel,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import { asOpmlJson, denormalize, toXml } from "../state/functions";
import UploadIcon from "@mui/icons-material/Upload";
import SaveTool from "./SaveTool";
import { buildNewOutline, reducer } from "../state";

function Panel({
  isVisible,
  setTabName,
}: {
  isVisible: boolean;
  setTabName: (name: string) => void;
}) {
  const [state, dispatch] = useReducer(reducer, {
    outlines: {
      ["1"]: buildNewOutline("1"),
      // ["3"]: buildNewOutlineWithChild("3", "31"),
      // ["31"]: buildNewOutline("31"),
    },
    showXml: true,
    topOutlineOrder: ["1"],
    title: "",
    importXml: null,
    importEnabled: true,
  });

  function onTitleUpdate(event: ChangeEvent) {
    setTabName(event.target.value);
    dispatch({
      type: ActionTypes.TITLE_CHANGED,
      payload: { textInput: event.target.value, id: event.target.id },
    });
  }

  function onShowPreviewClicked() {
    dispatch({
      type: ActionTypes.PREVIEW_XML_CLICKED,
    });
  }

  function onImportXmlFileAdded(e: ChangeEventHandler<HTMLInputElement>) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        dispatch({
          type: ActionTypes.IMPORT_XML_ADDED,
          payload: e.target.result,
        });
      };
      reader.readAsText(file);
    }
  }

  function onImportXmlAdded(
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void {
    dispatch({
      type: ActionTypes.IMPORT_XML_ADDED,
      payload: e.target.value,
    });
  }

  function onImportClicked(
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void {
    dispatch({
      type: ActionTypes.IMPORT_OPML_CLICKED,
    });
  }

  function save(): void {
    const saveName = state.title + "_" + new Date().toISOString().slice(0, -5);

    dispatch({
      type: ActionTypes.SAVE_CLICKED,
      payload: saveName,
    });
  }

  function load(saveName: string): () => void {
    return () => {
      dispatch({
        type: ActionTypes.LOAD_SAVE_CLICKED,
        payload: saveName,
      });
    };
  }

  function removeSave(saveName: string): () => void {
    return () => {
      dispatch({
        type: ActionTypes.REMOVE_SAVE_CLICKED,
        payload: saveName,
      });
    };
  }

  function copyToClipboad() {
    navigator.clipboard.writeText(xml);
  }

  const outlines = denormalize(state.outlines);
  const json = asOpmlJson(state.title, outlines);
  const xml = toXml(json);
  const file = new Blob([xml], { type: "text/plain" });

  const allSaves = [];
  for (var i = 0; i < localStorage.length; i++) {
    if (localStorage) {
      const keyName = localStorage.key(i);
      if (keyName?.startsWith("Save_")) {
        allSaves.push(keyName);
      }
    }
  }

  return (
    <div
      style={{
        backgroundColor: "#bdb7b7",
        display: isVisible ? "block" : "none",
      }}
    >
      <Grid2 container spacing={2} style={{ height: "140vh" }}>
        <Grid2
          size={{ xs: 6, md: 8 }}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
          }}
        >
          <TextareaAutosize
            style={{
              minHeight: "30px",
              width: "300px",
              fontSize: "22px",
              backgroundColor: "#527DA1",
            }}
            aria-label="Title"
            placeholder="Title"
            value={state.title || ""}
            onChange={onTitleUpdate}
          />
          <div style={{ padding: "5px" }}>
            {outlines &&
              outlines
                .sort(
                  (o1, o2) =>
                    state.topOutlineOrder.indexOf(o1.id) -
                    state.topOutlineOrder.indexOf(o2.id)
                )
                .map((out) => (
                  <OutlineComponent
                    outline={out}
                    key={out.id}
                    parentOutlineId={null}
                    dispatch={dispatch}
                  />
                ))}
          </div>
        </Grid2>
        <Grid2 size={{ xs: 6, md: 4 }}>
          <Grid2 size={8} style={{ width: "100%" }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <SaveTool
                save={save}
                load={load}
                saves={allSaves}
                removeSave={removeSave}
              />
              <input
                type="file"
                id="file"
                className="input-file"
                accept=".opml"
                onChange={onImportXmlFileAdded}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  marginBottom: "12px",
                }}
              >
                <TextareaAutosize
                  style={{
                    padding: 5,
                    width: "300px",
                  }}
                  value={state.importXml || ""}
                  onChange={onImportXmlAdded}
                />
                <IconButton
                  style={{ padding: 0 }}
                  disabled={!state.importEnabled}
                  color="secondary"
                  onClick={onImportClicked}
                >
                  <UploadIcon />
                </IconButton>
              </Box>
              <Button
                sx={{
                  width: "200px",
                  marginBottom: "12px",
                  borderRadius: "50px",
                }}
                onClick={copyToClipboad}
                variant="outlined"
              >
                Copy to Clipboard
              </Button>
              <Button
                sx={{
                  width: "200px",
                  marginBottom: "12px",
                  borderRadius: "50px",
                }}
                variant="contained"
              >
                <a
                  download={state.title + ".opml"}
                  target="_blank"
                  rel="noreferrer"
                  href={URL.createObjectURL(file)}
                  style={{
                    textDecoration: "inherit",
                    color: "inherit",
                  }}
                >
                  Export to file
                </a>
              </Button>
            </Box>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    onChange={onShowPreviewClicked}
                    value={state.showXml}
                    inputProps={{ "aria-label": "Toggle preview" }}
                  />
                }
                label="OPML PREVIEW"
              />
            </FormGroup>

            {state.showXml && (
              <Preview xml={xml} copyToClipboad={copyToClipboad} />
            )}
          </Grid2>
        </Grid2>
      </Grid2>
    </div>
  );
}

export default Panel;
