import { SlashCommandBuilder } from '@discordjs/builders';

import fs from 'fs';
const gamesConfig = JSON.parse(fs.readFileSync('./config/games.json'));

const handleAddGame = (interaction) => {
  const game = interaction.options.getString('game');
  const groupSize = interaction.options.getInteger('groupsize');
  const image = interaction.options.getString('image');

  gamesConfig.push({
    label: game,
    value: game,
    meta: {
      groupSize: groupSize,
      image: image
    }
  });

  fs.writeFileSync('./config/games.json', JSON.stringify(gamesConfig));
  //Display list of games
  return interaction.reply({
    content: 'You have successfully added a game',
    ephemeral: true
  });
};

const addGameData = {
  data: new SlashCommandBuilder()
    .setName('add')
    .setDescription('Add a game')
    .addStringOption((option) =>
      option
        .setName('game')
        .setDescription('Name of game to be added')
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName('groupsize')
        .setDescription('Number of players in a group')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('image')
        .setDescription('URL of image for game')
        .setRequired(true)
    ),
  async execute(interaction) {
    return handleAddGame(interaction);
  }
};

export default addGameData;
