import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { collections, connectToDatabase } from "../../../middleware/database";
import { server } from "../../index";

const handler = nextConnect<NextApiRequest, NextApiResponse>();
handler.post(async (req, res) => {
  let isInsertedChat = false;
  const chatData = req.body;

  await fetch(
    `${server}/api/chats/isInsertedChat?content=${chatData[0].content}&id_chat_group=${chatData[0].id_chat_group}&from=${chatData[0].from}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.send_at == chatData[0].send_at) {
        isInsertedChat = true;
      }
    });

  if (isInsertedChat) {
    res.send("Already inserted chat!!!");
    return;
  }
  try {
    if (chatData != null) {
      await connectToDatabase();
      await collections.chat?.insertMany(chatData);
      res.send("Insert correctly!");
    } else {
      res.send("Nothing to insert!");
      console.warn("Nothing to insert!");
    }
  } catch (error: any) {
    res.send(error.message);
  }
});
export default handler;
