const commandCreator = require('../commandCreator/commandCreator');
const menu = require('../components/menu');
const adminMenu = require('../components/adminMenu')
module.exports = new commandCreator({
    tag: /^Меню$/i,
    start: async (ctx, msg, user, api, apiDb, Keyboard, announcesManager) => {
        if (user.rights == 1) {
            return adminMenu(ctx, Keyboard, "Главное меню")
        }
        return menu(ctx, Keyboard, "Главное меню");

    },
    desc: "Меню бота",
    type: "textBtn",
    rights: 0
})