// 格式化时间
function getFormatDate(nowTimeStamp) {
  let defaultYear = nowTimeStamp.getFullYear();
  let defaultMonth = nowTimeStamp.getMonth()+1;
  let defaultDay = nowTimeStamp.getDate();
  let defaultHours = nowTimeStamp.getHours();
  let defaultMinutes = nowTimeStamp.getMinutes();

  if (defaultMonth < 10) {
    defaultMonth = '0' + defaultMonth;
  }
  if (defaultDay < 10) {
    defaultDay = '0' + defaultDay;
  }
  if (defaultHours < 10) {
    defaultHours = '0' + defaultHours;
  }
  if (defaultMinutes < 10) {
    defaultMinutes = '0' + defaultMinutes;
  }

  return defaultYear + '-' + defaultMonth + '-' + defaultDay + ' ' + defaultHours + ':' + defaultMinutes;
}

export default getFormatDate;