
module.exports = {
    name:'deathMatch',
    deathMatch(msg, filter, demon){
            msg.react('👍');

            msg.channel.send(`@here ${msg.author.username} has a ${demon} Demon available`).catch((err) => console.log(err));

            let collector = msg.createReactionCollector((reaction, user) => (user.id !== msg.author.id || user.id !== '733321444280238090')  && reaction.emoji.name == '👍', { time: 300000 });
            collector.on('collect', (reaction, user) => {
                if (!user.bot && user.id !== msg.author.id) {
                    msg.reply(`${user.username} is interested`);
                }
            });

            collector.on('end', collected => {
                msg.channel.send(`${demon} Demon from ${msg.author.username} is likely been done`)
            })
    },
}