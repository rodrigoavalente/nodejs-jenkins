const mongoose = require('mongoose');

const dburl = require('./env.json').dburl;
const JenkinsTelegramBot = require('./bot/jenkins_telegram.bot');

mongoose.connect(dburl);

const db = mongoose.connection;

db.on('error', console.error.bind(console, '[ERROR] Failed to connect to database.'));
db.once('open', () => {
    const bot = new JenkinsTelegramBot();
});
