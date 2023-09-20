import { Scenes } from "telegraf";
import { DB, deleteUserInfo } from "../db.js";
export const wizardSceneDelete = new Scenes.WizardScene(
  "deleteNotification",
  async (ctx) => {
    await ctx.reply("✍ Write cryptocurrancy youre notification:");
    ctx.wizard.next();
  },
 async (ctx) => {
    ctx.scene.state.cryptocurrancy = ctx.message.text;
    await ctx.reply("✍ Write the set price in the notice:");
    ctx.wizard.next();
  },
  async (ctx) => {
    const id = +ctx.from.id;
    const price = +ctx.message.text;
    const cryptocurrancy = ctx.scene.state.cryptocurrancy;
    try {
      const data = deleteUserInfo(cryptocurrancy,price,id)
      await DB("deleteData",data, "users");
      await ctx.reply("✅Notification has been removed.");
      ctx.scene.leave();
    } catch (err) {
      await ctx.reply(`😓Sorry,We have problem in our application.`);
      ctx.scene.leave();
    }
  }
);
