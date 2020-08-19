// Twitter stream 
const params = {
    screen_name: '7DS_en',
    count: 1,
    tweet_mode: 'extended'
}

module.exports = {
    name: 'twitter',
    getTweet: (T, msg) => {
        T.get('statuses/user_timeline', params, (error, tweets) => {
            console.log(tweets);
            const tweet = tweets[0];
            const twitterMessage = `${tweet.user.name} (@${tweet.user.screen_name}) tweeted this: https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`
            msg.channel.send(twitterMessage);
          });
    }
}