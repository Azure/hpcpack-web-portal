export interface DataPoint { Key: string, Value: number };

function normalizeByHour(time: string): Date {
  let t = Date.parse(time);
  let d = new Date(t);
  d.setMinutes(0, 0, 0);
  return d;
}

//Get the first data point in each hour
//Elements in values are already ordered by time(Key) ascendingly.
export function sampleFirstInEachHour(values: DataPoint[]): DataPoint[] {
  let date: Date = new Date();
  let result: DataPoint[] = [];
  for (let v of values) {
    let d = normalizeByHour(v.Key);
    if (d.getTime() != date.getTime()) {
      result.push({ Key: v.Key, Value: v.Value });
      date = d;
    }
  }
  return result;
}

//Get the last data point in each hour
//Elements in values are already ordered by time(Key) ascendingly.
export function sampleLastInEachHour(values: DataPoint[]): DataPoint[] {
  let value: DataPoint = values[0];
  let date: Date = normalizeByHour(value.Key);
  let result: DataPoint[] = [];
  for (let v of values) {
    let d = normalizeByHour(v.Key);
    if (d.getTime() != date.getTime()) {
      result.push({ Key: value.Key, Value: value.Value });
      date = d;
    }
    value = v;
  }
  let last = values[values.length - 1];
  result.push({ Key: last.Key, Value: last.Value });
  return result;
}

export function formatDateToHour(date: Date): string {
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:00`;
}

export function formatDateToHourAndMinute(date: Date): string {
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
}