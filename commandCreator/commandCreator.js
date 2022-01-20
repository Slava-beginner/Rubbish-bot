
/**
 * @function commandCreator функция создания команды
     * 
     * @param {Object} command объект для создания команды
     * @param {RegExp} command.tag регулярное выражение
    * @param {Function} command.start функция для выполнения этой команды
     * @param {Number} command.rights права для выполнения этой команды
     * @param {String} command.desc описание команды
     * @param {("textBtn" | "callbackBtn")} command.type тип команды
     */

function commandCreator(
    command = {
        tag,
        start,
        rights,
        desc,
        type
    }) {
    this.tag = command.tag;
    this.start = command.start;
    this.rights = command.rights;
    this.desc = command.desc;
    this.type = command.type;

}
module.exports = commandCreator