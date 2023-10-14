import styledMe from "styled-components";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Button from "@mui/material/Button/Button";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import React, { useEffect } from "react";
import DefaultAvatar from "../../../asset/group_avatar.png";
import { useState, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { server } from "../../index";
import { debounce } from "@mui/material";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import GroupChatObject from "../../../Object/GroupChatObject";
import CheckShowAlertValidToken from "../../Function/CheckShowAlertValidToken";
const StyleBox = styledMe(Box)`
  height: 22vh;
  min-height: 50px;
  width: "100%";
`;
const StyleBoxUserList = styledMe(Box)`
  height: 72vh;
  max-height:65vh;
  min-height: 50px;
  overflow-y: scroll;
  width: "100%";
  margin-top:2em;
  @media only screen and (max-width: 767px)  { 
    margin-top:5em;
    }
`;
const StyleBoxWrapper = styledMe(Box)` 
  @media only screen and (max-width: 429px) { 
  height: 48em;
  }
  @media (min-width: 1600px) {
    height:91vh;
  } 
  `;

const StyleButton = styledMe(Button)`
display: none;
@media only screen and (max-width: 767px)  { 
  display: flex;
  }
`;
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function CreateConversation(props: any) {
  const [searchData, setSearchData] = useState([]);
  const [loading, setLoading] = useState(-1);
  const [pleaseWait, setPleaseWait] = useState(false);
  const [text, setText] = useState("");
  const { data: session } = useSession<any | null>();
  const textInput = useRef<HTMLInputElement>(null);

  const userEmail = session && session.user ? session.user.email : null;
  const userNickname = session && session.user ? session.user.name : null;
  const userUrl = session && session.user ? session.user.image : null;

  useEffect(() => {
    if (userEmail) CheckShowAlertValidToken(userEmail);

    let listUsersData = [];

    listUsersData = JSON.parse(localStorage.getItem("listUsers") as any);
    if (listUsersData) {
      setSearchData(listUsersData);
    }
  }, []);

  //TODO:Load list User Data
  useEffect(() => {
    fetch(server + `/api/users/findUser?searchKey=${" "}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          const filteredData = data.filter(
            (group: any) => group.email != userEmail
          );
          localStorage.setItem("listUsers", JSON.stringify(filteredData));
          setSearchData(filteredData);
        }
      });
  }, []);

  const keyPress = (e: any) => {
    e.preventDefault();
    setText("Searching...");
    setLoading(0);
    const keySearch = e.target.value;
    if (keySearch.length <= 2) {
      setSearchData([]);
      setLoading(-1);
    }
    if (keySearch == " ") {
      setText("Show all user...");
      setLoading(0);
    }

    if (keySearch.length > 2 || keySearch == " ") {
      textInput.current?.blur();
      fetch(server + `/api/users/findUser?searchKey=${keySearch}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.length > 0) {
            const filteredData = data.filter(
              (group: any) => group.email != userEmail
            );
            setLoading(1);
            setSearchData(filteredData);
          }
          if (data.length == 0) {
            setSearchData(data);
            setLoading(0);
            setText("Nothing data...");
          }
        });
    }
  };

  const debounceSearchUsers = useCallback(debounce(keyPress, 1300), []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClickCreateConversation = (
    newNickname: string,
    newEmail: string,
    newUrl: string
  ) => {
    setPleaseWait(true);
    setText("Checking...");
    const emailArray = [userEmail, newEmail];

    let groupData: GroupChatObject = {
      id_chat_group: "",
      chat_name: "",
      memberData: [
        { email: userEmail, nickname: userNickname, photoUserUrl: userUrl },
        { email: newEmail, nickname: newNickname, photoUserUrl: newUrl },
      ],
      last_chat_content: "",
      photoGroupChatUrl: "",
      last_chat_update: new Date(),
      validateGroup: emailArray.sort().toString().replaceAll(",", ""),
    };
    props.handleDoubleClick(groupData);
  };

  const comBackButtonOnclick = () => {
    props.handleClick("SidebarContainer", "", "");
  };
  return (
    <StyleBoxWrapper>
      {pleaseWait ? (
        <Typography
          sx={{ textAlign: "center", fontSize: "2em", paddingTop: "5em" }}
        >
          {text}
        </Typography>
      ) : (
        <>
          {" "}
          <StyleBox>
            <Grid>
              <Grid item xs={12}>
                <StyleButton onClick={comBackButtonOnclick}>
                  <ArrowBackIosIcon fontSize="large" color="primary" />
                  Back
                </StyleButton>
              </Grid>
              <Grid item xs={12} sx={{ textAlign: "center", marginTop: "2em" }}>
                <Typography
                  sx={{
                    marginBottom: "1em",
                    fontSize: "2rem",
                    fontWeight: "bold",
                    color: "#1976d2",
                  }}
                >
                  Add friend and Enjoy!!!
                </Typography>
                <FormControl sx={{ width: "22em" }}>
                  <TextField
                    inputRef={textInput}
                    label="Input your friend Name or Email"
                    type="text"
                    multiline={false}
                    maxRows={1}
                    onChange={debounceSearchUsers}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </StyleBox>
          <StyleBoxUserList>
            <Grid container>
              {loading != -1 && loading == 0 ? (
                <>
                  <Grid item xs={4}></Grid>
                  <Grid item xs={4}>
                    <Item sx={{ fontWeight: "bold", color: "indianred" }}>
                      {text}
                    </Item>
                  </Grid>
                  <Grid item xs={4}></Grid>
                </>
              ) : (
                <>
                  {" "}
                  {searchData.map((object: any) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      sx={{
                        marginTop: "0.5em",
                      }}
                      key={object._id}
                    >
                      <List
                        id={object._id}
                        key={object._id}
                        sx={{
                          bgcolor: "background.paper",
                          paddingTop: 0,
                          paddingBottom: 0,
                        }}
                      >
                        <ListItemButton
                          title="Click to start chat!"
                          sx={{
                            padding: "0",
                            ":hover": {
                              bgcolor: "rgba(25, 118, 210, 0.08)",
                            },
                            ":focus": {
                              bgcolor: "rgba(25, 118, 210, 0.08)",
                            },
                            color: "#1976d2",
                          }}
                        >
                          <ListItem
                            onClick={() =>
                              handleClickCreateConversation(
                                object.nickname,
                                object.email,
                                object.photoUserUrl
                              )
                            }
                          >
                            <ListItemAvatar>
                              <Avatar
                                alt="UserAvatar"
                                imgProps={{ referrerPolicy: "no-referrer" }}
                                src={object.photoUserUrl || DefaultAvatar.src}
                              />
                            </ListItemAvatar>
                            <ListItemText
                              sx={{
                                color: "black",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                              primary={object.nickname}
                              secondary={
                                <React.Fragment>{object.email}</React.Fragment>
                              }
                            />
                          </ListItem>
                        </ListItemButton>
                      </List>
                    </Grid>
                  ))}
                </>
              )}
            </Grid>
          </StyleBoxUserList>
        </>
      )}
    </StyleBoxWrapper>
  );
}
