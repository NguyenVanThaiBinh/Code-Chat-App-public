import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { collections, connectToDatabase } from "../../../middleware/database";

const handler = nextConnect<NextApiRequest, NextApiResponse>();
handler.get(async (req, res) => {
  try {
    await connectToDatabase();
    const chatData = await collections
      .chat!.find({
        content: req.query.content,
        id_chat_group: req.query.id_chat_group,
        from: req.query.from,
      })
      .sort({ send_at: -1 })
      .limit(1)
      .toArray();

    if (chatData.length != 0) {
      res.send({ send_at: chatData[0].send_at });
      return;
    }
    // the first time chat, can insert
    res.send({ send_at: null });
  } catch (error: any) {
    res.send(error.message);
  }
});
export default handler;
