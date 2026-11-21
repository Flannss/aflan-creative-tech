export interface AgeDetails {
  age: number;
  birthYear: number;
  daysUntilNextBirthday: number;
  isBirthdayToday: boolean;
}

/**
 * Calculates exact calendar-based age from an ISO YYYY-MM-DD date string.
 * Never approximates via simple year subtraction.
 */
export function calculateExactAge(
  isoBirthDate: string,
  referenceDate: Date = new Date(),
): AgeDetails {
  const [yearStr, monthStr, dayStr] = isoBirthDate.split('-');
  const birthYear = Number(yearStr);
  const birthMonthIndex = Number(monthStr) - 1; // 0-indexed
  const birthDay = Number(dayStr);

  const currentYear = referenceDate.getFullYear();
  const currentMonthIndex = referenceDate.getMonth();
  const currentDay = referenceDate.getDate();

  let age = currentYear - birthYear;
  const hasHadBirthdayThisYear =
    currentMonthIndex > birthMonthIndex ||
    (currentMonthIndex === birthMonthIndex && currentDay >= birthDay);

  if (!hasHadBirthdayThisYear) {
    age -= 1;
  }

  const isBirthdayToday =
    currentMonthIndex === birthMonthIndex && currentDay === birthDay;

  const todayMidnight = new Date(currentYear, currentMonthIndex, currentDay);
  let nextBirthday = new Date(currentYear, birthMonthIndex, birthDay);
  if (nextBirthday < todayMidnight) {
    nextBirthday = new Date(currentYear + 1, birthMonthIndex, birthDay);
  }

  const msPerDay = 1000 * 60 * 60 * 24;
  const daysUntilNextBirthday = Math.round(
    (nextBirthday.getTime() - todayMidnight.getTime()) / msPerDay,
  );

  return {
    age,
    birthYear,
    daysUntilNextBirthday,
    isBirthdayToday,
  };
}
