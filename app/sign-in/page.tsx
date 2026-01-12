"use client";
import SignInForm from "@/components/custom-ui/forms/SignInForm";
import Image from "next/image";

function SignInPage() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <div className=" max-w-md w-full space-y-4 p-4">
        <div className="w-full relative h-25">
          <Image
            src={"/images/logo.png"}
            alt="app-logo"
            fill
            sizes="100%"
            priority
            className="object-contain relative"
          />
        </div>
        <h3 className="text-center text-lg font-semibold">Sign In</h3>
        <SignInForm />
      </div>
    </div>
  );
}

export default SignInPage;
