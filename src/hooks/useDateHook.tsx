import moment from 'moment';

export default function useDateHook() {
  const getCurrentDate = () => {
    return moment().format('YYYY-MM-DD');
  };

  const getCurrentTime = () => {
    return moment().format('HH:mm A');
  };

  const getFormattedTime = (time: string | Date) => {
    if (typeof time === 'string') {
      const parsed = moment(time, [
        moment.ISO_8601,
        'HH:mm',
        'HH:mm:ss',
        'hh:mm A',
        'h:mm A',
      ]);
      return parsed.format('hh:mm A');
    }
    return moment(time).format('hh:mm A');
  };

  return { getCurrentDate, getCurrentTime, getFormattedTime };
}
