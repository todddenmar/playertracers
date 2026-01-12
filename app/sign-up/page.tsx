"use client";
import SignUpForm from "@/components/custom-ui/forms/SignUpForm";
import Image from "next/image";

function SignUpPage() {
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
        <h3 className="text-center text-lg font-semibold">Sign Up</h3>
        <SignUpForm />
      </div>
    </div>
  );
}

export default SignUpPage;
