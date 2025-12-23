export class DateUtils {

  static isBeforeToday(date: Date | string): boolean {
    const inputDate = this.parseLocalDate(date);
    const today = this.addDays(new Date(), 0);

    // resetăm ora
    inputDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return inputDate < today;
  }

  static isBeforeOrToday(date: Date | string): boolean {
    const inputDate = this.parseLocalDate(date);

    const today = this.addDays(new Date(), 0);
    today.setHours(0, 0, 0, 0);

    return inputDate < today;
  }

  static parseLocalDate(date: Date | string): Date {
    if (date instanceof Date) {
      return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
    }
    // string: YYYY-MM-DD
    const [y, m, d] = date.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  static addDays(date: Date, days: number = 1): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }


}
