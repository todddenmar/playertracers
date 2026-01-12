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
import _ from "lodash";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useState } from "react";
import { DB_COLLECTION, DB_METHOD_STATUS, ROLE_TYPE } from "@/lib/config";
import { dbUpdateDocument } from "@/lib/firebase/actions";
import { TFacility, TFacilityUser, TRoleType } from "@/typings";
import { useAppStore } from "@/lib/store";
import LoadingComponent from "../custom-ui/LoadingComponent";
import { Input } from "../ui/input";

const FormSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  emailAddress: z.string(),
});

type EditFacilityUserFormProps = {
  setClose: () => void;
  facility: TFacility;
  facilityUser: TFacilityUser;
};
export function EditFacilityUserForm({
  setClose,
  facility,
  facilityUser,
}: EditFacilityUserFormProps) {
  const { currentFacilities, setCurrentFacilities } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [roleType, setRoleType] = useState<string>(facilityUser.roleType);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstname: facilityUser.firstName || "",
      lastname: facilityUser.lastName || "",
      emailAddress: facilityUser.emailAddress || "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!roleType) {
      toast.error("Role type required");
      return;
    }
    const { emailAddress, firstname, lastname } = data;
    setIsLoading(true);
    const updatedUser: TFacilityUser = {
      ...facilityUser,
      emailAddress: emailAddress,
      firstName: firstname,
      lastName: lastname,
      roleType: roleType as TRoleType,
      updatedAt: new Date().toISOString(),
    };
    const updatedUsers = facility.users.map((item) =>
      item.id === facilityUser.id ? updatedUser : item
    );
    const res = await dbUpdateDocument(DB_COLLECTION.FACILITIES, facility.id, {
      users: updatedUsers,
    });

    const updatedFacilities = currentFacilities.map((item) =>
      item.id === facility.id ? { ...facility, users: updatedUsers } : item
    );
    setCurrentFacilities(updatedFacilities);
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
        <Select value={roleType} onValueChange={setRoleType}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Role" />
          </SelectTrigger>
          <SelectContent>
            {[ROLE_TYPE.ADMIN, ROLE_TYPE.MANAGER].map((item, idx) => {
              return (
                <SelectItem key={`role-type-${idx}`} value={item}>
                  {_.startCase(item.toLowerCase())}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        {isLoading ? (
          <LoadingComponent />
        ) : (
          <Button type="submit">Submit</Button>
        )}
      </form>
    </Form>
  );
}
