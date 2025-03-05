import "../App.css";
import { Box, TextareaAutosize } from "@mui/material";

type PreviewProps = {
  xml: string | undefined;
};

function Preview({ xml }: PreviewProps) {
  return (
    <Box flexDirection="column">
      <TextareaAutosize
        style={{ minHeight: "60%", width: "100%" }}
        aria-label="empty textarea"
        placeholder=">"
        value={xml}
      />
    </Box>
  );
}

export default Preview;
