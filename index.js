require('dotenv').config(); //initializes dotenv
const { Client, GatewayIntentBits } = require('discord.js'); //imports discord.js
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  GoogleGenerativeAIResponseError,
} = require("@google/generative-ai");
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const safe = {
  "HARM_CATEGORY_HARASSMENT": "BLOCK_NONE",
  "HARM_CATEGORY_HATE_SPEECH": "BLOCK_NONE",
  "HARM_CATEGORY_SEXUALLY_EXPLICIT": "BLOCK_NONE",
  "HARM_CATEGORY_DANGEROUS_CONTENT": "BLOCK_NONE",
}
const model = genAI.getGenerativeModel({
  model: "gemini-1.0-pro-001",
  safe
});


const generationConfig = {
  temperature: 1,
  topP: 1,
  topK: 0,
  maxOutputTokens: 2048,
  responseMimeType: "text/plain",
};

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const axios = require('axios'); //add this line at the top

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});
client.on('messageCreate', async msg => {
    try {
    let command
    const args = msg.content.split(' ');
    command = args.shift().toLowerCase();
    let mentionedUser
    let additionalParameter
    switch (command) {
      case "<@1245289334731575366>":
        try {
          const asker = msg.content.replace(/<@1245289334731575366>/g, '');
          const aiResponse = await ai(asker);
          msg.reply(aiResponse);
        } catch (error) {
          if (error instanceof GoogleGenerativeAIResponseError) {
            console.error('GoogleGenerativeAIResponseError:', error.message);
            msg.reply('Ga boleh kasar ya anjing!.');
          } else {
            console.error('Error:', error.message);
            msg.reply('KOntol.');
          }
        }
        break;
      case "summon":
        mentionedUser = msg.mentions.users.first();
        let repeatCount = msg.content.split(" ")[2] ?? 1;
        if (mentionedUser) {
            for (let i = 0; i < repeatCount; i++) {
                msg.reply(`<@${mentionedUser.id}> Keluar Kontol`);
            }
        } else {
            msg.reply('Tag dulu orangnya kontol!');
        }
        break;
     }
    } catch (error) {
      console.log(error)
      msg.reply('Bacot gua lagi sibuk.');
  }
  })
async function ai(message) {
  let parts = [
    {text: "input: jawab dengan bahasa gaul, "+message},
    {text: "output: "},
  ];

  const result = await model.generateContent({
    contents: [{ role: "user", parts }],
    generationConfig
  });
  console.log(result.response.text())
  return result.response.text();
}
//this line must be at the very end
client.login(process.env.CLIENT_TOKEN); //signs the bot in with token

// process.on('unhandledRejection', error => {
//   console.error('Unhandled promise rejection:', error);
// });