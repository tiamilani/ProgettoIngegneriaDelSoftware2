
exports.update = function(req, res) {
    const TelegramBot = require('./../../TelegramBot/bot');

    res.status(200).send('working');
    TelegramBot.BOT.processUpdate(req.body);
};
