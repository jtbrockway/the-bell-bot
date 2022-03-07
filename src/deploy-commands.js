import fs from 'fs';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import config from '../config/config.js';

const commands = [];
const commandFiles = fs
  .readdirSync('./src/commands')
  .filter((file) => file.endsWith('.js'));
for (const file of commandFiles) {
  const { default: command } = await import(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(config.botToken);
//Register commands
rest
  .put(Routes.applicationCommands(config.clientId), { body: commands })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);

//Delete commands
/*
rest.get(Routes.applicationCommands(config.clientId)).then((data) => {
  const promises = [];
  for (const command of data) {
    const deleteUrl = `${Routes.applicationCommands(config.clientId)}/${
      command.id
    }`;
    promises.push(rest.delete(deleteUrl));
  }
  return Promise.all(promises);
});
*/
