import "../App.css";
import { Box, IconButton } from "@mui/material";
import { useAppContext } from "../state/useAppContext";
import { Outline } from "../state/types";
import { ActionTypes } from "../state/actions";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface OutlineProps {
  outline: Outline;
  parentOutlineId: string | null;
}

function OutlineLeftButtons({ outline, parentOutlineId }: OutlineProps) {
  const { dispatch } = useAppContext();

  function onRemoveClicked(id: string) {
    return () => {
      if (outline.subs.length === 0)
        dispatch({
          type: ActionTypes.REMOVE_CLICKED,
          payload: id,
        });
    };
  }

  function onUpClicked() {
    dispatch({
      type: ActionTypes.MOVE_UP_CLICKED,
      payload: { outlineId: outline.id, parentOutlineId: parentOutlineId },
    });
  }

  function onDownClicked() {
    dispatch({
      type: ActionTypes.MOVE_DOWN_CLICKED,
      payload: { outlineId: outline.id, parentOutlineId: parentOutlineId },
    });
  }

  function onOutClicked() {
    dispatch({
      type: ActionTypes.MOVE_OUT_CLICKED,
      payload: { outlineId: outline.id, parentOutlineId: parentOutlineId },
    });
  }

  function onInClicked() {
    dispatch({
      type: ActionTypes.MOVE_IN_CLICKED,
      payload: { outlineId: outline.id, parentOutlineId: parentOutlineId },
    });
  }

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

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "start",
        flexDirection: "row",
        paddingLeft: "12px",
      }}
    >
      <Box>
        <IconButton style={{ padding: 0 }} onClick={onAddSiblingClicked}>
          <AddIcon />
        </IconButton>
        <IconButton
          style={{ padding: 0 }}
          onClick={onAddChildClicked(outline.id)}
        >
          <SubdirectoryArrowRightIcon />
        </IconButton>
      </Box>
      <IconButton style={{ padding: 0 }} onClick={onOutClicked}>
        <ArrowBackIcon />
      </IconButton>
      <Box>
        <IconButton style={{ padding: 0 }} onClick={onUpClicked}>
          <ArrowUpwardIcon />
        </IconButton>
        <IconButton onClick={onDownClicked}>
          <ArrowDownwardIcon />
        </IconButton>
      </Box>
      <IconButton onClick={onInClicked}>
        <ArrowForwardIcon />
      </IconButton>
      <IconButton
        style={{ padding: 0 }}
        color="secondary"
        disabled={outline.subs.length !== 0}
        onClick={onRemoveClicked(outline.id)}
      >
        <RemoveIcon />
      </IconButton>
    </div>
  );
}

export default OutlineLeftButtons;
