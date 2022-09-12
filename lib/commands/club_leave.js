const { SlashCommandBuilder } = require('discord.js');
const logger = require('../logger.js');
const Clubs = require('./clubs/clubs.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leave')
		.setDescription('Leave a club to remove access from a self-service channel(s).')
		.addStringOption(option =>
			option.setName('club')
				.setDescription('Name of the club you wish to leave')
				.setRequired(true)),
	async execute(interaction) {
		const clubName = interaction.options.getString('club');
		const clubs    = new Clubs();
		const response = { 'content': '', 'ephemeral': true };

		if (clubs.exists(clubName)) {
			const role = interaction.guild.roles.cache.find(r => { return r.name === clubName });
			if (!role) {
				response.content = `The role for club '${clubName}' doesn't exist, check with a mod`;
				interaction.reply(response);
			} else if (clubs.removeUser(clubName, role, interaction.member)) {
				logger.info(`Removed ${interaction.member.displayName} from ${clubName}`);
				response.content = `Your have left ${clubName}.`;
				interaction.reply(response);
			} else {
				response.content = `Unable to leave ${clubName}.`;
				interaction.reply(response);
			}
		} else {
			response.content = `**${clubName}** does not exist, unable to leave. Check your spelling and try again.`;
			interaction.reply(response);
		}
	},
};

