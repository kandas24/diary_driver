// components/ui/meeting-scheduler.tsx
"use client";

import * as React from "react";
import { useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isAfter,
  isBefore,
  parse,
} from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { ru, kk } from "date-fns/locale";

import { cn } from "../../lib/cn";
import { Button } from "./button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { Label } from "./label";

// Define the props for the component
interface MeetingSchedulerProps {
  /** The main title for the scheduler card. */
  title?: string;
  /** A short description under the title. */
  description?: string;
  /** The text for the schedule confirmation button. */
  scheduleButtonText?: string;
  /** The text for the cancel button. */
  cancelButtonText?: string;
  /** Locale code for month and weekday names. */
  locale?: string;
  /** Weekday headers, Monday first. */
  weekdays?: string[];
  /** Placeholder for an unset date. */
  selectDateText?: string;
  /** Placeholder for an unset time. */
  selectTimeText?: string;
  /** Hint shown before the first date is picked. */
  beginText?: string;
  /** Label for the event summary line. */
  eventText?: string;
  /** Field label for the start date. */
  startLabel?: string;
  /** Field label for the end date. */
  endLabel?: string;
  /** Initial selected start date. */
  initialStartDate?: Date;
  /** Initial selected end date. */
  initialEndDate?: Date;
  /** Callback function when the schedule button is clicked. */
  onSchedule: (details: { startDate: Date | null; endDate: Date | null; aiNotes: boolean; startTime: string; endTime: string }) => void;
  /** Callback function when the cancel button is clicked. */
  onCancel: () => void;
  /** Extra fields rendered in the right column under the dates. */
  children?: React.ReactNode;
  /** Render function receiving the current date range, placed under the calendar. */
  underCalendar?: (range: {
    startDate: Date | null;
    endDate: Date | null;
  }) => React.ReactNode;
  /** Whether the built-in footer with buttons is rendered. */
  showFooter?: boolean;
  /** Label for the toggle row. */
  toggleLabel?: string;
}

// Helper to format time for display
const formatTime = (date: Date | null) => (date ? format(date, "h:mm a") : "Select time");

// Main component
export const MeetingScheduler: React.FC<MeetingSchedulerProps> = ({
  title = "Schedule a meeting",
  description = "Create your next meeting easily.",
  scheduleButtonText = "Schedule",
  cancelButtonText = "Cancel",
  locale = "en-US",
  weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  selectDateText = "Select date",
  selectTimeText = "Select time",
  beginText = "Select a date to begin.",
  eventText = "Event:",
  startLabel = "Start date*",
  endLabel = "End date*",
  initialStartDate,
  initialEndDate,
  onSchedule,
  onCancel,
  children,
  underCalendar,
  toggleLabel = "Enable AI notes",
  showFooter = true,
}) => {
  // State management
  const dateFnsLocale = locale.startsWith("ru") ? ru : locale.startsWith("kk") ? kk : undefined;
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(initialStartDate || new Date()));
  const [startDate, setStartDate] = useState<Date | null>(initialStartDate || null);
  const [endDate, setEndDate] = useState<Date | null>(initialEndDate || null);
  const [aiNotes, setAiNotes] = useState(false);
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("00:00");

  // Calendar logic
  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth)),
  });

  const handleDateClick = (day: Date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day);
      setEndDate(null);
    } else if (isBefore(day, startDate)) {
      setStartDate(day);
    } else {
      setEndDate(day);
    }
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Determine the event summary text
  const getEventSummary = () => {
    if (!startDate) return beginText;
    const startFormatted = format(startDate, "MMM d", { locale: dateFnsLocale });
    if (!endDate) return `${eventText} ${startFormatted}`;
    const endFormatted = format(endDate, "MMM d", { locale: dateFnsLocale });
    return `${eventText} ${startFormatted} - ${endFormatted}, ${formatTime(startDate)} - ${formatTime(endDate)}`;
  };

  const formatMonth = (d: Date) => format(d, "LLLL yyyy", { locale: dateFnsLocale });
  const formatLongDate = (d: Date | null) =>
    d ? format(d, "LLLL d, yyyy", { locale: dateFnsLocale }) : selectDateText;
  const formatTimeLocal = (d: Date | null) => (d ? format(d, "HH:mm") : selectTimeText);
  
  // Handlers
  const handleSchedule = () => {
    // In a real app, you'd likely parse time from inputs and combine with date
    // For this example, we pass the full date object
    onSchedule({ startDate, endDate, aiNotes, startTime, endTime });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto overflow-hidden shadow-lg border-none bg-card/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CardHeader className="flex flex-row items-start gap-4">
          <div className="p-3 rounded-full bg-primary/10 text-primary">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 p-6">
          {/* Left Side: Calendar */}
          <div className="flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" size="icon" onClick={prevMonth} aria-label="Previous month">
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <AnimatePresence mode="wait">
                <motion.h3
                  key={formatMonth(currentMonth)}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="text-lg font-medium text-center"
                >
                  {formatMonth(currentMonth)}
                </motion.h3>
              </AnimatePresence>
              <Button variant="ghost" size="icon" onClick={nextMonth} aria-label="Next month">
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
            <div className="grid grid-cols-7 text-center text-xs text-muted-foreground">
              {weekdays.map((day) => (
                <div key={day} className="py-2">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {days.map((day) => {
                const isSelected = (startDate && isSameDay(day, startDate)) || (endDate && isSameDay(day, endDate));
                const isInRange = startDate && endDate && isAfter(day, startDate) && isBefore(day, endDate);

                return (
                  <motion.button
                    key={day.toString()}
                    onClick={() => handleDateClick(day)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "relative h-10 w-10 rounded-full flex items-center justify-center transition-colors duration-200",
                      !isSameMonth(day, currentMonth) && "text-muted-foreground/50",
                      isSameDay(day, new Date()) && "text-primary font-bold",
                      isSelected && "bg-primary text-primary-foreground",
                      isInRange && "bg-primary/10 text-primary-foreground rounded-none",
                      startDate && isSameDay(day, startDate) && "rounded-r-none",
                      endDate && isSameDay(day, endDate) && "rounded-l-none"
                    )}
                  >
                    {format(day, "d")}
                     {isInRange && <div className="absolute inset-0 bg-primary/20" />}
                  </motion.button>
                );
              })}
            </div>
            {underCalendar ? (
              <div className="mt-auto pt-6">{underCalendar({ startDate, endDate })}</div>
            ) : null}
          </div>

          {/* Right Side: Inputs */}
          <div className="flex flex-col">
            <div className="space-y-4">
               {/* Start Date */}
              <div>
                <Label htmlFor="start-date" className="text-sm font-medium">{startLabel}</Label>
                <div className="flex items-center mt-2 gap-2 p-3 rounded-md border bg-background">
                  <span className="text-sm flex-grow">{formatLongDate(startDate)}</span>
                  <input
                    type="time"
                    aria-label={startLabel}
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="text-sm text-primary font-medium bg-primary/10 px-3 py-1 rounded-md border-0"
                  />
                </div>
              </div>

               {/* End Date */}
              <div>
                <Label htmlFor="end-date" className="text-sm font-medium">{endLabel}</Label>
                <div className="flex items-center mt-2 gap-2 p-3 rounded-md border bg-background">
                  <span className="text-sm flex-grow">{formatLongDate(endDate)}</span>
                  <input
                    type="time"
                    aria-label={endLabel}
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="text-sm text-primary font-medium bg-primary/10 px-3 py-1 rounded-md border-0"
                  />
                </div>
              </div>

              {children}
            </div>

            {showFooter ? (
            <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-4">{getEventSummary()}</p>
                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={onCancel}>{cancelButtonText}</Button>
                    <Button onClick={handleSchedule} disabled={!startDate || !endDate}>{scheduleButtonText}</Button>
                </div>
            </div>
          ) : null}
          </div>
        </CardContent>
      </motion.div>
    </Card>
  );
};