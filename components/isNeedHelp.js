const isNeedHelp = async (ctx, Keyboard, text) => ctx.send({
    message: text,
    keyboard: Keyboard.builder()
        .textButton({
            label: "Да",
            payload: {
                filter: "isNeedHelp",
                command: "createAnnouncement",
                item: true
            },
            color: 'positive'
        })
        .row()
        .textButton({
            label: "Нет",
            payload: {
                filter: "isNeedHelp",
                command: 'createAnnouncement',
                item: false
            },
            color: "negative"
        })
        .row()
        .textButton({
            label: "Меню 📄",
            payload: {
                command: 'menu',
                item: 'menu'
            },
            color: "secondary"
        })
})

module.exports = isNeedHelp;