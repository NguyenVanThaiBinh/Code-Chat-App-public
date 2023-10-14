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
import React from "react";
import DefaultAvatar from "../../../asset/group_avatar.png";
import { useState, useRef, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { server } from "../../index";
import { Tooltip, debounce } from "@mui/material";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import Stack from "@mui/material/Stack";
import AddReactionIcon from "@mui/icons-material/AddReaction";
import axios from "axios";
import GroupChatObject from "../../../Object/GroupChatObject";

const StyleBoxHeader = styledMe(Box)`
  min-height: 50px;
  width: "100%";

`;
const StyleBoxAddedMember = styledMe(Box)`
  min-height: 6em;
  width: "100%";
margin-top:1em;
`;
const StyleBoxUserList = styledMe(Box)`
  height: 78vh;
  min-height: 50px;
  overflow-y: scroll;
  width: "100%";
  max-height:46.5vh;
  margin-top:2.5em;
  @media only screen and (max-width: 767px)  { 
    margin-top:0em;
    }
`;

const StyleBoxWrapper = styledMe(Box)` 
  @media only screen and (max-width: 429px) { 
  height: 48em;
  }`;

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
const ItemAddedMember = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  marginRight: "0.6em",
  textAlign: "center",
  boxShadow: "none",
  backgroundColor: "#f0f0f0",
}));

export default function CreateGroupMember(props: any) {
  const [searchResultData, setSearchResultData] = useState<any[]>([]);

  const [loading, setLoading] = useState(-1);

  const [pleaseWait, setPleaseWait] = useState(false);
  const [text, setText] = useState("");
  const [makeRender, setMakeRender] = useState<any>();
  const { data: session } = useSession<any | null>();
  const [showAddGroupButton, setShowAddGroupButton] = useState("none");

  const textInput = useRef<HTMLInputElement>(null);
  const groupURL = useRef("");
  const listMemberAdding = useRef<any[]>([]);
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState("");
  const [groupName, setGroupName] = useState("");

  const [isUploadImage, setIsUploadImage] = useState(false);
  const [uploadPercents, setUploadPercent] = useState<any | null>(null);

  const userEmail = session && session.user ? session.user.email : null;
  const userNickname = session && session.user ? session.user.name : null;
  const userUrl = session && session.user ? session.user.image : null;

  //show all user and set group name when load component
  useEffect(() => {
    if (props.groupData.memberData.length == 2) {
      setGroupName(`Group of ${userNickname}`);
      setPreview("");
    } else {
      setGroupName(props.groupData.chat_name);
      setPreview(props.groupData.photoGroupChatUrl);
    }

    //TODO: Set list Users
    setText("Loading all user...");
    setLoading(0);
    let listUsersData = [];

    listUsersData = JSON.parse(localStorage.getItem("listUsers") as any);
    if (listUsersData) {
      const filteredData = listUsersData.filter(
        (group: any) => group.email != userEmail
      );
      //check if member is added in group
      for (let i = 0; i < filteredData.length; i++) {
        for (let j = 0; j < props.groupData?.memberData.length; j++) {
          if (filteredData[i].email == props.groupData?.memberData[j].email) {
            filteredData[i].isChecked = true;
            filteredData[i].isFocus = true;
            if (!listMemberAdding.current.includes(filteredData[i]))
              listMemberAdding.current.push(filteredData[i]);
          }
        }
      }

      // sort by checked item first in array
      filteredData.sort((x: any) => (x.isChecked == true ? -1 : 0));

      setLoading(1);
      setSearchResultData(filteredData);
      return;
    }

    fetch(server + `/api/users/findUser?searchKey= `)
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          const filteredData = data.filter(
            (group: any) => group.email != userEmail
          );
          //check if member is added in group
          for (let i = 0; i < filteredData.length; i++) {
            for (let j = 0; j < props.groupData?.memberData.length; j++) {
              if (
                filteredData[i].email == props.groupData?.memberData[j].email
              ) {
                filteredData[i].isChecked = true;
                filteredData[i].isFocus = true;
                if (!listMemberAdding.current.includes(filteredData[i]))
                  listMemberAdding.current.push(filteredData[i]);
              }
            }
          }

          // sort by checked item first in array
          filteredData.sort((x: any) => (x.isChecked == true ? -1 : 0));

          setLoading(1);
          setSearchResultData(filteredData);
        }

        //show button add group
        if (listMemberAdding.current.length >= 2) {
          setShowAddGroupButton("block");
        } else {
          setShowAddGroupButton("none");
        }

        if (data.length == 0) {
          setSearchResultData(data);
          setLoading(0);
          setText("Nothing data...");
        }
      });
  }, [props.groupData, userEmail, userNickname]);

  //TODO: Upload Image API
  const uploadImageAPI = async () => {
    try {
      if (
        selectedFile != null &&
        selectedFile != undefined &&
        (selectedFile as any).size <= 10485760
      ) {
        const formData = new FormData();
        formData.append("file", selectedFile as any);
        formData.append("upload_preset", "v8xiup5x");
        // formData.append("public_id", groupData.validateGroup);
        setIsUploadImage(true);

        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dbgx1oxde/image/upload",
          formData,
          {
            onUploadProgress: (progressEvent) => {
              if (progressEvent.bytes && progressEvent.total != undefined) {
                let percent = Math.round(
                  (progressEvent.loaded / progressEvent.total) * 100
                );
                setUploadPercent(percent + "%");
              }
            },
          }
        );

        setIsUploadImage(false);
        setUploadPercent(null);
        groupURL.current = response?.data?.url;
      }
    } catch (err) {
      setUploadPercent("upload fail!!!");
      setIsUploadImage(false);
      console.error(err);
    }
  };
  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    let objectUrl: any;
    if (selectedFile !== undefined && selectedFile != null) {
      objectUrl = URL.createObjectURL(selectedFile);

      uploadImageAPI();

      setPreview(objectUrl);
    }

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  // preview upload image
  const onSelectFile = async (e: any) => {
    e.preventDefault();
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }
    if (e.target.files[0].size > 10485760) {
      let size = e.target.files[0].size.toString().slice(0, 2);
      alert("Size must be <= 10M, now is: " + size + "M");
      setSelectedFile(undefined);
      return;
    }
    setSelectedFile(e.target.files[0]);
  };

  const searchUserKeyPress = (e: any) => {
    e.preventDefault();
    const keySearch = e.target.value;
    if (keySearch.length > 2 || keySearch == " ") {
      setText("Searching...");
      setLoading(0);
      textInput.current?.blur();
      fetch(server + `/api/users/findUser?searchKey=${keySearch}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.length > 0) {
            const filteredData = data.filter(
              (group: any) => group.email != userEmail
            );
            //check if member is checked before
            for (let i = 0; i < filteredData.length; i++) {
              for (let j = 0; j < listMemberAdding.current.length; j++) {
                if (
                  filteredData[i].email == listMemberAdding.current[j].email
                ) {
                  filteredData[i].isChecked = true;
                  filteredData[i].isFocus = true;
                }
              }
            }

            setLoading(1);
            setSearchResultData(filteredData);
          }
          if (data.length == 0) {
            setSearchResultData(data);
            setLoading(0);
            setText("Nothing data...");
          }
        });
    }
  };
  const debounceSearchUsers = useCallback(
    debounce(searchUserKeyPress, 1500),
    []
  ); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChangeGroupNameInput = (e: any) => {
    // 👇 Store the input value to local state
    setGroupName(e.target.value);
  };

  const handleClickAddMember: any = (newEmail: string) => {
    searchResultData.forEach((element: any) => {
      if (element?.email == newEmail) {
        //add field for searchResultData
        if (element.isChecked != true) {
          element.isChecked = true;
          element.isFocus = true;
          //add to listMemberAdding
          listMemberAdding.current.push(element);
        } else {
          element.isChecked = false;
          element.isFocus = false;
          //remove to listMemberAdding
          listMemberAdding.current = listMemberAdding.current.filter(
            (item) => item.email != element.email
          );
        }
      }
    });
    //show button add group
    if (listMemberAdding.current.length >= 2) {
      setShowAddGroupButton("block");
    } else {
      setShowAddGroupButton("none");
    }
    setSearchResultData(searchResultData);

    let time = new Date(new Date().getTime());
    setMakeRender(time);
  };

  const createGroupConversationButton = async () => {
    const emailArray = [userEmail];
    const memberArray = [
      { email: userEmail, nickname: userNickname, photoUserUrl: userUrl },
    ];

    listMemberAdding.current.forEach((element) => {
      let userData = {
        email: element.email,
        nickname: element.nickname,
        photoUserUrl: element.photoUserUrl,
      };
      emailArray.push(element.email);
      memberArray.push(userData);
    });
  
    let groupData: GroupChatObject = {
      id_chat_group: "",
      chat_name: groupName,
      memberData: memberArray,
      last_chat_content: "",
      photoGroupChatUrl: groupURL.current,
      last_chat_update: new Date(),
      validateGroup: emailArray.sort().toString().replaceAll(",", ""),
    };
    props.handleDoubleClick(groupData);
  };

  const comeBackButtonOnclick = () => {
    props.handleClick(props.groupData.id_chat_group, props.groupData);
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
          <StyleBoxHeader>
            <Grid>
              <Grid item xs={12} sx={{ display: "flex" }}>
                <StyleButton onClick={comeBackButtonOnclick}>
                  <ArrowBackIosIcon fontSize="large" color="primary" />
                  Back
                </StyleButton>
                <Typography
                  sx={{
                    marginTop: "0.5em",
                    marginLeft: "2em",
                    maxWidth: "13em",
                    fontWeight: "bold",
                    fontSize: "18px",
                    color: "#1976d2",
                  }}
                >
                  Create new group
                </Typography>
                <Button
                  onClick={createGroupConversationButton}
                  sx={{
                    marginLeft: "22.5em",
                    position: "fixed",
                    display: showAddGroupButton,
                  }}
                >
                  <AddReactionIcon fontSize="large" sx={{ color: "red" }} />
                </Button>
              </Grid>
              <Grid container>
                <Grid
                  item
                  xs={4}
                  sx={{
                    textAlign: "center",
                    marginTop: "0.5em",
                    marginLeft: "0.5em",
                  }}
                >
                  <TextField
                    title="Click to start chat!"
                    size="small"
                    inputRef={textInput}
                    label="Group name"
                    type="text"
                    multiline={false}
                    maxRows={1}
                    onChange={handleChangeGroupNameInput}
                    variant="standard"
                    value={groupName}
                    inputProps={{ maxLength: 28 }}
                  />
                </Grid>
                <Grid
                  item
                  xs={3}
                  sx={{ textAlign: "center", marginTop: "0.5em" }}
                >
                  <Button
                    sx={isUploadImage ? { display: "none" } : {}}
                    variant="contained"
                    component="label"
                    size="small"
                  >
                    Image
                    <input type="file" hidden onChange={onSelectFile} />
                  </Button>
                  <Typography variant="h6" gutterBottom>
                    {uploadPercents}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  {
                    <Avatar
                      sx={
                        isUploadImage
                          ? { filter: "blur(2px)", width: 65, height: 65 }
                          : { width: 65, height: 65 }
                      }
                      alt="ChatAvatar"
                      imgProps={{ referrerPolicy: "no-referrer" }}
                      src={preview || DefaultAvatar.src}
                    />
                  }
                </Grid>
              </Grid>

              <Grid
                item
                xs={12}
                sx={{ textAlign: "center", marginTop: "0.5em" }}
              >
                <FormControl sx={{ width: "22em", marginTop: "0.5em" }}>
                  <TextField
                    title="Click to start chat!"
                    size="small"
                    inputRef={textInput}
                    label="Search member"
                    type="text"
                    multiline={false}
                    maxRows={1}
                    onChange={debounceSearchUsers}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </StyleBoxHeader>
          <StyleBoxAddedMember>
            <Grid container>
              <Grid item xs={1}></Grid>
              <Grid item xs={11}>
                <Stack
                  direction="row"
                  sx={{
                    paddingTop: "0px",
                    overflowX: "scroll",
                  }}
                >
                  {listMemberAdding.current.map((e: any) => (
                    <React.Fragment key={e.email}>
                      <ItemAddedMember>
                        <Avatar
                          sx={{ marginLeft: "0.5em" }}
                          alt="UserAvatar"
                          imgProps={{ referrerPolicy: "no-referrer" }}
                          src={e.photoUserUrl || DefaultAvatar.src}
                        />

                        <ListItemText
                          sx={{
                            color: "black",
                            textOverflow: "ellipsis",
                            maxWidth: "4.5em",
                          }}
                          primary={e.nickname}
                        />
                      </ItemAddedMember>
                    </React.Fragment>
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </StyleBoxAddedMember>
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
                  {searchResultData.map((object: any) => (
                    <React.Fragment key={object._id}>
                      <Grid item xs={1}></Grid>

                      <Grid
                        item
                        xs={10}
                        sm={6}
                        sx={{
                          marginTop: "0.5em",
                        }}
                      >
                        <List
                          id={object._id}
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
                              sx={{
                                padding: "0",
                                paddingLeft: "0.5em",
                                bgcolor: object.isFocus
                                  ? "rgba(25, 118, 210, 0.08)"
                                  : "",
                              }}
                              onClick={() => handleClickAddMember(object.email)}
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
                                  <React.Fragment>
                                    {object.email}
                                  </React.Fragment>
                                }
                              />
                              <Checkbox
                                checked={object.isChecked ? true : false}
                                icon={<FavoriteBorder />}
                                checkedIcon={<Favorite />}
                                sx={{
                                  "& .MuiSvgIcon-root": { fontSize: 33 },
                                  marginTop: "0.7em",
                                }}
                              />
                            </ListItem>
                          </ListItemButton>
                        </List>
                      </Grid>

                      <Grid item xs={1}></Grid>
                    </React.Fragment>
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
