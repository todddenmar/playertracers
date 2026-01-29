import EmptyLayout from "@/components/custom-ui/EmptyLayout";
import { cn, customDateFormat } from "@/lib/utils";
import { isBefore, startOfDay } from "date-fns";
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
import { ROLE_TYPE, SKILL_LEVELS } from "@/lib/config";
import { CreateNewFacilityMemberForm } from "@/components/forms/CreateNewFacilityMemberForm";
import FacilityMemberActionButton from "@/components/pages/facility/buttons/FacilityActionButton";

function FacilityMembersSection() {
  const { currentUser, currentMembers, currentFacility } = useAppStore();
  const [isOpenAddMember, setIsOpenAddMember] = useState(false);
  const facilityUser = currentFacility?.facilityUsers?.find(
    (item) => item.userID === currentUser?.id,
  );

  return (
    <div className="flex-1 border p-4 rounded-lg flex flex-col gap-4">
      <div className="flex justify-between items-center gap-4">
        <h4 className="text-lg font-semibold">Members</h4>
        {facilityUser?.roleType
          ? [ROLE_TYPE.ADMIN, ROLE_TYPE.MANAGER].includes(
              facilityUser?.roleType,
            ) && (
              <Button type="button" onClick={() => setIsOpenAddMember(true)}>
                <PlusIcon />
                Add New Member
              </Button>
            )
          : null}

        <Dialog open={isOpenAddMember} onOpenChange={setIsOpenAddMember}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adding a Member</DialogTitle>
              <DialogDescription>
                Fill all the required fields
              </DialogDescription>
            </DialogHeader>
            <CreateNewFacilityMemberForm
              setClose={() => setIsOpenAddMember(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex-1 flex flex-col gap-4">
        {SKILL_LEVELS.map((item, idx) => {
          const membersBySkill = currentMembers.filter(
            (m) => m.skillLevel === item.id,
          );
          return (
            <div
              key={`skill-level-${item}-${idx}`}
              className="flex flex-col gap-2"
            >
              <div>
                <div>
                  <span
                    style={{
                      color: item.color.text,
                    }}
                    className={cn("font-semibold")}
                  >
                    {item.label}
                  </span>{" "}
                  <span className="text-muted-foreground">
                    {membersBySkill.length}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>
              {membersBySkill.length > 0 ? (
                <div className="space-y-2">
                  {membersBySkill.map((member) => {
                    const isExpired = isBefore(
                      new Date(member.expirationDate),
                      startOfDay(new Date()),
                    );
                    return (
                      <div
                        key={`member-item-${member.id}`}
                        className="flex items-center gap-2  border rounded-lg p-2 dark:bg-white/5"
                      >
                        <div className="space-y-2 flex-1">
                          <div>
                            <div>{`${member.firstName} ${member.lastName}`}</div>
                          </div>
                          <div className="flex justify-end text-muted-foreground text-xs">
                            <div
                              className={isExpired ? "text-destructive" : ""}
                            >
                              {isExpired ? "Expired: " : "Expiration Date: "}
                              {customDateFormat(
                                new Date(member.expirationDate),
                              )}
                            </div>
                          </div>
                        </div>
                        <FacilityMemberActionButton member={member} />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <EmptyLayout>None</EmptyLayout>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FacilityMembersSection;
