require('dotenv').config();
const { Telegraf, Markup } = require("telegraf");
const TOKEN = process.env.BOT_TOKEN;
const bot = new Telegraf(TOKEN);
const express = require("express");
const app = express()
app.use(express.json())
const web_link = "https://bicento-mini-app.vercel.app/";
const community_link = "https://t.me/BicentoHub";


bot.start((ctx) => {
    const startPayload = ctx.startPayload;
    const urlSent = `${web_link}?start=${startPayload}`;
    const user = ctx.message.from;
    const userName = user.username ? `@${user.username}` : user.first_name;
    ctx.replyWithMarkdown(`*Hey, ${userName}, Welcome to Bicento! *
Tap on the coin and see your balance rise.
      
*Bicento* is a Decentralized Exchange on the TON Blockchain. The biggest part of bot TOKEN distribution will occur among the players here.
      
Got friends, relatives, co-workers?
Bring them all into the game.
More buddies, more coins.`, {
        reply_markup: {
            inline_keyboard: [
              [{ text: "👋 Start now!", web_app: { url: urlSent } }],
              [{ text: "Join our Community", url: community_link }]
            
            ],
            in: true
        },
    });
  });
  
  
  
  bot.launch();
  
app.listen(3009, () => {
    console.log("server is me and now running")
})