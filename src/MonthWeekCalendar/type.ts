export interface MonthWeekCalendarProps {
    /** Initial date in 'yyyy-MM-dd' format. Default = now */
    initialDate?: string;
    boxWidth?: number;
    onMonthChange?: (date: string) => void;
}

export type Mode = 'week' | 'month';