const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const logger = require('../logger.js');
const Clubs = require('./clubs/clubs.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('announce')
		.setDescription('Update the channel announcement in #announcements')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles | PermissionFlagsBits.ManageChannels),
	async execute(interaction) {
		const clubs = new Clubs();
		interaction.reply({ 'content': 'Sending updated announcement...', 'ephemeral': true });
		const spam          = interaction.guild.channels.cache.find(channel => channel.name ===          'spam');
		const announcements = interaction.guild.channels.cache.find(channel => channel.name === 'announcements');
		if (announcements) {
			const announcement = '**Club list**\n\n' +
				'You can use `/join <clubName>` or `/leave <clubName>` from whatever ' +
				`channel you'd like, or throw it into the ${spam} channel, if you wanna keep ` +
				'the chat rooms tidy.' +
				'\n\n' +
				/*
				':memo: indicates clubs that provide access to channels\n' +
				':bell: indicates provide a method for pinging a group of users\n\n' +
				*/
				clubs.announce();
			// announcements.send({ 'content': 'Test announcement' });
			announcements.send({ 'content': announcement });
		} else {
			logger.error('no announcements channel');
		}
	},
};

