import { useState } from "react";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/dashboard/Hero";
import { StaffForm } from "@/components/forms/StaffForm";
import { SubjectForm } from "@/components/forms/SubjectForm";
import { ConfigForm } from "@/components/forms/ConfigForm";
import { TimetableDisplay } from "@/components/timetable/TimetableDisplay";
import { TimetableGenerator } from "@/utils/timetableGenerator";
import { exportTimetableToPDF, exportStaffTimetableToPDF } from "@/utils/pdfExport";
import { TimetableData, Staff, Subject, TimetableConfig, ClassSchedule, ConflictCheck } from "@/types/timetable";

const Index = () => {
  const [currentStep, setCurrentStep] = useState<string>("dashboard");
  const [timetableData, setTimetableData] = useState<TimetableData>({
    config: {
      academicYear: "2024-2025",
      workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      timeSlots: [
        { day: "", startTime: "09:00", endTime: "10:00", duration: 1 },
        { day: "", startTime: "10:00", endTime: "11:00", duration: 1 },
        { day: "", startTime: "11:15", endTime: "12:15", duration: 1 },
        { day: "", startTime: "12:15", endTime: "13:15", duration: 1 },
        { day: "", startTime: "14:15", endTime: "15:15", duration: 1 },
        { day: "", startTime: "15:15", endTime: "16:15", duration: 1 },
      ],
      breakSlots: [
        { day: "Monday", startTime: "11:00", endTime: "11:15", duration: 0.25 },
        { day: "Tuesday", startTime: "11:00", endTime: "11:15", duration: 0.25 },
        { day: "Wednesday", startTime: "11:00", endTime: "11:15", duration: 0.25 },
        { day: "Thursday", startTime: "11:00", endTime: "11:15", duration: 0.25 },
        { day: "Friday", startTime: "11:00", endTime: "11:15", duration: 0.25 },
        { day: "Monday", startTime: "13:15", endTime: "14:15", duration: 1 },
        { day: "Tuesday", startTime: "13:15", endTime: "14:15", duration: 1 },
        { day: "Wednesday", startTime: "13:15", endTime: "14:15", duration: 1 },
        { day: "Thursday", startTime: "13:15", endTime: "14:15", duration: 1 },
        { day: "Friday", startTime: "13:15", endTime: "14:15", duration: 1 },
      ],
      years: []
    },
    staff: [],
    subjects: [],
    schedule: []
  });

  const [generatedSchedule, setGeneratedSchedule] = useState<ClassSchedule[]>([]);
  const [conflicts, setConflicts] = useState<ConflictCheck[]>([]);

  const handleNavigate = (step: string) => {
    setCurrentStep(step);
  };

  const handleGetStarted = () => {
    setCurrentStep("setup");
  };

  const handleStaffChange = (staff: Staff[]) => {
    setTimetableData(prev => ({
      ...prev,
      staff
    }));
  };

  const handleSubjectsChange = (subjects: Subject[]) => {
    setTimetableData(prev => ({
      ...prev,
      subjects
    }));
  };

  const handleConfigChange = (config: TimetableConfig) => {
    setTimetableData(prev => ({
      ...prev,
      config
    }));
  };

  const generateTimetable = () => {
    if (timetableData.staff.length === 0) {
      toast.error("Please add at least one staff member");
      return;
    }

    if (timetableData.subjects.length === 0) {
      toast.error("Please add at least one subject");
      return;
    }

    if (timetableData.config.timeSlots.length === 0) {
      toast.error("Please configure time slots");
      return;
    }

    toast.loading("Generating timetable...");

    try {
      const generator = new TimetableGenerator(
        timetableData.config,
        timetableData.staff,
        timetableData.subjects
      );

      const schedule = generator.generateTimetable();
      const conflictChecks = generator.checkConflicts();

      setGeneratedSchedule(schedule);
      setConflicts(conflictChecks);
      setCurrentStep("generate");

      toast.dismiss();
      if (conflictChecks.length === 0) {
        toast.success("Timetable generated successfully with no conflicts!");
      } else {
        toast.warning(`Timetable generated with ${conflictChecks.length} conflicts`);
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to generate timetable. Please check your configuration.");
      console.error("Timetable generation error:", error);
    }
  };

  const handleRegenerateSchedule = () => {
    generateTimetable();
  };

  const handleExportPDF = () => {
    if (generatedSchedule.length === 0) {
      toast.error("No timetable to export");
      return;
    }

    try {
      // Export for Year 1 Semester 1 by default
      exportTimetableToPDF(generatedSchedule, timetableData.config, 1, 1);
      toast.success("Timetable exported to PDF successfully!");
    } catch (error) {
      toast.error("Failed to export PDF");
      console.error("PDF export error:", error);
    }
  };

  const getUniqueSubjectCodes = (): string[] => {
    return Array.from(new Set([
      ...timetableData.subjects.map(s => s.code),
      ...timetableData.subjects.map(s => s.name)
    ]));
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "dashboard":
        return <Hero onGetStarted={handleGetStarted} />;
      
      case "setup":
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">Setup Your Timetable</h1>
                <p className="text-muted-foreground">
                  Configure staff, subjects, and schedule preferences
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <ConfigForm 
                    config={timetableData.config}
                    onConfigChange={handleConfigChange}
                  />
                </div>
                <div className="lg:col-span-1">
                  <SubjectForm 
                    subjects={timetableData.subjects}
                    onSubjectsChange={handleSubjectsChange}
                  />
                </div>
                <div className="lg:col-span-1">
                  <StaffForm 
                    staff={timetableData.staff}
                    onStaffChange={handleStaffChange}
                    subjects={getUniqueSubjectCodes()}
                  />
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={generateTimetable}
                  className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  Generate Timetable
                </button>
              </div>
            </div>
          </div>
        );

      case "generate":
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <TimetableDisplay
              schedule={generatedSchedule}
              config={timetableData.config}
              conflicts={conflicts}
              onRegenerateSchedule={handleRegenerateSchedule}
              onExportPDF={handleExportPDF}
            />
          </div>
        );

      case "export":
        return (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">Export Options</h1>
              <p className="text-muted-foreground mb-8">
                Choose how you want to export your timetable
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 border rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">Student Timetable</h3>
                  <p className="text-muted-foreground mb-4">
                    Export timetables for each year and semester
                  </p>
                  <button
                    onClick={handleExportPDF}
                    className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground px-6 py-2 rounded-lg font-semibold"
                  >
                    Export Student PDF
                  </button>
                </div>
                
                <div className="p-6 border rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">Staff Timetable</h3>
                  <p className="text-muted-foreground mb-4">
                    Export individual staff timetables
                  </p>
                  <button
                    onClick={() => toast.info("Feature coming soon!")}
                    className="bg-gradient-to-r from-secondary to-muted text-secondary-foreground px-6 py-2 rounded-lg font-semibold"
                  >
                    Export Staff PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <Hero onGetStarted={handleGetStarted} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar currentStep={currentStep} onNavigate={handleNavigate} />
      {renderCurrentStep()}
    </div>
  );
};

export default Index;
