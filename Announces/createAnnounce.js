



class CreateAnnounce {
    constructor(options) {
        this.desc = options.desc;
        this.price = options.price;
        this.location = options.location;
        this.creatorId = options.creatorId;
        this.id = options.id;
        this.status = "none";
        this.carryBy = 0;

    }
}

module.exports = CreateAnnounce;