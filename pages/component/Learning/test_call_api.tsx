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
import ImageListItem from "@mui/material/ImageListItem";
import Image from 'next/image';

const Item = styled("div")(() => ({
  textAlign: "center",
}));

const tab = ["posts", "comments", "albums", "photos"];

const Test = () => {
  const [data, setData] = useState([]);
  const [type, setType] = useState("posts");
  const [showGoToTop, setShowGoToTop] = useState(false);
  const [countdown, setCountdown] = useState(10);

  if (countdown == 0) {
    setCountdown(10);
  }
  useEffect(() => {
    //Count down

    const timeId = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    //Load API
    fetch(`https://jsonplaceholder.typicode.com/${type}`)
      .then((response) => response.json())
      .then((data) => {
        if (type != "photos") {
          setData(data);
        } else {
          setData(data.filter((_: any, idx: any) => idx < 10));
        }
      });
    // DOM addEventListener
    const handlerScroll = () => {
      setShowGoToTop(window.scrollY >= 200);
    };
    window.addEventListener("scroll", handlerScroll);
    // Cleanup function
    return () => {
      window.removeEventListener("scroll", handlerScroll);
      clearInterval(timeId);
    };
  }, [type]);

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box
          sx={{ bgcolor: "#cfe8fc", padding: 10 }}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Item>
                {" "}
                <h1>{countdown}</h1>
              </Item>
            </Grid>
            <Grid item xs={12}>
              <Item>
                {tab.map((tab) => (
                  <Button
                    key={tab}
                    variant="contained"
                    onClick={() => setType(tab)}
                    sx={
                      type === tab
                        ? { color: "#fff", margin: 1, backgroundColor: "#333" }
                        : { margin: 1 }
                    }
                  >
                    {tab}
                  </Button>
                ))}
              </Item>
            </Grid>

            <Grid item xs={12}>
              <Item>
                <List>
                  {type != "photos"
                    ? data.map((object: any) => (
                        <ListItem key={object.id}>
                          {object.title || object.email}
                        </ListItem>
                      ))
                    : data.map((object: any) => (
                        <ListItem key={object.id}>
                          {
                            <Image
                              src={`${object.thumbnailUrl}`}
                              alt={object.title}
                            />
                          }
                        </ListItem>
                      ))}
                </List>
              </Item>
            </Grid>
          </Grid>
          {showGoToTop && (
            <Button
              variant="contained"
              sx={{
                position: "fixed",
                right: 20,
                bottom: 20,
              }}
              onClick={() => {
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
            >
              Go to top
            </Button>
          )}
        </Box>
      </Container>
    </React.Fragment>
  );
};
export default Test;
