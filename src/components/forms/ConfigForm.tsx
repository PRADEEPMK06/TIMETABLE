import { useState } from "react";
import { Clock, Calendar, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { TimetableConfig, TimeSlot } from "@/types/timetable";

interface ConfigFormProps {
  config: TimetableConfig;
  onConfigChange: (config: TimetableConfig) => void;
}

export const ConfigForm = ({ config, onConfigChange }: ConfigFormProps) => {
  const [newTimeSlot, setNewTimeSlot] = useState<Partial<TimeSlot>>({
    startTime: '09:00',
    endTime: '10:00',
    duration: 1
  });

  const [newBreakSlot, setNewBreakSlot] = useState<Partial<TimeSlot>>({
    day: 'Monday',
    startTime: '11:00',
    endTime: '11:15',
    duration: 0.25
  });

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const updateConfig = (updates: Partial<TimetableConfig>) => {
    onConfigChange({ ...config, ...updates });
  };

  const toggleWorkingDay = (day: string) => {
    const workingDays = config.workingDays.includes(day)
      ? config.workingDays.filter(d => d !== day)
      : [...config.workingDays, day];
    updateConfig({ workingDays });
  };

  const addTimeSlot = () => {
    if (!newTimeSlot.startTime || !newTimeSlot.endTime) return;

    const timeSlot: TimeSlot = {
      day: '', // Day will be applied during generation
      startTime: newTimeSlot.startTime,
      endTime: newTimeSlot.endTime,
      duration: calculateDuration(newTimeSlot.startTime, newTimeSlot.endTime)
    };

    updateConfig({
      timeSlots: [...config.timeSlots, timeSlot]
    });

    setNewTimeSlot({
      startTime: '09:00',
      endTime: '10:00',
      duration: 1
    });
  };

  const removeTimeSlot = (index: number) => {
    const timeSlots = config.timeSlots.filter((_, i) => i !== index);
    updateConfig({ timeSlots });
  };

  const addBreakSlot = () => {
    if (!newBreakSlot.startTime || !newBreakSlot.endTime || !newBreakSlot.day) return;

    const breakSlot: TimeSlot = {
      day: newBreakSlot.day,
      startTime: newBreakSlot.startTime,
      endTime: newBreakSlot.endTime,
      duration: calculateDuration(newBreakSlot.startTime, newBreakSlot.endTime)
    };

    updateConfig({
      breakSlots: [...(config.breakSlots || []), breakSlot]
    });

    setNewBreakSlot({
      day: 'Monday',
      startTime: '11:00',
      endTime: '11:15',
      duration: 0.25
    });
  };

  const removeBreakSlot = (index: number) => {
    const breakSlots = (config.breakSlots || []).filter((_, i) => i !== index);
    updateConfig({ breakSlots });
  };

  const calculateDuration = (startTime: string, endTime: string): number => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60); // Convert to hours
  };

  return (
    <div className="space-y-6">
      {/* Academic Year */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Academic Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="academic-year">Academic Year</Label>
            <Input
              id="academic-year"
              value={config.academicYear}
              onChange={(e) => updateConfig({ academicYear: e.target.value })}
              placeholder="e.g., 2024-2025"
            />
          </div>
        </CardContent>
      </Card>

      {/* Working Days */}
      <Card>
        <CardHeader>
          <CardTitle>Working Days</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {daysOfWeek.map(day => (
              <div key={day} className="flex items-center space-x-2">
                <Switch
                  id={day}
                  checked={config.workingDays.includes(day)}
                  onCheckedChange={() => toggleWorkingDay(day)}
                />
                <Label htmlFor={day}>{day}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Time Slots */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Time Slots</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="start-time">Start Time</Label>
              <Input
                id="start-time"
                type="time"
                value={newTimeSlot.startTime || ''}
                onChange={(e) => setNewTimeSlot({ ...newTimeSlot, startTime: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="end-time">End Time</Label>
              <Input
                id="end-time"
                type="time"
                value={newTimeSlot.endTime || ''}
                onChange={(e) => setNewTimeSlot({ ...newTimeSlot, endTime: e.target.value })}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={addTimeSlot} variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Slot
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Current Time Slots</h4>
            {config.timeSlots.length === 0 ? (
              <p className="text-muted-foreground text-sm">No time slots configured</p>
            ) : (
              <div className="space-y-2">
                {config.timeSlots.map((slot, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <span>{slot.startTime} - {slot.endTime} ({slot.duration}h)</span>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeTimeSlot(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Break Slots */}
      <Card>
        <CardHeader>
          <CardTitle>Break Slots</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="break-day">Day</Label>
              <Select 
                value={newBreakSlot.day} 
                onValueChange={(value) => setNewBreakSlot({ ...newBreakSlot, day: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {config.workingDays.map(day => (
                    <SelectItem key={day} value={day}>{day}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="break-start">Start Time</Label>
              <Input
                id="break-start"
                type="time"
                value={newBreakSlot.startTime || ''}
                onChange={(e) => setNewBreakSlot({ ...newBreakSlot, startTime: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="break-end">End Time</Label>
              <Input
                id="break-end"
                type="time"
                value={newBreakSlot.endTime || ''}
                onChange={(e) => setNewBreakSlot({ ...newBreakSlot, endTime: e.target.value })}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={addBreakSlot} variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Break
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Break Slots</h4>
            {!config.breakSlots || config.breakSlots.length === 0 ? (
              <p className="text-muted-foreground text-sm">No break slots configured</p>
            ) : (
              <div className="space-y-2">
                {config.breakSlots.map((slot, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <span>{slot.day}: {slot.startTime} - {slot.endTime}</span>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeBreakSlot(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};