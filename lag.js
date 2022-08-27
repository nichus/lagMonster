// do requires
//
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const { plusplus } = require('./data/plusPlus.json');

const lagIntents = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent
];

// Create a new client instance
const client = new Client({ intents: lagIntents });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
var numberWang = Math.floor(Math.random()*100);
// console.log(numberWang);

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  //Set a new item in the Collection
  //With the key as the command name and the value as it's exported module
  client.commands.set(command.data.name, command);
}

// When the client is ready, run this code (only once)
client.once('ready', () => {
  console.log('Ready!');
});

/*
 * Some common users:
 * jettero: 84756276248051712
 * orien: 84648915403542528
 */

function doEVO(message) {
  if (message.content.match(/evo/i)) {
    if (message.content.match(/evo view/)) {
      message.reply('https://photos.app.goo.gl/6IghYMzxY0yfUchu2');
    } else if (message.content.match(/evo treyla/)) {
      message.reply('http://voltar.org/evo/evo_treyla.jpg');
    } else if (message.content.match(/evo shandor|EVOshandor/)) {
      message.reply('http://voltar.org/evo/evo_shandor.jpg');
    } else if (message.content.match(/evo ripper/)) {
      message.reply('http://voltar.org/evo/evo_ripper.jpg');
    } else if (message.content.match(/evo pfunk/)) {
      message.reply('http://voltar.org/evo/evo_pfunk.jpg');
    } else if (message.content.match(/evo nichus|evo orien/)) {
      message.reply('http://voltar.org/evo/evo_nichus.jpg');
    } else if (message.content.match(/evo nadya|evo fred/)) {
      message.reply('http://voltar.org/evo/evo_nadya.jpg');
    } else if (message.content.match(/evo mirmillo/)) {
      message.reply('http://voltar.org/evo/evo_mirmillo.jpg');
    } else if (message.content.match(/evo mae/)) {
      message.reply('http://voltar.org/evo/evo_mae.jpg');
    } else if (message.content.match(/evo dorn|evo jettero/)) {
      message.reply('http://voltar.org/evo/evo_dorn.jpg');
    } else if (message.content.match(/evo bojo/)) {
      message.reply('http://voltar.org/evo/evo_bojo.jpg');
    } else if (message.content.match(/evo/)) {
      options = ["http://voltar.org/evo/evo_bojo.jpg","http://voltar.org/evo/evo_dorn.jpg","http://voltar.org/evo/evo_mae.jpg","http://voltar.org/evo/evo_mirmillo.jpg","http://voltar.org/evo/evo_nadya.jpg","http://voltar.org/evo/evo_nichus.jpg","http://voltar.org/evo/evo_pfunk.jpg","http://voltar.org/evo/evo_ripper.jpg","http://voltar.org/evo/evo_shandor.jpg","http://voltar.org/evo/evo_shandor_irl.jpg","http://voltar.org/evo/evo_treyla.jpg","http://voltar.org/evo/hug-saulted-with-evo-shandor-on-a-trampoline.jpg","https://photos.app.goo.gl/6IghYMzxY0yfUchu2","https://photos.app.goo.gl/3EUPbUNjV78ePNDX7"];
      message.reply(options[Math.floor(Math.random()*options.length)]);
    }
  }
}
function doPlusPlus(message) {
  const plusTargetRegex = /<@(\d+)>\s*\+\+/;
  const emotes = [ '( o.o)','Lovely','Charming','Adorable','Sweet','Delicious','Cute','Delightful','uwu','kawaii'];

  if (plusTargetRegex.test(message.content)) {

    // Get the plusplus target from the message
    const plusTarget = message.content.match(plusTargetRegex)[1];

    if (message.author.id == plusTarget) {
      // Someone's being cheaty!
      message.reply(`Cheater detected! Don't plus-plus yourself ${message.author}!`);
    } else {
      if (plusTarget in plusplus) {
        // increment their score
        plusplus[plusTarget]['score']++;
      } else {
        // for newbies, set their score to 1
        plusplus[plusTarget] = { 'score': 1 };
      }

      // reply with the plus-plusified score
      message.reply(`${emotes[Math.floor(Math.random()*emotes.length)]}. <@${plusTarget}> has earned ${plusplus[plusTarget]['score']} points!`);

      // write out the updated plus-plus stats
      fs.writeFile('./data/plusPlus.json', JSON.stringify({"plusplus": plusplus}), function(err) { if (err) {console.log(err)} });
    }
  }
}
function doDebug(message) {
  if (message.content.match(/^debug this:/) && message.channel.id == '1011802433825022103') {
    console.log(message);
  }
}
function doNumberWang(message) {
  // If the message received is just an embedded image/video, don't trigger
  // numberWang since noone can see the embedded url
  if(message.embeds[0] && message.embeds[0].data.url === message.content) {
    return;
  }

  const nWregex = new RegExp(`(?!<[#@])[^<]+${numberWang}[^>]+(?!>)`);

  // console.log(message);
  // console.log(message.embeds[0]);
  if (nWregex.test(message.content)) {
    message.reply(`${numberWang}? That\'s Numberwang!\nhttps://www.youtube.com/watch?v=0obMRztklqU`);
    numberWang = Math.floor(Math.random()*100);
  }
}

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});
client.on('messageCreate', (message) => {
  /*
  console.log("message received");
  console.log(message);
  console.log('--');
  */
  if (message.author.bot) {
    return;
  }

  doPlusPlus(message);
  doEVO(message);
  doDebug(message);
  doNumberWang(message);

  if (message.content.match(/(ask jake|ask ripper|Baby Yoda|eat shit|I have spoken|I just buy what he says|I just buy what jake says|I just buy what ripper says|jake knows|jake probably knows|jake would know|like jake said|like ripper said|Mando|Nick Nolte|ripper knows|ripper probably knows|ripper would know|what jake said|what jake says|what ripper said|what ripper says)/)) {
    message.reply("https://photos.app.goo.gl/SbVV9Mex7bKxFJ8U6");
  } else if (message.content.match(/(bad shandor|shandork|shandor is wrong|shandor you are wrong|you are wrong shandor|#neverforget|12\/13|shandor is a troll|9-11|9\/11|nine eleven|never forget|12-13|12\/13\/2019|9 11|dum dum|learn the rules|totally forgot|always forget)/)) {
    message.reply('NEVER FORGET \n https://photos.app.goo.gl/3EUPbUNjV78ePNDX7/');
  } else if (message.content.match(/fool/i)) {
    message.reply('you fool. you absolute buffoon. you think you can challenge me in my own realm? you think you can rebel against my authority? you dare come into my house and upturn my dining chairs and spill coffee grounds in my Keurig? you thought you were safe in your chain mail armor behind that screen of yours. I will take these laminate wood floor boards and destroy you. I didn’t want war. but i didn’t start it.');
  } else if (message.content.match(/almost died/)) {
    message.reply('https://memegenerator.net/img/instances/500x/43239386/i-almost-died.jpg');
  } else if (message.content.match(/pukes?|10.?35|vomits?/)) {
    message.reply('pukes');
  } else if (message.content.match(/masturbation|jerk.?off|jack.?off|masturbate|Louis CK|Louis C\.K\.|Louis Székely|rub one out|jacked off|beat.?off|masturbating|jerking off|ejaculate|fap|fapping|fappers|Lewis CK|Lewis C\.K\./)) {
    options = ['Do you guys mind if I masturbate furiously?','Want to be my JO bud? Straight guys only, no gay stuff.'];
    message.reply(options[Math.floor(Math.random()*options.length)]);
  } else if (message.content.match(/bsod|blue screen of death|blue screen|bsod'd|epic fail/)) {
    message.reply('https://goo.gl/photos/p4EEMUqKhEAHEXWk8');
  } else if (message.content.match(/EA|Electronic Arts|Origin|E\.A\./)) {
    options = ["Fuck EA!" ,"EA Sucks!" ,"EA can eat a dick :eggplant:" ,"https://goo.gl/photos/5SU5Ks1nPak2KBQMA" ,"https://goo.gl/photos/qwtQR1H6jM4588GC6" ,"https://goo.gl/photos/F2FrSgDwoRaw4EuN6" ,"https://goo.gl/photos/eVuSdaRLZZWmmw988" ,"https://goo.gl/photos/Gt2J7SMwuGKeu6tZ6" ,"https://goo.gl/photos/Q4KpavZEJQoCg2Fg8" ,"https://goo.gl/photos/Q4KpavZEJQoCg2Fg8" ,"https://goo.gl/photos/rmGbacku2i6NAGT66" ,"https://goo.gl/photos/GSAcndHMS18T8ntm7" ,"https://photos.app.goo.gl/L0S5UvmYPgmBs9Pw2" ,"https://photos.app.goo.gl/uH56U2W9y3BESLbB2" ,"https://photos.app.goo.gl/CamUhxhbNXQ8g0Po1" ,"https://photos.app.goo.gl/51gxcPWkrXUUoJfq1" ,"https://photos.app.goo.gl/Jj9xlu3Z3iMO4wx12" ,"https://photos.app.goo.gl/g3cxFPL5gFjvh4DFA" ];
    message.reply(options[Math.floor(Math.random()*options.length)]);
  } else if (message.content.match(/\$500/)) {
    message.reply('ball');
  } else if (message.content.match(/bakhara nda/)) {
    message.reply('YOU MUST AGREE TO IT!! https://bakhara.org/nda');
  } else if (message.content.match(/dave point security/)) {
    message.reply('<@84756276248051712> has a mug of that https://goo.gl/photos/qe8RZUnXhjL5aV3m9');
  } else if (message.content.match(/dps/i)) {
    message.react(message.guild.emojis.cache.get('370957798600605697'));
  } else if (message.content.match(/appositive phrase|apposition/)) {
    message.reply('You wanna start that Oxford Comma shit again?');
  }
});

// Login to Discord with your client's token
client.login(token);
