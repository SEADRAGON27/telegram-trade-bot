import "dotenv/config";
import { Telegraf } from "telegraf";
import { pricesCryptoCurrancy } from "../api.js";
import { sendMessageSMS } from "../lib/twilio.js";
import { DB, deleteUserInfo, extractFromDB } from "../db.js";

const bot = new Telegraf(process.env.BOT_TOKEN);

export const handler = async () => {
  try {
    const userData = await extractFromDB("users");
    for (const data of userData) {
      const currantPrice = await pricesCryptoCurrancy(data.cryptocurrancy);
      const dataUser=  deleteUserInfo(data.cryptocurrancy,data.price,data.userId)
      const notification = `✅Price ${data.cryptocurrancy} reached the goal.
      ${data.notification ?`✍Comment:${data.notification}` : ""}`;

      if (data.telegram && currantPrice >= data.price ) {
        await bot.telegram.sendMessage(data.userId, notification);
        await DB("deleteData",dataUser,'users')
      }

      if (data.sms && currantPrice>=data.price ) {
        await sendMessageSMS(data.phone, notification);
        await DB("deleteData",dataUser,'users')
      }

      if (data.both && currantPrice>=data.price) {
        await bot.telegram.sendMessage(data.userId, notification);
        await sendMessageSMS(data.phone, notification);
        await DB("deleteData",dataUser,'users')
      }
    }
   
  } catch (err) {
    console.log(err);
  }
};
