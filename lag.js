// do requires
//
const     fs = require('node:fs');
const   path = require('node:path');
const logger = require('./lib/logger.js');

const { Client, Collection, GatewayIntentBits, Partials, ActivityType } = require('discord.js');

const {      token } = require('./config.json');
const {   parseEvo } = require('./lib/interactions/parseEvo.js');
const { parseDebug } = require('./lib/interactions/parseDebug.js');
const {   interact } = require('./lib/interactions/interact.js');
const { NumberWang } = require('./lib/interactions/numberWang.js');
const {   PlusPlus } = require('./lib/interactions/plusPlus.js');

const lagIntents = [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMembers,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent,
	GatewayIntentBits.GuildMessageReactions,
];
const lagPartials = [
	Partials.Message,
	Partials.Channel,
	Partials.Reaction,
];

// Create a new client instance
const client = new Client({ intents: lagIntents, partials: lagPartials });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'lib/commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
const numberWang = new NumberWang();
const plusPlus   = new PlusPlus(path.resolve('./data/plusPlus.json'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection
	// With the key as the command name and the value as it's exported module
	client.commands.set(command.data.name, command);
}

// type: watching
// name: ping latency graphs

// When the client is ready, run this code (only once)
client.once('ready', () => {
	client.user.setActivity('ping graphs', { 'type': ActivityType.Watching });
	logger.info('Ready!');
});

/*
 * Some common users:
 * jettero: 84756276248051712
 * orien: 84648915403542528
 */

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		logger.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});
client.on('messageCreate', (message) => {
	/*
	logger.info("message received");
	logger.info(message);
	logger.info('--');
	*/
	if (message.author.bot) {
		return;
	}

	/*
	const UserMention = /<@!?(\d+)>/;
	if (UserMention.test(message.content)) {
		const userId = message.content.match(UserMention)[1];
		logger.info(`mentioned user ${userId}`);

		let user = client.users.fetch(userId);
		let user2 = client.users.resolve(userId);
		console.log(user2);
		user.then((u) => {
			console.log(u);
		});
	}
	*/

	plusPlus.parseMessage(message);
	parseEvo(message);
	parseDebug(message);
	numberWang.check(message);
	interact(message);

	let message_content = message.content;
	// Strip out mentions from our comparison
	// Channel mention
	message_content = message_content.replace(/<#\d+>/g, '');
	// Role mention
	message_content = message_content.replace(/<@&\d+>/g, '');
	// User mention
	message_content = message_content.replace(/<@!?\d+>/g, '');

	if (message_content.match(/pukes?|10.?35|vomits?/)) {
		message.reply('pukes');
	} else if (message.content.match(/masturbation|jerk.?off|jack.?off|masturbate|Louis CK|Louis C\.K\.|Louis Székely|rub one out|jacked off|beat.?off|masturbating|jerking off|ejaculate|fap|fapping|fappers|Lewis CK|Lewis C\.K\./)) {
		const options = ['Do you guys mind if I masturbate furiously?', 'Want to be my JO bud? Straight guys only, no gay stuff.'];
		message.reply(options[Math.floor(Math.random() * options.length)]);
	} else if (message_content.match(/\b\$500\b/)) {
		message.reply('ball');
	} else if (message_content.match(/dps/i)) {
		message.react(message.guild.emojis.cache.get('370957798600605697'));
	} else if (message_content.match(/appositive phrase|apposition/)) {
		message.reply('You wanna start that Oxford Comma shit again?');
	}
});

client.on('messageReactionAdd', async (reaction, user) => {
	if (user.bot) { return }

	// Check if the reaction structure is a partial
	if (reaction.partial) {
		try {
			await reaction.fetch();
		} catch (error) {
			logger.error('Something went wrong when fetching the message:', error);
			return;
		}
	}
	// logger.info(reaction.emoji.name);
	// console.log(reaction.interaction.user);
	if (reaction.emoji.name === '👍' || reaction.emoji.name === 'plus'  || reaction.emoji.name === '👎') {
		// logger.info(`${reaction.message.author}'s message "${reaction.message.content}" gained a reaction!`);
		// logger.info(`${reaction.count} user(s) have given the same reaction to this message!`);
		plusPlus.parseAddEmoji(reaction, user);
	}
});
client.on('messageReactionRemove', async (reaction, user) => {
	if (user.bot) { return }

	// Check if the reaction structure is a partial
	if (reaction.partial) {
		try {
			await reaction.fetch();
		} catch (error) {
			logger.error('Something went wrong when fetching the message:', error);
			return;
		}
	}
	// if (reaction.emoji.name === '👍' || reaction.emoji.name === '👎') {
	if (reaction.emoji.name === '👍' || reaction.emoji.name === 'plus' || reaction.emoji.name === '👎') {
		// logger.info(`${reaction.message.author}'s message "${reaction.message.content}" lost a reaction!`);
		// logger.info(`${reaction.count} user(s) have given the same reaction to this message!`);
		plusPlus.parseRemoveEmoji(reaction, user);
	}
});

// Login to Discord with your client's token
client.login(token);
