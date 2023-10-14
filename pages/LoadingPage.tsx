import styledMe from "styled-components";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { useEffect, useState, memo, useRef } from "react";
import { useSession } from "next-auth/react";
import React from "react";
import IconImage from "../asset/Icon.jpg";
import { server } from "./index";
import { styled } from "@mui/material/styles";
import axios from "axios";
import OneSignal from "react-onesignal";
import { runOneSignal } from "../middleware/onesignal";
import { useChannel } from "@ably-labs/react-hooks";

const StyleBox = styledMe(Box)`
  border-right: 1px solid whitesmoke;
  width: 100%;
  background-color:#08092e;
  z-index: -1;
  margin: 0;
  height: 100vh;
  overflow: hidden;
  position:fixed;
`;
const StyleWarperLaptop = styledMe(Box)`
display:flex;
justify-content: center;
text-align: center;
@media only screen and (max-width: 767px) {
  display: none;
}

`;
const StyleWarperMobile = styledMe(Box)`
justify-content: center;
text-align: center;
display: none;
@media only screen and (max-width: 767px) {
  display: flex;
}
`;
const StyleLoader = styled(Box)`
  font-size: 1.5em;
  color: blue;
  position: relative;
  justify-content: center;
  text-align: center;
  width: 15em;
  height: 15em;
  border-radius: 80%;
  background: linear-gradient(#f07e6e, #84cdfa, #5ad1cd);
  animation: animate 1.2s linear infinite;

  @keyframes animate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  :after {
    content: "";
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    background: #f1f1f1;
    border: solid white 10px;
    border-radius: 50%;
  }
`;
const StyleLoaderMobile = styled(Box)`
  font-size: 1em;
  color: blue;
  position: relative;
  justify-content: center;
  text-align: center;
  width: 15em;
  height: 15em;
  border-radius: 80%;
  background: linear-gradient(#f07e6e, #84cdfa, #5ad1cd);
  animation: animate 1.2s linear infinite;

  @keyframes animate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  :after {
    content: "";
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    bottom: 10px;
    background: #f1f1f1;
    border: solid white 10px;
    border-radius: 50%;
  }
`;
const StyleSpan1 = styled("div")`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(#f07e6e, #84cdfa, #5ad1cd);
  filter: blur(10px);
`;
const StyleSpan2 = styled("div")`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(#f07e6e, #84cdfa, #5ad1cd);
  filter: blur(25px);
`;
const StyleSpan3 = styled("div")`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(#f07e6e, #84cdfa, #5ad1cd);
  filter: blur(35px);
`;
const StyleSpan4 = styled("div")`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(#f07e6e, #84cdfa, #5ad1cd);
  filter: blur(50px);
`;

export default function LoadingPage(props: any) {
  const [loadingControl, setLoadingControl] = useState(0);
  let firstFiveConversationGroupId = useRef<any>([]);
  const { data: session } = useSession<any | null>();
  const userEmail = session && session.user ? session.user.email : null;

  //TODO: load 5 chat data
  const loadFiveUserChatData = async () => {
    await firstFiveConversationGroupId.current.forEach(
      (id_chat_group: string) => {
        fetch(server + `/api/chats/${id_chat_group}`)
          .then((response) => response.json())
          .then((chatData) => {
            localStorage.setItem(id_chat_group, JSON.stringify(chatData));
          });
      }
    );
  };

  //TODO: Insert user and playID into DB => get access_token
  async function insertUserToDB(dataUserAPI: any) {
    // Get access_token
    let access_token = localStorage.getItem("access_token") as any;

    const headers = {
      "Content-Type": "application/json",
      Authorization: access_token,
    };

    try {
      const response = await axios.post(
        server + "/api/users/insertUser",
        dataUserAPI,
        { headers }
      );
      if (
        response.data.access_token != "is already exist" &&
        response.data.success == true
      ) {
        localStorage.setItem("access_token", response.data.access_token);

        localStorage.setItem("isShowAlert", "false");

        props.handleOnClick("SidebarContainer", "", false);
      }
      if (response.data.success == false) {
        props.handleOnClick("SidebarContainer", "", true);
        return;
      }
    } catch (error) {
      console.warn("Insert User fail!");
    }
  }
  //TODO: Run OneSignal
  useEffect(() => {
    // runOneSignal();
  }, []);

  //TODO: Check to insert User
  useEffect(() => {
    let dataUserAPI = {
      userData: session?.user,
      playerId: "",
    };

    if (userEmail) {
      insertUserToDB(dataUserAPI);
      // OneSignal.getUserId((playerId: any) => {
      //   let isInsertByOneSignalFlag = false;
      //   console.log("Your PlayerID is: " + playerId);
      //   if (playerId) {
      //     isInsertByOneSignalFlag = true;
      //     insertUserToDB(dataUserAPI);
      //   }
      //   //If user not subscribe? just insert ""
      //   if (!isInsertByOneSignalFlag) {
      //     dataUserAPI.playerId = "";
      //     insertUserToDB(dataUserAPI);
      //   }
      // });
    }
  }, [userEmail]);

  useEffect(() => {
    // Get access_token
    let access_token = localStorage.getItem("access_token") as any;

    if (userEmail) {
      //TODO:load data for AlignItemList
      fetch(server + `/api/groups/${userEmail}`, {
        method: "GET",
        headers: {
          Authorization: access_token,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success == false) {
            return;
          }
          if (data.length > 0) {
            // save to local storage
            if (userEmail) {
              localStorage.setItem(userEmail, JSON.stringify(data));
              props.handleOnClick("SidebarContainer", "");
            }
            //Load first 5 user
            for (let i = 0; i < 5; i++) {
              if (data[i] != undefined && data[i] != null) {
                firstFiveConversationGroupId.current.push(
                  data[i].id_chat_group
                );
              }
            }
            loadFiveUserChatData();
          }
        });
    }
  }, [userEmail]);

  //TODO:Load list User Data
  useEffect(() => {
    let isLoadedListUser = localStorage.getItem("isLoadedListUser") as any;

    if (isLoadedListUser != "true") {
      localStorage.clear();
      fetch(server + `/api/users/findUser?searchKey=${" "}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.length > 0) {
            const filteredData = data.filter(
              (group: any) => group.email != userEmail
            );
            localStorage.setItem("listUsers", JSON.stringify(filteredData));
            localStorage.setItem("isLoadedListUser", "true");
          }
        });
    }
  }, []);

  // need check only scroll on laptop?
  useEffect(() => {
    let intervalForSentNotifications = setTimeout(() => {
      if (typeof window !== "undefined" && window.innerWidth > 767) {
        setLoadingControl(1);
      } else {
        setLoadingControl(2);
      }
    }, 1 * 1 * 400);
    return () => {
      clearTimeout(intervalForSentNotifications);
    };
  }, []);

  const renderControl = () => {
    if (loadingControl == 1) {
      return (
        <StyleWarperLaptop>
          <StyleLoader>
            <StyleSpan1></StyleSpan1>
            <StyleSpan2></StyleSpan2>
            <StyleSpan3></StyleSpan3>
            <StyleSpan4></StyleSpan4>
          </StyleLoader>
        </StyleWarperLaptop>
      );
    } else if (loadingControl == 2) {
      return (
        <StyleWarperMobile>
          <StyleLoaderMobile>
            <StyleSpan1></StyleSpan1>
            <StyleSpan2></StyleSpan2>
            <StyleSpan3></StyleSpan3>
            <StyleSpan4></StyleSpan4>
          </StyleLoaderMobile>
        </StyleWarperMobile>
      );
    }
  };

  return (
    <StyleBox>
      <Grid container>
        <Grid item xs={12} sx={{ textAlign: "center", marginTop: "5em" }}>
          <Typography
            sx={{
              marginBottom: "2em",
              fontSize: "2rem",
              fontWeight: "bold",
              color: "#faf78f",
            }}
          >
            Chat App Binh Hu
          </Typography>
        </Grid>

        <Grid
          item
          xs={12}
          sx={{
            textAlign: "center",
            width: "100%",
            zIndex: 1,
            position: "relative",
            marginTop: "1em",
          }}
        >
          {renderControl()}
        </Grid>

        <Grid
          item
          xs={12}
          sx={{
            textAlign: "center",
            width: "100%",
            zIndex: 2,
            position: "absolute",
            marginTop: "13.95em",
            marginLeft: "-0.58em",
          }}
        >
          <StyleWarperLaptop sx={{ marginLeft: "1.1em" }}>
            <Avatar
              sx={{
                width: "16.5em",
                height: "16.5em",
              }}
              alt="Icon"
              imgProps={{ referrerPolicy: "no-referrer" }}
              src={IconImage.src}
            />
          </StyleWarperLaptop>
          <StyleWarperMobile sx={{ marginLeft: "1.1em" }}>
            <Avatar
              sx={{
                width: "10.5em",
                height: "10.5em",
              }}
              alt="Icon"
              imgProps={{ referrerPolicy: "no-referrer" }}
              src={IconImage.src}
            />
          </StyleWarperMobile>
        </Grid>
      </Grid>
    </StyleBox>
  );
}
