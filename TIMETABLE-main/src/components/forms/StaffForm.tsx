import { useState } from "react";
import { Plus, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Staff } from "@/types/timetable";

interface StaffFormProps {
  staff: Staff[];
  onStaffChange: (staff: Staff[]) => void;
  subjects: string[];
}

export const StaffForm = ({ staff, onStaffChange, subjects }: StaffFormProps) => {
  const [newStaff, setNewStaff] = useState<Partial<Staff>>({
    name: '',
    email: '',
    subjects: [],
    maxHoursPerDay: 6
  });

  const addStaff = () => {
    if (!newStaff.name?.trim()) return;

    const staffMember: Staff = {
      id: Date.now().toString(),
      name: newStaff.name,
      email: newStaff.email || '',
      subjects: newStaff.subjects || [],
      maxHoursPerDay: newStaff.maxHoursPerDay || 6
    };

    onStaffChange([...staff, staffMember]);
    setNewStaff({ name: '', email: '', subjects: [], maxHoursPerDay: 6 });
  };

  const removeStaff = (id: string) => {
    onStaffChange(staff.filter(s => s.id !== id));
  };

  const toggleSubject = (staffId: string, subject: string) => {
    onStaffChange(staff.map(s => {
      if (s.id === staffId) {
        const subjects = s.subjects.includes(subject)
          ? s.subjects.filter(sub => sub !== subject)
          : [...s.subjects, subject];
        return { ...s, subjects };
      }
      return s;
    }));
  };

  const addSubjectToNew = (subject: string) => {
    const currentSubjects = newStaff.subjects || [];
    if (currentSubjects.includes(subject)) {
      setNewStaff({
        ...newStaff,
        subjects: currentSubjects.filter(s => s !== subject)
      });
    } else {
      setNewStaff({
        ...newStaff,
        subjects: [...currentSubjects, subject]
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Add New Staff Member</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="staff-name">Name *</Label>
              <Input
                id="staff-name"
                value={newStaff.name || ''}
                onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                placeholder="Enter staff name"
              />
            </div>
            <div>
              <Label htmlFor="staff-email">Email</Label>
              <Input
                id="staff-email"
                type="email"
                value={newStaff.email || ''}
                onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                placeholder="Enter email address"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="max-hours">Maximum Hours Per Day</Label>
            <Input
              id="max-hours"
              type="number"
              min="1"
              max="12"
              value={newStaff.maxHoursPerDay || 6}
              onChange={(e) => setNewStaff({ ...newStaff, maxHoursPerDay: parseInt(e.target.value) })}
            />
          </div>

          <div>
            <Label>Subjects</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {subjects.map(subject => (
                <Badge
                  key={subject}
                  variant={newStaff.subjects?.includes(subject) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => addSubjectToNew(subject)}
                >
                  {subject}
                </Badge>
              ))}
            </div>
          </div>

          <Button onClick={addStaff} variant="gradient" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Staff Member
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Staff Members ({staff.length})</h3>
        {staff.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No staff members added yet. Add your first staff member above.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {staff.map(staffMember => (
              <Card key={staffMember.id} className="relative">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold">{staffMember.name}</h4>
                      {staffMember.email && (
                        <p className="text-sm text-muted-foreground">{staffMember.email}</p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        Max {staffMember.maxHoursPerDay || 6} hours/day
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeStaff(staffMember.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div>
                    <Label className="text-sm">Subjects:</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {subjects.map(subject => (
                        <Badge
                          key={subject}
                          variant={staffMember.subjects.includes(subject) ? "default" : "outline"}
                          className="cursor-pointer text-xs"
                          onClick={() => toggleSubject(staffMember.id, subject)}
                        >
                          {subject}
                        </Badge>
                      ))}
                    </div>
                    {staffMember.subjects.length === 0 && (
                      <p className="text-sm text-muted-foreground mt-2">
                        No subjects assigned
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};