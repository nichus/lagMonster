const { SlashCommandBuilder } = require('discord.js');
const logger = require('../logger.js');
const Clubs = require('./clubs/clubs.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('join')
		.setDescription('Join a club to get access to a self-service channel(s).')
		.addStringOption(option =>
			option.setName('club')
				.setDescription('Name of the club you wish to join')
				.setRequired(true)),
	async execute(interaction) {
		const clubs    = new Clubs();
		const clubName = interaction.options.getString('club');

		if (clubs.exists(clubName)) {
			if (clubs.addUser(clubName, interaction.user)) {
				logger.info(`Added ${interaction.user} to ${clubName}`);
				interaction.reply(`You have joined ${clubName}.`);
			} else {
				interaction.reply(`Unable to join ${clubName}.`);
			}
		} else {
			interaction.reply(`**${clubName}** does not exist, unable to join. Check your spelling and try again.`);
		}
	},
};

