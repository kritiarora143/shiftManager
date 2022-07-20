const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export const addFormattedDate = (data) => (
    data.sort((a, b) => a.endTime - b.endTime)
        .sort((a, b) => a.startTime - b.startTime)
        .map(item => {
            let today = monthNames[new Date().getMonth()] + " " + new Date().getDate()
            let tomorrow = monthNames[new Date(new Date().getTime() + 24 * 60 * 60 * 1000).getMonth()] + " " + new Date(new Date().getTime() + 24 * 60 * 60 * 1000).getDate()
            let formattedDate = monthNames[new Date(item.startTime).getMonth()] + " " + new Date(item.startTime).getDate()
            if (formattedDate == today) {
                item.formattedDate = "Today"
            } else if (formattedDate == tomorrow) {
                item.formattedDate = "Tomorrow"
            } else {
                item.formattedDate = formattedDate
            }
            return (item)
        })
)

export const groupBy = (arr, key) => {
    return arr.reduce((obj, item) => {
        (obj[item[key]] = obj[item[key]] || []).push(item);
        return obj;
    }, {});
};

export const formatTime = (mils) => (
    (new Date(mils).getHours() < 10 ? `0${new Date(mils).getHours()}` : `${new Date(mils).getHours()}`) + ':' + (new Date(mils).getMinutes() < 10 ? `0${new Date(mils).getMinutes()}` : `${new Date(mils).getMinutes()}`)
)

export const getTimeDeltaHrs = (dt1, dt2) => {
    var diff = (new Date(dt2).getTime() - new Date(dt1).getTime()) / 1000;
    diff /= (60 * 60);
    return Math.abs(Math.round(diff));
}

