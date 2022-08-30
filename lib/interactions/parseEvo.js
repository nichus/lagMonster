exports.parseEvo = parseEvo;

function parseEvo(message) {
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
