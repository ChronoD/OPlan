import "../App.css";
import {
  Accordion,
  Box,
  IconButton,
  Typography,
  AccordionSummary,
  ListItem,
  ListItemText,
  List,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SaveIcon from "@mui/icons-material/Save";
import OpenInBrowserIcon from "@mui/icons-material/OpenInBrowser";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

interface SaveToolProps {
  save: () => void;
  load: (saveName: string) => () => void;
  saves: string[];
  removeSave: (saveName: string) => () => void;
}

function SaveTool({ save, load, saves, removeSave }: SaveToolProps) {
  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", marginBottom: "10px" }}
    >
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <IconButton color="secondary" onClick={save}>
          <Typography variant="subtitle1" component="div">
            Save
          </Typography>
          <SaveIcon />
        </IconButton>
      </Box>

      <Accordion
        sx={{
          backgroundColor: "gray",
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span">Saves</Typography>
        </AccordionSummary>
        <List dense>
          {saves &&
            saves
              .sort((s1, s2) => s2.localeCompare(s1))
              .map((save) => (
                <ListItem key={save}>
                  <IconButton color="primary" onClick={removeSave(save)}>
                    <DeleteOutlineIcon />
                  </IconButton>
                  <ListItemText primary={save} />
                  <IconButton color="secondary" onClick={load(save)}>
                    <OpenInBrowserIcon />
                  </IconButton>
                </ListItem>
              ))}
        </List>
      </Accordion>
    </Box>
  );
}

export default SaveTool;
