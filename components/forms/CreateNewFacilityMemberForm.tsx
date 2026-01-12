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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useState } from "react";
import { DB_COLLECTION, DB_METHOD_STATUS, SKILL_LEVELS } from "@/lib/config";
import { dbSetSubDocument } from "@/lib/firebase/actions";
import { TMembership } from "@/typings";
import { useAppStore } from "@/lib/store";
import LoadingComponent from "../custom-ui/LoadingComponent";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const FormSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  emailAddress: z.string(),
  mobileNumber: z.string().length(11, {
    message: "Mobile number must be the 11 digits ex. 09123456789",
  }),
});

type CreateNewFacilityMemberFormProps = {
  setClose: () => void;
};
export function CreateNewFacilityMemberForm({
  setClose,
}: CreateNewFacilityMemberFormProps) {
  const { currentFacility, currentMembers, setCurrentMembers } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [skillLevel, setSkillLevel] = useState<string>("");
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      emailAddress: "",
      mobileNumber: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!currentFacility) {
      toast.error("Facility not found");
      return;
    }
    if (!skillLevel) {
      toast.error("Skill level required");
      return;
    }
    const { emailAddress, firstname, lastname } = data;
    setIsLoading(true);
    const newMember: TMembership = {
      id: crypto.randomUUID(),
      playerID: null,
      emailAddress: emailAddress,
      firstName: firstname,
      lastName: lastname,
      createdAt: new Date().toISOString(),
      expirationDate: new Date().toISOString(),
      skillLevel: skillLevel,
    };
    const res = await dbSetSubDocument(
      DB_COLLECTION.FACILITIES,
      currentFacility.id,
      DB_COLLECTION.MEMBERS,
      newMember.id,
      newMember
    );

    if (res.status === DB_METHOD_STATUS.SUCCESS) {
      const updatedMembers = [...(currentMembers || []), newMember];
      setCurrentMembers(updatedMembers);

      toast.success("Member added successfully ");
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
        <FormField
          control={form.control}
          name="mobileNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile Number</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter Mobile Number"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 gap-2">
          <Label>Skill Level</Label>
          <Select value={skillLevel} onValueChange={setSkillLevel}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              {SKILL_LEVELS.map((item, idx) => {
                return (
                  <SelectItem key={`skill-level-${idx}`} value={item.id}>
                    {item.label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
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
