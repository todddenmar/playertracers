import { useAppStore } from "@/lib/store";
import React from "react";

interface FacilityUsersListProps {
  facilityID: string;
}
function FacilityUsersList({ facilityID }: FacilityUsersListProps) {
  const { currentFacilities, currentUsers } = useAppStore();
  const facility = currentFacilities.find((item) => item.id === facilityID);

  return (
    <section>
      {facility?.facilityUsers?.map((item) => {
        const userData = currentUsers.find((u) => u.id === item.userID);
        return (
          <div
            key={`facility-user-${item.userID}`}
            className="flex items-center justify-between gap-4 w-full border rounded-lg p-2"
          >
            <div> {`${userData?.firstName} ${userData?.lastName}`}</div>
            <div>{item.roleType}</div>
          </div>
        );
      })}
    </section>
  );
}

export default FacilityUsersList;
