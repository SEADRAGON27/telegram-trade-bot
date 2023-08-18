import { Scenes } from "telegraf";
import { deleteFromDB, deleteUserInfo } from "../db.js";
export const wizardSceneDelete = new Scenes.WizardScene(
  "deleteNotification",
  (ctx) => {
    ctx.reply("✍ Write cryptocurrancy youre notification:");
    ctx.wizard.next();
  },
  (ctx) => {
    ctx.scene.state.cryptocurrancy = ctx.message.text;
    ctx.reply("✍ Write the set price in the notice:");
    ctx.wizard.next();
  },
  async (ctx) => {
    const id = +ctx.from.id;
    const price = +ctx.message.text;
    const cryptocurrancy = ctx.scene.state.cryptocurrancy;
    try {
      const data = deleteUserInfo(cryptocurrancy,price,id)
      await deleteFromDB(data, "users");
      ctx.reply("✅Notification has been removed.");
      ctx.scene.leave();
    } catch (err) {
      ctx.reply(`😓Sorry,We have problem in our application.`);
      ctx.scene.leave();
    }
  }
);
