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
		const clubName = interaction.options.getString('club');
		const clubs    = new Clubs();
		const response = { 'content': '', 'ephemeral': true };

		if (clubs.exists(clubName)) {
			// We probably have to deal with some promises here since the data structures
			// might not be fully filled out
			const role = interaction.guild.roles.cache.find(r => { return r.name === clubName });
			if (!role) {
				response.content = `The role for club '${clubName}' doesn't exist, check with a mod`;
				interaction.reply(response);
			} else if (clubs.addUser(clubName, role, interaction.member)) {
				logger.info(`Added ${interaction.user} to ${clubName}`);
				response.content = `You have joined ${clubName}.`;
				interaction.reply(response);
			} else {
				response.content = `Unable to join ${clubName}.`;
				interaction.reply(response);
			}
		} else {
			response.content = `**${clubName}** does not exist, unable to join. Check your spelling and try again.`;
			interaction.reply(response);
		}
	},
};

