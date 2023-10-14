import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { collections, connectToDatabase } from "../../../middleware/database";

const handler = nextConnect<NextApiRequest, NextApiResponse>();
handler.post(async (req, res) => {
  try {
   
    if (req.body != null) {
      await connectToDatabase();
      await collections.user?.updateOne(
        { email: req.body.userEmail.toString() },
        {
          $set: {
            playerId_Onesignal: req.body.playerId.toString(),
          },
        }
      );
      res.send("Update playId correctly!");
    } else {
      res.send("Update playId fail!");
      console.warn("Nothing to update!");
    }
  } catch (error: any) {
    res.send(error.message);
  }
});
export default handler;
