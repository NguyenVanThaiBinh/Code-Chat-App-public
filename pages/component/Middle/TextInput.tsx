import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import { useState, useEffect, useRef } from "react";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import { styled } from "@mui/material/styles";
import SendIcon from "@mui/icons-material/Send";
import PhotoIcon from "@mui/icons-material/Photo";
import axios from "axios";
import { useSession } from "next-auth/react";
import CheckShowAlertValidToken from "../../Function/CheckShowAlertValidToken";
const StyleBox = styled(Box)`
  margin-top: 0.5em;
  @media only screen and (max-width: 429px) {
    margin-top: 1em;
    margin-bottom: 1em;
  }
`;
const StyleTextField = styled(TextField)`
  display: flex;
  @media only screen and (max-width: 767px) {
    display: none;
  }
`;
const StyleTextFieldMobile = styled(TextField)`
  display: none;
  @media only screen and (max-width: 767px) {
    display: flex;
  }
`;

export default function TextInput({ props }: { props: any }) {
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const textInput = useRef<HTMLInputElement>(null);
  const [uploadPercents, setUploadPercent] = useState<any | null>(null);
  const [isUploadImage, setIsUploadImage] = useState(false);
  const { data: session } = useSession();

  //TODO: Upload Image API
  const uploadImageAPI = async (selectedFile: any) => {
    try {
      //TODO:Call API to save image to server

      const formData = new FormData();
      formData.append("file", selectedFile);
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
      // setUrlImageAPI(response?.data?.url);
      updateChatData(response?.data?.url, "image");
      setIsUploadImage(false);
    } catch (err) {
      setUploadPercent("upload fail!!!");
      setIsUploadImage(false);
      console.error(err);
    }
  };
  useEffect(() => {
    setText("");
    setIsTyping(false);
  }, [props]);

  const updateChatData = (chatData: any, dataType: string) => {
    props(chatData, dataType);
  };

  // preview upload image
  const onSelectFile = async (e: any) => {
    //Check valid token
    if (
      session?.user?.email &&
      CheckShowAlertValidToken(session?.user?.email)
    ) {
      return;
    }
    e.preventDefault();
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    if (e.target.files[0].size > 10485760) {
      let size = e.target.files[0].size.toString().slice(0, 2);
      alert("Size must be <= 10M, now is: " + size + "M");
      return;
    }
    let objectUrl: any;
    objectUrl = URL.createObjectURL(e.target.files[0]);

    //Upload API image
    await uploadImageAPI(e.target.files[0]);
  };

  const keyPress = (e: any) => {
    if ((e.keyCode === 13 && !e.shiftKey) || (e.which === 13 && !e.shiftKey)) {
      e.preventDefault();

      if (e.target.value != "") {
        updateChatData(e.target.value, "text");
        setText("");
        setIsTyping(false);
      }
    }
  };
  const buttonClick = (e: any) => {
    e.preventDefault();

    if (e.currentTarget.value == "heart") {
      updateChatData("❤️", "text");
      textInput.current?.focus();
    }
    if (text.length > 0) {
      updateChatData(text, "text");
      setText("");
      setIsTyping(false);
      textInput.current?.focus();
    }
  };

  const handleOnChange = (e: any) => {
    if (e.target.value != null) {
      setIsTyping(true);
    }
    if (e.target.value.length == 0) {
      setIsTyping(false);
    }
    setText(e.target.value);
  };
  return (
    <>
      <StyleBox>
        <Grid container>
          <Grid item xs={2} sx={{ textAlign: "center", marginTop: "0.5em" }}>
            {isUploadImage ? (
              <>{uploadPercents}</>
            ) : (
              <>
                {" "}
                <Button component="label" size="small">
                  <PhotoIcon sx={{ color: "#1976d2", fontSize: 35 }}>
                    {" "}
                  </PhotoIcon>
                  <input type="file" hidden onChange={onSelectFile} />
                </Button>
              </>
            )}
          </Grid>

          <Grid item xs={8}>
            <FormControl size="small" fullWidth>
              <StyleTextField
                value={text ? text : ""}
                inputRef={(input) => input && input.focus()}
                label="Message"
                type="text"
                multiline={true}
                maxRows={3}
                onChange={handleOnChange}
                onKeyDown={keyPress}
              />
              <StyleTextFieldMobile
                value={text ? text : ""}
                inputRef={textInput}
                label="Message"
                type="text"
                multiline={true}
                maxRows={3}
                onChange={handleOnChange}
                onKeyDown={keyPress}
              />
            </FormControl>
          </Grid>
          <Grid item xs={2}>
            {isTyping ? (
              <Button sx={{ marginTop: 1 }} value={"AAA"} onClick={buttonClick}>
                <SendIcon />
              </Button>
            ) : (
              <>
                <Button
                  sx={{ color: "red" }}
                  value={"heart"}
                  onClick={buttonClick}
                >
                  <FavoriteRoundedIcon sx={{ fontSize: 34 }} />
                </Button>
              </>
            )}
          </Grid>
        </Grid>
      </StyleBox>
    </>
  );
}
