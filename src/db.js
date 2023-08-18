import "dotenv/config";
import { MongoClient } from "mongodb";

export const extractFromDB = async (collectionName, data) => {
  const client = new MongoClient(process.env.CONECTION_DB);
  await client.connect();
  const db = client.db("TelegramBot");
  const collection = db.collection(collectionName);
  const result = await collection.find(data).toArray();
  client.close();
  return result;
};

export const recordToDB = async (data, collectionName) => {
  const client = new MongoClient(process.env.CONECTION_DB);
  await client.connect();
  const db = client.db("TelegramBot");
  const collection = db.collection(collectionName);
  await collection.insertOne(data);
  client.close();
};

export const updateDataDB = async (filter, data, collectionName) => {
  const client = new MongoClient(process.env.CONECTION_DB);
  await client.connect();
  const db = client.db("TelegramBot");
  const collection = db.collection(collectionName);
  await collection.updateOne(filter, data);
  client.close();
};

export const deleteFromDB = async (data, collectionName) => {
  const client = new MongoClient(process.env.CONECTION_DB);
  await client.connect();
  const db = client.db("TelegramBot");
  const collection = db.collection(collectionName);
  await collection.deleteOne(data);
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
