
const menu = require('./commands/menu');

const publicAnnouncement = require('./commands/publicAnnouncement');


const myAds = require('./commands/myAds');


const constructionGarbage = require('./commands/typeOfRuubish/constructionGarbage');
const others = require('./commands/typeOfRuubish/others');
const hugeGarbage = require('./commands/typeOfRuubish/hugeGarbage');
const getAnnounces = require('./commands/getAnnounces');
const sendBrigade = require('./commands/sendBrigade');
const deleteAnnounce = require('./commands/deleteAnnounce');


const commands ={
    "меню":menu,
    "подать заявку":publicAnnouncement,
    "мои заявки":myAds,
    "строительный мусор":constructionGarbage,
    "другое":others,
    "старая мебель техника":hugeGarbage,
    "посмотреть заявки":getAnnounces,
    "отправить бригаду":sendBrigade,
    "отменить заявку":deleteAnnounce

   
};



module.exports = {commands}