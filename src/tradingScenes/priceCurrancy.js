import { Scenes } from "telegraf";
import { pricesCryptoCurrancy } from "../../api.js";
export const wizardScenePrice = new Scenes.WizardScene(
  "getPricesCrypto",
  async (ctx) => {
    await ctx.reply("✍ Write cryptocurrencies name(bitcoin,monero,ripple)");
    ctx.wizard.next();
  },
  async (ctx) => {
    const userPrompt = ctx.message.text;
    const res = await pricesCryptoCurrancy(userPrompt);
    if (+res) {
      await ctx.reply(`Price:${res}`);
      ctx.scene.leave();
    } else {
     await ctx.reply("⛔Cryptocurrency not found, please re-enter the text");
    }
  }
);
