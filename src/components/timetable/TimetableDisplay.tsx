import { useState } from "react";
import { Edit, Download, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClassSchedule, TimetableConfig, ConflictCheck } from "@/types/timetable";
import { TimetableCell } from "./TimetableCell";

interface TimetableDisplayProps {
  schedule: ClassSchedule[];
  config: TimetableConfig;
  conflicts: ConflictCheck[];
  onEditSchedule?: (schedule: ClassSchedule) => void;
  onRegenerateSchedule?: () => void;
  onExportPDF?: () => void;
}

export const TimetableDisplay = ({
  schedule,
  config,
  conflicts,
  onEditSchedule,
  onRegenerateSchedule,
  onExportPDF
}: TimetableDisplayProps) => {
  const [selectedYear, setSelectedYear] = useState<number>(1);
  const [selectedSemester, setSelectedSemester] = useState<number>(1);

  const getScheduleForYearSemester = () => {
    return schedule.filter(s => s.year === selectedYear && s.semester === selectedSemester);
  };

  const getScheduleForDayTime = (day: string, timeSlot: string): ClassSchedule | undefined => {
    const filteredSchedule = getScheduleForYearSemester();
    return filteredSchedule.find(s => 
      s.timeSlot.day === day && 
      s.timeSlot.startTime === timeSlot
    );
  };

  const hasConflicts = conflicts.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <span>Generated Timetable</span>
                {hasConflicts ? (
                  <Badge variant="destructive" className="flex items-center space-x-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>{conflicts.length} Conflicts</span>
                  </Badge>
                ) : (
                  <Badge variant="success" className="flex items-center space-x-1">
                    <CheckCircle className="h-3 w-3" />
                    <span>No Conflicts</span>
                  </Badge>
                )}
              </CardTitle>
              <p className="text-muted-foreground">
                Academic Year: {config.academicYear}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Button onClick={onRegenerateSchedule} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerate
              </Button>
              <Button onClick={onExportPDF} variant="success">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div>
              <label className="text-sm font-medium">Year:</label>
              <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1st Year</SelectItem>
                  <SelectItem value="2">2nd Year</SelectItem>
                  <SelectItem value="3">3rd Year</SelectItem>
                  <SelectItem value="4">4th Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Semester:</label>
              <Select value={selectedSemester.toString()} onValueChange={(value) => setSelectedSemester(parseInt(value))}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Semester 1</SelectItem>
                  <SelectItem value="2">Semester 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conflicts Display */}
      {hasConflicts && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <span>Scheduling Conflicts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {conflicts.map((conflict, index) => (
                <div key={index} className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Badge variant="destructive">{conflict.conflictType}</Badge>
                    <span className="text-sm">{conflict.message}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timetable Grid */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedYear} Year - Semester {selectedSemester} Timetable
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-8 gap-1">
                {/* Header Row */}
                <div className="p-3 bg-muted font-semibold text-center rounded-lg">
                  Time
                </div>
                {config.workingDays.map(day => (
                  <div key={day} className="p-3 bg-muted font-semibold text-center rounded-lg">
                    {day}
                  </div>
                ))}

                {/* Time Slots */}
                {config.timeSlots.map(timeSlot => (
                  <div key={timeSlot.startTime} className="contents">
                    <div className="p-3 bg-muted/50 text-center font-medium rounded-lg">
                      {timeSlot.startTime}<br />
                      <span className="text-xs text-muted-foreground">
                        {timeSlot.endTime}
                      </span>
                    </div>
                    {config.workingDays.map(day => {
                      const classSchedule = getScheduleForDayTime(day, timeSlot.startTime);
                      return (
                        <TimetableCell
                          key={`${day}-${timeSlot.startTime}`}
                          schedule={classSchedule}
                          onEdit={onEditSchedule}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {getScheduleForYearSemester().length}
            </div>
            <div className="text-sm text-muted-foreground">Total Classes</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {new Set(getScheduleForYearSemester().map(s => s.staff.id)).size}
            </div>
            <div className="text-sm text-muted-foreground">Staff Involved</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {new Set(getScheduleForYearSemester().map(s => s.subject.id)).size}
            </div>
            <div className="text-sm text-muted-foreground">Subjects Scheduled</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};