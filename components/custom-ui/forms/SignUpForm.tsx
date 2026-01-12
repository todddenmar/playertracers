"use client";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import LoadingComponent from "@/components/custom-ui/LoadingComponent";
import { auth, db } from "@/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import {
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { dbFetchCollectionWhere, dbSetDocument } from "@/lib/firebase/actions";
import { DB_COLLECTION, DB_METHOD_STATUS } from "@/lib/config";
import { TUser } from "@/typings";
const formSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, { message: "First name is required." })
      .max(50, { message: "First name must be under 50 characters." }),

    lastName: z
      .string()
      .trim()
      .min(1, { message: "Last name is required." })
      .max(50, { message: "Last name must be under 50 characters." }),
    username: z
      .string()
      .trim()
      .min(3, { message: "Username must be at least 3 characters." })
      .max(30, { message: "Username must be at most 30 characters." })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: "Username can only contain letters, numbers, and underscores.",
      }),
    emailAddress: z
      .string()
      .trim()
      .email({ message: "Invalid email address." }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters." }),

    confirmPassword: z
      .string()
      .min(6, { message: "Confirm password must be at least 6 characters." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

function SignUpForm() {
  // 1. Define your form.
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [usernameFound, setUsernameFound] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [emailTaken, setEmailTaken] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      firstName: "",
      lastName: "",
      emailAddress: "",
      password: "",
      confirmPassword: "",
    },
  });

  const username = useWatch({
    control: form.control,
    name: "username",
  });

  // Debounce: check username 1s after user stops typing
  useEffect(() => {
    if (!username || username.length < 3) return;

    const timeout = setTimeout(async () => {
      setCheckingUsername(true);

      const res = await dbFetchCollectionWhere({
        collectionName: DB_COLLECTION.USERS,
        fieldName: "username",
        fieldValue: username,
      });

      if (res.status === DB_METHOD_STATUS.ERROR) {
        toast.error(res.message);
        setCheckingUsername(false);
        return;
      }

      const resultData = res.data as TUser[];
      setUsernameFound(resultData.length > 0);
      setCheckingUsername(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [username]);

  const email = useWatch({
    control: form.control,
    name: "emailAddress",
  });

  useEffect(() => {
    if (!email || email.length < 5) return;

    const timeout = setTimeout(async () => {
      const q = query(
        collection(db, "users"),
        where("email", "==", email.trim().toLowerCase())
      );
      const snapshot = await getDocs(q);
      setEmailTaken(!snapshot.empty);
    }, 1000); // 1 second debounce

    return () => clearTimeout(timeout);
  }, [email]);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const { username, emailAddress, firstName, lastName } = values;
    if (usernameFound) {
      toast.error("Username already exist");
      return;
    }
    if (emailTaken) {
      toast.error("Email already taken");
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        emailAddress.trim(),
        values.password
      );

      const newUser: TUser = {
        uid: userCredential.user.uid,
        displayName:
          userCredential.user.displayName || `${firstName} ${lastName}`.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        emailAddress: emailAddress.trim(),
        photoURL: userCredential.user.photoURL,
        username: username.trim(),
        createdAt: new Date().toISOString(),
        timestamp: serverTimestamp(),
      };

      if (!newUser.uid) {
        console.error("user id not found");
        return;
      }
      const resUser = await dbSetDocument(
        DB_COLLECTION.USERS,
        newUser.uid,
        newUser
      );

      if (resUser.status === DB_METHOD_STATUS.ERROR) {
        console.log(resUser.message);
        setIsLoading(false);
        return;
      }
      toast.success("You have successfully created an account");
      router.push("/sign-in");
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code: string }).code === "auth/email-already-in-use"
      ) {
        toast.error("Email is already in use.");
      } else if (error instanceof Error) {
        console.error("Signup error:", error);
        toast.error(error.message);
      } else {
        console.error("Unknown error:", error);
        toast.error("An unknown error occurred");
      }
    }

    setIsLoading(false);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter first name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />{" "}
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="emailAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter email address"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {isLoading || checkingUsername ? (
          <LoadingComponent />
        ) : (
          <div className="flex justify-end">
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </div>
        )}
        <div className="text-sm flex items-center justify-center gap-2">
          Already have an account?{" "}
          <Link href={"/sign-in"}>
            <Button type="button" variant={"link"}>
              Sign In
            </Button>
          </Link>
        </div>
      </form>
    </Form>
  );
}

export default SignUpForm;
