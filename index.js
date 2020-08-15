require('dotenv').config()

const userIDToSpam = 1098881188230508544

const Twit = require('twit');
const T = new Twit({
    consumer_key: process.env.APPLICATION_CONSUMER_KEY,
    consumer_secret: process.env.APPLICATION_CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

// start stream and track users
const streamUsers = T.stream('statuses/filter', {
    follow: [1519408933, userIDToSpam] //ID of users you want to check and reply to.. @jessegoeman to test
});

streamUsers.on('tweet', tweet => {
    console.log('---- streamUsers ----', tweet)
    //Only reply to tweets, not replies OR when it's a spamableuser => reply to everything
    if (tweet.user.id == userIDToSpam || (!tweet.in_reply_to_status_id && !tweet.in_reply_to_status_id_str && !tweet.in_reply_to_user_id && !tweet.in_reply_to_user_id_str && !tweet.in_reply_to_screen_name)) {
        // comment
        var res = {
            status: 'When Segwit?? @' + tweet.user.screen_name,
            in_reply_to_status_id: '' + tweet.id_str
        };
        T.post('statuses/update', res, responseCallback);
        // like
        T.post('favorites/create', {
            id: tweet.id_str
        }, responseCallback);
    }
});

// start stream and track words (or hashtags)
var streamWords = T.stream('statuses/filter', {
    track: ['bitcoin']
})

streamWords.on('tweet', function(tweet) {
    console.log('---- streamWords ----',tweet)
    // Like
    T.post('favorites/create', {
        id: tweet.id_str
    }, responseCallback);
})

// use this to log errors from requests
function responseCallback(err, data, response) {
    console.log(err);
}