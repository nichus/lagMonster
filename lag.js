// do requires
//
const fs = require('node:fs');
const path = require('node:path');
const logger = require('./lib/logger.js');

const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const { parseEvo } =  require('./lib/interactions/parseEvo.js');
const { parseDebug } = require('./lib/interactions/parseDebug.js');
const { interact }   = require('./lib/interactions/interact.js');
const { NumberWang } = require('./lib/interactions/numberWang.js');
const { PlusPlus }   = require('./lib/interactions/plusPlus.js');

const lagIntents = [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMembers,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent,
];

// Create a new client instance
const client = new Client({ intents: lagIntents });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
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

// When the client is ready, run this code (only once)
client.once('ready', () => logger.info('Ready!'));

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

	plusPlus.parseMessage(message);
	parseEvo(message);
	parseDebug(message);
	numberWang.check(message);
	interact(message);

	if (message.content.match(/pukes?|10.?35|vomits?/)) {
		message.reply('pukes');
	} else if (message.content.match(/masturbation|jerk.?off|jack.?off|masturbate|Louis CK|Louis C\.K\.|Louis Székely|rub one out|jacked off|beat.?off|masturbating|jerking off|ejaculate|fap|fapping|fappers|Lewis CK|Lewis C\.K\./)) {
		const options = ['Do you guys mind if I masturbate furiously?', 'Want to be my JO bud? Straight guys only, no gay stuff.'];
		message.reply(options[Math.floor(Math.random() * options.length)]);
	} else if (message.content.match(/\b\$500\b/)) {
		message.reply('ball');
	} else if (message.content.match(/dps/i)) {
		message.react(message.guild.emojis.cache.get('370957798600605697'));
	} else if (message.content.match(/appositive phrase|apposition/)) {
		message.reply('You wanna start that Oxford Comma shit again?');
	}
});

// Login to Discord with your client's token
client.login(token);
