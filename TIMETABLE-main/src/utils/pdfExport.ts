/**
 * PDF Export Utility for Timetable
 */
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ClassSchedule, TimetableConfig } from "@/types/timetable";

export const exportTimetableToPDF = (schedule: ClassSchedule[], config: TimetableConfig, year: number, semester: number) => {
  const doc = new jsPDF({ orientation: "landscape" });
  doc.setFontSize(18);
  doc.text("Academic Timetable", 20, 20);
  doc.setFontSize(12);
  doc.text(`Academic Year: ${config.academicYear}`, 20, 30);
  doc.text(`Year: ${year} Semester: ${semester}`, 20, 38);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 46);

  // Table and header logic...
  autoTable(doc, {
    head: [["Time", ...config.workingDays]],
    body: [
      // fill with schedule data rows...
    ],
    startY: 60
  });

  doc.save("timetable.pdf");
};
