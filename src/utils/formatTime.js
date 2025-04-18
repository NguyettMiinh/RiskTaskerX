export const formatTime = (data) => {
  const date = new Date(data);
  let month = date.getMonth() + 1;
  let day = date.getDate();
  if (day < 10) {
    day = "0" + day;
  }
  if (month < 10) {
    month = "0" + month;
  }
  let hours = date.getHours();
  let minutes = date.getMinutes();

  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  const dateTimeString =
    hours + ":" + minutes + " " + day + "-" + month + "-" + date.getFullYear();
  return dateTimeString;
};
