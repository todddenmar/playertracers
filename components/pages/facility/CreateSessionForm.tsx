"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useState } from "react";
import { DB_COLLECTION, DB_METHOD_STATUS } from "@/lib/config";
import { dbSetDocument } from "@/lib/firebase/actions";
import { TPeriod, TSession, TSessionType } from "@/typings";
import LoadingComponent from "@/components/custom-ui/LoadingComponent";
import { serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { DatePicker } from "@/components/custom-ui/DatePicker";
import TimePicker from "@/components/custom-ui/TimePicker";
import { Label } from "@/components/ui/label";

type CreateSessionFormProps = {
  facilityID: string;
};
export function CreateSessionForm({ facilityID }: CreateSessionFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [sessionDate, setSessionDate] = useState<Date | undefined>(new Date());
  const [sessionType, setSessionType] = useState<string>("RENTAL");
  const [hourStart, setHourStart] = useState<string>("1");
  const [minuteStart, setMinuteStart] = useState<string>("00");
  const [periodStart, setPeriodStart] = useState<TPeriod>("AM");

  const [hourEnd, setHourEnd] = useState<string>("1");
  const [minuteEnd, setMinuteEnd] = useState<string>("00");
  const [periodEnd, setPeriodEnd] = useState<TPeriod>("AM");

  const onSubmit = async () => {
    setIsLoading(true);
    const newSession: TSession = {
      id: crypto.randomUUID(),
      facilityID: facilityID,
      date: (sessionDate || new Date())?.toISOString(),
      timestamp: serverTimestamp(),
      type: sessionType as TSessionType,
      players: [],
    };
    const res = await dbSetDocument(
      DB_COLLECTION.SESSIONS,
      newSession.id,
      newSession
    );
    if (res.status === DB_METHOD_STATUS.SUCCESS) {
      toast.success("Session added successfully ");
      setIsLoading(false);
      router.push("/facilities/" + facilityID);
    }
  };

  return (
    <section className="space-y-4">
      <h4 className="font-semibold text-lg">Create New Session</h4>
      <div className="p-4 rounded-lg border space-y-4">
        <div className="grid grid-cols-1 gap-2">
          <Label>Date</Label>
          <DatePicker date={sessionDate} setDate={setSessionDate} />
        </div>
        <div className="grid grid-cols-1 gap-2">
          <Label>Start</Label>
          <TimePicker
            hour={hourStart}
            setHour={setHourStart}
            minute={minuteStart}
            setMinute={setMinuteStart}
            period={periodStart}
            setPeriod={setPeriodStart}
          />
        </div>
        <div className="grid grid-cols-1 gap-2">
          <Label>End</Label>
          <TimePicker
            hour={hourEnd}
            setHour={setHourEnd}
            minute={minuteEnd}
            setMinute={setMinuteEnd}
            period={periodEnd}
            setPeriod={setPeriodEnd}
          />
        </div>
        <div className="grid grid-cols-1 gap-2">
          <Label>Type</Label>
          <Select
            defaultValue="RENTAL"
            value={sessionType}
            onValueChange={setSessionType}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="RENTAL">Rental</SelectItem>
              <SelectItem value="OPEN_PLAY">Open Play</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {isLoading ? (
        <LoadingComponent />
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            variant={"destructive"}
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="button" onClick={onSubmit}>
            Submit
          </Button>
        </div>
      )}
    </section>
  );
}
