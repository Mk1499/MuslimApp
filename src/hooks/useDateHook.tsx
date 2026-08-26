import moment from 'moment';

export default function useDateHook() {
  const getCurrentDate = () => {
    return moment().format('YYYY-MM-DD');
  };

  const getCurrentTime = () => {
    return moment().format('HH:mm A');
  };

  return { getCurrentDate, getCurrentTime };
}
