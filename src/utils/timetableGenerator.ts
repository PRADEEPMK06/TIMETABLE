import { TimetableConfig, Staff, Subject, ClassSchedule, TimeSlot, ConflictCheck } from "@/types/timetable";

export class TimetableGenerator {
  private config: TimetableConfig;
  private staff: Staff[];
  private subjects: Subject[];
  private schedule: ClassSchedule[] = [];

  constructor(config: TimetableConfig, staff: Staff[], subjects: Subject[]) {
    this.config = config;
    this.staff = staff;
    this.subjects = subjects;
  }

  generateTimetable(): ClassSchedule[] {
    this.schedule = [];
    
    // Sort subjects by priority (year, then labs, then theory)
    const sortedSubjects = this.prioritizeSubjects();
    
    for (const subject of sortedSubjects) {
      this.scheduleSubject(subject);
    }

    return this.schedule;
  }

  private prioritizeSubjects(): Subject[] {
    return this.subjects.sort((a, b) => {
      // Higher year gets priority
      if (a.year !== b.year) return b.year - a.year;
      
      // Labs get priority over theory
      if (a.type !== b.type) {
        if (a.type === 'lab') return -1;
        if (b.type === 'lab') return 1;
      }
      
      // More required hours per week gets priority
      return b.requiredPerWeek - a.requiredPerWeek;
    });
  }

  private scheduleSubject(subject: Subject): void {
    const qualifiedStaff = this.getQualifiedStaff(subject);
    
    if (qualifiedStaff.length === 0) {
      console.warn(`No qualified staff found for subject: ${subject.name}`);
      return;
    }

    // Find the best staff member with least conflicts
    const bestStaff = this.findBestStaff(qualifiedStaff, subject);
    
    // Schedule the required hours for this subject
    for (let i = 0; i < subject.requiredPerWeek; i++) {
      const timeSlot = this.findAvailableTimeSlot(bestStaff, subject);
      
      if (timeSlot) {
        const classSchedule: ClassSchedule = {
          id: `${subject.id}-${i}-${Date.now()}`,
          subject,
          staff: bestStaff,
          timeSlot,
          year: subject.year,
          semester: subject.semester,
          section: 'A', // Default section
        };

        this.schedule.push(classSchedule);
      }
    }
  }

  private getQualifiedStaff(subject: Subject): Staff[] {
    return this.staff.filter(staff => 
      staff.subjects.includes(subject.code) || 
      staff.subjects.includes(subject.name)
    );
  }

  private findBestStaff(qualifiedStaff: Staff[], subject: Subject): Staff {
    // Simple algorithm: pick staff with least current assignments
    return qualifiedStaff.reduce((best, current) => {
      const bestCount = this.getStaffAssignmentCount(best);
      const currentCount = this.getStaffAssignmentCount(current);
      return currentCount < bestCount ? current : best;
    });
  }

  private getStaffAssignmentCount(staff: Staff): number {
    return this.schedule.filter(schedule => schedule.staff.id === staff.id).length;
  }

  private findAvailableTimeSlot(staff: Staff, subject: Subject): TimeSlot | null {
    for (const day of this.config.workingDays) {
      for (const timeSlot of this.config.timeSlots) {
        const slotWithDay = { ...timeSlot, day };
        
        if (this.isSlotAvailable(staff, subject, slotWithDay)) {
          return slotWithDay;
        }
      }
    }
    return null;
  }

  private isSlotAvailable(staff: Staff, subject: Subject, timeSlot: TimeSlot): boolean {
    // Check staff availability
    const staffConflict = this.schedule.some(schedule => 
      schedule.staff.id === staff.id &&
      schedule.timeSlot.day === timeSlot.day &&
      this.isTimeOverlapping(schedule.timeSlot, timeSlot)
    );

    if (staffConflict) return false;

    // Check student conflicts (same year/semester)
    const studentConflict = this.schedule.some(schedule =>
      schedule.year === subject.year &&
      schedule.semester === subject.semester &&
      schedule.timeSlot.day === timeSlot.day &&
      this.isTimeOverlapping(schedule.timeSlot, timeSlot)
    );

    if (studentConflict) return false;

    // Check if it's a break slot
    const isBreakTime = this.config.breakSlots?.some(breakSlot =>
      this.isTimeOverlapping(breakSlot, timeSlot)
    );

    return !isBreakTime;
  }

  private isTimeOverlapping(slot1: TimeSlot, slot2: TimeSlot): boolean {
    const start1 = this.timeToMinutes(slot1.startTime);
    const end1 = this.timeToMinutes(slot1.endTime);
    const start2 = this.timeToMinutes(slot2.startTime);
    const end2 = this.timeToMinutes(slot2.endTime);

    return start1 < end2 && start2 < end1;
  }

  private timeToMinutes(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  }

  checkConflicts(): ConflictCheck[] {
    const conflicts: ConflictCheck[] = [];
    
    for (let i = 0; i < this.schedule.length; i++) {
      for (let j = i + 1; j < this.schedule.length; j++) {
        const schedule1 = this.schedule[i];
        const schedule2 = this.schedule[j];
        
        if (schedule1.timeSlot.day === schedule2.timeSlot.day &&
            this.isTimeOverlapping(schedule1.timeSlot, schedule2.timeSlot)) {
          
          // Staff conflict
          if (schedule1.staff.id === schedule2.staff.id) {
            conflicts.push({
              hasConflict: true,
              conflictType: 'staff',
              message: `Staff ${schedule1.staff.name} has conflicting classes at ${schedule1.timeSlot.startTime} on ${schedule1.timeSlot.day}`
            });
          }
          
          // Student conflict (same year/semester)
          if (schedule1.year === schedule2.year && schedule1.semester === schedule2.semester) {
            conflicts.push({
              hasConflict: true,
              conflictType: 'student',
              message: `Year ${schedule1.year} Semester ${schedule1.semester} has conflicting classes at ${schedule1.timeSlot.startTime} on ${schedule1.timeSlot.day}`
            });
          }
        }
      }
    }
    
    return conflicts;
  }

  getScheduleByDay(day: string): ClassSchedule[] {
    return this.schedule
      .filter(schedule => schedule.timeSlot.day === day)
      .sort((a, b) => this.timeToMinutes(a.timeSlot.startTime) - this.timeToMinutes(b.timeSlot.startTime));
  }

  getScheduleByStaff(staffId: string): ClassSchedule[] {
    return this.schedule.filter(schedule => schedule.staff.id === staffId);
  }

  getScheduleByYear(year: number): ClassSchedule[] {
    return this.schedule.filter(schedule => schedule.year === year);
  }
}