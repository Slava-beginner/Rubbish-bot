const commandCreator = require('../commandCreator/commandCreator');
const { getRandomId } = require('vk-io')

module.exports = new commandCreator({
    tag: /^Отменить заявку$/i,
    start: async (ctx, msg, user, api, apiDb, Keyboard, announcesManager) => {
        if (!ctx.messagePayload) {
            return ctx.send('Выберите нужную заявку!')
        }
        let announce = await announcesManager.getAnnounceById(ctx.messagePayload['id'])
        console.log(ctx.messagePayload['id'])
        let Otheruser = await apiDb.getUserById(announce['user_id'])
        let resp = await ctx.question('Укажите причину отмены заявки');
        announcesManager.deleteAnnounce(announce);
        Otheruser['announceState'] = 'none'
        Otheruser.announces.shift()
        await apiDb.deleteFinalData(user)
        await apiDb.saveUser(Otheruser)

        await api.messages.send({
            message: "Ваша заявка отклонена",
            random_id: getRandomId(),
            user_id: announce['user_id']
        })
        await api.messages.send({
            message: `Причина: ${resp['text']}`,
            random_id: getRandomId(),
            user_id: announce['user_id']
        })
        return ctx.send('Заявка отклонена и удалена')
    },
    desc: "Отменить заявку",
    type: "textBtn",
    rights: 0
})