import React from "react";
import TextInput from "./TextInput";
import { useState, useEffect, useRef } from "react";
import Grid from "@mui/material/Grid";
import Conversation from "./Conversation";
import { useSession } from "next-auth/react";
import Box from "@mui/material/Box";
import styledMe from "styled-components";
import { Button } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar/Avatar";
import DefaultAvatar from "../../../asset/group_avatar.png";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import Tooltip from "@mui/material/Tooltip";
import { server } from "../../index";
import axios from "axios";
import { useChannel } from "@ably-labs/react-hooks";
import CheckShowAlertValidToken from "../../Function/CheckShowAlertValidToken";

const StyleGrid = styledMe(Grid)`
display: none;
@media only screen and (max-width: 767px)  { 
  display: flex;
  }
`;

const StyleBox = styledMe(Box)`
`;

export default function ChatMsg(props: any) {
  const { data: session } = useSession();
  const [ChatGroupDataProps, setChatGroupDataProps] = useState(props.groupData);
  const [channelChat] = useChannel("on-chat", () => {});
  const [channelCreate] = useChannel("on-create", () => {});
  const [channelGroupId] = useChannel("on-group-id", () => {});

  let isCreateNewConversation = useRef(false);

  async function insertChatGroupDataToDB(groupData: any) {
    try {
      await fetch(server + "/api/groups/insertGroup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(groupData),
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.id_chat_group != null) {
            props.groupData.id_chat_group = res.id_chat_group;
            // Just send id_chat_group to Conversation component for two case
            channelGroupId.publish(res.id_chat_group, {
              id_chat_group: res.id_chat_group,
              result: res.message,
            });
            if (res.result == "success") {
              //Ably socket to add new conversation
              isCreateNewConversation.current = true;
              channelCreate.publish(res.id_chat_group, props.groupData);
            }

            setChatGroupDataProps(props.groupData);
          }
        });
    } catch (error) {
      console.warn("Insert group fail!", error);
    }
  }

  //TODO: insert chat group to DB if props.groupData.id_chat_group != null
  useEffect(() => {
    //Check valid token
    if (
      session?.user?.email &&
      CheckShowAlertValidToken(session?.user?.email)
    ) {
      return;
    }

    if (!props.groupData.id_chat_group && props.groupData.validateGroup) {
      insertChatGroupDataToDB(props.groupData);
    }
    setChatGroupDataProps(props.groupData);
  }, [props.groupData, session?.user?.email]);

  const handleChangDataTextInput = (chatsData: any, dataType: string,typeImage: string) => {
    //Check valid token
    if (
      session?.user?.email &&
      CheckShowAlertValidToken(session?.user?.email)
    ) {
      return;
    }

    if (chatsData != null) {
      props.groupData.ChatData = chatsData;
      setChatGroupDataProps(props.groupData);
    }

    // TODO: Add ably socket
    channelChat.publish(props.groupData.id_chat_group, {
      content: chatsData,
      from: session?.user?.email,
      id_chat_group: props.groupData.id_chat_group,
      nickname: session?.user?.name,
      memberURL: session?.user?.image,
      to: props.groupData?.memberData,
      send_at: new Date(),
      type: dataType,
      typeImage: typeImage
    });

    const callAPItoChatGPT = async (message: any) => {
      try {
        let messages = [{ role: "user", content: message }];
        // use data destructuring to get data from the promise object
        const { data: response } = await axios.post(
          server + "/api/chatgpt/createMessage",
          JSON.stringify({ messages }),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        channelChat.publish(props.groupData.id_chat_group, {
          content: response.choices[0].message.content,
          from: "Chat GPT",
          id_chat_group: props.groupData.id_chat_group,
          nickname: "Chat GPT",
          memberURL:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/180px-ChatGPT_logo.svg.png",
          to: props.groupData?.memberData,
          send_at: new Date(),
          type: dataType,
        });
      } catch (error) {
        console.error(error);
      }
    };

    //ChatGPT in personal conversation
    if (
      props.groupData?.memberData[1].email == "You can ask me anything!" &&
      props.groupData?.memberData.length == 2
    ) {
      callAPItoChatGPT(chatsData);
    }
    //ChatGPT in group conversation

    props.groupData?.memberData.forEach((element: any) => {
      if (
        element.email == "You can ask me anything!" &&
        props.groupData.ChatData.substring(0, 3).toUpperCase() == "GPT"
      ) {
        callAPItoChatGPT(props.groupData.ChatData.slice(3));
      }
    });
  };

  const comeBackButtonOnclick = () => {
    props.handleClick("SidebarContainer", "");
  };

  const addMemberGroupButtonOnclick = () => {
    props.handleClick("AddMemberGroup", props.groupData);
  };

  return (
    <>
      <StyleBox>
        <Grid container>
          <StyleGrid
            item
            xs={10}
            sx={{
              position: "sticky",
              top: 0,
              zIndex: "3",
              backgroundColor: "rgb(230 236 242)",
              height: "4em",
            }}
          >
            <Button onClick={comeBackButtonOnclick}>
              <ArrowBackIosIcon
                sx={{ marginRight: "-13px", marginLeft: "18px" }}
                fontSize="large"
                color="primary"
              />
              <Typography>Back</Typography>
            </Button>

            <Avatar
              sx={{
                width: "4.8vh",
                height: "4.8vh",
                marginTop: "11px",
                marginLeft: "14px",
              }}
              alt="ChatAvatar"
              imgProps={{ referrerPolicy: "no-referrer" }}
              src={
                props.groupData?.memberData.length > 2
                  ? props.groupData?.photoGroupChatUrl || DefaultAvatar.src
                  : props.groupData?.memberData[0].email == session?.user?.email
                  ? props.groupData?.memberData[1].photoUserUrl ||
                    DefaultAvatar.src
                  : props.groupData?.memberData[0].photoUserUrl ||
                    DefaultAvatar.src
              }
            />
            <Typography
              sx={{
                marginTop: "1.1em",
                marginLeft: "0.8em",
                fontWeight: "bold",
                color: "#c34949",
                overflowY: "hidden",
              }}
              style={{ wordWrap: "break-word" }}
            >
              {props.groupData?.chat_name ||
                props.groupData?.memberData[1].nickname}
            </Typography>
          </StyleGrid>
          <StyleGrid
            item
            xs={2}
            sx={{
              position: "sticky",
              top: 0,
              zIndex: "3",
              backgroundColor: "rgb(230 236 242)",
              height: "4em",
              marginBottom: "6px",
            }}
          >
            <Tooltip title="Add group here!" placement="bottom-start">
              <Button onClick={addMemberGroupButtonOnclick}>
                <GroupAddIcon fontSize="large" color="primary" />
              </Button>
            </Tooltip>
          </StyleGrid>
          <Grid item xs={12} sx={{ zIndex: "1" }}>
            <Conversation
              ChatGroupDataProps={ChatGroupDataProps}
              isCreateNewConversation={isCreateNewConversation.current}
            ></Conversation>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              position: "sticky",
              bottom: 0,
              zIndex: "2",
              backgroundColor: "#f0f0f0",
            }}
          >
            <TextInput props={handleChangDataTextInput}></TextInput>
          </Grid>
        </Grid>
      </StyleBox>
    </>
  );
}
