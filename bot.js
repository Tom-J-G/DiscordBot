  
//Run dotenv
require('dotenv').config(); 

// Import libraries
const Discord = require('discord.js');
const Twit = require('twit');
const fs = require('fs');

// Discord
const client = new Discord.Client();
client.commands = new Discord.Collection();

// collect files with fs
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

//set up your twitter 
const T = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  timeout_ms: 60*1000,
})

// Event listener when a user connected to the server.
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  if (!client.channels.cache.find(x => x.name === 'bot-channel')) {
    console.log('channel does not exist');
  } else {
    console.log('channel exists')
  }
});

//welcome message
client.on('guildMemberAdd', member => {
  const channel = member.guild.channels.cache.find(channel => channel.name === "welcome");
  if(!channel) return;
  channel.send(`Welcome to the Server ${member}`)
})

const prefix = "!";
// Event listener when a user sends a message in the chat.
client.on('message', msg => {
  if (msg.author.bot) return;
  if (!msg.content.startsWith(prefix)) return;

  const body = msg.content.slice(prefix.length);
  const args = body.split(' ');
  const command = args.shift().toLowerCase();

  if (msg.channel.name.toLowerCase() === 'bot-channel') {
    const filter = (reaction, user) => {
      if (reaction.emoji.name === '👍') msg.reply(`${user.tag} is interested`);
      return true;
    };

    switch(command) {
      case 'red':
        client.commands.get('deathMatch').deathMatch(msg, filter, 'Red');
        break;
      case 'grey':
        client.commands.get('deathMatch').deathMatch(msg, filter, 'Grey');
        break;
      case 'howlex':
        client.commands.get('deathMatch').deathMatch(msg, filter, 'Howlex');
        break;
      case 'latesttweet':
        client.commands.get('twitter').getTweet(T, msg);
        break;
      case 'help':
        client.commands.get('help').commands(msg);
        break;
      case 'roleadd':
        client.commands.get('roles').addRole(msg, args);
        break;
      case 'roleremove':
        client.commands.get('roles').removeRole(msg, args);
        break;
      case 'pollmulti':
        client.commands.get('poll').multiPoll(msg, body);
        break;
      case 'poll':
        client.commands.get('poll').singlePoll(msg, body);
        break;
    }
  }

  if (msg.channel.name.toLowerCase() !== 'bot-channel') client.commands.get('help').outsideChannel(client, msg, command);
  
});

// Initialize bot by connecting to the server
client.login(process.env.TOKEN);
