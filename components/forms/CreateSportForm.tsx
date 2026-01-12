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
import { TSport } from "@/typings";
import { useAppStore } from "@/lib/store";
import LoadingComponent from "../custom-ui/LoadingComponent";
import { Input } from "../ui/input";

const FormSchema = z.object({
  name: z.string(),
  description: z.string(),
});

type CreateSportFormProps = {
  setClose: () => void;
};
export function CreateSportForm({ setClose }: CreateSportFormProps) {
  const { currentSports, setCurrentSports } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const { name, description } = data;
    setIsLoading(true);
    const newSport: TSport = {
      id: crypto.randomUUID(),
      name: name,
      description: description,
    };
    const res = await dbSetDocument(
      DB_COLLECTION.SPORTS,
      newSport.id,
      newSport
    );
    if (res.status === DB_METHOD_STATUS.SUCCESS) {
      const updatedSports: TSport[] = [...currentSports, newSport];
      setCurrentSports(updatedSports);
      toast.success("Sport added successfully ");
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
                <Input placeholder="Enter sport name" {...field} />
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
        {isLoading ? (
          <LoadingComponent />
        ) : (
          <Button type="submit">Submit</Button>
        )}
      </form>
    </Form>
  );
}
