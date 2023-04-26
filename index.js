require("dotenv").config();
const { Client, GatewayIntentBits, } = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

client.once("ready", () => {
    console.log("Bot Ready...");
});

client.on("messageCreate", message => {
    console.log(message);
    if (message.content === "trend") { //message.reply returns to user
        message.reply("Here are some trendy pieces for the week!");
      }

});

client.login(process.env.token);