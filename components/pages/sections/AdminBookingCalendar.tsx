"use client";

import React, { useEffect, useMemo, useState } from "react";
import { addDays, isSameDay, startOfWeek, addWeeks } from "date-fns";
import { useAppStore } from "@/lib/store";
import { cn, stringifyDate } from "@/lib/utils";
import CalendarScheduleItem from "../facility/list/CalendarScheduleItem";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { XIcon } from "lucide-react";

function formatHour(hour: number) {
  const period = hour >= 12 ? "PM" : "AM";
  const h = hour % 12 || 12;
  return `${h}:00 ${period}`;
}
type SelectedSlot = {
  date: string; // YYYY-MM-DD
  hour: number;
};
export default function AdminBookingCalendar() {
  const { currentBookings, currentFacility } = useAppStore();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [hoveredHour, setHoveredHour] = useState<number | null>(null);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<SelectedSlot[]>([]);

  function isSlotSelected(date: Date, hour: number) {
    return selectedSlots.some(
      (s) => s.date === dayKey(date) && s.hour === hour,
    );
  }
  function formatHourRange(hour: number) {
    const start = formatHour(hour);
    const end = formatHour(hour + 1);
    return `${start} - ${end}`;
  }
  function toggleSlot(date: Date, hour: number) {
    setSelectedSlots((prev) => {
      const exists = prev.some(
        (s) => s.date === dayKey(date) && s.hour === hour,
      );

      if (exists) {
        return prev.filter(
          (s) => !(s.date === dayKey(date) && s.hour === hour),
        );
      }

      return [...prev, { date: dayKey(date), hour }];
    });
  }
  const start = useMemo(
    () => startOfWeek(currentWeek, { weekStartsOn: 1 }),
    [currentWeek],
  );

  const [activeDay, setActiveDay] = useState(start);

  useEffect(() => {
    setActiveDay(start);
  }, [start]);

  if (!currentFacility) return null;
  function parseHour(time?: string, fallback = 0) {
    if (!time) return fallback;
    const [hour] = time.split(":");
    return Number(hour);
  }
  const START_HOUR = currentFacility.isAlwaysOpen
    ? 0
    : parseHour(currentFacility.openingTime, 8);

  const END_HOUR = currentFacility.isAlwaysOpen
    ? 23
    : parseHour(currentFacility.closingTime, 22);

  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(start, i));

  const timeSlots = Array.from(
    { length: END_HOUR - START_HOUR },
    (_, i) => START_HOUR + i,
  );
  function dayKey(date: Date) {
    return date.toISOString().split("T")[0];
  }
  const getBookingForSlot = (date: Date, hour: number) => {
    return currentBookings.find((b) => {
      const bookingDate = new Date(b.dateFrom);
      return isSameDay(bookingDate, date) && bookingDate.getHours() === hour;
    });
  };

  return (
    <div className="flex gap-4">
      <section className="overflow-y-auto grid flex-1">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <Button onClick={() => setCurrentWeek((p) => addWeeks(p, -1))}>
            ← Previous
          </Button>

          <div className="font-semibold text-sm">
            Week of {stringifyDate(start)}
          </div>

          <Button onClick={() => setCurrentWeek((p) => addWeeks(p, 1))}>
            Next →
          </Button>
        </div>

        {/* Mobile day selector */}
        <div className="flex gap-2 overflow-x-auto md:hidden pb-2">
          {weekDates.map((date) => {
            const isActive = isSameDay(date, activeDay);
            return (
              <button
                key={date.toISOString()}
                onClick={() => setActiveDay(date)}
                className={cn(
                  "px-3 py-2 rounded text-sm whitespace-nowrap border",
                  isActive && "bg-primary text-primary-foreground",
                )}
              >
                {stringifyDate(date)}
              </button>
            );
          })}
        </div>

        {/* Mobile view */}
        <div className="md:hidden space-y-2">
          {timeSlots.map((hour) => {
            const slotDate = new Date(activeDay);
            slotDate.setHours(hour, 0, 0, 0);

            const isPast = slotDate < new Date();
            const booking = getBookingForSlot(activeDay, hour);

            return (
              <div
                key={hour}
                className={cn("border rounded p-3", isPast && "bg-muted")}
              >
                <div className="text-xs mb-1 font-medium">
                  {formatHour(hour)}
                </div>

                {booking ? (
                  <CalendarScheduleItem booking={booking} />
                ) : !isPast ? (
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSlotSelected(slotDate, hour)}
                      onChange={() => toggleSlot(slotDate, hour)}
                      className="mt-1"
                    />
                    <span className="text-xs text-muted-foreground">
                      Available
                    </span>
                  </label>
                ) : null}
              </div>
            );
          })}
        </div>

        {/* Desktop view */}
        <ScrollArea className="hidden md:block w-full">
          <div className="grid grid-cols-[80px_repeat(7,1fr)] border text-sm">
            <div />
            {weekDates.map((date) => {
              const isToday = isSameDay(date, new Date());

              return (
                <div
                  key={date.toISOString()}
                  className={cn(
                    "border-b p-2 text-center font-semibold",
                    isToday && "bg-white/5",
                  )}
                >
                  {stringifyDate(date)}
                </div>
              );
            })}

            {timeSlots.map((hour) => (
              <React.Fragment key={hour}>
                <div
                  className={cn(
                    "border-r p-2 text-xs transition-colors",
                    hoveredHour === hour && "bg-primary/10 dark:bg-white/20",
                  )}
                >
                  {formatHour(hour)}
                </div>

                {weekDates.map((date) => {
                  const slotDate = new Date(date);
                  slotDate.setHours(hour, 0, 0, 0);

                  const isPast = slotDate < new Date();
                  const isToday = isSameDay(date, new Date());
                  const booking = getBookingForSlot(date, hour);

                  return (
                    <div
                      key={slotDate.toISOString()}
                      onMouseEnter={() => {
                        setHoveredHour(hour);
                        setHoveredDate(dayKey(date));
                      }}
                      onMouseLeave={() => {
                        setHoveredHour(null);
                        setHoveredDate(null);
                      }}
                      className={cn(
                        "border-r border-b p-3 transition-colors",
                        isPast && "bg-muted",

                        // column highlight
                        hoveredDate === dayKey(date) &&
                          !isPast &&
                          "bg-primary/5 dark:bg-white/10",

                        // row highlight
                        hoveredHour === hour &&
                          !isPast &&
                          "bg-primary/5 dark:bg-white/10",

                        // intersection (cell itself)
                        hoveredHour === hour &&
                          hoveredDate === dayKey(date) &&
                          !isPast &&
                          "bg-primary/10 dark:bg-white/20",

                        isToday && !isPast && "dark:bg-white/5",

                        !booking && !isPast && "cursor-pointer",
                      )}
                    >
                      {booking ? (
                        <CalendarScheduleItem booking={booking} />
                      ) : !isPast ? (
                        <label className="flex items-start gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isSlotSelected(date, hour)}
                            onChange={() => toggleSlot(date, hour)}
                            className="mt-1"
                          />
                          <span className="text-xs text-muted-foreground">
                            Available
                          </span>
                        </label>
                      ) : null}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>

          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>

      <div className="w-full max-w-sm border rounded-lg p-4 space-y-4">
        <div className="mb-2 font-semibold">
          Selected Slots: {selectedSlots.length} hour
          {selectedSlots.length !== 1 ? "s" : ""}
        </div>
        <div className="bg-white dark:bg-white/5 border rounded-lg p-4 shadow-sm space-y-2">
          {selectedSlots.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No slots selected
            </div>
          ) : (
            selectedSlots
              .sort((a, b) => a.date.localeCompare(b.date) || a.hour - b.hour)
              .map((slot, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-primary/10 dark:hover:bg-white/10 transition-colors"
                >
                  <span className="text-sm font-medium">
                    {new Date(slot.date).toLocaleDateString()} •{" "}
                    {formatHourRange(slot.hour)}
                  </span>
                  <Button
                    size={"icon"}
                    className="cursor-pointer"
                    onClick={() =>
                      setSelectedSlots((prev) =>
                        prev.filter(
                          (s) =>
                            !(s.date === slot.date && s.hour === slot.hour),
                        ),
                      )
                    }
                  >
                    <XIcon />
                  </Button>
                </div>
              ))
          )}
        </div>
        {selectedSlots.length > 0 && (
          <Button
            className="w-full cursor-pointer"
            onClick={() => {
              console.log("Booking payload:", selectedSlots);
              // here you can send to backend
            }}
          >
            Create Booking
          </Button>
        )}
      </div>
    </div>
  );
}
