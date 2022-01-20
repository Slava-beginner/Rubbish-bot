const getAnnounces = async (ctx, Keyboard, text) => ctx.send({
    message: text,
    keyboard: Keyboard.builder()
        .textButton({
            label: "Посмотреть заявки 📃",
            payload: {
                command: "seeAnnounces",
            },
            color: 'positive'
        })
})

module.exports = isNeedHelp;