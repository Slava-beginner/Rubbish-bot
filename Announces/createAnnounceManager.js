const { randomOpen } = require("../utils/utils");

class createAnnounceManager {
    #db;
    constructor(db, operatorIds) {
        this.#db = db;
        this.operatorIds = operatorIds
    }

    async saveDb(announce) {
        return this.#db.updateOne({ id: announce['id'] }, { $set: announce }, { upsert: false });

    }


    async addNewAnnounce(announce, api, Keyboard) {

        await this.#db.insertOne(announce)
        for (let i of this.operatorIds) {
            await api.messages.send({
                message: "Появилась новая заявка ❗",
                user_id: i,
                random_id: Math.round(Math.random()),
                keyboard: Keyboard.builder()
                    .textButton({
                        label: "Посмотреть заявки 📃",
                        payload: {
                            command: "seeAnnounces",
                        },
                        color: 'positive'
                    })
            })
        }


    }

    async getDb() {
        let db = await this.#db.find();
        return db.toArray()
    }


    async checkAnnounce(announce) {
        if (announce == -1 || announce == undefined || announce == null) {
            return true
        }
        return false
    }
    /**@returns boolean: true в случае успеха, иначе false */
    async checkNumber(num) {
        if ((num ^ 0) != num || String((num).indexOf(',')) != -1 || isNaN(parseInt(num)) || String(num).includes('-')) {
            return false
        }
        return true
    }

    async getAnnounceById(id) {
        let announce = await this.#db.findOne({ id: id });
        if (announce) {
            return announce
        }
        else {
            return null;
        }
    }

    async deleteAnnounce(announce) {
        return this.#db.deleteOne({ id: announce['id'] }, (err, result) => {
            if (err) throw err;

        });

    }
}

module.exports = createAnnounceManager;