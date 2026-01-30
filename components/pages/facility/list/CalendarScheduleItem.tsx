"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { TBooking } from "@/typings";
import { format } from "date-fns";

type Props = {
  booking: TBooking;
  className?: string;
};

export default function CalendarScheduleItem({ booking, className }: Props) {
  const start = format(new Date(booking.dateFrom), "hh:mm a");
  const end = format(new Date(booking.dateTo), "hh:mm a");

  return (
    <div
      className={cn(
        "rounded border bg-white p-2 text-xs shadow-sm space-y-1",
        className,
      )}
    >
      <div className="font-semibold truncate">{booking.customerName}</div>

      <div className="text-muted-foreground">
        {start} – {end}
      </div>

      <div
        className={cn(
          "inline-block rounded px-2 py-0.5 text-[10px] font-medium",
          booking.isPaymentConfirmed
            ? "bg-green-100 text-green-700"
            : "bg-yellow-100 text-yellow-700",
        )}
      >
        {booking.isPaymentConfirmed ? "Paid" : "Pending"}
      </div>
    </div>
  );
}
