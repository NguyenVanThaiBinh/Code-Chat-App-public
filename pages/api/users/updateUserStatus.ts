import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { collections, connectToDatabase } from "../../../middleware/database";

const handler = nextConnect<NextApiRequest, NextApiResponse>();
handler.post(async (req, res) => {
  try {
    if (req.body != null) {
      await connectToDatabase();

      await collections.user?.updateOne(
        { email: req.body.email.toString() },
        {
          $set: {
            isOnline: req.body.status,
          },
        }
      );
      res.send("Update User status correctly status: " + req.body.status);
    } else {
      res.send("Update status fail!");
      console.warn("Nothing to update!");
    }
  } catch (error: any) {
    res.send(error.message);
  }
});
export default handler;
