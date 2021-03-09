const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
	console.log('Ready!');
  client.user.setPresence({
    status: "online",  //You can show online, idle....
    activity: {
        name: "https://jtbrockway.github.io/the-bell/"
      }
  });
});

client.login('ODE4OTMxNjk3MjMwODA3MDQw.YEfPkw.dxO4cbJVqaEWJkTyzppzAU9tAYQ');

const messages = {};

client.on('message', message => {
  if(message.author.username === 'Bell') {
    const gameEmbed = new Discord.MessageEmbed()
      .setColor('#228B22')
      .setTitle('The Bell')
      .setAuthor('The Bell', 'https://static.wikia.nocookie.net/darksouls/images/a/a3/Parish_bell.jpg/revision/latest?cb=20130131003456')
      .setDescription('The Bell has been rung')
      .addField('Registered Players', '----------------------')
      .setTimestamp()
      .setFooter('Support your local bell people', 'https://i.redd.it/xpeoyxf0wdoz.jpg');
    
    message.channel.send(message.content, gameEmbed).then(sentMessage => {
      messages[sentMessage.id] = {players: new Set()};
      message.delete();
    });
  }
});

client.on('messageReactionAdd', (reaction, user) => {
  const message = messages[reaction.message.id];
  message.players.add(user.username);

  const gameEmbed = new Discord.MessageEmbed()
      .setColor('#228B22')
      .setTitle('The Bell')
      .setAuthor('The Bell', 'https://static.wikia.nocookie.net/darksouls/images/a/a3/Parish_bell.jpg/revision/latest?cb=20130131003456')
      .setDescription('The Bell has been rung')
      .addField('Registered Players', [...message.players])
      .setTimestamp()
      .setFooter('Support your local bell people', 'https://i.redd.it/xpeoyxf0wdoz.jpg');

  reaction.message.edit(reaction.message.content, gameEmbed);
});

client.on('messageReactionRemove', (reaction, user) => {
  const message = messages[reaction.message.id];
  message.players.delete(user.username);
  
  const registeredPlayers = message.players.size ? [...message.players] : '----------------------';

  const gameEmbed = new Discord.MessageEmbed()
      .setColor('#228B22')
      .setTitle('The Bell')
      .setAuthor('The Bell', 'https://static.wikia.nocookie.net/darksouls/images/a/a3/Parish_bell.jpg/revision/latest?cb=20130131003456')
      .setDescription('The Bell has been rung')
      .addField('Registered Players', registeredPlayers)
      .setTimestamp()
      .setFooter('Support your local bell people', 'https://i.redd.it/xpeoyxf0wdoz.jpg');
  
  reaction.message.edit(reaction.message.content, gameEmbed);
});