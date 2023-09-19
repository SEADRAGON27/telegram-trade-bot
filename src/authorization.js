import "dotenv/config"
import { Scenes, Telegraf, session } from "telegraf";
import { recordToDB, extractFromDB, findUserInfo } from "./db.js";
import { wizardSceneTrade } from "./tradingScenes/handler.js";
import { hashPassword } from "../lib/argon2.js";


export const SceneTradingAutorization = new Scenes.WizardScene(
  "autorization",

  async (ctx) => {
    const data = findUserInfo(ctx.from.id);
    try {
      const res = await extractFromDB("usersKey", data);
      if (res.length <= 0) {
        await ctx.reply("For introducing with с API Kucoin.\n✍Write passphrase:");
        ctx.wizard.next();
      } else {
        await ctx.scene.enter("tradeScene");
      }
    } catch (err) {
      await ctx.reply(`😓Sorry,We have problem in our application.`);
      ctx.scene.leave();
    }
  },
    async (ctx) => {
    ctx.scene.state.phrase = await hashPassword(ctx.message.text);;
    await ctx.reply("✍Write apiSecret");
    ctx.wizard.next();
  },
  async (ctx) => {
    ctx.scene.state.secret = ctx.message.text;
    await ctx.reply("Write apiKey");
    ctx.wizard.next();
  },
  async (ctx) => {
    ctx.scene.state.apiKey = ctx.message.text;
    try {
      const data = {
        userId: ctx.from.id,
        passPhrase: ctx.scene.state.phrase,
        apiSecret: ctx.scene.state.secret,
        apiKey: ctx.scene.state.apiKey,
      };
      await recordToDB(data);
      await ctx.scene.enter("tradeScene");
      ctx.scene.leave();
    } catch (err) {
      await ctx.reply(`😓Sorry,We have problem in our application.`);
      ctx.scene.leave();
    }
  }
);
