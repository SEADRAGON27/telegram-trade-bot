import "dotenv/config";
import mongoose from "mongoose";

export const db = async (method, data, collection, filter) => {
 try{
  await mongoose.connect(process.env.CONECTION_DB)
  switch (method) {
    case 'getData':
      const result = await collection.find(data);
      return result;
    case 'recordData':
      await collection.create(data);
      break;
    case 'updateData':
      await collection.updateOne(filter, data);
      break;
    case 'deleteData':
      await collection.deleteOne(data);
      break;
  }
  await mongoose.disconnect();
}catch(error){
  throw new Error(error);
}
};


