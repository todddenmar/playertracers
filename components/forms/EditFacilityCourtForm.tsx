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
import { DB_COLLECTION, DB_METHOD_STATUS, SKILL_LEVELS } from "@/lib/config";
import { dbUpdateSubDocument } from "@/lib/firebase/actions";
import { TCourt } from "@/typings";
import { useAppStore } from "@/lib/store";
import LoadingComponent from "../custom-ui/LoadingComponent";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "../ui/textarea";

const FormSchema = z.object({
  name: z.string(),
  description: z.string(),
  orderNumber: z.string(),
});

type EditNewFacilityCourtFormProps = {
  setClose: () => void;
  court: TCourt;
};
export function EditNewFacilityCourtForm({
  court,
  setClose,
}: EditNewFacilityCourtFormProps) {
  const { currentFacility, currentCourts, setCurrentCourts } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [skillLevels, setSkillLevels] = useState<string[]>(
    court.skillLevels || [],
  );
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: court.name || "",
      description: court.description || "",
      orderNumber: court.orderNumber.toString() || "1",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!currentFacility) {
      toast.error("Facility not found");
      return;
    }
    if (skillLevels.length === 0) {
      toast.error("Skill level required");
      return;
    }
    const { orderNumber, name, description } = data;
    setIsLoading(true);
    const updates: Partial<TCourt> = {
      name: name,
      description: description,
      orderNumber: parseInt(orderNumber || "1"),
      facilityID: currentFacility.id,
      skillLevels: skillLevels,
    };
    const updatedCourt = {
      ...court,
      ...updates,
    };
    const res = await dbUpdateSubDocument(
      DB_COLLECTION.FACILITIES,
      currentFacility.id,
      DB_COLLECTION.COURTS,
      court.id,
      updates,
    );

    if (res.status === DB_METHOD_STATUS.SUCCESS) {
      const updatedCourts = currentCourts.map((item) =>
        item.id === court.id ? updatedCourt : item,
      );
      setCurrentCourts(updatedCourts);

      toast.success("Court updated successfully ");
      setIsLoading(false);
      setClose();
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
          name="orderNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Order Number</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter Order Number"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 gap-2">
          <Label>Skill Levels</Label>
          {SKILL_LEVELS.map((item) => {
            const isAdded = skillLevels.includes(item.id);
            return (
              <div
                key={`skill-level-item-${item.id}`}
                className="flex items-center gap-2"
              >
                <Checkbox
                  checked={isAdded}
                  onCheckedChange={(val) => {
                    if (val) {
                      setSkillLevels([...skillLevels, item.id]);
                    } else {
                      setSkillLevels(skillLevels.filter((i) => i != item.id));
                    }
                  }}
                />
                <div>{item.label}</div>
              </div>
            );
          })}
        </div>
        {isLoading ? (
          <LoadingComponent />
        ) : (
          <Button type="submit">Submit</Button>
        )}
      </form>
    </Form>
  );
}
