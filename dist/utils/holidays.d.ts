declare function getKoreanHolidays(year: number): Map<string, string>;
declare function getSemesterRange(year: number, semester: "FIRST" | "SECOND"): {
    start: Date;
    end: Date;
};
declare function generateWeekdays(start: Date, end: Date): Date[];

export { generateWeekdays, getKoreanHolidays, getSemesterRange };
