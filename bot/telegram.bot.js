const token = require('../env.json').token;
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
    console.log(msg);

    const id = msg.chat.id;
    bot.sendMessage(id, 'Certo, no momento possuo essas duas opções.', {
        reply_markup: {
            keyboard: [['Cadastrar novo Servidor Jenkins', 'Ajuda']]
        }
    })
});

bot.on('message', (msg) => {
    console.log(msg);

    const id = msg.chat.id;

    bot.sendMessage(id, `Olá ${msg.chat.first_name}! Eu sou o JenkinsBô! Estou aqui para lhe ajudar a organizar suas tarefas no Jenkins :)`);
    bot.sendMessage(id, 'Se quiser iniciar basta digitar /start.');
});

bot.onText(/Ajuda/, (msg) => {
    console.log(msg);
    const id = msg.chat.id;
    bot.sendMessage(id, 'Minha função é lhe auxiliar com o gerenciamento de Jekins, posso lhe dar informações das últimas builds, agendar novas e até executar uma nesse momento.', {
        reply_markup: {
            keyboard: [['Cadastrar novo Servidor Jenkins', 'Ajuda']]
        }
    });
});

module.exports = bot;