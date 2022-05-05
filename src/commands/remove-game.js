import { SlashCommandBuilder } from '@discordjs/builders';
import fs from 'fs';

const handleRemoveGame = async (interaction) => {
  await interaction.deferReply({ ephemeral: true });

  const gamesConfig = JSON.parse(fs.readFileSync('./config/games.json'));
  const gameName = interaction.options.getString('game');

  //Verify game exists before attempting to remove
  if (!gamesConfig.find((game) => game.label == gameName)) {
    return interaction.editReply({
      content: `${gameName} is not a valid game to remove. Please verify spelling and try again`,
      ephemeral: true
    });
  }

  gamesConfig = gamesConfig.filter((game) => game.label !== gameName);

  fs.writeFileSync('./config/games.json', JSON.stringify(gamesConfig));
  console.log(`GAME REMOVED ${gameName}`);
  return interaction.editReply({
    content: 'You have successfully added a game',
    ephemeral: true
  });
};

const removeGameData = {
  data: new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Remove a game')
    .addStringOption((option) =>
      option
        .setName('game')
        .setDescription('Name of game to be removed')
        .setRequired(true)
    ),
  async execute(interaction) {
    return handleRemoveGame(interaction);
  }
};

export default removeGameData;
