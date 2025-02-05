import { useState } from "react";
import "./App.css";
import xmlFormat from "xml-formatter";
import opml from "opml";

function parse(opmltext) {
  if (opmltext !== undefined) {
    let temprResult = null;
    opml.parse(opmltext, (error, parseResult) => {
      console.log(JSON.stringify(parseResult));
      temprResult = parseResult;
    });
    const xmlFromObj = opml.stringify(temprResult);
    console.log(xmlFromObj);
  }
}

function App() {
  const [xml, setXml] = useState<string | undefined>();

  let fileReader;

  const handleFileRead = (e) => {
    const content = fileReader.result;
    setXml(content);
    parse(content);
  };

  const handleFileChosen = (file) => {
    fileReader = new FileReader();
    fileReader.onloadend = handleFileRead;
    fileReader.readAsText(file);
  };

  return (
    <div>
      <input
        type="file"
        id="file"
        className="input-file"
        accept=".opml"
        onChange={(e) => handleFileChosen(e.target.files[0])}
      />
      <pre>{xml && xmlFormat(xml!)}</pre>
    </div>
  );
}

export default App;
