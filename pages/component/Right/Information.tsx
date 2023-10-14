import styledMe from "styled-components";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import React from "react";
import IconImage from "../../../asset/Icon.jpg";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { server } from "../../index";
import { styled } from "@mui/material/styles";

const StyleBox = styledMe(Box)`
  height: 100vh;
  min-height: 50px;

  border-right: 1px solid whitesmoke;
  width: "100%";
 

`;

export default function Information() {
  return (
    <StyleBox>
      <Grid container>
        <Grid item xs={12} sx={{ textAlign: "center", marginTop: "2em" }}>
          <Typography
            sx={{
              marginBottom: "2em",
              fontSize: "2rem",
              fontWeight: "bold",
              color: "#1976d2",
            }}
          ></Typography>
        </Grid>
      </Grid>
    </StyleBox>
  );
}
