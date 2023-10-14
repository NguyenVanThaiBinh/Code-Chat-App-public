import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { collections, connectToDatabase } from "../../../middleware/database";
var jwt = require("jsonwebtoken");

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.get(async (req, res) => {
  var access_token_req = req.headers.authorization;
  const secret = process.env.NEXTAUTH_SECRET;
  let decodedTokenData: any;
  try {
    const decodedToken = jwt.verify(access_token_req, secret);
    decodedTokenData = decodedToken.data;
  } catch (error) {
    res.send({
      message: "Access_token is valid!",
      success: false,
    });
    return;
  }

  try {
    await connectToDatabase();
    const group = await collections.chatgroup
      ?.find(req.query)
      .sort({ last_chat_update: -1 })
      .toArray();

    //Check Authorization User
    if (group && group?.length > 0) {
      group.forEach((e: any) => {
        if (!e.validateGroup.includes(decodedTokenData)) {
          res.send({
            message: "Access_token is not authenticated!",
            success: false,
          });
          return;
        }
      });
    }

    res.send(group);
  } catch (error: any) {
    res.send(error.message);
  }
});
export default handler;
