
exports.update = function(req, res) {
    const TelegramBot = require('./../../TelegramBot/bot');

    console.log("Setto stato");
    res.status(200).send('working');
    console.log("Stato settato-processUpdate del bot");
    TelegramBot.BOT.processUpdate(req.body);
};
