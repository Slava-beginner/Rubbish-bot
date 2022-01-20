const commandCreator = require('../commandCreator/commandCreator');


module.exports = new commandCreator({
    tag: /^Посмотреть заявки$/i,
    start: async function (ctx, msg, user, api, apiDb, Keyboard, announcesManager) {
        if (user.rights < this['rights']) {
            return
        }
        let announces = await announcesManager.getDb()
        const typeOfRuubish = {
            constructionGarbage: "Строительный мусор ⚒",
            hugeGarbage: "Старая мебель, техника 📺",
            others: "не указан"
        }
        if (announces.length == 0) {
            return ctx.send('На данный момент заявок нет')
        }
        for (let i of announces) {
            ctx.send({
                message: `--------\nID заявки: ${i['id']}\n Ссылка на заказчика: ${i['url']}\nОписание:\n${i.desc} \nТип мусора: ${typeOfRuubish[i['typeOfRubbish']]}\n\n Помощь в доставке к контейнеру: ${i.isNeedHelp}\n\nАдрес ${i['addres']}\n\nКоординаты:\nШирота - ${i.lat}\nДолгота - ${i.lng}`,
                keyboard: Keyboard.builder()
                    .textButton({
                        label: 'Отправить бригаду ☎',
                        payload: {
                            command: 'sendBrigade',
                            item: 'sendBrigade',
                            id: i['id']
                        },
                        color: "positive"
                    })
                    .row()
                    .textButton({
                        label: "Отменить заявку 🛑",
                        payload: {
                            command: 'deleteAnnounce',
                            item: 'deleteAnnounce',
                            id: i['id']
                        },
                        color: 'negative'
                    })
                    .row()
                    .textButton({
                        label: i['announceState'] == "wait" ? 'Ждёт ответа 💬' : 'Выполняется 🚀',
                        payload: {
                            command: 'deleteAnnounce',
                            item: 'deleteAnnounce'
                        },
                        color: i['announceState'] == "wait" ? 'primary' : 'negative'
                    })
                    .inline()
            })
        }
    },
    desc: "Посмотреть заявки",
    type: "textBtn",
    rights: 1
})




