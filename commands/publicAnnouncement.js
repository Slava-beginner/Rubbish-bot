const commandCreator = require('../commandCreator/commandCreator');
const typeOfRubbish = require('../components/typeOfRubbish');


module.exports = new commandCreator({
    tag: /^Подать заявку$/i,
    start: async (ctx, msg, user, api, apiDb, Keyboard, announcesManager) => {
        if (user['announceState'] == "wait") {
            return ctx.send("У вас уже есть заявка\nВы можете посмотреть её в \'Мои заявки\'")
        }
        let { text } = await ctx.question('Укажите описание к вашей заявки\nКакой у вас мусор и т.д.')
        await ctx.send('Перед подачей заявки ответьте на пару вопросов для более полной информации')
        user['filter']['desc'] = text;
        await apiDb.saveUser(user)
        return typeOfRubbish(ctx, Keyboard, "Выберите тип вашего мусора ♻")

    },
    desc: "Подать заявку",
    type: "textBtn",
    rights: 0
})