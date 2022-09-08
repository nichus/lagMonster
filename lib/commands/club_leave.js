const { SlashCommandBuilder } = require('discord.js');
const logger = require('../logger.js');
const clubs = require('./clubs/clubs.js');

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
		if (clubs.exists(clubName)) {
			if (clubs.removeUser(clubName, interaction.user)) {
				logger.info(`Removed ${interaction.user} from ${clubName}`);
				interaction.reply(`You have left ${clubName}.`);
			} else {
				interaction.reply(`Unable to leave ${clubName}.`);
			}
		} else {
			interaction.reply(`**${clubName}** does not exist, unable to leave. Check your spelling and try again.`);
		}
	},
};

