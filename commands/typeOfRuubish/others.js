const isNeedHelp = require('../../components/isNeedHelp');
const commandCreator = require('../../commandCreator/commandCreator');



module.exports = new commandCreator({
    tag: /^Другое$/i,
    start: async (ctx, msg, user, api, apiDb, Keyboard, announcesManager) => {
        let value = ctx.messagePayload.item
        user['filter']['typeOfRubbish'] = value
        await apiDb.saveUser(user);
        return isNeedHelp(ctx, Keyboard, "Нужна ли помощь,в доставке мусора к контейнеру?")

    },
    desc: "Другое",
    type: "textBtn",
    rights: 0
})