import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { collections, connectToDatabase } from "../../../middleware/database";

const handler = nextConnect<NextApiRequest, NextApiResponse>();
handler.post(async (req, res) => {
  try {
    if (req.body != null) {
      await connectToDatabase();
      await collections.chatgroup?.updateOne(
        { id_chat_group: req.body.id_chat_group.toString() },
        {
          $set: {
            last_chat_content: req.body.last_chat_content.toString(),
            last_chat_update: req.body.DATE_TIME,
          },
        }
      );
      res.send("Update last msg correctly!");
    } else {
      res.send("Update last msg fail!");
      console.warn("Nothing to update!");
    }
  } catch (error: any) {
    res.send(error.message);
  }
});
export default handler;
