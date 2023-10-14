import Sidebar from "./component/Left/Sidebar";
import ChatMsg from "./component/Middle/ChatMsg";
import CreateConversation from "./component/Middle/CreateConversation";
import AddMemberToGroup from "./component/Middle/AddMemberToGroup";
import Home from "./component/Middle/Home";
import AlignItemsList from "./component/Left/AlignItemsList";
import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useState, useRef, useEffect } from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import Information from "./component/Right/Information";
import LoadingPage from "../pages/LoadingPage";
import GroupChatObject from "../Object/GroupChatObject";

const StyleBox = styled(Box)`
  height: 100%;
  body {
    position: static !important;
  }
`;

const InformationGrid = styled(Grid)`
  @media only screen and (max-width: 429px) {
    display: none;
  }
`;
const SidebarContainer = styled(Grid)`
  border-right: 1px solid whitesmoke;
`;
const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});
export default function Body() {
  // 0 for default
  // 1 for ChatMsg
  // 2 for Create new Conversation
  // 3 for Add member group
  const [mountComponentIndex, setMountComponent] = useState(0);
  const [groupData, setGroupData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isShowAlert, setIsShowAlert] = useState(false);
  const [displaySidebarContainer, setDisplaySidebarContainer] = useState("");

  let isEnableBlueAlignItem = useRef(false);

  //id_control to control render component and also chat_group_id
  const handleOnClickFromChild = (
    id_control: any,
    groupChatData: GroupChatObject,
    showAlert: boolean
  ) => {
    // using for middle component Create New Conversation
    if (id_control == null) {
      isEnableBlueAlignItem.current = false;
      setDisplaySidebarContainer("none");
      setMountComponent(2);
      return;
    }
    // using for middle component Add Member Group
    if (id_control == "AddMemberGroup") {
      isEnableBlueAlignItem.current = false;
      setGroupData(groupChatData);
      setDisplaySidebarContainer("none");
      setMountComponent(3);
      return;
    }
    // using for mobile: comBack SidebarContainer
    if (id_control == "SidebarContainer") {
      isEnableBlueAlignItem.current = true;
      if (showAlert) setIsShowAlert(true);
      setDisplaySidebarContainer("block");
      setMountComponent(99);
      return;
    }
    // using for middle component ChatMsg
    if (id_control != null && id_control != "SidebarContainer") {
      isEnableBlueAlignItem.current = true;

      setDisplaySidebarContainer("none");
      setMountComponent(1);
      setGroupData(groupChatData);
      return;
    }

    return null;
  };

  const handleNewConversation = (groupData: any) => {
    if (groupData) {
      isEnableBlueAlignItem.current = true;

      setMountComponent(1);
      setGroupData(groupData);
    }
  };

  useEffect(() => {
    let intervalForLoadingPage = setTimeout(() => {
      setIsLoading(false);
    }, 1 * 1 * 1000);
    return () => {
      clearTimeout(intervalForLoadingPage);
    };
  }, []);

  const renderControl = () => {
    switch (mountComponentIndex) {
      case 1:
        return (
          <ChatMsg groupData={groupData} handleClick={handleOnClickFromChild} />
        );
      case 2:
        return (
          <CreateConversation
            handleDoubleClick={handleNewConversation}
            handleClick={handleOnClickFromChild}
          />
        );
      case 3:
        return (
          <AddMemberToGroup
            groupData={groupData}
            handleClick={handleOnClickFromChild}
            handleDoubleClick={handleNewConversation}
          />
        );
      default:
        return <Home />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <StyleBox>
        {isLoading ? (
          <>
            <LoadingPage handleOnClick={handleOnClickFromChild}></LoadingPage>
          </>
        ) : (
          <>
            <Grid container spacing={2}>
              <Grid
                item
                xs={12}
                sm={3.5}
                xl={3}
                sx={{
                  display: {
                    xs: displaySidebarContainer,
                    xl: "block",
                    sm: "block",
                  },
                }}
              >
                <SidebarContainer>
                  <Sidebar
                    handleOnClick={handleOnClickFromChild}
                    isEnableBlue={isEnableBlueAlignItem.current}
                    isShowAlert={isShowAlert}
                  />
                  <AlignItemsList
                    handleOnClick={handleOnClickFromChild}
                    isEnableBlue={isEnableBlueAlignItem.current}
                  />
                </SidebarContainer>
              </Grid>
              <Grid
                item
                xs={12}
                sm={8.5}
                xl={5.5}
                sx={{
                  backgroundColor: "#f0f0f0",
                  height: "100%",
                  top: 0,
                  position: "sticky",
                  overflowY: "hidden",
                }}
              >
                {renderControl()}
              </Grid>
              <InformationGrid
                item
                xs={12}
                sm={12}
                xl={3.5}
                sx={{
                  textAlign: "center",
                  display: {
                    xs: "none",
                    xl: "block",
                    sm: "none",
                  },
                }}
              >
                <Information></Information>
              </InformationGrid>
            </Grid>
          </>
        )}
      </StyleBox>
    </ThemeProvider>
  );
}
