require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Discord = require('discord.js');
const config = require('../config/config');
const {getRoutes} = require('./router.js');
const discordCommands = require('./DiscordBot/commands.js');

//Declarations
const app = express();
const client = new Discord.Client();
const messages = new Set();

//Express Setup
app.use(cors());
app.use(express.json());
app.use('/', getRoutes(client, messages));
app.listen(config.port);

//Discord Bot setup
client.once('ready', () => {
  console.log('Ready!');

  client.user.setPresence({
    status: "online",
    activity: {
      name: config.bellSite
    }
  });
});
client.login(config.botToken);

//Discord Client functions
client.on('messageReactionAdd', (reaction, user) => {
  discordCommands.reactionEdit(reaction, user, 'add', messages);
});

client.on('messageReactionRemove', (reaction, user) => {
  discordCommands.reactionEdit(reaction, user, 'remove', messages);
});