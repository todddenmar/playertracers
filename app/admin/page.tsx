"use client";
import { useAppStore } from "@/lib/store";
import ErrorCard from "@/components/custom-ui/ErrorCard";
import Link from "next/link";

function FacilityAdminPage() {
  const { currentFacility } = useAppStore();

  if (!currentFacility) {
    return (
      <ErrorCard
        title="Facility not found"
        description="There was an error in viewing this page."
        linkText="Go Back"
        redirectionLink={`/`}
      />
    );
  }
  return (
    <div className="flex flex-col gap-4">
      <div>
        <Link href={"/admin/members"}>Members</Link>
      </div>
    </div>
  );
}

export default FacilityAdminPage;
