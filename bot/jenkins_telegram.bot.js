const token = require('../env.json').token;
const emoji = require('node-emoji');
const TelegramBot = require('node-telegram-bot-api');

const UserService = require('../services/user.service');
const JenkinsClient = require('../client/jenkins.client');

function JenkinsTelegramBot() {
    const bot = new TelegramBot(token, { polling: true });

    const user_service = new UserService();

    const default_keyboard_markup = {
        reply_markup: {
            keyboard: [['Nova Conta', 'Detalhes']]
        }
    };

    const jenkins_managing_keyboard_markup = {
        reply_markup: {
            keyboard: [['Adicionar Servidor', 'Listar Servidores']]
        }
    };

    var jenkins_server_data = {};

    bot.onText(/\/start/, async (msg) => {
        const id = msg.chat.id;
        const username = msg.chat.username;

        const [user, err] = await user_service.get_user_by_username(username);
        if (err) {
            console.error(`[ERROR] ${err.message}`);
        } else if (user) {
            await bot.sendMessage(id, `Bem vindo de volta ${user.first_name}! O que deseja fazer?`, jenkins_managing_keyboard_markup);
            return true;
        }

        await bot.sendMessage(id, 'Olá, sou o JenkinsBô! Fui criado para lhe ajudar a gerir seu servidor Jenkins! :)')
        await bot.sendMessage(id, 'O que deseja fazer? Posso criar um novo cadastro para você, ou se tiver dúvidas posso dar mais detalhes sobre minhas funções.', default_keyboard_markup);
    });

    bot.onText(/\/Nova Conta/, async (msg) => {
        const id = msg.chat.id;
        await bot.sendMessage(id, `Tudo bem! Vou iniciar o seu cadastro! Enquanto isso aceita algo para beber? Que tal um café ${emoji.get('coffee')}?`, default_keyboard_markup);

        const user_data = {
            first_name: msg.chat.first_name,
            last_name: msg.chat.last_name,
            username: msg.chat.username,
            telegram_id: msg.chat.id,
            user_jenkins: []
        };

        const [user, err] = await user_service.add_user(user_data);
        if (err) {
            console.error(`[ERROR] ${err.message}`);
            await bot.sendMessage(id, `Ops! Alguma coisa aconteceu e eu não consegui salvar seus dados, se importaria de tentar mais tarde? ${emoji.get('disappointed')}`, default_keyboard_markup);
            return null;
        }
        await bot.sendMessage(id, `Tudo pronto ${emoji.get('smile')}! Você já está cadastro! No momento posso lhe ajudar com isto.`, jenkins_managing_keyboard_markup);
    });

    bot.onText(/\/Detalhes/, async (msg) => {
        const id = msg.chat.id;
        await bot.sendMessage(id, 'Como eu disse eu sou o JenkinsBô!');
        await bot.sendMessage(id, 'Minha tarefa é gerir os servidores do Jenkins que você cadastrar junto a mim.');
        await bot.sendMessage(id, 'Dessa forma eu vou poder lhe ajudar a programar tarefas, ver os status delas e lhe notificar quando um job no jenkins finalizar!', default_keyboard_markup);
    });

    bot.onText(/Adicionar Servidor/, async (msg) => {
        const id = msg.chat.id;

        await bot.sendMessage(id, 'Ótimo! Vou precisar que você me informe os dados da seguinte forma.');
        await bot.sendMessage(id, 'nome <nome_do_servidor>, usuario <nome_de_usuario>, senha <senha_do_servidor>, url <url_do_servidor>.');
        await bot.sendMessage(id, `Hã? O que foi? Você acha complexo? Me desculpe, mas eu ainda sou meio burrinho ${emoji.get('grimacing')}`);
    });

    bot.onText(/nome (.+), usuario (.+), senha (.+), url (.+)/, async (msg, match) => {
        const id = msg.chat.id;
        await bot.sendMessage(id, `Opa! Certo vou guardar as informações, me dê um minuto! Aqui tome um café enquanto isso ${emoji.get('coffee')}.`);

        const name = match[1];
        const username = match[2];
        const password = match[3];
        const url = match[4];

        const client = new JenkinsClient(username, password, url);
        const [jobs_data, err] = await client.list_jobs();

        if (err) {
            await bot.sendMessage(id, `Vish! Não conseguir me comunicar com o seu servidor ${emoji.get('sweat_smile')}.`);
            await bot.sendMessage(id, `Ele me retornou essa informção: ${err.to_string()}`);
            return null;
        }

        await bot.sendMessage(id, `Já comuniquei com o seu servidor, vou listar os jobs cadastrados nele. Enquanto isso... Mais café? ${emoji.get('coffee')}`);        
        const jobs = jobs_data.jobs.map(job => { return job.name });

        if (jobs.length > 0) {
            await bot.sendMessage(id, `Pronto! Eu encontrei esses trabalhos no seu servidor: ${jobs.join(', ')}`);
        } else {
            await bot.sendMessage(id, 'Hmmm... Parece que você não tem trabalhos no seu servidor ainda... Isso não é um problema vamos continuar.');
        }

        await bot.sendMessage(id, `Certo, vamos prosseguir... Vou gravar estes dados para vocês. Eu lhe ofereceria outro café, mas aposto que você nem terminou outro.`);

        const jenkins_data = {
            url: url,
            name: name,
            username: username,
            password: password,
            jobs: jobs
        }

        const [user, update_error] = await user_service.add_jenkins_server(jenkins_data, msg.chat.username);
        if (update_error) {
            console.error(`[ERROR] ${update_error.message}`);
            await bot.sendMessage(id, `Hehehe... Num deu pra salvar não ${emoji.get('sweat_smile')}`);
        }
        await bot.sendMessage(id, `Sucesso! Cadastramos o servidor jenkins ${name} sem nenhum problema! ${emoji.get('sunglasses')}`);        
    });

    bot.onText(/Listar Servidores/, async (msg) => {
        const id = msg.chat.id;

        await bot.sendMessage(id, `Tranquilo, vou buscar suar informações.`);

        const [user, err] = await user_service.get_user_by_username(msg.chat.username);
        if (user) {
            await bot.sendMessage(id, `Aqui estão os servidores que você gerencia comigo: ${user.list_server_names().join(', ')}.`);
            await bot.sendMessage(id, 'Se quiser ver os jobs de um servidor me diga com \'servidor jobs <nome_do_servidor> \'.');
            return true;
        }
        await bot.sendMessage(id, `Hmm... Não encontrei seus dados, você já se cadastrou? ${emoji.get('grimacing')}`);
    });

    bot.onText(/servidor jobs (.+)/, async (msg, match) => {
        const id = msg.chat.id;
        const servername = match[1];
        await bot.sendMessage(id, `${emoji.get('coffee')}. Já sabe né? Vai ter de esperar um pouquinho ${emoji.get('grimacing')}.`);

        const [user, err] = await user_service.get_user_by_username(msg.chat.username);
        if (user) {
            await bot.sendMessage(id, `Prontinho! Já encontrei, aqui está: ${user.get_server_by_name(servername).jobs.join(', ')}.`);
            return true;
        }
        await bot.sendMessage(id, `Hmm... Não encontrei seus dados, você já se cadastrou? ${emoji.get('grimacing')}`);
    });
}

module.exports = JenkinsTelegramBot;