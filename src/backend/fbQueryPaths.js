class FBQueryPaths {
    static admin = () => 'admin/';

    static getAllMatches = () => "matches/";
    static getMatchInfo = (matchId) => `/matches/${matchId}/`;
    static getMatchContests = (matchId) => `/matches/${matchId}/poles/`;
    static createMatchContests = (matchId, contestID) => `/matches/${matchId}/poles/${contestID}`;
    static getPrizeTemplate = () => `prizeTemplate/`
    static getNotification = () => `notifications/`
    static getStudents = (matchId, team) => `matches/${matchId}/${team}/`;
    static getSubjects = (matchId) => `matches/${matchId}/subjects/`;
    static getJoinedUsers = (matchId, contestID) => `matches/${matchId}/poles/${contestID}/joinedPlayers`;
    static updateStudentData = (matchId, team) => `/matches/${matchId}/${team}/`;

    static getJoinedMatches = (userID) => `users/${userID}/matches/`;
    static getSelectedTeam = (userID, matchId) => `/users/${userID}/matches/${matchId}/teams`

}

export default FBQueryPaths;