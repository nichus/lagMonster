exports.parseDebug = parseDebug;

function parseDebug(message) {
  if (message.content.match(/^debug this:/) && message.channel.id == '1011802433825022103') {
    console.log(message);
  }
}
