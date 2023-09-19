import "dotenv/config";
import { MongoClient } from "mongodb";

export const DB = async (method, data, collection, filter) => {
  const client = new MongoClient(process.env.CONECTION_DB);
  await client.connect();
  const db = client.db("TelegramBot");
  const collection = db.collection(collection);
  switch (method) {
    case "getData":
      const result = await collection.find(data).toArray();
      return result;
    case "recordData":
      await collection.insertOne(data);
      break;
    case "updateData":
      await collection.updateOne(filter, data);
      break;
    case "deleteData":
      await collection.deleteOne(data);
      break;
  }
  client.close();
};


export const findUserInfo = (userId) => {
  return {
    $and: [
      { userId: userId },
      { passPhrase: { $exists: true } },
      { apiSecret: { $exists: true } },
      { apiKey: { $exists: true } },
    ],
  };
};

export const deleteUserInfo = (cryptocurrancy, price, id) => {
  return {
    cryptocurrancy: cryptocurrancy,
    price: price,
    userId: id,
  };
};
