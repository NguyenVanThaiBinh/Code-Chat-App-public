import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { collections, connectToDatabase } from "../../../middleware/database";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.get(async (req, res, next) => {
  const searchKey = req.query.searchKey;
  try {
    await connectToDatabase();
    const userList = await collections
      .user!.find({
        $or: [
          { email: { $regex: searchKey, $options: "i" } },
          {
            nickname: { $regex: searchKey, $options: "i" },
          },
        ],
      })
      .toArray();
    res.send(userList);
  } catch (error: any) {
    res.send(error.message);
  }
});
export default handler;
