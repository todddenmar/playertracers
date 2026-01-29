import EmptyLayout from "@/components/custom-ui/EmptyLayout";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { ROLE_TYPE } from "@/lib/config";
import { CreateNewFacilityCourtForm } from "@/components/forms/CreateNewFacilityCourtForm";
import FacilityCourtActionButton from "@/components/pages/facility/buttons/FacilityCourtActionButton";

function FacilityCourtsSection() {
  const { currentUser, currentCourts, currentFacility } = useAppStore();
  const [isOpenAddCourt, setIsOpenAddCourt] = useState(false);

  const facilityUser = currentFacility?.facilityUsers?.find(
    (item) => item.userID === currentUser?.id,
  );

  return (
    <div className="flex-1 border p-4 rounded-lg flex flex-col gap-4">
      <div className="flex justify-between items-center gap-4">
        <h4 className="text-lg font-semibold">Courts</h4>
        {facilityUser?.roleType
          ? [ROLE_TYPE.ADMIN, ROLE_TYPE.MANAGER].includes(
              facilityUser?.roleType,
            ) && (
              <Button type="button" onClick={() => setIsOpenAddCourt(true)}>
                <PlusIcon />
                Add New Court
              </Button>
            )
          : null}

        <Dialog open={isOpenAddCourt} onOpenChange={setIsOpenAddCourt}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adding a Court</DialogTitle>

              <DialogDescription>
                Fill all the required fields
              </DialogDescription>
            </DialogHeader>
            <CreateNewFacilityCourtForm
              setClose={() => setIsOpenAddCourt(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex-1 flex flex-col gap-4">
        {currentCourts.length > 0 ? (
          <div className="space-y-2">
            {currentCourts.map((court) => {
              return (
                <div
                  key={`Court-item-${court.id}`}
                  className="flex items-center gap-2  border rounded-lg p-2 dark:bg-white/5"
                >
                  <div className="space-y-2 flex-1">
                    <div>
                      <div className="font-semibold">{court.name}</div>
                      <p className="text-sm text-muted-foreground">
                        {court.description}
                      </p>
                    </div>
                    <div className="flex justify-end text-muted-foreground text-xs"></div>
                  </div>
                  <FacilityCourtActionButton court={court} />
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyLayout>None</EmptyLayout>
        )}
      </div>
    </div>
  );
}

export default FacilityCourtsSection;
