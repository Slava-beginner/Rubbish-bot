const commandCreator = require('../commandCreator/commandCreator');


module.exports = new commandCreator({
    tag: /^Отправить бригаду$/i,
    start: async (ctx, msg, user, api, apiDb, Keyboard, announcesManager) => {
        if (!ctx.messagePayload) {
            return ctx.send('Выберите нужную заявку!')
        }
        let announce = await announcesManager.getAnnounceById(ctx.messagePayload['id'])
        let Otheruser = await apiDb.getUserById(announce['user_id'])
        announce['announceState'] = 'doing';
        Otheruser['announceState'] = 'doing'
        Otheruser['finalData']['announceState'] = 'doing'
        await announcesManager.saveDb(announce)
        await apiDb.saveUser(Otheruser)
        await api.messages.send({
            message: "Ваша заявка принята, ожидайте бригаду",
            random_id: Math.round(Math.random()),
            user_id: announce['user_id']
        })
        await ctx.send('Бригада отправлена!')
        return
    },
    desc: "Отправить бригаду",
    type: "textBtn",
    rights: 0
})