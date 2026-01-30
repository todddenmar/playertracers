"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useState } from "react";
import { DB_COLLECTION, DB_METHOD_STATUS } from "@/lib/config";
import { dbUpdateDocument } from "@/lib/firebase/actions";
import { TFacility } from "@/typings";
import { useAppStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import LoadingComponent from "@/components/custom-ui/LoadingComponent";
import { isValid, parse } from "date-fns";

const FormSchema = z.object({
  name: z.string(),
  description: z.string(),
  openingTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "Opening time must be in HH:mm (24-hour) format",
  }),
  closingTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "Closing time must be in HH:mm (24-hour) format",
  }),
});

export function AdminFacilitySettingsForm() {
  const { currentFacility, setCurrentFacility } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: currentFacility?.name || "",
      description: currentFacility?.description || "",
      openingTime: currentFacility?.openingTime || "06:00",
      closingTime: currentFacility?.closingTime || "23:00",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!currentFacility) {
      toast.error("Facility not found");
      return;
    }

    const { name, description, openingTime, closingTime } = data;
    setIsLoading(true);
    if (openingTime || closingTime) {
      const parsedStartTime = parse(openingTime, "HH:mm", new Date());
      const parsedEndTime = parse(closingTime, "HH:mm", new Date());
      if (!isValid(parsedStartTime) || !isValid(parsedEndTime)) {
        toast.error(
          "Invalid Daily Time Format, must be HH:mm military time / 24hrs",
        );
        return;
      }
    }
    const updates: Partial<TFacility> = {
      name: name,
      description: description,
      openingTime,
      closingTime,
    };

    const updatedFacility = {
      ...currentFacility,
      ...updates,
    };
    const res = await dbUpdateDocument(
      DB_COLLECTION.FACILITIES,
      currentFacility.id,
      updates,
    );

    if (res.status === DB_METHOD_STATUS.SUCCESS) {
      setCurrentFacility(updatedFacility);

      toast.success("Updated successfully ");
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  rows={10}
                  placeholder="Enter description"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="openingTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Daily Opening Time</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="closingTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Daily Closing Time</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {isLoading ? (
          <LoadingComponent />
        ) : (
          <Button type="submit">Submit</Button>
        )}
      </form>
    </Form>
  );
}
