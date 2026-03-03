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

  static isSlotBeforeNow(
    day: Date | string,
    hour: number,
    minute: number
  ): boolean {
    const slotDate = this.parseLocalDate(day);
    slotDate.setHours(hour, minute, 0, 0);
    const nowRounded = DateUtils.roundDownToQuarter();

    return slotDate.getTime() < nowRounded.getTime();
  }

  static roundDownToQuarter(date: Date = new Date()): Date {
    const d = new Date(date.getTime());

    const minutes = d.getMinutes();
    const roundedMinutes = Math.floor(minutes / 15) * 15;

    d.setMinutes(roundedMinutes, 0, 0); // reset seconds & ms

    return d;
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

  static isToday(date: Date | string): boolean {
    const inputDate = this.parseLocalDate(date);

    const today = this.addDays(new Date(), 0);
    today.setHours(0, 0, 0, 0);

    return inputDate.getDay() == today.getDay();
  }

}
