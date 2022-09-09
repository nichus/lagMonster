const { SlashCommandBuilder } = require('discord.js');
const logger = require('../logger.js');
const Clubs = require('./clubs/clubs.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('club')
		.setDescription('Manage clubs for the self-service channel(s).')
		.addSubcommand(subcommand =>
			subcommand.setName('list')
				.setDescription('List all the clubs, and the channels they grant'),
		)
		.addSubcommand(subcommand =>
			subcommand.setName('add')
				.setDescription('Create a new club for users')
				.addStringOption(option =>
					option.setName('club')
						.setDescription('Name of club')
						.setRequired(true),
				)
				.addStringOption(option =>
					option.setName('description')
						.setDescription('Description of club')
						.setRequired(true),
				)
				.addChannelOption(option =>
					option.setName('channel')
						.setDescription('Channel to grant access to')
						.setRequired(false),
				),
		)
		.addSubcommand(subcommand =>
			subcommand.setName('remove')
				.setDescription('Remove a club')
				.addStringOption(option =>
					option.setName('club')
						.setDescription('Name of club')
						.setRequired(true),
				),
		)
		.addSubcommand(subcommand =>
			subcommand.setName('addchan')
				.setDescription('Add a channel to a club')
				.addStringOption(option =>
					option.setName('club')
						.setDescription('Name of club')
						.setRequired(true),
				)
				.addChannelOption(option =>
					option.setName('channel')
						.setDescription('Channel to add')
						.setRequired(true),
				),
		)
		.addSubcommand(subcommand =>
			subcommand.setName('remchan')
				.setDescription('Remove a channel from a club')
				.addStringOption(option =>
					option.setName('club')
						.setDescription('Name of club')
						.setRequired(true),
				)
				.addChannelOption(option =>
					option.setName('channel')
						.setDescription('Channel to remove')
						.setRequired(true),
				),
		),
	async execute(interaction) {

		console.log('\nfoo');
		const clubs = new Clubs();
		const clubName = interaction.options.getString('club');
		const description = interaction.options.getString('description');
		const command  = interaction.options.getSubcommand();
		const channel  = interaction.options.getChannel('channel');


		console.log('\n');
		console.log('here');
		if (command === 'list') {
			clubs.list(interaction);
		} else if (command === 'add') {
			clubs.addClub(interaction, clubName, description, channel);
		} else if (command === 'remove') {
			clubs.removeClub(interaction, clubName);
		} else if (command === 'addchan') {
			clubs.addChannel(interaction, clubName, channel);
		} else if (command === 'remchan') {
			clubs.removeChannel(interaction, clubName, channel);
		} else {
			logger.error(`Invalid club subcommand '${command}' specified, debug needed...`);
			interaction.reply({ 'content': `You asked me to '${command}', I'm gonna ask you to *${command}* yourself...`, 'ephemeral': true });
		}
		/*
		if (!clubs.has(clubName)) {
			// Add a new club to the clubs object
			// Keeping the next two manual for now...
			// Add a new channel to the channels list
			// Add a new role to the server roles.
			interaction.reply('Currently a no-op, come back later...');
		} else {
			interaction.reply(`**${clubName}** already exists.`);
		}
		*/
	},
};

