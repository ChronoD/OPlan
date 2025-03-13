import "../App.css";
import { Box, IconButton, TextareaAutosize } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

type PreviewProps = {
  xml: string | undefined;
  copyToClipboad: () => void;
};

function Preview({ xml, copyToClipboad }: PreviewProps) {
  return (
    <Box flexDirection="column">
      <IconButton
        style={{
          padding: 0,
          position: "absolute",
          inset: "auto 25px auto auto",
        }}
        color="secondary"
        onClick={copyToClipboad}
      >
        <ContentCopyIcon />
      </IconButton>
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
