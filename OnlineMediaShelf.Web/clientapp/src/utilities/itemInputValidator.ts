export class ItemInputValidator {
  static isValidBarcode(barcode: string) {
    return barcode.split('').reduce(function (p, v, i) {
      return i % 2 == 0 ? p + parseInt(v) : p + 3 * parseInt(v);
    }, 0) % 10 == 0;
  }

  static validateBarcode(barcode: string | undefined): string | undefined {
    if (barcode?.length !== 13)
      return "The barcode must be 13 digits long.";

    if (!this.isValidBarcode(barcode!))
      return "The barcode must have a valid check digit.";
  }

  static validateTitle(title: string | undefined): string | undefined {
    if (title === undefined || title.length === 0)
      return "The field 'Title' is required.";

    if (title.length > 128)
      return "The title mustn't be longer than 128 characters.";
  }

  static validateDescription(description: string | undefined): string | undefined {
    if (description === undefined)
      return undefined;

    if (description.length > 2048)
      return "The description mustn't be longer than 2048 characters.";

  }

  static validateAuthors(authors: string[] | undefined): string | undefined {
    if (authors?.some(author => author.length > 64))
      return "No author may be longer than 64 characters.";
  }

  static validateFormat(format: string | undefined): string | undefined {
    if (format?.length === undefined || format?.length === 0)
      return "The field 'Format' is required.";

    if (format?.length > 20)
      return "The format mustn't be longer than 20 characters.";
  }

  static validateDate(year: string, month: string, day: string): {
    releaseYearError: string | undefined,
    releaseMonthError: string | undefined,
    releaseDayError: string | undefined,
  } {
    let releaseYearError: string | undefined;
    let releaseMonthError: string | undefined;
    let releaseDayError: string | undefined;

    const yearInt = parseInt(year);
    const monthInt = parseInt(month);
    const dayInt = parseInt(day);

    if (!month && (day)) releaseMonthError = "Month is required.";
    if (!year && (month || year)) releaseYearError = "Year is required.";

    if (year && (isNaN(yearInt) || yearInt < 1)) releaseYearError = "Invalid year.";
    if (month && (isNaN(monthInt) || monthInt < 1 || monthInt > 12)) releaseMonthError = "Invalid month.";
    if (day && (isNaN(dayInt) || dayInt < 1 || dayInt > 31)) releaseDayError = "Invalid day.";

    if (yearInt && monthInt && dayInt) {
      const date = new Date(yearInt, monthInt - 1, dayInt);
      if (date.getFullYear() !== yearInt || date.getMonth() !== monthInt - 1 || date.getDate() !== dayInt) {
        releaseYearError = releaseMonthError = releaseDayError = "Invalid date.";
      }
    }

    return {
      releaseYearError: releaseYearError,
      releaseMonthError: releaseMonthError,
      releaseDayError: releaseDayError
    }
  }
}