const adminMenu = async (ctx, Keyboard, text) => ctx.send({
    message: text,
    keyboard: Keyboard.builder()
        .textButton({
            label: "Посмотреть заявки 📃",
            payload: {
                command: "seeAnnouXnces",
            },
            color: 'positive'
        })

})

module.exports = adminMenu;