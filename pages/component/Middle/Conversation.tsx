import styledMe from "styled-components";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import React from "react";
import DefaultAvatar from "../../../asset/group_avatar.png";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { server } from "../../index";
import ChatObject from "../../../Object/ChatObject";
import { useChannel } from "@ably-labs/react-hooks";
import { sendNotification } from "../../../middleware/onesignal";
import { app_id } from "../../index";
import GroupChatObject from "../../../Object/GroupChatObject";

const StyleBox = styledMe(Box)`
  overflow-y: scroll;
  border-right: 1px solid whitesmoke;
  height:66.5vh;
  @media (min-width: 1600px) {
    height:91vh;
  } 

  
 @media only screen   
and (min-width: 1030px)   
and (max-width: 1600px)  
{ height:88.8vh;}  
`;
const StyleGrid = styledMe(Grid)`
@media only screen and (max-width: 429px) {
  padding-left:0.75em;

 }
`;
// CSS scroll is down when loading page
// display: flex;
// flex-direction: column-reverse;
const ItemLeft = styled(Paper)(({ theme }) => ({
  backgroundColor: "#3e4042b5",
  ...theme.typography.body1,
  padding: theme.spacing(1),
  textAlign: "center",
  color: "white",
  borderRadius: 30,
  maxWidth: "55%",
  wordWrap: "break-word",
}));
const ItemRight = styled(Paper)(({ theme }) => ({
  backgroundColor: "rgb(0, 132, 255)",
  ...theme.typography.body1,
  padding: theme.spacing(1),
  textAlign: "center",
  color: "white",
  borderRadius: 30,
  maxWidth: "55%",
  marginRight: 12,
  wordWrap: "break-word",
}));

export default function Conversation({
  ChatGroupDataProps: ChatGroupDataProps,
  isCreateNewConversation: isCreateNewConversation,
}: {
  ChatGroupDataProps: GroupChatObject;
  isCreateNewConversation: boolean;
}) {
  const { data: session } = useSession();
  const [chatData, setChatData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrolling, setScrolling] = useState(true);
  const [maxWidthGPT, setMaxWidthGPT] = useState("55%");

  let playerId = useRef("");
  let id_chat_group = useRef("");
  const listChatData = useRef<ChatObject[]>([]);

  let sendNotificationFlag = useRef(true);

  const userSession = session?.expires;
  const userEmail = session && session.user ? session.user.email : null;

  async function scrollDownAfter1s() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const boxElement = document?.getElementById("divElem");
    boxElement?.scrollTo({
      top: 25000,
      behavior: "smooth",
    });
  }
  async function scrollDownNow() {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const boxElement = document?.getElementById("divElem");
    boxElement?.scrollTo({
      top: 25000,
      behavior: "smooth",
    });
  }
  // TODO: Get group-id (ably)from ChatMsg Component to load Conversation Data
  useChannel("on-group-id", (message: any) => {
    id_chat_group.current = message.data.id_chat_group;
    // if is new conversation return
    if (message.data.result == "Group is inserted successfully!") {
      return;
    }
    setLoading(true);
    let localStorageData = [];

    localStorageData = JSON.parse(
      localStorage.getItem(message.data.id_chat_group) as any
    );

    if (localStorageData != null) {
      setChatData(localStorageData);

      // need check only scroll on laptop
      var width = window.innerWidth > 0 ? window.innerWidth : screen.width;
      if (width > 767) {
        setScrolling(true);
        scrollDownAfter1s();
      } else {
        setScrolling(false);
      }
      setLoading(false);
    } else {
      if (!message.data.id_chat_group) {
        setLoading(false);
        return;
      }

      setLoading(true);
      fetch(server + `/api/chats/${message.data.id_chat_group}`)
        .then((response) => response.json())
        .then((chatData) => {
          // add photoURL each member group
          for (let i = 0; i < chatData.length; i++) {
            for (let j = 0; j < ChatGroupDataProps.memberData.length; j++) {
              if (chatData[i].from == ChatGroupDataProps.memberData[j].email) {
                chatData[i].memberURL =
                  ChatGroupDataProps.memberData[j].photoUserUrl;
              }
            }
          }
          if (message.data.id_chat_group) {
            localStorage.setItem(
              message.data.id_chat_group,
              JSON.stringify(chatData)
            );
          }

          setChatData(chatData);
          setLoading(false);
          setScrolling(false);
        });
    }
  });
  // TODO: Get Data from ChatMsg Component to load Conversation Data
  useEffect(() => {
    if (ChatGroupDataProps.memberData[1].email == "You can ask me anything!") {
      setMaxWidthGPT("70%");
    } else {
      setMaxWidthGPT("55%");
    }
    if (ChatGroupDataProps.id_chat_group !== undefined) {
      id_chat_group.current = ChatGroupDataProps.id_chat_group;
    }
    setLoading(true);
    let localStorageData = [];

    localStorageData = JSON.parse(
      localStorage.getItem(ChatGroupDataProps.id_chat_group) as any
    );

    if (localStorageData != null) {
      setChatData(localStorageData);

      // need check only scroll on laptop
      var width = window.innerWidth > 0 ? window.innerWidth : screen.width;
      if (width > 767) {
        setScrolling(true);
        scrollDownAfter1s();
      } else {
        setScrolling(false);
      }
      setLoading(false);
    } else {
      if (!ChatGroupDataProps.id_chat_group) {
        setLoading(false);
        return;
      }

      setLoading(true);
      fetch(server + `/api/chats/${ChatGroupDataProps.id_chat_group}`)
        .then((response) => response.json())
        .then((chatData) => {
          // add photoURL each member group
          for (let i = 0; i < chatData.length; i++) {
            for (let j = 0; j < ChatGroupDataProps.memberData.length; j++) {
              if (chatData[i].from == ChatGroupDataProps.memberData[j].email) {
                chatData[i].memberURL =
                  ChatGroupDataProps.memberData[j].photoUserUrl;
              }
            }
          }
          if (ChatGroupDataProps.id_chat_group) {
            localStorage.setItem(
              ChatGroupDataProps.id_chat_group,
              JSON.stringify(chatData)
            );
          }

          setChatData(chatData);
          setLoading(false);
          setScrolling(false);
        });
    }
  }, [ChatGroupDataProps]);

  // TODO: Auto save chat  and update last content after 1s
  useEffect(() => {
    let intervalForSaveChat = setInterval(() => {
      if (listChatData.current.length > 0) {
        insertChatAndUpdateLastContentToDB(listChatData.current);
        listChatData.current.length = 0;
      }
    }, 1 * 1000);

    return () => {
      clearInterval(intervalForSaveChat);
    };
  }, []);

  // TODO: Auto save chat  and update last content after 1s
  useEffect(() => {
    let intervalForSaveChat = setInterval(() => {
      if (listChatData.current.length > 0) {
        insertChatAndUpdateLastContentToDB(listChatData.current);
        listChatData.current.length = 0;
      }
    }, 1 * 1000);

    return () => {
      clearInterval(intervalForSaveChat);
    };
  }, []);

  //TODO: load chat data
  useEffect(() => {
    if (isCreateNewConversation) {
      isCreateNewConversation = false;
      setLoading(false);
      setScrolling(false);
      return;
    }
    //save chat  and update last content before change conversation
    if (listChatData.current.length > 0) {
      insertChatAndUpdateLastContentToDB(listChatData.current);
      listChatData.current.length = 0;
    }
  }, [ChatGroupDataProps?.memberData]);

  // TODO: insertChatToDB and update last chat content
  function insertChatAndUpdateLastContentToDB(saveChatData: any) {
    const last_length = saveChatData.length - 1;
    const id_chat_group = saveChatData[last_length].id_chat_group;
    const last_chat_content = saveChatData[last_length].content;

    try {
      fetch(server + "/api/chats/insertChats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(saveChatData),
      });
    } catch (error) {
      console.warn("Insert chat fail!");
    }

    //Only update last_chat_content when type is text
    if (saveChatData[last_length]?.type == "text") {
      const DATE_TIME = new Date();
      const changeData = {
        id_chat_group: id_chat_group,
        last_chat_content,
        DATE_TIME,
      };
      try {
        fetch(server + "/api/groups/updateLastContent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(changeData),
        });
      } catch (error) {
        console.warn("update Last Chat Content fail!");
      }
    }
  }

  // TODO: Add ably and render data vs Push Notification
  useChannel("on-chat", (message: any) => {
    // Interval send notification each 15 min.
    let intervalForSentNotifications = setTimeout(() => {
      sendNotificationFlag.current = true;
    }, 15 * 60 * 1000);

    if (message.name == id_chat_group.current) {
      // just save chat data from 1 side
      if (message.data.from == userEmail) {
        listChatData.current.push(message.data);
      }
      // Save message from ChatGPT
      if (message.data.from == "Chat GPT") {
        listChatData.current.push(message.data);
      }

      if (
        playerId.current &&
        userEmail != message.data.to[0].email &&
        sendNotificationFlag.current == true
      ) {
        //Push Notification
        let pushMessage = {
          app_id: app_id,
          contents: {
            en: message.data.content,
          },
          headings: { en: `${session?.user?.name} is calling you!` },
          include_player_ids: [playerId.current],
        };
        sendNotification(pushMessage);
        sendNotificationFlag.current = false;
        intervalForSentNotifications;
      }

      setChatData((prev: any) => {
        const newChatData = [...prev, message.data] as any;
        if (ChatGroupDataProps.id_chat_group) {
          localStorage.setItem(
            ChatGroupDataProps.id_chat_group,
            JSON.stringify(newChatData)
          );
        }

        return newChatData;
      });
      setScrolling(true);
      scrollDownNow();
    }
    return () => {
      clearTimeout(intervalForSentNotifications);
    };
  });

  return (
    <StyleBox
      id="divElem"
      sx={
        scrolling
          ? {}
          : {
              display: "flex",
              flexDirection: "column-reverse",
            }
      }
    >
      {loading ? (
        <Typography sx={{ textAlign: "center", marginTop: "3.5em" }}>
          Loading...
        </Typography>
      ) : (
        <>
          <Grid>
            {chatData.map((data: any, index: any) => (
              <React.Fragment key={index}>
                {session?.user?.email != data.from ? (
                  <StyleGrid
                    sx={{ marginTop: 1, marginBottom: 0.2 }}
                    item
                    xs={12}
                    container
                    key={index}
                  >
                    <Avatar
                      sx={{
                        width: 30,
                        height: 30,
                        marginTop: "5px",
                        marginRight: "6px",
                      }}
                      alt="ChatAvatar"
                      imgProps={{ referrerPolicy: "no-referrer" }}
                      src={data.memberURL || DefaultAvatar.src}
                    />
                    {data.type == "image" ? (
                      <>
                        <Avatar
                          sx={{
                            width: 190,
                            height: 125,
                            marginTop: "5px",
                            marginRight: "13px",
                            borderRadius: "6px 6px 6px 6px",
                          }}
                          alt="Image"
                          imgProps={{ referrerPolicy: "no-referrer" }}
                          src={data.content}
                        />
                      </>
                    ) : (
                      <>
                        <ItemLeft sx={{ maxWidth: maxWidthGPT }}>
                          {data.content}
                        </ItemLeft>
                      </>
                    )}
                  </StyleGrid>
                ) : (
                  <Grid
                    sx={{ marginTop: 1, marginBottom: 0.2 }}
                    item
                    xs={12}
                    container
                    justifyContent="flex-end"
                    key={index}
                  >
                    {data.type == "image" ? (
                      <>
                        <Avatar
                          sx={{
                            width: 190,
                            height: 125,
                            marginTop: "5px",
                            marginRight: "13px",
                            borderRadius: "6px 6px 6px 6px",
                          }}
                          alt="Image"
                          imgProps={{ referrerPolicy: "no-referrer" }}
                          src={data.content}
                        />
                      </>
                    ) : (
                      <>
                        <ItemRight>{data.content}</ItemRight>
                      </>
                    )}
                  </Grid>
                )}
              </React.Fragment>
            ))}
          </Grid>
        </>
      )}
    </StyleBox>
  );
}
