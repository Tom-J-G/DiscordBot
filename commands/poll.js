const { MessageEmbed } = require('discord.js');

const reactDigit = [
    "1️⃣",
    "2️⃣",
    "3️⃣",
    "4️⃣",
    "5️⃣",
    "6️⃣",
    "7️⃣",
    "8️⃣",
    "9️⃣",
];

const buildEmbed = (msg, question, choices) => {
    return new MessageEmbed()
            .setDescription(`🗒 Poll from ${msg.author.username}`)
            .setColor('#00AE86')
            .addField(`**${question}**`, buildChoices(choices))

};

const buildChoices = (choices) => {
    let choicesString = '';
    if(choices && choices.length > 0) {
        choices.filter((c) => c.length > 0)
      .forEach((choice, i) => {
        choicesString += `${reactDigit[i]} ${choice}\n`
      })
    } else {
        choicesString += `👍 👎`
    }

    return choicesString
};

const helpEmbed = () => {
    return new MessageEmbed()
        .setTitle('Poll Help')
        .setColor('#00AE86')
        .setDescription('To use poll type !poll or \n !pollmulti with upto 9 choices : example !pollmulti ;question ; choice1 ; choice2 ; choice 3')
}

const react = async (poll, args) => {
    if(args.length === 0) {
        poll.react('👍');
        poll.react('👎');
    } else {
        args = args.filter(arg => arg.length > 0);
        console.log(args);
        args.forEach((x,i) => {
            poll.react(reactDigit[i])
        })
    }
}

const reactionList = async (poll, question, args, msg) => {
    let reactfilter = [];
    if(args.length === 0) {
        reactfilter = ['👍', '👎']
    } else {
        args.forEach((x, i) => {
            reactfilter.push(reactDigit[i])
        })
    }

    const filter = (reaction, user) => {
        return reactfilter.includes(reaction.emoji.name) && user.id !== '733321444280238090';
    }

    const results = poll.createReactionCollector(filter, { time: 40000 });

    let resultText = `Here are the results: \n `;
    results.on('collect', (reaction, user) => {
        console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
    });

    results.on('end', c => {
        console.log('yes ended');
        c.forEach(x => {
            console.log(x._emoji.name);
            console.log(x.count);
            resultText += `${x._emoji.name} got ${x.count - 1} votes \n \n `;
        })
        
    });

    setTimeout( () => 
        poll.channel.send(resultEmbed(question, resultText)), 40500);
}

const resultEmbed = (question, result) => {
    return new MessageEmbed()
            .setTitle(`Results for ${question}:`)
            .setColor('#00AE86')
            .setDescription(result)
}

module.exports = {
    name: 'poll',
    description: '',
    multiPoll(msg, body) {
        const args = body.trim().split(';');
        args.shift();
        const question = args[0];

        args.shift();

        if (question === 'help') return msg.channel.send(helpEmbed());

        if (args.length > 9 ) return msg.channel.send('Too many choices please try again');
        if (args.length === 0) return msg.channel.send('please use !poll if no choices available');

        msg.channel.send(buildEmbed(msg, question, args)).then(poll => {
            react(poll, args);
            msg.delete({ timeout: 500 });
            reactionList(poll, question, args, msg);
        }).catch((err) => console.log(err));
    },
    singlePoll(msg, body) {
        const args = body.trim().split(';');
        args.shift();
        
        const question = args[0];

        args.shift();

        if (question === 'help') return msg.channel.send(helpEmbed());

        if (args.length > 0 || question === undefined) {
            msg.channel.send('Please Try again try useing ; after !poll');
        } else {
            console.log('no')
            msg.channel.send(buildEmbed(msg, question, args)).then(poll => {
                react(poll, args);
                msg.delete({ timeout: 500 });
                reactionList(poll, question, args, msg);
            }).catch((err) => console.log(err));
        }
    }
}