import moment from 'moment';

export default function useDateHook() {
  const getCurrentDate = () => {
    return moment().format('YYYY-MM-DD');
  };

  const getCurrentTime = () => {
    return moment().format('HH:mm A');
  };

  const getFormattedTime = (time: string) => {
    return moment(time, 'HH:mm').format('hh:mm A');
  };

  return { getCurrentDate, getCurrentTime, getFormattedTime };
}
