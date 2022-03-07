import config from '../config/config.js';
import { Client, Collection, Intents } from 'discord.js';
import fs from 'fs';

import { handleSelect, handleJoin, handleLeave } from './commands/ring.js';

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

//Register commands
client.commands = new Collection();
const commandFiles = fs
  .readdirSync('./src/commands')
  .filter((file) => file.endsWith('.js'));
for (const file of commandFiles) {
  const { default: command } = await import(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.once('ready', () => {
  console.log('Ready!');
});

client.on('interactionCreate', async (interaction) => {
  if (interaction.isSelectMenu()) {
    switch (interaction.customId) {
      case 'game_select':
        handleSelect(interaction);
    }
  } else if (interaction.isButton()) {
    switch (interaction.customId) {
      case 'join_button':
        handleJoin(interaction);
        break;
      case 'leave_button':
        handleLeave(interaction);
        break;
    }
  } else {
    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true
      });
    }
  }
});

client.login(config.botToken);
