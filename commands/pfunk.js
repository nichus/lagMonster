const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
        .setName('pfunk')
        .setDescription('wonder what he does...'),
  async execute(interaction) {
    interaction.deferReply();
    interaction.deleteReply();
    interaction.channel.send(`pfunk can't operation channels :rofl:`);
  },
};
