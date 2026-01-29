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
import { TUser } from "@/typings";
import LoadingComponent from "../custom-ui/LoadingComponent";
import { Input } from "../ui/input";

const FormSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  emailAddress: z.string(),
});

type EditUserFormProps = {
  setClose: () => void;
  user: TUser;
};
export function EditUserForm({ setClose, user }: EditUserFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstname: user.firstName || "",
      lastname: user.lastName || "",
      emailAddress: user.emailAddress || "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const { emailAddress, firstname, lastname } = data;
    setIsLoading(true);
    const updates: Partial<TUser> = {
      emailAddress: emailAddress,
      firstName: firstname,
      lastName: lastname,
      updatedAt: new Date().toISOString(),
    };

    const res = await dbUpdateDocument(DB_COLLECTION.USERS, user.id, updates);

    if (res.status === DB_METHOD_STATUS.SUCCESS) {
      toast.success("User updated successfully ");
      setIsLoading(false);
      setClose();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        <FormField
          control={form.control}
          name="emailAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter email address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Firstname</FormLabel>
                <FormControl>
                  <Input placeholder="Enter firstname" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lastname</FormLabel>
                <FormControl>
                  <Input placeholder="Enter lastname" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
