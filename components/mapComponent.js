const mapComponent = async (ctx, Keyboard, text) => ctx.send({
    message: text,
    keyboard: Keyboard.builder().
        locationRequestButton({
            payload: {
                command: "setLocation"
            }
        })
})

module.exports = mapComponent;