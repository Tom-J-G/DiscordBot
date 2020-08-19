const Discord = require('discord.js');

const fs = require('fs');
const commands = fs.readFileSync('commands/help.txt', 'utf8');

const embedMessage = (title, desc) => {
  return new Discord.MessageEmbed()
          .setColor([135,206,235])
          .setTitle(title)
          .setDescription(desc)
}

module.exports = {
        name: 'help',
        commands(msg) {
            let embed = new Discord.MessageEmbed()
                    .setColor([135,206,235])
                    .setTitle('7dsBot Help')
                    .addField('Commands:', commands)

            msg.channel.send(embed);
        },
        outsideChannel(client, msg, command) {
            switch(command) {
                case 'help':
                  if(!client.channels.cache.find(x => x.name === 'bot-channel')) {
                    let channelEmbed = embedMessage('Bot Channel', 'To use the bot please create bot-channel or use !addchannel')
                    
                    msg.channel.send(channelEmbed);
                  } 
                  if(!msg.guild.roles.cache.find(x => x.name === '7ds')) {
                    let roleEmbed = embedMessage('New Role', 'Please type !createrole to add the 7ds role');
                    
                    msg.channel.send(roleEmbed);
                  };
                  if(client.channels.cache.find(x => x.name === 'bot-channel') && msg.guild.roles.cache.find(x => x.name === '7ds')){
                    let successEmbed = embedMessage('7ds Bot', 'Please go to #bot-channel to use the bot and type !help to get a list of commands')
                    
                    msg.channel.send(successEmbed);
                  }
                break;
                case 'addchannel':
                  if(client.channels.cache.find(x => x.name === 'bot-channel')) {
                    msg.reply('Channel already exists');
                  } else {
                    if(!client.channels.cache.find(x => x.name === '7ds' && x.type === 'category')) 
                      msg.guild.channels.create('7ds', {type: 'category'});
                    
                    msg.guild.channels.create('bot-channel', { type: 'text', topic: 'This is the channel for 7dsBot' }).then(
                      channel => {
                        let cat = client.channels.cache.find(x => x.name === '7ds' && x.type === 'category');
                        if (!cat) throw new Error("Category channel does not exist");
                        channel.setParent(cat.id);
                      }
                    ).catch(console.error);
                  }
                  break;
                case 'createrole':
                  if(msg.guild.roles.cache.find(x => x.name === '@7ds')){
                    let successEmbed = new Discord.MessageEmbed()
                              .setColor([135,206,235])
                              .setTitle('Role')
                              .setDescription('The Role has already been created')
                    
                    msg.channel.send('The role has already been created');
                  } else {
                    msg.guild.roles.create({data: {
                      name: '7ds',
                      color: '#7A2F8F'
                    }, reason: 'Role for the 7ds Bot'})
                    msg.channel.send('Role Created')
                  }
                  break;
              }
        }

}