const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const logger = require('../logger.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('listusers')
		.setDescription('debug')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles | PermissionFlagsBits.ManageChannels),
	async execute(interaction) {
		await interaction.reply('listed');
		interaction.guild.members.fetch().then(members => {
			members.map(member => {
				logger.debug(`${member.nickname || member.user.username} - ${member.user.username}#${member.user.discriminator}: ${member.user.id}`);
			});
		}).catch(console.error);
	},
};

