import { Button, IconButton } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import ChatIcon from "@mui/icons-material/Chat";
import MorVericalIcon from "@mui/icons-material/MoreVert";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import Typography from "@mui/material/Typography";
import { useSession, signOut } from "next-auth/react";
import styled from "styled-components";
import { server } from "../../index";
import { useEffect, memo, useState, useRef } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Swal from "sweetalert2";
import axios from "axios";

const StyleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px;
  height: 5em;
  border-bottom: 1px solid whitesmoke;
  background-color: white;
`;
const StyleSearch = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 2px;
`;
const StyleSidebarButton = styled(Button)`
  display: flex;
  font-weight: bolder;
  width: 100%;
  border-top: 1px solid whitesmoke;
  :hover {
    background-color: white;
  }
`;

const StyleAvatar = styled(Avatar)`
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;

const StyleSearchInput = styled.input`
  outline: none;
  flex: 1;
  border: none;
  font-size: 15px;
`;

function Sidebar(props: any) {
  const { data: session, status } = useSession();
  const [isBlue, setIsBlue] = useState(false);

  const handleClickFromSidebar = () => props.handleOnClick(null);

  useEffect(() => {
    if (props.isShowAlert) {
      localStorage.setItem("isShowAlert", "true");
      Swal.fire({
        title: "Your access token is invalid. Please log in again!",
      }).then((result: any) => {
        if (result.isConfirmed) {
          try {
            axios.post(server + "/api/users/updateUserStatus", {
              email: session?.user?.email,
              status: false,
            });
            signOut();
          } catch (error) {
            console.warn("update User status fail!");
          }
        }
      });
    } else {
      localStorage.setItem("isShowAlert", "false");
    }
  }, [props.isShowAlert]);

  //set background color blue
  useEffect(() => {
    if (!props.isEnableBlue) {
      setIsBlue(true);
    } else {
      setIsBlue(false);
    }
  }, [props.isEnableBlue]);

  const Logout = () => {
    axios.post(server + "/api/users/updateUserStatus", {
      email: session?.user?.email,
      status: false,
    });

    signOut();
  };

  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: "2",
      }}
    >
      <Grid container>
        <Grid item xs={12}>
          <StyleHeader>
            <Tooltip
              title={
                session && session.user ? session?.user?.name : ("" as string)
              }
              placement="right"
            >
              <StyleAvatar
                sx={{ marginLeft: "1.2em", height: "48px", width: "48px" }}
                src={session?.user?.image as string}
                imgProps={{ referrerPolicy: "no-referrer" }}
              />
            </Tooltip>
            <Typography>What are you thinking ?</Typography>

            <div>
              <IconButton>
                <ChatIcon />
              </IconButton>

              <IconButton sx={{ marginRight: "0.5em;" }}>
                <Tooltip title="Logout" placement="right">
                  <LogoutIcon onClick={Logout} />
                </Tooltip>
              </IconButton>
            </div>
          </StyleHeader>
          <Divider
            sx={{ borderBottomWidth: 2.5, backgroundColor: "#e0e0e0" }}
          ></Divider>
        </Grid>

        <Grid item xs={12}>
          <StyleSidebarButton
            sx={isBlue ? { bgcolor: "#c6e3ff" } : { bgcolor: "white" }}
            onClick={handleClickFromSidebar}
          >
            Start a new conversation
          </StyleSidebarButton>
          <Divider
            sx={{ borderBottomWidth: 2.7, backgroundColor: "#e0e0e0" }}
          ></Divider>
        </Grid>
      </Grid>
    </Box>
  );
}
export default memo(Sidebar);
