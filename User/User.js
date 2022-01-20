class User {
    constructor({ name = '', id = 0, isAdmin = false, rights = 0, announceState = "none" || "wait" }) {
        this.name = name,
            this.id = id,
            this.isAdmin = isAdmin;
        this.rights = rights;
        this.announces = [];
        this.announceState = announceState;
        this.isFreezed = false;
        this.filter = {
            typeOfRubbish: '',
            isNeedHelp: false,
            latitude: 0,
            longitude: 0,
            city: '',
            desc: '',
        }
        this.finalData = {
            typeOfRubbish: "",
            isNeedHelp: '',
            addres: "",
            desc: "",
            lat: '',
            lng: '',
            id: 0,
            url: '',
            user_id: '',
            announceState: ''
        }

    }
}

module.exports = User;