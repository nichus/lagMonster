const { SlashCommandBuilder, EmbedBuilder, Collection } = require('discord.js');
const logger = require('../lib/logger.js');

const gamesList = new Collection();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gamepicker')
		.setDescription('Let me pick your games')
		.addSubcommandGroup((group) =>
			group
				.setName('games')
				.setDescription('Manage game selection list')
				.addSubcommand((subcommand) =>
					subcommand
						.setName('add')
						.setDescription('Add a new game to the list')
						.addStringOption(option =>
							option.setName('title')
								.setDescription('Name of the game to consider')
								.setRequired(true),
						),
				)
				.addSubcommand((subcommand) =>
					subcommand.setName('remove')
						.setDescription('Remove a game from the list')
						.addStringOption(option =>
							option.setName('title')
								.setDescription('Name of game to remove')
								.setRequired(true),
						),
				)
				.addSubcommand((subcommand) =>
					subcommand.setName('clear')
						.setDescription('Remove all games from the list'),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand.setName('vote')
				.setDescription('Run a user vote to impact the weights')
				.addIntegerOption(option =>
					option.setName('seconds')
						.setDescription('For how many seconds should the vote run')
						.setRequired(false),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand.setName('draw')
				.setDescription('Based on the current weights/votes, pick the next game'),
		)
		.addSubcommand((subcommand) =>
			subcommand.setName('list')
				.setDescription('Display the current games/weights'),
		),
	async execute(interaction) {
		if (interaction.options.getSubcommandGroup() === 'games' && interaction.options.getSubcommand() === 'add') {
			const title = interaction.options.getString('title');
			gamesList.set(title, { 'votes': {}, 'weight': 1 });
			interaction.reply(`${title} added`);
		}
		if (interaction.options.getSubcommandGroup() === 'games' && interaction.options.getSubcommand() === 'clear') {
			gamesList.sweep(game => true);
			interaction.reply('List cleared');
		}
		if (interaction.options.getSubcommand() === 'vote') {
			interaction.reply({ 'content': 'Starting vote', 'ephemeral': true });
			const delay = interaction.options.getInteger('seconds');
			const voteStart = await interaction.channel.send(`Voting started, voting will end in ${delay} seconds`);

			const tally = new Collection;
			gamesList.map(async (v, k) => {
				const option = await interaction.channel.send(`Game: ${k}`);
				option.react('⏫')
					.then(() => option.react('⏬'));
				tally.set(k, option);
			});

			interaction.channel.awaitMessages({ filter: (m) => m.author.id === interaction.user.id, max: 10000, time: delay*1000, errors: ['time'] })
				.then(collected => console.log(collected.size))
				.catch(collected => {
					console.log('After 2 minutes, only ${collected.size} voted')
					voteStart.edit('Voting ended');
					tally.forEach((v) => {
						console.log(v);
						// TODO
						//logger.info(`upvotes: ${v.reactions['⏫'].cache.count-1}`);
						//logger.info(`downvotes: ${v.reactions['⏬'].cache.count-1}`);
						//v.delete()
					});
				});

			//interaction
			// do a thing
		}
		if (interaction.options.getSubcommand() === 'draw') {
			const options = gamesList.map((v, k, m) => { return Array(v['weight']).fill(k) }).flat();
			const selection = options[Math.floor(Math.random() * options.length)];
			// gamesList[selection]['weight'] = 0;
			gamesList.map((v, k, m) => {
				if (k === selection) {
					v['weight'] = 0;
				} else {
					v['weight']++;
				}
			});

			/*
			const weight = gamesList.map((v, k, m) => {return v['weight']}).reduce((p, c) => p + c, 0);

			gamesList.forEach((details,title,m) => {
				embed.addFields({ 'name': title, 'value': String(Math.round((details['weight']/weight)*1000)/10)+'%' });
			});
			*/
			interaction.reply(`Drawing complete, selected: ${selection}`);
		}

		if (interaction.options.getSubcommand() === 'list') {
			const embed = new EmbedBuilder()
				.setColor('#ff0000')
				.setTitle('foo')
				.setDescription('Games List');

			const weight = gamesList.map((v, k, m) => {return v['weight']}).reduce((p, c) => p + c, 0);

			gamesList.forEach((details,title,m) => {
				embed.addFields({ 'name': title, 'value': String(Math.round((details['weight']/weight)*1000)/10)+'%' });
			});

			interaction.reply({ embeds: [embed] });
		}
		/*
		console.log('foo');
		console.log(interaction);
		console.log(interaction.options);
		console.log(interaction.options.getSubcommandGroup());
		console.log(interaction.options.getSubcommand());
		console.log(gamesList);
		*/
	},
};

