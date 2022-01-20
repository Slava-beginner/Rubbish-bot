const menu = require("../components/menu");
const opencage = require('opencage-api-client');


const CreateAnnounce = require('../Announces/createAnnounce')
const utils = require('../utils/utils');

class DataBase {
    #db;
    constructor(db) {
        this.#db = db;

    }

    async saveUser(user) {
        return this.#db.updateOne({ id: user['id'] }, { $set: user }, { upsert: false });

    }

    async getAddres(coordinates) {

        let resp = await opencage.geocode(`${coordinates.latitude} ${coordinates.longitude}`);
        console.log(resp)

    }
    async addNewUser(user) {
        return this.#db.insertOne(user);

    }

    async getDb() {
        let db = await this.#db.find();
        return db.toArray()
    }

    async hasUser(id) {
        let searchUser = await this.getUserById(id);
        return !searchUser ? false : true

    }
    async checkUser(user) {
        if (user == -1 || user == undefined || user == null) {
            return true
        }
        return false
    }
    /**@returns boolean: true в случае успеха, иначе false */
    async checkNumber(num) {
        if ((num ^ 0) != num || num < 0 || String((num).indexOf(',')) != -1 || isNaN(parseInt(num)) || String(num).includes('-')) {
            return false
        }
        return true
    }

    async getUserById(id) {
        id = Number(id);
        if (isNaN(id)) {
            return null
        }
        let user = await this.#db.findOne({ id: id });
        if (user) {
            return user
        }
        else {
            return null;
        }
    }
    async checkData(user) {
        let arr = Object.entries(user['filter'])
        for (let i of arr) {
            console.log(i)
            if (i[1] == null || i[1] === 0) {
                return false
            }
        }
        let { results: [elem] } = await opencage.geocode({ q: `${user['filter'].latitude} ,${user['filter'].longitude}`, language: 'ru' });
        user['finalData']['typeOfRubbish'] = user['filter']['typeOfRubbish']
        user['finalData']['isNeedHelp'] = user['filter']['isNeedHelp'] ? "да" : "нет"
        user['finalData']['addres'] = elem?.formatted ? elem.formatted : 'не указан'
        user['finalData']['desc'] = user['filter']['desc']
        user['finalData']['lat'] = user['filter']['latitude']
        user['finalData']['lng'] = user['filter']['longitude']
        user['finalData']['id'] = await utils.makeid();
        user['finalData']['url'] = `@id${user['id']}(${user.name})`
        user['finalData']['user_id'] = user['id']
        user['finalData']['announceState'] = 'wait'
        user['announceState'] = "wait"
        user.announces.push(user['finalData']);
        await this.zeroingData(user)
        await this.saveUser(user)
        return true
    }
    async deleteUser(user) {
        return this.#db.deleteOne({ id: user['id'] }, (err, result) => {
            if (err) throw err;

        });

    }
    async deleteFinalData(user) {
        user['finalData']['typeOfRubbish'] = ''
        user['finalData']['isNeedHelp'] = ''
        user['finalData']['addres'] = ''
        user['finalData']['desc'] = ''
        user['finalData']['lat'] = 0
        user['finalData']['lng'] = 0
        user['finalData']['id'] = 0
        user['finalData']['url'] = ''
        user['finalData']['user_id'] = 0
        user['finalData']['announceState'] = 'none'
    }


    async setLocation(user, data) {
        user['filter'].latitude = data['coordinates']['latitude'];
        user['filter'].longitude = data['coordinates']['longitude'];
        user['filter'].city = data['place']['city'] ? data['place']['city'] : 'не указан';
        user['announceState'] = "ready";
        return this.saveUser(user)
    }

    async publicAnnounce(user, ctx, Keyboard, announcesManager) {
        await ctx.send('...Готовим ваше объявление')
        let filter = user['filter'];
        let announce = new CreateAnnounce({
            desc: filter['desc'],
            price: filter['price'],
            creatorId: user['id'],
            id: await utils.makeid(),
            location: {
                latitude: filter['latitude'],
                longitude: filter['longitude'],
                city: filter['city'],
            }
        });
        await announcesManager.addNewAnnounce(announce);
        user['announces'].push(announce);
        await this.zeroingData(user);
        await this.saveUser(user)

        return menu(ctx, Keyboard, 'Готово, теперь вы можете найти его в общем списке')
    }
    async zeroingData(user) {
        user['filter'].latitude = 0;
        user['filter'].longitude = 0;
        user['filter'].desc = "";
        user['filter'].city = "";

    }

}
module.exports = { DataBase };

