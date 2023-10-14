import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { collections, connectToDatabase } from "../../../middleware/database";
import { server } from "../../index";
import axios from "axios";
var jwt = require("jsonwebtoken");

const secret = process.env.NEXTAUTH_SECRET;

const handler = nextConnect<NextApiRequest, NextApiResponse>();
handler.post(async (req, res) => {
  const user = req.body.userData;
  const userEmail = user?.email;
  const playerId = req.body.playerId;

  var access_token_req = req.headers.authorization;
  var access_token_user = "";
  var refresh_token = "";
  let access_token_status = false;
  var user_status = false;

  let isRegisteredUser = false;
  let isInvalidAccessToken = false;
  let isInvalidRefreshToken = false;

  // TODO: check isRegisteredUser and get refresh_token
  if (user?.email) {
    await fetch(
      `${server}/api/users/isRegisteredUser?userEmail=${user?.email}&playerId=${playerId}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.result == true) {
          axios.post(server + "/api/users/updateUserStatus", {
            email: userEmail,
            status: true,
          });
          isRegisteredUser = true;
          refresh_token = data.refresh_token;
          access_token_user = data.access_token;
          user_status = data.user_status;
        }
      });
  }
  // TODO: check access_token is own of user.
  // if (access_token_req && access_token_user != access_token_req) {
  //   res.send({
  //     message: "Access_token is not the same!",
  //     success: false,
  //     isRegisteredUser: true,
  //   });
  //   return;
  // }

  // TODO: if already registered user: check access token
  if (isRegisteredUser) {
    try {
      const decodedToken = jwt.verify(access_token_req, secret);

      if (decodedToken) access_token_status = true;
      //prevent other JWT access
      if (decodedToken.data != userEmail) {
        res.send({
          message: "Access_token is not authenticated!",
          success: false,
          isRegisteredUser: true,
        });
        return;
      }
      if (access_token_status) {
        access_token_req = "is already exist";
        res.send({
          access_token: access_token_req,
          success: true,
          isRegisteredUser: true,
        });
        return;
      }
    } catch (error) {
      isInvalidAccessToken = true;
    }
  }

  //TODO: If access_token is valid, check refresh_token
  if (isInvalidAccessToken) {
    try {
      const decodedRefreshToken = jwt.verify(refresh_token, secret);
      if (decodedRefreshToken) {
        // Create new access token and return new access token
        access_token_req = await jwt.sign(
          {
            exp: Math.floor(Date.now() / 1000) + 1 * 60 * 30,
            data: userEmail,
          },
          secret
        );
        await collections.user?.updateOne(
          { email: userEmail.toString() },
          {
            $set: {
              access_token: access_token_req,
            },
          }
        );

        res.send({
          access_token: access_token_req,
          success: true,
          message: "Create new access_token successfully!",
          isRegisteredUser: true,
        });
        return;
      }
    } catch (error) {
      isInvalidRefreshToken = true;
    }
  }

  if (isInvalidRefreshToken && user_status == false) {
    axios.post(server + "/api/users/updateUserStatus", {
      email: userEmail,
      status: true,
    });
    try {
      await connectToDatabase();

      access_token_req = await jwt.sign(
        {
          exp: Math.floor(Date.now() / 1000) + 1 * 60 * 30,
          data: userEmail,
        },
        secret
      );
      refresh_token = await jwt.sign(
        // refresh_token has 3 days to expire
        {
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 3,

          data: userEmail,
        },
        secret
      );
      await collections.user?.updateOne(
        { email: userEmail.toString() },
        {
          $set: {
            refresh_token: refresh_token,
            access_token: access_token_req,
          },
        }
      );
      res.send({
        access_token: access_token_req,
        success: true,
        message: "Create new refresh_token successfully!",
      });
    } catch (error: any) {
      res.send({ error, success: false });
    }
  } else if (isInvalidRefreshToken && user_status != false) {
    res.send({
      success: false,
      message: "Refresh_token is invalid!",
    });
  }

  //TODO: Insert new User to database
  if (!isRegisteredUser) {
    try {
      await connectToDatabase();
      axios.post(server + "/api/users/updateUserStatus", {
        email: userEmail,
        status: true,
      });
      access_token_req = await jwt.sign(
        {
          exp: Math.floor(Date.now() / 1000) + 1 * 60 * 30,
          data: userEmail,
        },
        secret
      );
      refresh_token = await jwt.sign(
        // refresh_token has 3 days to expire
        {
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 3,

          data: userEmail,
        },
        secret
      );

      let userData = {
        email: user?.email,
        fullname: user?.name,
        nickname: user?.name,
        last_active: new Date(),
        isOnline: false,
        photoUserUrl: user?.image,
        playerId_Onesignal: playerId,
        refresh_token: refresh_token,
        access_token: access_token_req,
      };
      await collections.user?.insertOne(userData);
      res.send({
        access_token: access_token_req,
        success: true,
        message: "Create new user successfully!",
      });
    } catch (error: any) {
      res.send({ error, success: false });
    }
  }
});
export default handler;
