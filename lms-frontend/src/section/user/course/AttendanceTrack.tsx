"use client";

import { useState, useEffect } from "react";
import { Check, Calendar, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/form/ScrollArea";
import { formatDate } from "date-fns";

interface Student {
  id: string;
  name: string;
  isAttend: boolean;
}

interface AttendanceTrackerProps {
  studentNames: Student[];
  onSubmit: (attendanceData: Record<string, Student[]>) => void;
  dates: string[];
  courseData: any;
}

export default function AttendanceTracker({
  studentNames = [],
  onSubmit,
  dates = [],
  courseData,
}: AttendanceTrackerProps) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [attendanceData, setAttendanceData] = useState<
    Record<string, Student[]>
  >({});

  // Initialize with empty data if no dates are provided
  useEffect(() => {
    if (dates.length > 0 && !selectedDate) {
      setSelectedDate(dates[0]);
    }
  }, [dates, selectedDate]);

  // Initialize attendance data for a new date
  useEffect(() => {
    console.log(courseData);

    // const currentDateData = courseData[selectedDate];
    if (selectedDate && !attendanceData[selectedDate]) {
      setAttendanceData((prev) => ({
        ...prev,
        [selectedDate]: studentNames.map((student) => {
          const courseDate = courseData?.attendanceDays?.find(
            (date: any) =>
              formatDate(date.sessionStartDate, "yyyy-MM-dd") === selectedDate
          );
          const studentId = courseDate?.courseAttendees?.find(
            (attendee: any) => attendee.enrolledUser_id === student.id
          );
          console.log(courseDate, "studentId");
          console.log(student);

          return {
            ...student,
            isAttend: studentId ? true : false,
          };
        }),
      }));
    }
  }, [selectedDate, studentNames, attendanceData]);

  const handleAttendanceChange = (studentId: string, isChecked: boolean) => {
    if (!selectedDate) return;

    setAttendanceData((prev) => ({
      ...prev,
      [selectedDate]: prev[selectedDate].map((student) =>
        student.id === studentId ? { ...student, isAttend: isChecked } : student
      ),
    }));
  };

  const handleSubmit = () => {
    onSubmit(attendanceData);
  };

  const getAttendanceCount = () => {
    if (!selectedDate || !attendanceData[selectedDate]) return 0;
    return attendanceData[selectedDate].filter((student) => student.isAttend)
      .length;
  };

  return (
    <div className="panel flex h-full flex-1 flex-col space-y-4 rounded-md border-2 p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Attendance Tracker</h2>
          <p className="text-muted-foreground">
            Track student attendance by date
          </p>
        </div>

        <div className="w-full md:w-64">
          <Select value={selectedDate} onValueChange={setSelectedDate}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a date" />
            </SelectTrigger>
            <SelectContent>
              {dates.map((date) => (
                <SelectItem key={date} value={date}>
                  {new Date(date).toLocaleDateString()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedDate && attendanceData[selectedDate] ? (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span>Student Attendance</span>
              <span className="text-sm font-normal text-muted-foreground">
                {getAttendanceCount()} of {attendanceData[selectedDate].length}{" "}
                present
              </span>
            </CardTitle>
            <CardDescription>
              {new Date(selectedDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {attendanceData[selectedDate].map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between rounded-lg border p-3 shadow-sm"
                    onClick={() =>
                      handleAttendanceChange(student.id, !student.isAttend)
                    }
                  >
                    <div className="flex items-center space-x-4">
                      <UserCheck className="h-5 w-5 text-muted-foreground" />
                      <Label
                        htmlFor={`student-${student.id}`}
                        className="font-medium"
                      >
                        {student.name}
                      </Label>
                    </div>
                    <Checkbox
                      id={`student-${student.id}`}
                      checked={student.isAttend}
                      onCheckedChange={(checked) =>
                        handleAttendanceChange(student.id, checked as boolean)
                      }
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSubmit} className="w-full" size="lg">
              <Check className="mr-2 h-4 w-4" />
              Submit Attendance
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="flex h-[400px] items-center justify-center rounded-lg border-2 border-dashed">
          <div className="flex flex-col items-center text-center">
            <Calendar className="h-10 w-10 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No Date Selected</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Select a date to view and mark student attendance
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
