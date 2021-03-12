const express = require('express');
const discord = require('./DiscordBot/commands');

const getRoutes = (client, messages) => {
  
  const router = express.Router();
  router.route('/ringBell')
    .post((req, res) => {
      const { message, game, ringer, slots, img } = req.body;
      discord.ringBell(client, messages, message, game, ringer, slots, img);
      res.send('SUCCESS');
    });
  return router;
}

module.exports={getRoutes};