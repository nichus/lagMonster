const { SlashCommandBuilder, EmbedBuilder, Collection } = require('discord.js');
const fs	    = require('node:fs');
const logger    = require('../logger.js');

const dataFile  = './data/gamepicker.json';
const gamesList = loadGamesCollection();

const emojiUpvote   = '⏫';
const emojiDownvote = '⏬';

function union(setA, setB) {
	const _union = new Set(setA);
	for (const elem of setB) {
		_union.add(elem);
	}
	return _union;
}

function loadGamesCollection() {
	if (fs.existsSync(dataFile)) {
		const string = fs.readFileSync(dataFile, 'utf8');
		return new Collection(JSON.parse(string));
	} else {
		logger.info(`${dataFile} doesn't exist`);
		return new Collection();
	}
}
function saveGamesCollection() {
	logger.info('Attempting to save');
	if (gamesList.length > 30) {
		logger.error('SaveGameCollection called. GamesList longer than 30, not saving the list');
		return;
	}

	fs.writeFile(
		dataFile,
		JSON.stringify(Array.from(gamesList)),
		function(err) { if (err) { logger.error(err) } },
	);
}
function gameWeight(game) {
	let weight = game['weight'] + game['votes'];
	if (weight < 0) {
		weight = 0;
	}
	return weight;
}
async function doVote(interaction) {
	interaction.reply({ 'content': 'Starting vote', 'ephemeral': true });
	let delay = interaction.options.getInteger('seconds');
	if (delay < 30)  { delay = 30 }
	if (delay > 300) { delay = 300 }

	const filter = (reaction, user) => {
		return !user.bot && [ emojiUpvote, emojiDownvote ].includes(reaction.emoji.name);
	};

	const voteStart = await interaction.channel.send(`Voting started, voting will end in ${delay} seconds`);

	const tally = new Collection;
	gamesList.map(async (v, k) => {
		const option = await interaction.channel.send(`Game: *${k}*`);
		option.react(emojiUpvote).then(() => option.react(emojiDownvote));
		tally.set(k, option);
		const collector = option.createReactionCollector({ filter, time: delay * 1000, dispose: true });

		const downVoters  = new Set();
		const upVoters    = new Set();

		collector.on('collect', (reaction, user) => {
			logger.info(`Collected ${reaction.emoji.name} from ${user.tag}`);
			if (reaction.emoji.name === emojiUpvote) {
				upVoters.add(user);
			} else {
				downVoters.add(user);
			}
		});
		collector.on('remove', (reaction, user) => {
			logger.info(`Removed ${reaction.emoji.name} from ${user.tag}`);
			if (reaction.emoji.name === emojiUpvote) {
				upVoters.delete(user);
			} else {
				downVoters.delete(user);
			}
		});
		collector.on('end', collected => {
			const change = upVoters.size - downVoters.size;
			const reactions = upVoters.size + downVoters.size;
			const voters = union(upVoters, downVoters);

			console.info(`Collected ${collected.size} items`);
			option.edit(`Game: *${k}* received ${reactions} votes for a change of **${change}**. Voters: ${Array.from(voters.values()).sort().join(', ')}.`);
			option.reactions.removeAll()
				.catch(error => logger.error('Failed to clear reactions:', error));

			gamesList.get(k)['votes'] = change;
		});
	});

	const voteCollector = voteStart.createReactionCollector({ filter, time: (delay + 1) * 1000 });

	voteCollector.on('end', collected => {
		logger.debug(collected.size);
		interaction.channel.send('Voting Completed. Use `draw` when ready, and `list` to preview weights.');
		saveGamesCollection();
	});

}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gamepicker')
		.setDescription('Let me pick your games')
		.addSubcommand((subcommand) =>
			subcommand.setName('add')
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
		if (interaction.options.getSubcommand() === 'add') {
			const title = interaction.options.getString('title');
			gamesList.set(title, { 'votes': 0, 'weight': 1 });
			saveGamesCollection();
			interaction.deferReply();
			interaction.deleteReply();
			interaction.channel.send('Current game list: ' + Array.from(gamesList.keys()).sort().join(', '));
		}
		if (interaction.options.getSubcommand() === 'remove') {
			const title = interaction.options.getString('title');
			gamesList.delete(title);
			saveGamesCollection();
			interaction.deferReply();
			interaction.deleteReply();
			interaction.channel.send('Current game list: ' + Array.from(gamesList.keys()).sort().join(', '));
		}
		if (interaction.options.getSubcommand() === 'clear') {
			gamesList.sweep(() => true);
			saveGamesCollection();
			interaction.reply('List cleared');
		}
		if (interaction.options.getSubcommand() === 'vote') {
			doVote(interaction);
		}
		if (interaction.options.getSubcommand() === 'draw') {
			const options = gamesList.map((v, k) => { return Array(gameWeight(v)).fill(k) }).flat();
			const selection = options[Math.floor(Math.random() * options.length)];
			gamesList.map((v, k) => {
				if (k === selection) {
					v['weight'] = 0;
				/* To greatly decrease picking negative votes
				} else if (v['votes'] < 0) {
					v['weight'] = v['weight'] + (1/(-1*v['votes']));
				*/
				} else {
					v['weight']++;
				}
			});
			interaction.reply(`Drawing complete, selected: **${selection}**`);
			saveGamesCollection();
		}

		if (interaction.options.getSubcommand() === 'list') {
			const embed = new EmbedBuilder()
				.setColor('#dcdcdc')
				.setTitle('Gamepicker Database');

			const weight = gamesList.map((v) => {return gameWeight(v)}).reduce((p, c) => p + c, 0);

			gamesList.forEach((details, title) => {
				embed.addFields({
					'name': title,
					'inline': true,
					'value': String(Math.round(((gameWeight(details)) / weight) * 1000) / 10) + '%',
				});
			});

			interaction.reply({ embeds: [embed] });
		}
	},
};

