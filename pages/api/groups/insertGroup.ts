import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { collections, connectToDatabase } from "../../../middleware/database";
import { server } from "../../index";

const handler = nextConnect<NextApiRequest, NextApiResponse>();
handler.post(async (req, res) => {
  const groupData = req.body;

  try {
    // insert and set id_chat_group by _id
    await connectToDatabase();

    const searchGroupChat = await collections
      .chatgroup!.find({ validateGroup: groupData.validateGroup })
      .toArray();

    if (searchGroupChat.length != 0) {
      res.send({
        result: "fail",
        message: "Group is already inserted!",
        id_chat_group: searchGroupChat[0].id_chat_group,
      });

      return;
    }

    const groupChat = await collections.chatgroup?.insertOne(groupData);
    await collections.chatgroup?.updateOne(
      { _id: groupChat?.insertedId },
      { $set: { id_chat_group: groupChat?.insertedId.toString() } }
    );

    res.send({
      result: "success",
      message: "Group is inserted successfully!",
      id_chat_group: groupChat?.insertedId,
    });
  } catch (error: any) {
    res.send(error.message);
  }
});
export default handler;
