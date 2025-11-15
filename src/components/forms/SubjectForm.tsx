import { useState } from "react";
import { Plus, Trash2, BookOpen, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Subject } from "@/types/timetable";

interface SubjectFormProps {
  subjects: Subject[];
  onSubjectsChange: (subjects: Subject[]) => void;
}

export const SubjectForm = ({ subjects, onSubjectsChange }: SubjectFormProps) => {
  const [newSubject, setNewSubject] = useState<Partial<Subject>>({
    name: '',
    code: '',
    type: 'theory',
    duration: 1,
    requiredPerWeek: 3,
    year: 1,
    semester: 1
  });

  const addSubject = () => {
    if (!newSubject.name?.trim() || !newSubject.code?.trim()) return;

    const subject: Subject = {
      id: Date.now().toString(),
      name: newSubject.name,
      code: newSubject.code,
      type: newSubject.type as 'theory' | 'lab' | 'practical',
      duration: newSubject.duration || 1,
      requiredPerWeek: newSubject.requiredPerWeek || 3,
      year: newSubject.year || 1,
      semester: newSubject.semester || 1
    };

    onSubjectsChange([...subjects, subject]);
    setNewSubject({
      name: '',
      code: '',
      type: 'theory',
      duration: 1,
      requiredPerWeek: 3,
      year: 1,
      semester: 1
    });
  };

  const removeSubject = (id: string) => {
    onSubjectsChange(subjects.filter(s => s.id !== id));
  };

  const getSubjectsByYear = (year: number) => {
    return subjects.filter(s => s.year === year);
  };

  const getSubjectIcon = (type: string) => {
    switch (type) {
      case 'lab':
      case 'practical':
        return <FlaskConical className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getSubjectBadgeVariant = (type: string) => {
    switch (type) {
      case 'lab':
        return 'warning';
      case 'practical':
        return 'success';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>Add New Subject</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="subject-name">Subject Name *</Label>
              <Input
                id="subject-name"
                value={newSubject.name || ''}
                onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                placeholder="e.g., Data Structures"
              />
            </div>
            <div>
              <Label htmlFor="subject-code">Subject Code *</Label>
              <Input
                id="subject-code"
                value={newSubject.code || ''}
                onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value.toUpperCase() })}
                placeholder="e.g., CS201"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="subject-type">Type</Label>
              <Select 
                value={newSubject.type} 
                onValueChange={(value) => setNewSubject({ ...newSubject, type: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="theory">Theory</SelectItem>
                  <SelectItem value="lab">Lab</SelectItem>
                  <SelectItem value="practical">Practical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="duration">Duration (hours)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="4"
                value={newSubject.duration || 1}
                onChange={(e) => setNewSubject({ ...newSubject, duration: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="required-per-week">Hours/Week</Label>
              <Input
                id="required-per-week"
                type="number"
                min="1"
                max="10"
                value={newSubject.requiredPerWeek || 3}
                onChange={(e) => setNewSubject({ ...newSubject, requiredPerWeek: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="year">Year</Label>
              <Select 
                value={newSubject.year?.toString()} 
                onValueChange={(value) => setNewSubject({ ...newSubject, year: parseInt(value) })}
              >
                <SelectTrigger>
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
          </div>

          <div>
            <Label htmlFor="semester">Semester</Label>
            <Select 
              value={newSubject.semester?.toString()} 
              onValueChange={(value) => setNewSubject({ ...newSubject, semester: parseInt(value) })}
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Semester 1</SelectItem>
                <SelectItem value="2">Semester 2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={addSubject} variant="gradient" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Subject
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Subjects ({subjects.length})</h3>
        
        {subjects.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No subjects added yet. Add your first subject above.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(year => {
              const yearSubjects = getSubjectsByYear(year);
              if (yearSubjects.length === 0) return null;

              return (
                <Card key={year}>
                  <CardHeader>
                    <CardTitle className="text-lg">{year} Year</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {yearSubjects.map(subject => (
                        <Card key={subject.id} className="relative">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center space-x-2">
                                {getSubjectIcon(subject.type)}
                                <h4 className="font-semibold">{subject.name}</h4>
                              </div>
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => removeSubject(subject.id)}
                                className="h-8 w-8"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline">{subject.code}</Badge>
                                <Badge variant={getSubjectBadgeVariant(subject.type)}>
                                  {subject.type}
                                </Badge>
                              </div>
                              
                              <div className="text-sm text-muted-foreground">
                                <p>Semester {subject.semester} • {subject.duration}h duration</p>
                                <p>{subject.requiredPerWeek} hours per week</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};