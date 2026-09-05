export type HijriDateResponse = {
  data: {
    gregorian: {
      date: string;
      formatted: string;
      day_of_week: string;
      day: number;
      month: number;
      month_name: string;
      year: number;
    };
    hijri: {
      date: string;
      formatted: string;
      day: number;
      month: number;
      month_name: string;
      month_name_arabic: string;
      year: number;
      era: string;
    };
  };
};
