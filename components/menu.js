const menu = async (ctx, Keyboard, text) => ctx.send({
    message: text,
    keyboard: Keyboard.builder()
        .textButton({
            label: "Подать заявку ♻",
            payload: {
                command: "publicAnnounce",
                item: 'publicAnnounce'
            },
            color: 'positive'
        })
        .row()
        .textButton({
            label: 'Мои заявки 📰',
            payload: {
                command: "myAds",
                item: 'myAds'
            },
            color: 'secondary'
        })

})

module.exports = menu;