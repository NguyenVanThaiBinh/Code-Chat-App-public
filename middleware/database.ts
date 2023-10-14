import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";

export const collections: {
  user?: mongoDB.Collection;
  chatgroup?: mongoDB.Collection;
  chat?: mongoDB.Collection;
} = {};

export async function connectToDatabase() {
  dotenv.config();

  const client: mongoDB.MongoClient = new mongoDB.MongoClient(
    process.env.DB_CONN_STRING as string
  );

  await client.connect();

  const db: mongoDB.Db = client.db(process.env.DB_NAME);

  const usersCollection: mongoDB.Collection = db.collection(
    process.env.USERS_COLLECTION_NAME as string
  );

  const chatgroupCollection: mongoDB.Collection = db.collection(
    process.env.CHATGROUP_COLLECTION_NAME as string
  );
  const chatCollection: mongoDB.Collection = db.collection(
    process.env.CHAT_COLLECTION_NAME as string
  );

  collections.user = usersCollection;
  collections.chatgroup = chatgroupCollection;
  collections.chat = chatCollection;
}
