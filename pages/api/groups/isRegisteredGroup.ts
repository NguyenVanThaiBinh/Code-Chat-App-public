import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { collections, connectToDatabase } from "../../../middleware/database";

const handler = nextConnect<NextApiRequest, NextApiResponse>();
handler.get(async (req, res) => {
  try {
    await connectToDatabase();
    const groupChat = await collections
      .chatgroup!.find({ validateGroup: req.query.validateGroup })
      .toArray();

    if (groupChat.length != 0) {
      res.status(200).send({ result: groupChat[0].id_chat_group, groupURL:groupChat[0].photoGroupChatUrl});

      return;
    }
    res.status(200).send({ result: false });
  } catch (error: any) {
    res.send(error.message);
  }
});
export default handler;
