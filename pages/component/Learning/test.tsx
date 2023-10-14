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

const Test = () => {
  const [jobs, setJobs] = useState([]);
  const [job, setJob] = useState("");

  useEffect(() => {
    // Perform localStorage action
    let getLocalState: [];
    getLocalState = JSON.parse(localStorage.getItem("jobs") as any);
    setJobs(getLocalState);
  }, []);

  const handleSubmit = () => {
    setJobs((prev: any) => {
      const newJobs = [...prev, job] as any;

      const jsonJobs = JSON.stringify(newJobs);
      // localStorage.setItem("jobs", jsonJobs);

      return newJobs;
    });
    setJob("");
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
                <Input
                  value={job}
                  onChange={(e) => setJob(e.target.value)}
                ></Input>
              </Item>
            </Grid>
            <Grid item xs={12}>
              <Item>
                <Button variant="contained" onClick={handleSubmit}>
                  Add List
                </Button>
              </Item>
            </Grid>

            <Grid item xs={12}>
              <Item>
                <List>
                  {jobs.map((job: any, index: any) => (
                    <ListItem key={index} sx={{ textAlign: "center" }}>
                      <ListItemText primary={job} />
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
