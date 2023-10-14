import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import Input from "@mui/material/Input";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Image from 'next/image';

const Item = styled("div")(() => ({
  textAlign: "center",
}));

const Test = () => {
  const [avatar, setAvatar] = useState();

  useEffect(() => {
    return () => {
      avatar && URL.revokeObjectURL(avatar);
    };
  }, [avatar]);

  const handlePreviewAvatar = (e: any) => {
    const img = e.target.files[0];

    img.preview = URL.createObjectURL(img);
    setAvatar(img.preview);
  };
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box
          sx={{ bgcolor: "#cfe8fc", height: "100vh" }}
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Item>
                <Input type="file" onChange={handlePreviewAvatar} />
              </Item>
            </Grid>
            <Grid item xs={12}>
              <Item>
                <Button variant="contained">Add List</Button>
              </Item>
            </Grid>

            <Grid item xs={12}>
              {avatar && (
                <Item>
                  {<Image  src={avatar as any} alt="" width="250" height="250" />}
                </Item>
              )}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </React.Fragment>
  );
};
export default Test;
