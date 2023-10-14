import styledMe from "styled-components";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";

const StyleBox = styledMe(Box)`
  height: 100vh;
  min-height: 50px;
  border-right: 1px solid whitesmoke;
  width: "100%";
  @media only screen and (max-width: 429px) {
   display:none;
  }
  
`;
export default function Home() {
  return (
    <StyleBox>
      <Grid container>
        <Grid item xs={12} sx={{ textAlign: "center", marginTop: "2em" }}>
          <Typography sx={{ fontSize: "30px" }}>
            {"This is Chat App Binh Hu"}
          </Typography>
        </Grid>
        <Grid item xs={12} sx={{ marginTop: "1em" }}>
          <Typography sx={{ fontSize: "20px" }}>{"A.How to use?"}</Typography>
          <Typography sx={{ fontSize: "17px" }}>
            {"1.Click 'Start a new conversation'"}
          </Typography>
          <Typography sx={{ fontSize: "17px" }}>
            {"2.Click friend you want to talk"}
          </Typography>
        </Grid>
        <Grid item xs={12} sx={{ marginTop: "1em" }}>
          <Typography sx={{ fontSize: "20px" }}>
            {"B.This Chat App use:"}
          </Typography>
          <Typography sx={{ fontSize: "17px" }}>
            {"1.NodeJs in Backend with Ably(real-time), axios, JWT."}
          </Typography>
          <Typography sx={{ fontSize: "17px" }}>
            {"2.NextJs in Frontend with Material UI, sweetalert2. "}
          </Typography>
          <Typography sx={{ fontSize: "17px" }}>
            {"3.DataBase: MongoDB."}
          </Typography>
          <Typography sx={{ fontSize: "17px" }}>
            {
              "4.Source Git: https://github.com/NguyenVanThaiBinh/Chat-App-Nextjs-MUI."
            }
          </Typography>
        </Grid>
      </Grid>
    </StyleBox>
  );
}
