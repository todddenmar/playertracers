"use client";
import { DB_COLLECTION, DB_METHOD_STATUS } from "@/lib/config";
import { dbFetchDocument } from "@/lib/firebase/actions";
import { TFacility } from "@/typings";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

function FacilityPage() {
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

  return (
    <div className="grid grid-cols-1">
      {facility?.name}
      {/* <Button asChild type="button">
        <Link href={"/facilities/" + facilityID + "/create-session"}>
          New Session
        </Link>
      </Button> */}
    </div>
  );
}

export default FacilityPage;
