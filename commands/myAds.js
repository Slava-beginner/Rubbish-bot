const commandCreator = require('../commandCreator/commandCreator');


module.exports = new commandCreator({
    tag: /^Мои объявления$/i,
    start: async (ctx, msg, user, api, apiDb, Keyboard, announcesManager) => {
        const adsArr = user['announces'];
        const typeOfRuubish = {
            constructionGarbage: "Строительный мусор ⚒",
            hugeGarbage: "Старая мебель, техника 📺",
            others: "не указан"
        }
        if (adsArr.length == 0) {
            return ctx.send('У вас пока нет заявок')
        }
        const check = async (status, i) => {
            console.log(status)
            return status == "wait" ? Keyboard.builder().textButton({
                label: 'Ожидание ответа оператора 💬',
                payload: {
                    command: "seeState",
                    item: "seeState",
                    status: "wait",

                },
                color: "primary"
            }).inline()
                :
                Keyboard.builder().textButton({
                    label: 'Выполняется 🚀',
                    payload: {
                        command: "seeState",
                        item: "seeState",
                        status: "doing"
                    },
                    color: "negative"
                }).inline()
        }
        for (let i of adsArr) {

            await ctx.send({
                message: `--------\nID заявки: ${i['id']}\nОписание:\n${i.desc} \nТип мусора: ${typeOfRuubish[i['typeOfRubbish']]}\n\n Нужна помощь в доставке к контейнеру: ${i.isNeedHelp}\n\nАдрес ${i['addres']}\n\nКоординаты:\nШирота - ${i.lat}\nДолгота - ${i.lng}`,
                keyboard: await check(user['announceState'], i)
            })
        }

    },
    desc: "Мои объявления",
    type: "textBtn",
    rights: 0
})