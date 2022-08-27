const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
        .setName('listusers')
        .setDescription('debug'),
  async execute(interaction) {
    await interaction.reply("listed");
    interaction.guild.members.fetch().then(members => {
      members.map(member => {
        console.log(`${member.nickname||member.user.username} - ${member.user.username}#${member.user.discriminator}: ${member.user.id}`)
      });
    }).catch(console.error);
  },
};

