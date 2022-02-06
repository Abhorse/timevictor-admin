import { db } from '../config/firebase';
import FBQueryPaths from './fbQueryPaths';
import { firestore } from 'firebase';
import { compose } from 'redux';

class FirestoreDatabase {
    static getAllMatches() {
        return db.collection(FBQueryPaths.getAllMatches()).orderBy('startTime', 'desc').get();
    }
    static getMatchInfo(matchID) {
        return db.doc(FBQueryPaths.getMatchInfo(matchID)).get();
    }
    static getMatchContests(matchID) {
        return db.collection(FBQueryPaths.getMatchContests(matchID)).orderBy('maxPrize', 'desc').get();
    }
    static getPrizeTemplates() {
        return db.collection(FBQueryPaths.getPrizeTemplate()).get();
    }

    static getNotifications() {
        return db.collection(FBQueryPaths.getNotification()).orderBy('date', 'desc').get();
    }

    static async deleteNotifications(id) {
        await db.collection(FBQueryPaths.getNotification()).doc(id).delete();
    }
    static getStudents(matchID, isTeamA) {
        return db.collection(FBQueryPaths.getStudents(matchID, isTeamA ? 'teamAStudents' : 'teamBStudents')).orderBy('score', 'desc').get();
    }
    static getSubjects(matchID) {
        return db.collection(FBQueryPaths.getSubjects(matchID)).get();
    }
    static getJoinedUser(matchID, contestID) {
        return db.collection(FBQueryPaths.getJoinedUsers(matchID, contestID))
            .orderBy('rank', 'asc')
            .get();
    }
    static async createContest(matchID, contestData, totalPools) {
        console.log(matchID, contestData);
        await db.collection(FBQueryPaths.getMatchContests(matchID)).doc(contestData.id).set(contestData);
        await db.collection(FBQueryPaths.getAllMatches()).doc(matchID).update({
            totalPools: totalPools + 1
        })
    }

    static async editContest(matchID, contestID, data) {
        console.log(matchID, contestID, data);
        await db.collection(FBQueryPaths.getMatchContests(matchID)).doc(contestID).update(data);
    }

    static async updateAllStudentMark(matchID, teamA, teamB) {
        for (const student of teamA) {
            // console.log('teamA', student);
            await db.collection(FBQueryPaths.updateStudentData(matchID, 'teamAStudents'))
                .doc(student.team_name)
                .update({
                    quizMarks: student.quiz_score !== null ? parseFloat(student.quiz_score) : null,
                })
        }

        for (const student of teamB) {
            // console.log('teamB', student);
            await db.collection(FBQueryPaths.updateStudentData(matchID, 'teamBStudents'))
                .doc(student.team_name)
                .update({
                    quizMarks: student.quiz_score !== null ? parseFloat(student.quiz_score) : null,
                })
        }
    }

    static async updateStudentMark(matchID, student, newMarks, isTeamA) {
        // console.log(matchID, student, newMarks, isTeamA);
        await db.collection(FBQueryPaths.updateStudentData(matchID, isTeamA ? 'teamAStudents' : 'teamBStudents'))
            .doc(student.name)
            .update({
                quizMarks: newMarks,
            })
    }

    static async addStudent(matchID, newStudent, isTeamA) {
        console.log(matchID, newStudent, isTeamA);
        await db.collection(FBQueryPaths.updateStudentData(matchID, isTeamA ? 'teamAStudents' : 'teamBStudents'))
            .doc(newStudent.name)
            .set(newStudent)
    }
    static async deleteMatch(matchID) {
        console.log(matchID);
        await db.collection(FBQueryPaths.getAllMatches()).doc(matchID).delete();
    }

    static async changeMatchStatus(matchID, status) {
        console.log(matchID, status);
        await db.collection(FBQueryPaths.getAllMatches()).doc(matchID).update(
            { showToAll: status }
        );
    }

    static async editStartTime(matchID, startTime, duration, endTime) {

        console.log(matchID, startTime, duration, endTime);
        await db.collection(FBQueryPaths.getAllMatches()).doc(matchID).update(
            {
                startTime: firestore.Timestamp.fromDate(startTime),
                duration: duration,
                endTime: firestore.Timestamp.fromDate(endTime),
            }
        )
    }

    static async createPrizeTemplates(template) {
        return db.collection(FBQueryPaths.getPrizeTemplate()).doc(template.name).set(template);
    }

    static async sendNotification(title, message) {
        const admin = await db.collection(FBQueryPaths.admin()).doc('notification').get();
        const adminData = admin.data();
        const notificationID = `notify-${adminData.total + 1}`;

        await db.collection(FBQueryPaths.getNotification()).doc(notificationID).set({
            id: notificationID,
            title: title,
            message: message,
            date: firestore.Timestamp.now(),
        });

        await db.collection(FBQueryPaths.admin()).doc('notification').update({ total: adminData.total + 1 });

    }



    static async addMatch(matchData, subjects, teamAStudents, teamBStudents) {
        debugger
        const admin = await db.collection(FBQueryPaths.admin()).doc('matches').get();
        const adminData = admin.data();
        const matchID = `match_${adminData.total + 1}`;
        console.log(firestore.Timestamp.fromDate(matchData.startDate))
        console.log(firestore.Timestamp.fromDate(matchData.endTime));
        const match = {
            matchID: matchID,
            quizID: matchData.matchID,
            teamAName: matchData.teamAName,
            teamAImage: matchData.teamALogo,
            teamBName: matchData.teamBName,
            teamBImage: matchData.teamBLogo,
            totalPools: 0,
            showToAll: false,
            maxTeamStudents: parseInt(matchData.studentCount ?? 11),
            duration: parseInt(matchData.duration),
            startTime: firestore.Timestamp.fromDate(matchData.startDate),
            endTime: firestore.Timestamp.fromDate(matchData.endTime),
        }

        await db.collection(FBQueryPaths.getAllMatches()).doc(matchID).set(match);
        for (const subject of subjects) {
            await db.collection(FBQueryPaths.getSubjects(matchID)).doc(subject.subject).set(subject);
        }
        for (const student of teamAStudents) {
            await db.collection(FBQueryPaths.getStudents(matchID, 'teamAStudents')).doc(student.name).set(student);
        }
        for (const student of teamBStudents) {
            await db.collection(FBQueryPaths.getStudents(matchID, 'teamBStudents')).doc(student.name).set(student);
        }
        await db.collection(FBQueryPaths.admin()).doc('matches').update({ total: adminData.total + 1 });

    }

    static async updateLeaderboard(matchID, contestID) {
        const joinedUsers = await db.collection(FBQueryPaths.getJoinedUsers(matchID, contestID)).get();
        const teamAStudents = await db.collection(FBQueryPaths.getStudents(matchID, 'teamAStudents')).get();
        const teamBStudents = await db.collection(FBQueryPaths.getStudents(matchID, 'teamBStudents')).get();
        const tAS = teamAStudents.docs.map(doc => doc.data());
        const tBS = teamBStudents.docs.map(doc => doc.data());
        const allStudents = tAS.concat(tBS);
        const users = joinedUsers.docs.map(doc => doc.data());
        async function updateTeamTotalScore(userID) {
            console.log('id', userID);
            const joinedContests = (await db.collection(FBQueryPaths.getJoinedMatches(userID)).doc(matchID).get()).data();
            console.log('id', joinedContests.joinedPools);
            const pool = joinedContests.joinedPools.find((p) => p.poolId === contestID);
            const selectedTeam = (await db.collection(FBQueryPaths.getSelectedTeam(userID, matchID)).doc(pool.teamName).get()).data();
            const teamScore = calculateTeamScore(selectedTeam, allStudents)
            await db.collection(FBQueryPaths.getJoinedUsers(matchID, contestID)).doc(userID).update({
                quizTotalScore: teamScore,
            })
            return teamScore;
        }

        function calculateTeamScore(selectedStudents, allStudents) {
            var score = 0;
            selectedStudents.studentsId.forEach((id) => {
                var ss = allStudents.find((stu) => stu.id === id);
                if (selectedStudents.captainId == id) {
                    score += ss.quizMarks * 3 ?? 0;
                } else if (selectedStudents.viceCaptainId == id) {
                    score += ss.quizMarks * 2 ?? 0;
                } else if (selectedStudents.thirdBestId == id) {
                    score += ss.quizMarks * 1.5 ?? 0;
                } else {
                    score += ss.quizMarks ?? 0;
                }
            })
            return score;
        }

        async function updateRank() {
            console.log('update Rank please');
            const joinedUsers = await db.collection(FBQueryPaths.getJoinedUsers(matchID, contestID))
                .orderBy('quizTotalScore', 'desc')
                .get();
            const users = joinedUsers.docs.map(doc => doc.data());
            var index = 1;
            for (const user of users) {
                await db.collection(FBQueryPaths.getJoinedUsers(matchID, contestID)).doc(user.userId).update({
                    rank: index
                })
                index++;
            }
        }

        var i = 0;
        var unprocessedUser = [];
        for (const user of users) {
            i++;
            try {
                const score = await updateTeamTotalScore(user.userId);
                console.log(score);
            } catch (e) {
                unprocessedUser.push(user);
                console.log('Not able to update score for: ', user);
            }

            if (i === users.length) {
                console.log(unprocessedUser);
                if (unprocessedUser.length === 0) {
                    updateRank();
                } else {
                    var emsg = '';
                    unprocessedUser.forEach((u) => {
                        emsg = emsg + `{Name: ${u.name}, ID: ${u.userId}}, `
                    })
                    throw Error(` users: ${emsg}`);
                }

            }
        }
    }

    static async updateRanks(matchID, contestID) {
        const joinedUsers = await db.collection(FBQueryPaths.getJoinedUsers(matchID, contestID))
            .orderBy('quizTotalScore', 'desc')
            .get();
        const users = joinedUsers.docs.map(doc => doc.data());
        console.log(users);
        var index = 1;
        for (const user of users) {
            await db.collection(FBQueryPaths.getJoinedUsers(matchID, contestID)).doc(user.userId).update({
                rank: index
            })
            index++;
        }

    }

    static async distributePrizes(matchID, contestID) {
        const joinedUsers = await db.collection(FBQueryPaths.getJoinedUsers(matchID, contestID))
            .orderBy('quizTotalScore', 'desc')
            .get();
        const users = joinedUsers.docs.map(doc => doc.data());
        console.log(users);
        const contestData = await (db.collection(FBQueryPaths.getMatchContests(matchID))
            .doc(contestID)
            .get());
        const contest = contestData.data()
        const awards = contest.awards ?? null;
        const maxPrize = contest.maxPrize ?? null;
        const currentPrize = contest.currentPrize ?? maxPrize;

        function calculatePrize(percentage) {
            return parseInt((currentPrize * percentage) / 100);
        }

        if (awards) {
            console.log('contest data', currentPrize, contestData.data().awards);
            console.log(awards[0].from, awards[awards.length - 1].to);

            var unprocessedPrizes = [];
            for (var award of awards) {
                const prize = calculatePrize(award.prize);
                if (users.length >= award.from) {
                    var i = award.from;

                    while (i <= award.to && users.length >= i) {
                        var user = users[i - 1];
                        console.log(users.length, award.from);
                        console.log(i, prize, user.name, user.userId);
                        i++;
                        // distribute {prize} to users[i -1] from rank i - 1
                        var errorState = 0;
                        try {
                            await db.collection(FBQueryPaths.getJoinedUsers(matchID, contestID))
                                .doc(user.userId)
                                .update({
                                    prize: prize
                                })
                            errorState = 1;
                            const userDataSanp = await db.collection(`/users`)
                                .doc(user.userId)
                                .get();
                            const userData = userDataSanp.data();
                            console.log(userData.walletBalance, userData);
                            errorState = 2;
                            await db.collection(`/users`)
                                .doc(user.userId)
                                .update({
                                    walletBalance: userData.walletBalance + prize,
                                });
                            errorState = 3;
                            const paymentID = `TESTING-WIN-RANK-${i - 1}-${matchID}-${contestID}`;
                            await db.collection(`/users/${user.userId}/payments/`)
                                .doc(paymentID)
                                .set({
                                    amount: prize,
                                    contestName: contestID,
                                    isDebited: false,
                                    isSuccess: true,
                                    match: matchID,
                                    orderId: paymentID,
                                    paymentMethod: 'Wallet',
                                    time: firestore.Timestamp.now(),
                                    transactionID: paymentID,
                                });
                            errorState = 4;
                        } catch (e) {
                            console.log(e);
                            console.log('Payment Error: ', `${i - 1} at state ${errorState}`);
                            unprocessedPrizes.push(`${i - 1} at state ${errorState}`);
                        }
                    }

                }
            }

            if (unprocessedPrizes.length != 0) {
                var errorMsg = 'unable to distribute prizes for the ranks: ';
                errorMsg += unprocessedPrizes.toString();
                throw Error(` ranks: ${errorMsg}`);

            }

        } else {
            throw Error(`Contest with id: ${contestID} Do not have awards`);
        }


    }
}

export default FirestoreDatabase;