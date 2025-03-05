import { ChangeEvent } from "react";
import "../App.css";
import opml from "opml";
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
} from "@mui/material";
import { denormalize } from "../state/functions";
import { JsonForXml, OPlanState } from "../state/types";

// function parse(opmltext, useJson) {
//   if (opmltext !== undefined) {
//     opml.parse(opmltext, (error, parseResult) => {
//       useJson(parseResult);
//     });
//   }
// }

function Panel() {
  const { state, dispatch } = useAppContext();

  function onTitleUpdate(event: ChangeEvent) {
    dispatch({
      type: ActionTypes.TITLE_CHANGED,
      payload: { textInput: event.target.value, id: event.target.id },
    });
  }

  function onAddClicked(id: string, index: number) {
    return () => {
      dispatch({
        type: ActionTypes.ADD_CLICKED,
        payload: id,
      });
      handleKeyPress(index);
    };
  }

  function onShowPreviewClicked() {
    dispatch({
      type: ActionTypes.PREVIEW_XML_CLICKED,
    });
  }

  const outlines = denormalize(state.outlines);

  function stateToXmlJson(state: OPlanState): JsonForXml {
    return {
      opml: {
        head: { title: state.title },
        body: { subs: outlines },
      },
    };
  }

  const json = stateToXmlJson(state);
  const xml = json ? opml.stringify(json) : null;
  const file = new Blob([xml], { type: "text/plain" });
  return (
    <>
      <Grid2 container spacing={2} style={{ height: "101vh" }}>
        <Grid2
          size={{ xs: 6, md: 8 }}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
          }}
        >
          <TextareaAutosize
            style={{ minHeight: "20px", width: "300px" }}
            aria-label="Title"
            placeholder=">"
            value={state.title}
            onChange={onTitleUpdate}
          />
          <div style={{ padding: "5px" }}>
            {outlines &&
              outlines.map((out, index) => (
                <OutlineComponent
                  outline={out}
                  addSibling={onAddClicked(out.id, index)}
                  key={out.id}
                />
              ))}
          </div>
        </Grid2>
        <Grid2 size={{ xs: 6, md: 4 }}>
          <Grid2 size={8} style={{ width: "100%" }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Button
                sx={{
                  width: "200px",
                  marginBottom: "12px",
                  borderRadius: "50px",
                }}
                onClick={() => {
                  navigator.clipboard.writeText(xml);
                }}
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
                  download="outlines.opml"
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

            {state.showXml && <Preview xml={xml} />}
          </Grid2>
        </Grid2>
        {/* <input
          type="file"
          id="file"
          className="input-file"
          accept=".opml"
          onChange={(e) => handleFileChosen(e.target.files[0])}
        /> */}
        {/* <OutlineComponent outline={context.state} /> */}
        {/*
        <TextareaAutosize
          style={{ minHeight: "60%", width: "100%" }}
          aria-label="empty textarea"
          placeholder="Empty"
          value={json && opml.stringify(json)}
        />
       */}
        {/* <TextareaAutosize
          style={{ minHeight: "60%", width: "100%" }}
          aria-label="empty textarea"
          placeholder="Empty"
          value={json && JSON.stringify(json, null, 2)}
        /> */}
      </Grid2>
    </>
  );
}

export default Panel;
