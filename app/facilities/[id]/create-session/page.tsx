"use client";
import { CreateSessionForm } from "@/components/pages/facility/CreateSessionForm";
import { DB_COLLECTION, DB_METHOD_STATUS } from "@/lib/config";
import { dbFetchDocument } from "@/lib/firebase/actions";
import { TFacility } from "@/typings";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

function CreateSessionPage() {
  const { id: facilityID } = useParams();
  const [facility, setFacility] = useState<TFacility | null>(null);

  useEffect(() => {
    const fetchFacility = async () => {
      if (!facilityID) return;
      const res = await dbFetchDocument({
        collectionName: DB_COLLECTION.FACILITIES,
        id: facilityID as string,
      });
      if (res.status === DB_METHOD_STATUS.ERROR) {
        console.error(res.message);
        return;
      }
      if (!res.data) return;
      const facilityData = res.data as TFacility;
      setFacility(facilityData);
    };
    fetchFacility();
  }, [facilityID]);

  if (!facilityID) return null;
  return (
    <div className="space-y-4 grid grid-cols-1">
      <div>{facility?.name}</div>
      <CreateSessionForm facilityID={facilityID as string} />
    </div>
  );
}

export default CreateSessionPage;
