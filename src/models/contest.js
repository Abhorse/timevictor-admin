
class MatchContest {


    constructor(data) {
        this.id = data.id;
        this.maxPrize = data.maxPrize;
        this.currentPrize = data.currentPrize;
        this.maxLimit = data.maxLimit;
        this.entry = data.entry;
        this.currentCount = data.currentCount;
        this.awards = data.awards;
        this.joinedUsers = data.joinedUsers;
    }

}

export default MatchContest;

