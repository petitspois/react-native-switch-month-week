import type { ITheme } from '../Constants/type';
export interface MonthWeekCalendarProps {
    /** Initial date in 'yyyy-MM-dd' format. Default = now */
    initialDate?: string;
    boxWidth?: number;
    onMonthChange?: (date: string) => void;
    theme?: ITheme;
}

export type Mode = 'week' | 'month';