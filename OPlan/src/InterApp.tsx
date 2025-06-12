import { Box, IconButton, Tab } from "@mui/material";
import "./App.css";
import React, { MouseEventHandler, useState } from "react";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import Panel from "./Components/Panel.tsx";
import Tabs, { tabsClasses } from "@mui/material/Tabs";
import CloseIcon from "@mui/icons-material/Close";
import { v6 as uuidv6 } from "uuid";

function InterApp() {
  const [tabs, setTabs] = React.useState<{ id: string; name?: string }[]>([
    { id: uuidv6() },
  ]);
  const [activeTab, setActiveTab] = React.useState<string>(tabs[0].id);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  function addNewTab() {
    return () => {
      const tabId = uuidv6();
      tabs.push({ id: tabId });
      setTabs([...tabs]);
      setActiveTab(tabId);
    };
  }

  function removeTab(tabNo: string) {
    return (event: MouseEventHandler<HTMLAnchorElement>) => {
      event.stopPropagation();
      if (tabNo === activeTab && tabs.length !== 1) {
        const indexOfTabToRemove = tabs.findIndex((tab) => tab.id === tabNo);
        if (indexOfTabToRemove !== undefined) {
          const updatedTabs = tabs.filter((tab) => tab.id !== tabNo);
          setTabs([...updatedTabs]);
          if (updatedTabs.length > 1 && indexOfTabToRemove > 1) {
            setActiveTab(updatedTabs[indexOfTabToRemove - 1].id);
          } else {
            setActiveTab(updatedTabs[0].id);
          }
        }
      }
    };
  }

  function setTabName(tabNo: string) {
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
        bgcolor: "transparent",
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
        <IconButton onClick={addNewTab()}>
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
              id="sadafsdfa"
              key={index}
              disableRipple
              value={tab.id}
              sx={{
                padding: "6px",
                backgroundColor:
                  tab.id === activeTab ? "#bdb7b7" : "rgb(176, 173, 173)",
              }}
              label={
                <span id={tab.id}>
                  {tab.name || "Tab " + index}
                  <IconButton
                    disabled={tab.id !== activeTab || tabs.length === 1}
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
