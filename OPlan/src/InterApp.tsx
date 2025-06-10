import { Box, IconButton, Tab } from "@mui/material";
import "./App.css";
import React, { MouseEventHandler, useState } from "react";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import Panel from "./Components/Panel.tsx";
import Tabs, { tabsClasses } from "@mui/material/Tabs";
import CloseIcon from "@mui/icons-material/Close";

function InterApp() {
  const [activeTab, setActiveTab] = React.useState<number>(1);

  const [tabs, setTabs] = React.useState<{ id: number; name?: string }[]>([
    { id: 1 },
  ]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(event.target);
    console.log(newValue);

    // setActiveTab(Number(event.target.id));
    setActiveTab(Number(newValue));
  };

  function addNewTab(tabNo: number) {
    return () => {
      tabs.push({ id: tabNo });
      setTabs([...tabs]);
      setActiveTab(tabNo);
    };
  }

  function removeTab(tabNo: number) {
    return (event: MouseEventHandler<HTMLAnchorElement>) => {
      // prevent MaterialUI from switching tabs
      // const tabId = Number(event.target.parentElement.parentElement);
      // console.log("tabId", tabId);
      event.stopPropagation();
      // Cases:
      // Case 1: Single tab.
      // Case 2: Tab on which it's pressed to delete.
      // Case 3: Tab on which it's pressed but it's the first tab
      // Case 4: Rest all cases.
      // Also cleanup data pertaining to tab.
      // Case 2,3,4:
      console.log("tabNo", tabNo);

      if (tabNo === activeTab) {
        const indexToRemove = tabs.findIndex((tab) => tab.id === tabNo);
        console.log("indexToRemove", indexToRemove);
        if (indexToRemove !== undefined) {
          console.log("tabs", tabs);
          const newTabs = tabs.filter((tab) => tab.id !== tabNo);
          console.log(" tabs after", newTabs);
          setTabs([...newTabs]);

          let newActiveTab = indexToRemove - 1;
          if (newTabs.length > 1) {
            setActiveTab(newTabs[newActiveTab].id);
          } else {
            setActiveTab(1);
          }
        }
      } else {
        console.log("in inactive tab");
      }
    };
  }

  function setTabName(tabNo: number) {
    return (tabName: string) => {
      const tabToChangeName = tabs.find((tab) => tab.id === tabNo);
      if (tabToChangeName) {
        tabToChangeName.name = tabName;
      }
      setTabs([...tabs]);
      if (activeTab !== tabNo) {
        setActiveTab(tabNo);
      }
    };
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: "background.paper",
        margin: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        minHeight: "60px",
      }}
    >
      <Box
        sx={{
          display: "flex",
        }}
      >
        <IconButton onClick={addNewTab(tabs.length + 1)}>
          <CreateNewFolderIcon />
        </IconButton>
        <Tabs
          value={activeTab}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons
          sx={{
            [`& .${tabsClasses.scrollButtons}`]: {
              color: "black",
              "&.Mui-disabled": { opacity: 0.3 },
            },
          }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              disableRipple
              value={tab.id}
              label={
                <span id={tab.id}>
                  {tab.name || "Tab " + Number(tab.id)}
                  <IconButton
                    disabled={tab.id !== activeTab}
                    size="small"
                    component="span"
                    onClick={removeTab(tab.id)}
                  >
                    <CloseIcon />
                  </IconButton>
                </span>
              }
              wrapped
            />
          ))}
        </Tabs>
      </Box>

      {tabs.map((tab) => (
        <Panel
          key={tab.id}
          isVisible={tab.id === activeTab}
          setTabName={setTabName(tab.id)}
        />
      ))}
    </Box>
  );
}

export default InterApp;

const TabsMap = () => {
  const [tabs, setTabs] = useState(Array.from(Array(10).keys()));

  const [activeTab, setActiveTab] = React.useState(0);

  const closeTab = (i) => {
    if (i === 0) {
      if (tabs.length > 1) {
        setTabs(tabs.slice(1, tabs.length));
        return;
      }

      setTabs([]);
      return;
    }

    if (i === tabs.length - 1) {
      setTabs(tabs.slice(0, tabs.length - 1));
      return;
    }

    setTabs([...tabs.slice(0, i), ...tabs.slice(i + 1, tabs.length)]);
  };

  return (
    <div>
      {tabs.map((k, i) => (
        <button onClick={() => closeTab(i)}>{k}</button>
      ))}
    </div>
  );
};

const App = () => {
  return <TabsMap />;
};
