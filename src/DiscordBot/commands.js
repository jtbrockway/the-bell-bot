const Discord = require('discord.js');

const ringBell = (client, messages, message, game, host, slots, img) => {
  const channel = client.channels.resolve([...client.channels.cache.filter(channel => channel.name === 'general')][0][0]);

  const registeredPlayers = [host];
  slots--;
  while(slots > 0) {
    registeredPlayers.push('---------');
    slots--;
  }

  const gameEmbed = new Discord.MessageEmbed()
      .setColor('#228B22')
      .setTitle(game)
      .setAuthor('The Bell', 'https://static.wikia.nocookie.net/darksouls/images/a/a3/Parish_bell.jpg/revision/latest?cb=20130131003456')
      .setDescription(`${host} has rung the bell`)
      .setImage(img)
      .addField('Registered Players', registeredPlayers)
      .setTimestamp()
      .setFooter('Support your local bell people', 'https://i.redd.it/xpeoyxf0wdoz.jpg');

  channel.send(message, gameEmbed).then(sentMessage => {
    messages.add(sentMessage.id);
  });

};

const reactionEdit = (reaction, user, type, messages) => {
  if(!messages.has(reaction.message.id)) {
    return;
  }
  const embed = reaction.message.embeds[0];
  const field = embed.fields[0].value.split("\n");
  
  if(type === 'add') {
    const replaceIndex = field.indexOf('---------');
    if(replaceIndex !== -1) {
      field[replaceIndex] = user.username;
    } 
  } else {
    const replaceIndex = field.indexOf(user.username);
    if(replaceIndex !== -1) {
      field[replaceIndex] = '---------'
    }
  }

  embed.fields[0].value = field.join("\n");

  reaction.message.edit(reaction.message.content, embed);
};

module.exports = {ringBell, reactionEdit};
 