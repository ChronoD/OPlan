import { useState } from "react";
import "./App.css";
import opml from "opml";
import { TextareaAutosize } from "@mui/material";

function parse(opmltext, useJson) {
  if (opmltext !== undefined) {
    opml.parse(opmltext, (error, parseResult) => {
      useJson(parseResult);
    });
  }
}

function Panel() {
  const [json, setJson] = useState<string | undefined>();

  let fileReader;

  const handleFileRead = (e) => {
    const content = fileReader.result;
    parse(content, setJson);
  };

  const handleFileChosen = (file) => {
    fileReader = new FileReader();
    fileReader.onloadend = handleFileRead;
    fileReader.readAsText(file);
  };

  return (
    <>
      <div
        style={{ padding: "30px", display: "flex", justifyContent: "start" }}
      >
        <input
          type="file"
          id="file"
          className="input-file"
          accept=".opml"
          onChange={(e) => handleFileChosen(e.target.files[0])}
        />
      </div>
      <div
        style={{
          textAlign: "start",
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <TextareaAutosize
          style={{ minHeight: "60%", width: "100%" }}
          aria-label="empty textarea"
          placeholder="Empty"
          value={json && opml.stringify(json)}
        />

        <TextareaAutosize
          style={{ minHeight: "60%", width: "100%" }}
          aria-label="empty textarea"
          placeholder="Empty"
          value={json && JSON.stringify(json, null, 2)}
        />
      </div>
    </>
  );
}

export default Panel;
