const { vk, operatorIds, mongoDbLink } = require('./config');
const { Keyboard, getRandomId } = require('vk-io');
const { MongoClient } = require('mongodb');
const { HearManager } = require('@vk-io/hear');
const { QuestionManager } = require('vk-io-question');
const question = new QuestionManager();
const listener = new HearManager();

const client = new MongoClient(mongoDbLink, { useUnifiedTopology: true });
const { api } = vk;
const User = require('./User/User');
const { commands } = require('./commands');
const { DataBase } = require('./db/dataBase');
const createAnnounceManager = require('./Announces/createAnnounceManager');
let apiDb;
let announcesManager;


const mapComponent = require('./components/mapComponent');
const menu = require('./components/menu');



const start = async () => {
    await client.connect();
    const db = client.db("rubbish-Bot")
    let users = db.collection("users")
    let announces = db.collection("announces");
    announcesManager = new createAnnounceManager(announces, operatorIds);
    apiDb = new DataBase(users);
    return { apiDb, announcesManager };
}

vk.updates.on("message_new", listener.middleware);
vk.updates.use(question.middleware)

listener.hear(/^начать$/i, async ctx => {
    if (!await apiDb.hasUser(ctx.peerId)) {
        let [user] = await api.users.get({
            user_ids: ctx.peerId,
        })
        let isOperator = operatorIds.includes(user['id'])
        await apiDb.addNewUser(new User({
            id: user['id'],
            isAdmin: isOperator ? true : false,
            rights: isOperator ? 1 : 0,
            name: user.first_name + ' ' + user.last_name,
        }));
        isOperator ?
            ctx.send({
                message: `Приветствую, оператор ${user.first_name + ' ' + user.last_name}`,
                keyboard: Keyboard.builder().textButton({
                    label: "Меню 📄",
                    payload: {
                        command: 'menu',
                        item: 'menu'
                    },
                    color: "secondary"
                })
            })
            :
            ctx.send({
                message: `Привет, ${user.first_name + ' ' + user.last_name}\nС помощью этого бота ты можешь быстро утилизировать свой мусор\nЧтобы подать заявку на утилизацию нажмите \"Подать заявку\"`,
                keyboard: Keyboard.builder().textButton({
                    label: "Меню 📄",
                    payload: {
                        command: 'menu',
                        item: 'menu'
                    },
                    color: "secondary"
                })
            })

    }
    else {
        return ctx.send(`Вы уже зарегистрированы в боте`)
    }

})

vk.updates.on("message", async ctx => {
    if (ctx.isGroup) return


    if (!await apiDb.hasUser(ctx.peerId)) {
        return ctx.send({
            message: "Привет, нажми кнопку начать,чтобы взаимодействовать с ботом",
            keyboard: Keyboard.builder().textButton({
                label: "Начать",
                payload: {
                    command: "start",
                    item: "start"
                },
                color: "primary"
            })
        })
    }
    let user = await apiDb.getUserById(ctx.peerId);

    if (ctx.messagePayload?.filter == "isNeedHelp") {
        user['filter']['isNeedHelp'] = ctx.messagePayload.item;
        await apiDb.saveUser(user)
        return mapComponent(ctx, Keyboard, "Укажите местоположение откуда\nОткуда надо вывезти мусор")

    }
    if (ctx.messagePayload?.['command'] == "setLocation" && ctx?.geo) {
        await apiDb.setLocation(user, ctx.geo);
        await ctx.send('Данные о местоположении обновлены')
        if (!await apiDb.checkData(user)) {
            await apiDb.zeroingData(user)
            return menu(ctx, Keyboard, 'Вы упустили какие-то данные\nПопробуйте подать заявку ещё раз')

        }
        await ctx.send('Готовим вашу заявку...')
        await announcesManager.addNewAnnounce(user['finalData'], api, Keyboard)
        return menu(ctx, Keyboard, 'Заявка готова ✅ !\nОжидайте ответ оператора')

    }

    let msg = ctx.text.replace(/[^а-я\sА-ЯёЁ]*/ig, '').toLowerCase().trimLeft().trimRight()
    console.log(msg)
    console.log(commands[msg])
    commands.hasOwnProperty(msg) ? commands[msg].start(ctx, msg, user, api, apiDb, Keyboard, announcesManager) : false
});


vk.updates.on("group_join", ctx => {
    return vk.api.messages.send({
        user_id: ctx.userId,
        message: 'Спасибо за подписку!',
        random_id: getRandomId()

    })

})
vk.updates.on("group_leave", ctx => {
    return vk.api.messages.send({
        user_id: ctx.userId,
        message: 'Возвращайся к нам!',
        random_id: getRandomId()
    })
})

vk.updates.on('block_group_user', ctx => {
    return vk.api.messages.send({
        user_id: ctx.userId,
        message: 'That\'s life!',
        random_id: getRandomId()

    })
})


start().then(() => {
    vk.updates.start().catch(e => { throw new Error("Start Error" + e) }).then(() => {
        console.log("Bot started")

    })
})
