import "dotenv/config";
import { Markup, Scenes } from "telegraf";
import { extractFromDB, findUserInfo, updateDataDB } from "../db.js";
export const changeDataAuthScene = new Scenes.WizardScene(
  "changeDataAuth",
  async (ctx) => {
    await ctx.reply(
      "Select data which would you change.",
      Markup.inlineKeyboard([
        [Markup.button.callback("💥Api secret", "secret")],
        [Markup.button.callback("💥Api key", "key")],
        [Markup.button.callback("💥Passphrase", "phrase")],
      ])
    );
    ctx.wizard.next();
  },
  async (ctx) => {
    const userPromt = ctx.message;
    if (userPromt) {
      await ctx.reply("⛔ Please use the buttons to make a selection.");
    } else {
      switch (ctx.callbackQuery.data) {
        case "secret":
          ctx.scene.state.secret = "secret";
          await ctx.reply("✍Write a new api secret:");
          break;
        case "key":
          ctx.scene.state.key = "key";
          await ctx.reply("✍Write a new api key:");
          break;
        case "phrase":
          ctx.scene.state.passPhrase = "phrase";
          await ctx.reply("✍Write a new passphrase:");
          break;
      }
      ctx.wizard.next();
    }
  },
  async (ctx) => {
    const newData = ctx.message.text;
    const typeAuth = ctx.scene.state;
    const data = findUserInfo(ctx.from.id);
    try {
      const res = await extractFromDB("usersKey", data);
      if (Object.hasOwn(typeAuth, "secret")) {
        await updateDataDB(
          { _id: res[0]._id },
          { $set: { apiSecret: newData } },
          "usersKey"
        );
        ctx.reply("✅Api secret is changed");
      }
      if (Object.hasOwn(typeAuth, "key")) {
        await updateDataDB(
          { _id: res[0]._id },
          { $set: { apiKey: newData } },
          "usersKey"
        );
        await ctx.reply("✅Api key is changed");
      }
      if (Object.hasOwn(typeAuth, "passPhrase")) {
        await updateDataDB(
          { _id: res[0]._id },
          { $set: { passPhrase: newData } },
          "usersKey"
        );
        ctx.reply("✅Passphrase is changed");
      }

      ctx.scene.leave();
    } catch (err) {
      await ctx.reply(
        `😓Sorry,something went wrong, make sure that you are registrated in our bot`
      );
      ctx.scene.leave();
    }
  }
);
