const typeOfRubbish = async (ctx, Keyboard, text) => ctx.send({
    message: text,
    keyboard: Keyboard.builder()
        .textButton({
            label: "Строительный мусор ⚒",
            payload: {
                filter: "typeOfRubbish",
                command: "createAnnouncement",
                item: 'constructionGarbage'
            },
            color: 'positive'
        })
        .row()
        .textButton({
            label: "Старая мебель, техника 📺",
            payload: {
                filter: "typeOfRubbish",
                command: 'createAnnouncement',
                item: "hugeGarbage"
            },
            color: "primary"
        })
        .row()
        .textButton({
            label: 'Другое 📝',
            payload: {
                filter: "typeOfRubbish",
                command: "createAnnouncement",
                item: 'others'
            },
            color: 'negative'
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

module.exports = typeOfRubbish;