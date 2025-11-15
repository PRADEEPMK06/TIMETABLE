/**
 * Timetable Data Models & Interfaces
 */
export interface Staff {
  id: string;
  name: string;
  email?: string;
  subjects: string[];
  maxHoursPerDay?: number;
  unavailableSlots?: TimeSlot[];
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  type: "theory" | "lab" | "practical";
  duration: number;
  requiredPerWeek: number;
  year: number;
  semester: number;
}

export interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
  duration: number;
}

export interface ClassSchedule {
  id: string;
  subject: Subject;
  staff: Staff;
  timeSlot: TimeSlot;
  year: number;
  semester: number;
  section?: string;
  room?: string;
}

export interface TimetableConfig {
  academicYear: string;
  workingDays: string[];
  timeSlots: TimeSlot[];
  breakSlots?: TimeSlot[];
  years: YearConfig[];
}

export interface YearConfig {
  year: number;
  semesters: SemesterConfig[];
}

export interface SemesterConfig {
  semester: number;
  subjects: Subject[];
  sections: string[];
  totalSubjects: number;
  totalLabs: number;
  weightage: number;
}

export interface TimetableData {
  config: TimetableConfig;
  staff: Staff[];
  subjects: Subject[];
  schedule: ClassSchedule[];
}

export interface ConflictCheck {
  hasConflict: boolean;
  // ... other fields
}
