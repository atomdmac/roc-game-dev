var tf = require('./twitter-feed');

tf.start().then(function (tweets) {
	console.log(tweets[0]);
});

setInterval(function () {
	console.log(tf.getTweets());
}, 30000);