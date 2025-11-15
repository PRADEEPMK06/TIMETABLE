/**
 * College Timetable Generator: Main Entry
 */
import React, { useState } from "react";
import { toast } from "sonner";
import { Navbar, Hero, StaffForm, SubjectForm, ConfigForm, TimetableDisplay } from "@/components";
import { TimetableGenerator } from "@/utils/timetableGenerator";
import { exportTimetableToPDF } from "@/utils/pdfExport";
import { TimetableData, Staff, Subject, TimetableConfig, ClassSchedule, ConflictCheck } from "@/types/timetable";

const Index: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<string>("dashboard");
  const [timetableData, setTimetableData] = useState<TimetableData>({ config: {/* ... */}, staff: [], subjects: [], schedule: [] });
  const [generatedSchedule, setGeneratedSchedule] = useState<ClassSchedule[]>([]);
  const [conflicts, setConflicts] = useState<ConflictCheck[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleNavigate = (step: string) => setCurrentStep(step);

  const generateTimetable = () => {
    if (!timetableData.staff.length || !timetableData.subjects.length) {
      return toast.error("Staff and subjects are required before generating a timetable.");
    }
    setLoading(true); toast.loading("Generating timetable, please wait...");
    try {
      const generator = new TimetableGenerator(timetableData.config, timetableData.staff, timetableData.subjects);
      const schedule = generator.generateTimetable();
      const conflicts = generator.checkConflicts();
      setGeneratedSchedule(schedule);
      setConflicts(conflicts);
      setCurrentStep("generate");
      toast.dismiss();
      toast.success(conflicts.length ? `Generated with ${conflicts.length} conflict(s)` : "Timetable generated successfully.");
    } catch (err) {
      toast.dismiss(); toast.error("Failed to generate timetable.");
      console.error(err);
    }
    setLoading(false);
  };

  const handleExportPDF = () => {
    if (!generatedSchedule.length) return toast.error("Nothing to export.");
    try {
      exportTimetableToPDF(generatedSchedule, timetableData.config, 1, 1);
      toast.success("PDF export successful.");
    } catch (err) {
      toast.error("PDF export failed."); console.error(err);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Conditional rendering for each workflow step */}
      {/* <Hero /> <ConfigForm /> <StaffForm /> <SubjectForm /> <TimetableDisplay /> etc. */}
    </main>
  );
};

export default Index;
