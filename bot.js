const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const token = process.env.DISCORD_TOKEN;
const prefix = '!'

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', message => {
  // Prevent bot from responding to itself or other bots
  if (message.author.bot) return;

  switch (message.content){
	case `${prefix}test`:
		  message.reply('cool');
		  break;
	case `${prefix}help`:
		  message.reply('with what? there are no commands yet');
		  break;
  }
});

client.login(token);
