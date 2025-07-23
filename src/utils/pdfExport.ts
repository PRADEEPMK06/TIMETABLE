import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ClassSchedule, TimetableConfig } from '@/types/timetable';

export const exportTimetableToPDF = (
  schedule: ClassSchedule[],
  config: TimetableConfig,
  year: number,
  semester: number
) => {
  const doc = new jsPDF('landscape');
  
  // Title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Academic Timetable', 20, 20);
  
  // Academic info
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Academic Year: ${config.academicYear}`, 20, 30);
  doc.text(`Year: ${year} | Semester: ${semester}`, 20, 38);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 46);

  // Filter schedule for the selected year and semester
  const filteredSchedule = schedule.filter(
    s => s.year === year && s.semester === semester
  );

  // Prepare data for the table
  const tableData: any[][] = [];
  
  // Header row
  const headers = ['Time', ...config.workingDays];
  
  // Create rows for each time slot
  config.timeSlots.forEach(timeSlot => {
    const row: any[] = [`${timeSlot.startTime} - ${timeSlot.endTime}`];
    
    config.workingDays.forEach(day => {
      const classSchedule = filteredSchedule.find(s => 
        s.timeSlot.day === day && 
        s.timeSlot.startTime === timeSlot.startTime
      );
      
      if (classSchedule) {
        row.push(`${classSchedule.subject.name}\n${classSchedule.subject.code}\n${classSchedule.staff.name}`);
      } else {
        row.push('');
      }
    });
    
    tableData.push(row);
  });

  // Generate table
  autoTable(doc, {
    head: [headers],
    body: tableData,
    startY: 55,
    styles: {
      fontSize: 8,
      cellPadding: 4,
      overflow: 'linebreak',
      valign: 'middle',
      halign: 'center'
    },
    headStyles: {
      fillColor: [99, 102, 241], // Primary color
      textColor: 255,
      fontStyle: 'bold'
    },
    bodyStyles: {
      textColor: 50
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    columnStyles: {
      0: { 
        cellWidth: 30,
        halign: 'center',
        fontStyle: 'bold'
      }
    },
    margin: { top: 55, left: 10, right: 10 }
  });

  // Add statistics section
  const finalY = (doc as any).lastAutoTable.finalY + 20;
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Statistics', 20, finalY);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const totalClasses = filteredSchedule.length;
  const uniqueStaff = new Set(filteredSchedule.map(s => s.staff.id)).size;
  const uniqueSubjects = new Set(filteredSchedule.map(s => s.subject.id)).size;
  const theoryClasses = filteredSchedule.filter(s => s.subject.type === 'theory').length;
  const labClasses = filteredSchedule.filter(s => s.subject.type === 'lab').length;
  const practicalClasses = filteredSchedule.filter(s => s.subject.type === 'practical').length;
  
  doc.text(`Total Classes: ${totalClasses}`, 20, finalY + 10);
  doc.text(`Staff Members: ${uniqueStaff}`, 20, finalY + 18);
  doc.text(`Subjects: ${uniqueSubjects}`, 20, finalY + 26);
  doc.text(`Theory Classes: ${theoryClasses}`, 120, finalY + 10);
  doc.text(`Lab Classes: ${labClasses}`, 120, finalY + 18);
  doc.text(`Practical Classes: ${practicalClasses}`, 120, finalY + 26);

  // Add subject list
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Subject List', 220, finalY);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  
  const subjects = Array.from(new Set(filteredSchedule.map(s => s.subject)));
  subjects.forEach((subject, index) => {
    const yPos = finalY + 10 + (index * 8);
    if (yPos < 190) { // Check if it fits on the page
      doc.text(`${subject.code}: ${subject.name} (${subject.type})`, 220, yPos);
    }
  });

  // Save the PDF
  const filename = `timetable_year${year}_sem${semester}_${config.academicYear.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
  doc.save(filename);
};

export const exportStaffTimetableToPDF = (
  schedule: ClassSchedule[],
  config: TimetableConfig,
  staffId: string,
  staffName: string
) => {
  const doc = new jsPDF('landscape');
  
  // Title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Staff Timetable', 20, 20);
  
  // Staff info
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Staff: ${staffName}`, 20, 30);
  doc.text(`Academic Year: ${config.academicYear}`, 20, 38);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 46);

  // Filter schedule for the selected staff
  const staffSchedule = schedule.filter(s => s.staff.id === staffId);

  // Prepare data for the table
  const tableData: any[][] = [];
  
  // Header row
  const headers = ['Time', ...config.workingDays];
  
  // Create rows for each time slot
  config.timeSlots.forEach(timeSlot => {
    const row: any[] = [`${timeSlot.startTime} - ${timeSlot.endTime}`];
    
    config.workingDays.forEach(day => {
      const classSchedule = staffSchedule.find(s => 
        s.timeSlot.day === day && 
        s.timeSlot.startTime === timeSlot.startTime
      );
      
      if (classSchedule) {
        row.push(`${classSchedule.subject.name}\nYear ${classSchedule.year} Sem ${classSchedule.semester}\n${classSchedule.subject.code}`);
      } else {
        row.push('');
      }
    });
    
    tableData.push(row);
  });

  // Generate table
  autoTable(doc, {
    head: [headers],
    body: tableData,
    startY: 55,
    styles: {
      fontSize: 8,
      cellPadding: 4,
      overflow: 'linebreak',
      valign: 'middle',
      halign: 'center'
    },
    headStyles: {
      fillColor: [99, 102, 241],
      textColor: 255,
      fontStyle: 'bold'
    },
    bodyStyles: {
      textColor: 50
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    columnStyles: {
      0: { 
        cellWidth: 30,
        halign: 'center',
        fontStyle: 'bold'
      }
    },
    margin: { top: 55, left: 10, right: 10 }
  });

  // Save the PDF
  const filename = `staff_timetable_${staffName.replace(/[^a-zA-Z0-9]/g, '_')}_${config.academicYear.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
  doc.save(filename);
};