
class Match {
    // var id;
    // var teamAName;
    // var teamBName;
    // var teamAImageURL;
    // var teamBImageURL;
    // var startTime;
    // var endTime;
    // var showToAll;
    // var duration;
    // var totalPools;
    // var maxTeamStudents;

    constructor(data) {
        this.id = data.matchID;
        this.quizId = data.quizID;
        this.teamAName = data.teamAName;
        this.teamBName = data.teamBName;
        this.teamAImageURL = data.teamAImage;
        this.teamBImageURL = data.teamBImage;
        this.startTime = data.startTime;
        this.endTime = data.endTime;
        this.showToAll = data.showToAll;
        this.duration = data.duration;
        this.totalPools = data.totalPools;
        this.maxTeamStudents = data.maxTeamStudents;

    }

}

export default Match;

