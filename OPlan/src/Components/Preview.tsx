import "../App.css";
import opml from "opml";
import { Box, TextareaAutosize } from "@mui/material";

type PreviewProps = {
  json: {} | undefined;
};

function Preview({ json }: PreviewProps) {
  return (
    <Box flexDirection="column">
      <TextareaAutosize
        style={{ minHeight: "60%", width: "100%" }}
        aria-label="empty textarea"
        placeholder=">"
        value={json && opml.stringify(json)}
      />
    </Box>
  );
}

export default Preview;
