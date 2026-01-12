"use client";
import React, { useEffect } from "react";

import { TMembership } from "@/typings";
import { dbFetchSubCollection } from "@/lib/firebase/actions";
import { DB_COLLECTION, DB_METHOD_STATUS } from "@/lib/config";
import { useAppStore } from "@/lib/store";
import ErrorCard from "@/components/custom-ui/ErrorCard";
import Link from "next/link";

function FacilityAdminPage() {
  const { setCurrentMembers, currentFacility } = useAppStore();

  useEffect(() => {
    const fetchFacilityMembers = async () => {
      if (!currentFacility) return;
      const res = await dbFetchSubCollection({
        collectionName: DB_COLLECTION.FACILITIES,
        id: currentFacility.id,
        collectionName2: DB_COLLECTION.MEMBERS,
      });
      if (res.status === DB_METHOD_STATUS.ERROR) {
        console.error(res.message);
        return;
      }
      if (!res.data) return;
      const members = res.data as TMembership[];
      setCurrentMembers(members);
    };
    fetchFacilityMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFacility]);

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
