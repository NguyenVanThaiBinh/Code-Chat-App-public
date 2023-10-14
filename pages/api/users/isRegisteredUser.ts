import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { collections, connectToDatabase } from "../../../middleware/database";
import { server } from "../../index";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.get(async (req, res) => {
  try {
    let userEmail = req.query.userEmail;
    let playerId = req.query.playerId;

    //get User from Email
    await connectToDatabase();
    const user = await collections.user?.findOne({ email: userEmail });

    if (user) {
      //check is the same playerId to update
      if (user.playerId_Onesignal != playerId) {
        let updatePlayerIdData = { userEmail: user.email, playerId: playerId };
        try {
          fetch(server + "/api/users/updatePlayerId", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatePlayerIdData),
          });
        } catch (error) {
          console.warn("update updatePlayerId fail!");
        }
      }
      res.send({
        result: true,
        refresh_token: user.refresh_token,
        access_token: user.access_token,
        user_status: user.isOnline,
      });
      return;
    } else {
      res.send({ result: false });
      return;
    }
  } catch (error: any) {
    res.send(error.message);
  }
});
export default handler;
