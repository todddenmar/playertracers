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
import { dbSetDocument, dbUpdateDocument } from "@/lib/firebase/actions";
import { TFacility, TFacilityUser, TUser } from "@/typings";
import { useAppStore } from "@/lib/store";
import LoadingComponent from "../custom-ui/LoadingComponent";
import { Input } from "../ui/input";

const FormSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  emailAddress: z.string(),
});

type CreateNewFacilityUserFormProps = {
  setClose: () => void;
  facility: TFacility;
};
export function CreateNewFacilityUserForm({
  setClose,
  facility,
}: CreateNewFacilityUserFormProps) {
  const { currentFacilities, setCurrentFacilities } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      emailAddress: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const { emailAddress, firstname, lastname } = data;
    setIsLoading(true);
    const newUser: TUser = {
      id: crypto.randomUUID(),
      emailAddress: emailAddress,
      firstName: firstname,
      lastName: lastname,
      isVerified: false,
      createdAt: new Date().toISOString(),
    };

    const resCreate = await dbSetDocument(
      DB_COLLECTION.USERS,
      newUser.id,
      newUser,
    );
    if (resCreate.status === DB_METHOD_STATUS.ERROR) {
      console.error(resCreate.message);
      return;
    }

    const updatedUserIDs: TFacilityUser[] = [
      ...(facility.facilityUsers || []),
      { userID: newUser.id, roleType: null },
    ];
    const resUPdate = await dbUpdateDocument(
      DB_COLLECTION.FACILITIES,
      facility.id,
      {
        userIDs: updatedUserIDs,
      },
    );

    if (resUPdate.status === DB_METHOD_STATUS.ERROR) {
      console.error(resUPdate.message);
      return;
    }

    const updatedFacilities = currentFacilities.map((item) =>
      item.id === facility.id ? { ...facility, userIDs: updatedUserIDs } : item,
    );
    setCurrentFacilities(updatedFacilities);
    toast.success("User created successfully ");
    setIsLoading(false);
    setClose();
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
