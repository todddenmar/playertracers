import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { auth } from "@/firebase";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import {
  dbFetchCollectionWhere,
  dbFetchDocument,
} from "@/lib/firebase/actions";
import { DB_COLLECTION, DB_METHOD_STATUS } from "@/lib/config";
import { TUser } from "@/typings";
import { Separator } from "@/components/ui/separator";
const formSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, { message: "Username must be at least 3 characters." })
    .max(30, { message: "Username must be at most 30 characters." })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores.",
    }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

function SignInForm() {
  // 1. Define your form.
  const { setCurrentUser, setCurrentFirebaseUser } = useAppStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const provider = new GoogleAuthProvider();

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const { username, password } = values;

    setIsLoading(true);

    const resUser = await dbFetchCollectionWhere({
      collectionName: DB_COLLECTION.USERS,
      fieldName: "username",
      fieldValue: username,
    });

    if (resUser.status === DB_METHOD_STATUS.ERROR) {
      console.log(resUser.message);
      setIsLoading(false);
      return;
    }
    if (!resUser.data) {
      console.log({ resUser });
      toast.error("No user found with this username");
      setIsLoading(false);
      return;
    }
    const { emailAddress } = resUser.data[0] as TUser;
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        emailAddress,
        password,
      );
      const user = userCredential.user;
      getUserData(user.uid);
      toast.success("Signed in successfully");
      router.push("/");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "An unknown error occurred");
    }
    setIsLoading(false);
  }

  const onLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        if (user) {
          setCurrentFirebaseUser({
            uid: user.uid,
            displayName: user.displayName || "No name",
            email: user.email || "No Email",
            photoURL: user.photoURL || null,
          });
        }
        toast.success("Signed in successfully");
        router.push("/");
      })
      .catch((error) => {
        toast.error(error.message);
        console.log({ error });
      });
  };

  const getUserData = async (id: string) => {
    const res = await dbFetchDocument({
      collectionName: DB_COLLECTION.USERS,
      id: id,
    });
    if (res.status === DB_METHOD_STATUS.ERROR) {
      console.log(res.message);
      return;
    }
    const firebaseUser = res.data as TUser;
    if (firebaseUser.uid)
      setCurrentFirebaseUser({
        uid: firebaseUser.uid,
        displayName: firebaseUser.displayName || "No name",
        email: firebaseUser.emailAddress || "No Email",
        photoURL: firebaseUser.photoURL || null,
      });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

        {isLoading ? (
          <LoadingComponent />
        ) : (
          <div className="flex justify-end">
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Separator className="flex-1" /> or <Separator className="flex-1" />
        </div>
        <div>
          <Button
            type="button"
            variant={"secondary"}
            className="w-full"
            onClick={onLogin}
          >
            <svg width="16" height="16" data-view-component="true">
              <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                width="16"
                height="16"
                data-view-component="true"
                className="octicon color-fg-default"
              >
                <g clipPath="url(#clip0_643_9687)">
                  <path
                    d="M8.00018 3.16667C9.18018 3.16667 10.2368 3.57333 11.0702 4.36667L13.3535 2.08333C11.9668 0.793333 10.1568 0 8.00018 0C4.87352 0 2.17018 1.79333 0.853516 4.40667L3.51352 6.47C4.14352 4.57333 5.91352 3.16667 8.00018 3.16667Z"
                    fill="#EA4335"
                  ></path>
                  <path
                    d="M15.66 8.18335C15.66 7.66002 15.61 7.15335 15.5333 6.66669H8V9.67335H12.3133C12.12 10.66 11.56 11.5 10.72 12.0667L13.2967 14.0667C14.8 12.6734 15.66 10.6134 15.66 8.18335Z"
                    fill="#4285F4"
                  ></path>
                  <path
                    d="M3.51 9.53001C3.35 9.04668 3.25667 8.53334 3.25667 8.00001C3.25667 7.46668 3.34667 6.95334 3.51 6.47001L0.85 4.40668C0.306667 5.48668 0 6.70668 0 8.00001C0 9.29334 0.306667 10.5133 0.853333 11.5933L3.51 9.53001Z"
                    fill="#FBBC05"
                  ></path>
                  <path
                    d="M8.0001 16C10.1601 16 11.9768 15.29 13.2968 14.0633L10.7201 12.0633C10.0034 12.5467 9.0801 12.83 8.0001 12.83C5.91343 12.83 4.14343 11.4233 3.5101 9.52667L0.850098 11.59C2.1701 14.2067 4.87343 16 8.0001 16Z"
                    fill="#34A853"
                  ></path>
                </g>
                <defs>
                  <clipPath id="clip0_643_9687">
                    <rect width="16" height="16" fill="white"></rect>
                  </clipPath>
                </defs>
              </svg>
            </svg>
            Login Via Google
          </Button>
        </div>
        <div className="text-sm flex justify-center gap-2 items-center">
          No account yet?{" "}
          <Link href={"/sign-up"}>
            <Button type="button" variant={"link"}>
              Create an account
            </Button>
          </Link>
        </div>
      </form>
    </Form>
  );
}

export default SignInForm;
