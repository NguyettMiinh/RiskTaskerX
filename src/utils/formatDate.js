
export const formatDate = (data) => {
    const date = new Date(data);
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if (day < 10) {
        day = "0" + day;
    }
    console.log("m",month);
    if (month < 10){
        month = "0" + month;

    }
    const dateTimeString = day + "-" + month + "-" + date.getFullYear();
    return dateTimeString;
    };
