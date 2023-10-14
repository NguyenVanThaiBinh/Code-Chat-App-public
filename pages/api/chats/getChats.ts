import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { collections, connectToDatabase } from "../../../middleware/database";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.get(async (req, res) => {
  try {
    await connectToDatabase();
    const message = await collections.chat
      ?.find(req.query)
      .sort({ _id: -1 })
      .limit(1)
      .toArray();
    res.send(message);
  } catch (error: any) {
    res.send(error.message);
  }
});
export default handler;
