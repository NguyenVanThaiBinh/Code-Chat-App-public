import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import { useEffect, useState, memo, useRef } from "react";
import { useSession } from "next-auth/react";
import DefaultAvatar from "../../../asset/group_avatar.png";
import GroupChatObject from "../../../Object/GroupChatObject";
import { useChannel } from "@ably-labs/react-hooks";
import Box from "@mui/material/Box";


import { styled } from "@mui/material/styles";
const StyleBox = styled(Box)``;

function AlignItemsList(props: any) {
  const [chatGroupDataList, setChatGroupDataList] = useState<GroupChatObject[]>(
    []
  );
  let groupSaveChatData = useRef<GroupChatObject[]>([]);
  let userEmailSession = useRef("");

  const { data: session } = useSession<any | null>();
  const userEmail = session && session.user ? session.user.email : null;

  //TODO: Change color when selected
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const handleListItemClick = (index: number) => {
    setSelectedIndex(index);
  };

  function setChatNameandPhotoChat(data: GroupChatObject[]) {
    for (let i = 0; i < data.length; i++) {
      // for 2 people
      if (data[i].memberData.length == 2) {
        if (data[i].memberData[0].email == userEmail) {
          data[i].chat_name = data[i].memberData[1].nickname;
          data[i].photoGroupChatUrl = data[i].memberData[1].photoUserUrl;
        } else {
          data[i].chat_name = data[i].memberData[0].nickname;
          data[i].photoGroupChatUrl = data[i].memberData[0].photoUserUrl;
        }
      } else {
        // for group chat
        data[i].chat_name = data[i].chat_name;
      }
    }
  }
  // TODO: when click mouse
  const handleClick = (GroupChatData: GroupChatObject) => {
    props.handleOnClick(GroupChatData.id_chat_group, GroupChatData);
  };

  //TODO: Loading AlignItem Data
  useEffect(() => {
    if (userEmail) {
      userEmailSession.current = userEmail;
    }
    let data: GroupChatObject[];

    data = JSON.parse(localStorage.getItem(userEmailSession.current) as any);

    if (data != null && groupSaveChatData.current.length == 0) {
      groupSaveChatData.current = data;
    }
  }, [userEmail]);

  useEffect(() => {
    if (userEmail) {
      userEmailSession.current = userEmail;
    }
    const setChatNameandPhotoChat = (data: GroupChatObject[]) => {
      for (let i = 0; i < data.length; i++) {
        // for 2 people
        if (data[i].memberData.length == 2) {
          if (data[i].memberData[0].email == userEmail) {
            data[i].chat_name = data[i].memberData[1].nickname;
            data[i].photoGroupChatUrl = data[i].memberData[1].photoUserUrl;
          } else {
            data[i].chat_name = data[i].memberData[0].nickname;
            data[i].photoGroupChatUrl = data[i].memberData[0].photoUserUrl;
          }
        } else {
          // for group chat
          data[i].chat_name = data[i].chat_name;
        }
      }

      setChatGroupDataList(data);
    };

    if (props.isEnableBlue == false) {
      setSelectedIndex(-1);
    }

    //when the first mount, userEmail is null
    if (userEmailSession.current != "") {
      let data: GroupChatObject[];

      data = JSON.parse(localStorage.getItem(userEmailSession.current) as any);

      if (data != null) {
        setChatNameandPhotoChat(data);
      }
    }
  }, [props.isEnableBlue, userEmail]);

  //   TODO: Use ably add new conversation
  useChannel("on-create", (message: any) => {
    const setChatNameandPhotoChat = (data: any) => {
      //return if groupChat has member >2
      if (data.memberData.length > 2) return;
      // for 2 people
      if (data.memberData[0].email == userEmail) {
        data.chat_name = data.memberData[1].nickname;
        data.photoGroupChatUrl = data.memberData[1].photoUserUrl;
      } else {
        data.chat_name = data.memberData[0].nickname;
        data.photoGroupChatUrl = data.memberData[0].photoUserUrl;
      }
    };

    setChatNameandPhotoChat(message.data);
    groupSaveChatData.current.unshift(message.data);
    localStorage.setItem(
      userEmailSession.current,
      JSON.stringify(groupSaveChatData.current)
    );

    setChatGroupDataList((prev: any) => {
      const newGroupChatData = [message.data, ...prev];
      return newGroupChatData;
    });
    setSelectedIndex(0);
  });

  //   TODO: Add ably and set last content data
  useChannel("on-chat", (message: any) => {
    if (message?.data?.type == "image") return;

    groupSaveChatData.current.forEach((groupChatDataPara) => {
      if (groupChatDataPara.id_chat_group == message.data.id_chat_group) {
        groupChatDataPara.last_chat_content = message.data.content;
        groupChatDataPara.last_chat_update = new Date();
        // move object data to first: 1 delete -> 2. add first
        const filteredData = groupSaveChatData.current.filter(
          (item: any) => item.id_chat_group != groupChatDataPara.id_chat_group
        );
        filteredData.unshift(groupChatDataPara);

        // save  groupChatData to localStorage
        if (userEmailSession.current != "") {
          localStorage.setItem(
            userEmailSession.current,
            JSON.stringify(filteredData)
          );
        }

        setChatNameandPhotoChat(filteredData);
        setChatGroupDataList(filteredData);
        setSelectedIndex(0);
        return;
      }
    });

    // TODO: update  Chats Data in localStorage when not in conversation.
    let sessionChatData = [];
    sessionChatData = JSON.parse(
      localStorage.getItem(message.data.id_chat_group) as any
    );
    if (sessionChatData) {
      sessionChatData.push(message.data);
      localStorage.setItem(
        message.data.id_chat_group,
        JSON.stringify(sessionChatData)
      );
    }
  });

  return (
    <StyleBox>
      <Divider />
      {chatGroupDataList.map((ChatGroupData: any, index: any) => (
        <List
          key={index}
          sx={{
            width: "100%",
            maxWidth: 450,
            bgcolor: "background.paper",
            paddingTop: 0,
            paddingBottom: 0,
            zIndex: "1",
          }}
        >
          <ListItemButton
            key={index}
            sx={{
              ":hover": {
                bgcolor: "rgba(25, 118, 210, 0.08)",
              },
              color: "#1976d2",
              "&.Mui-selected": {
                backgroundColor: "rgb(25 127 227 / 23%)",
              },
            }}
            selected={selectedIndex == index}
            onClick={() => handleListItemClick(index)}
          >
            <ListItem
              alignItems="flex-start"
              onClick={() => handleClick(ChatGroupData)}
            >
              <ListItemAvatar>
                <Avatar
                  alt="GroupChatAvatar"
                  imgProps={{ referrerPolicy: "no-referrer" }}
                  src={ChatGroupData.photoGroupChatUrl || DefaultAvatar.src}
                  sx={{ height: "44px", width: "44px" }}
                />
              </ListItemAvatar>
              <ListItemText
                sx={{
                  color: "black",
                  maxHeight: "4.2em",
                  overflow: "hidden",
                }}
                primary={ChatGroupData.chat_name}
                secondary={
                  <React.Fragment>
                    {ChatGroupData.last_chat_content}
                  </React.Fragment>
                }
              />
            </ListItem>
          </ListItemButton>

          <Divider />
        </List>
      ))}
    </StyleBox>
  );
}
export default memo(AlignItemsList);
