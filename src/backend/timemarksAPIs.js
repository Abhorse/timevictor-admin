import axios from 'axios'
import { baseURLs } from './baseURL';


class TimemarksAPI {
    static getAllUnMappedMatches = async () => {
        const quizzes = await axios.get(`${baseURLs.TIMEMARKSAPI}/app2_quizList.php`);
        return quizzes;
    }

    static getSponsorsByQuiz = async (quizId) => {
        const formData = new FormData();
        formData.append("quiz_id", quizId);
        const sponsors = await axios.post(`${baseURLs.TIMEMARKSAPI}/app2_quiz_sponsor_list.php`, formData);
        return sponsors;
    }

    static getSponsorsTeam = async (sid, quiz_id) => {
        const formData = new FormData();
        formData.append("user_id", sid);
        formData.append("quiz_id", quiz_id);
        const sponsorTeam = await axios.post(`${baseURLs.TIMEMARKSAPI}/sponsorTeamLeaderboarByQuiz.php`, formData);
        return sponsorTeam;
    }

    static getStudentProfileData = async (student_id) => {
        const formData = new FormData();
        formData.append("user_id", student_id);
        const studentData = await axios.post(`${baseURLs.TIMEMARKSAPI}/app2_user_profile.php`, formData);
        return studentData;
    }
}
export default TimemarksAPI;