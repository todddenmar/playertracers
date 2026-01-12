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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useState } from "react";
import { DB_COLLECTION, DB_METHOD_STATUS } from "@/lib/config";
import { dbSetDocument } from "@/lib/firebase/actions";
import { TFacility } from "@/typings";
import { useAppStore } from "@/lib/store";
import LoadingComponent from "../custom-ui/LoadingComponent";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import ProvinceSelect from "../custom-ui/ProvinceSelect";
import { Label } from "../ui/label";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string(),
  address: z.string().min(2, {
    message: "Address must be at least 2 characters.",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
});

type CreateFacilityFormProps = {
  setClose: () => void;
};
export function CreateFacilityForm({ setClose }: CreateFacilityFormProps) {
  const { currentSports, currentFacilities, setCurrentFacilities } =
    useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [sportIDs, setSportIDs] = useState<string[]>([]);
  const [province, setProvince] = useState<string>("");

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      city: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!province) {
      toast.error("Province required");
      return;
    }
    if (sportIDs.length === 0) {
      toast.error("Please select a sport");
      return;
    }
    const { name, description, address, city } = data;
    setIsLoading(true);
    const newFacility: TFacility = {
      id: crypto.randomUUID(),
      name: name,
      description: description,
      address: address,
      city: city,
      province: province,
      sportIDs,
      users: [],
    };
    const res = await dbSetDocument(
      DB_COLLECTION.FACILITIES,
      newFacility.id,
      newFacility
    );
    if (res.status === DB_METHOD_STATUS.SUCCESS) {
      const updatedFacilities: TFacility[] = [
        ...currentFacilities,
        newFacility,
      ];
      setCurrentFacilities(updatedFacilities);
      toast.success("Facility added successfully ");
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
                <Input placeholder="Enter facility name" {...field} />
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
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea rows={10} placeholder="Enter address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 gap-2">
          <Label>Province</Label>
          <ProvinceSelect value={province} onChange={setProvince} />
        </div>
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City/Municipality</FormLabel>
              <FormControl>
                <Input placeholder="Enter city or municipality" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="border rounded-lg p-4">
          {currentSports.map((item) => {
            const isSelected = sportIDs.includes(item.id);
            return (
              <Badge
                onClick={() => {
                  const updates = isSelected
                    ? sportIDs.filter((s) => s != item.id)
                    : [...sportIDs, item.id];
                  setSportIDs(updates);
                }}
                variant={isSelected ? "default" : "secondary"}
                key={`sport-selection-${item.id}`}
                className={cn(isSelected ? "" : "")}
              >
                {item.name}
              </Badge>
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
