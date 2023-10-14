import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import Input from "@mui/material/Input";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

const Item = styled("div")(() => ({
  textAlign: "center",
}));

const jobs = [
  {
    id: 1,
    name: "Toi la binh hu",
  },
  {
    id: 2,
    name: "Toi la ngo khong",
  },
  {
    id: 3,
    name: "Toi la ai vay ta?",
  },
];

const Test = () => {
  const [me, setMe] = useState(1);

  useEffect(() => {
    const handleComment = ({ detail }: any) => {
    };

    window.addEventListener(`lesson-${me}`, handleComment);
    return window.removeEventListener(`lesson-${me}`, handleComment);
  }, [me]);
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
              <Item></Item>
            </Grid>
            <Grid item xs={12}>
              <Item></Item>
            </Grid>

            <Grid item xs={12}>
              <Item>
                <List>
                  {jobs.map((job) => (
                    <ListItem
                      key={job.id}
                      sx={{
                        textAlign: "center",
                        color: job.id === me ? "red" : "#333",
                      }}
                    >
                      <ListItemText
                        primary={job.name}
                        onClick={() => setMe(job.id)}
                      />
                    </ListItem>
                  ))}
                </List>
              </Item>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </React.Fragment>
  );
};
export default Test;
