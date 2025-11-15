import { Edit, User, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ClassSchedule } from "@/types/timetable";

interface TimetableCellProps {
  schedule?: ClassSchedule;
  onEdit?: (schedule: ClassSchedule) => void;
}

export const TimetableCell = ({ schedule, onEdit }: TimetableCellProps) => {
  if (!schedule) {
    return (
      <div className="p-3 border border-dashed border-muted-foreground/30 rounded-lg min-h-[100px] bg-muted/20">
        <div className="text-center text-muted-foreground text-sm">
          Free
        </div>
      </div>
    );
  }

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
    <Card className="p-3 min-h-[100px] hover:shadow-md transition-shadow cursor-pointer group relative">
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-semibold text-sm leading-tight">
              {schedule.subject.name}
            </h4>
            <p className="text-xs text-muted-foreground">
              {schedule.subject.code}
            </p>
          </div>
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onEdit(schedule)}
            >
              <Edit className="h-3 w-3" />
            </Button>
          )}
        </div>

        <div className="space-y-1">
          <Badge variant={getSubjectBadgeVariant(schedule.subject.type)} className="text-xs">
            {schedule.subject.type}
          </Badge>
          
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <User className="h-3 w-3" />
            <span className="truncate">{schedule.staff.name}</span>
          </div>
          
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{schedule.subject.duration}h</span>
          </div>
          
          {schedule.room && (
            <div className="text-xs text-muted-foreground">
              Room: {schedule.room}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};