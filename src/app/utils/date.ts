
export function formatDateToHour(date: Date): string {
  let mon: any = date.getMonth() + 1;
  mon = mon < 10 ? '0' + mon : '' + mon;
  let day: any = date.getDate();
  day = day < 10 ? '0' + day : '' + day;
  let hour: any = date.getHours();
  hour = hour < 10 ? '0' + hour : '' + hour;
  return `${date.getFullYear()}/${mon}/${day} ${hour}:00`;
}

export function formatDateToHourAndMinute(date: Date): string {
  let mon: any = date.getMonth() + 1;
  mon = mon < 10 ? '0' + mon : '' + mon;
  let day: any = date.getDate();
  day = day < 10 ? '0' + day : '' + day;
  let hour: any = date.getHours();
  hour = hour < 10 ? '0' + hour : '' + hour;
  let min: any = date.getMinutes();
  min = min < 10 ? '0' + min : '' + min;
  return `${date.getFullYear()}/${mon}/${day} ${hour}:${min}`;
}