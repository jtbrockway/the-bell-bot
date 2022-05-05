import config from '../../config/config.js';
import { MessageActionRow, MessageSelectMenu, MessageButton } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

import fs from 'fs';

let players = [];
let groupSize;

const joinButton = new MessageActionRow().addComponents(
  new MessageButton()
    .setCustomId('join_button')
    .setLabel('Join!')
    .setStyle('SUCCESS')
);

const leaveButton = new MessageActionRow().addComponents(
  new MessageButton()
    .setCustomId('leave_button')
    .setLabel('Leave')
    .setStyle('DANGER')
);

const handlePlayerUpdate = (interaction) => {
  let playersString = players.join('\n');
  let i = groupSize - players.length;
  while (i > 0) {
    playersString += '\n---------\n';
    i--;
  }

  const embed = interaction.message.embeds[0];
  embed.fields = [{ name: 'Registered Players', value: playersString }];

  return interaction.update({
    content: interaction.content,
    embeds: [embed],
    components: [joinButton]
  });
};

export const handleJoin = (interaction) => {
  const { username } = interaction.user;
  if (players.length >= groupSize) {
    return interaction.reply({
      content: 'Too many other bells are resonating',
      ephemeral: true
    });
  }

  if (players.includes(username)) {
    return interaction.reply({
      content: 'Your bell is already resonating',
      ephemeral: true
    });
  }

  players.push(username);
  handlePlayerUpdate(interaction);
  return interaction.followUp({
    content: "You have answered the bell's call",
    components: [leaveButton],
    ephemeral: true
  });
};

export const handleLeave = (interaction) => {
  const { username } = interaction.user;
  players = players.filter((player) => player != username);

  handlePlayerUpdate(interaction);
  return interaction.update({
    content: "You have deafened your bell's resonance",
    components: [],
    ephemeral: true
  });
};

export const handleSelect = async (interaction) => {
  await interaction.deferReply({ ephemeral: true });

  players = [];

  const game = gamesConfig.filter((item) => {
    return item.value == interaction.values[0];
  })[0];

  players.push(interaction.user.username);
  groupSize = game.meta.groupSize;

  let playersString = players[0] + '\n';
  let i = groupSize - 1;
  while (i > 0) {
    playersString += '---------\n';
    i--;
  }

  const gameEmbed = {
    color: '#228B22',
    title: game.label,
    author: {
      name: 'Belle DelleRing',
      icon_url:
        'https://bloodborne.wiki.fextralife.com/file/Bloodborne/beckoning_bell.jpg'
    },
    description: `${interaction.user.username} has rung the bell`,
    image: {
      url: game.meta.image
    },
    fields: [{ name: 'Registered Players', value: playersString }],
    timestamp: new Date(),
    footer: {
      text: 'Support your local bell people',
      icon_url: 'https://i.redd.it/xpeoyxf0wdoz.jpg'
    }
  };

  await interaction.editReply({
    content: 'You may dismiss this message now',
    components: []
  });
  await interaction.followUp({
    content: `${config.coreId} ${interaction.user.username} would like to play ${game.label}`,
    embeds: [gameEmbed],
    components: [joinButton]
  });
};

const handleRing = (interaction) => {
  const gamesConfig = JSON.parse(fs.readFileSync('./config/games.json'));

  const gamesSelect = new MessageActionRow().addComponents(
    new MessageSelectMenu()
      .setCustomId('game_select')
      .setPlaceholder('No Game Selected')
      .addOptions(gamesConfig)
  );
  //Display list of games
  return interaction.reply({
    content: 'Select the game you would like to play',
    components: [gamesSelect],
    ephemeral: true
  });
};

const ringData = {
  data: new SlashCommandBuilder()
    .setName('ring')
    .setDescription('Notify Core of desire to play game'),
  async execute(interaction) {
    return handleRing(interaction);
  }
};

export default ringData;
