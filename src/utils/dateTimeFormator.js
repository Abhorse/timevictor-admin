import firebase, { firestore } from 'firebase'

class FormatDateTime {
    static format(date) {
        new Intl.DateTimeFormat('en-US').format(date)

        // console.log('date', Date(date));
        // console.log(new Intl.DateTimeFormat('en-US').format(date))
        return new Intl.DateTimeFormat('en-US', {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit"
        }).format(date);
    }

    static isUpcoming(date) {
        return date - firestore.Timestamp.now() > 0 ? true : false;
    }

    static isLive(date, duration, endTime) {
        const isStarted = firestore.Timestamp.now() - date > 0 ? true : false;
        const isClosed = endTime - firestore.Timestamp.now() > 0 ? false : true;
        return isStarted && !isClosed;
    }

    static isClosed(date) {
        return date - firestore.Timestamp.now() > 0 ? false : true;
    }
}

export default FormatDateTime;