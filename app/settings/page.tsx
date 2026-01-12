"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LayoutDashboardIcon, PlusIcon, Users2Icon } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { CreateSportForm } from "@/components/forms/CreateSportForm";
import { CreateFacilityForm } from "@/components/forms/CreateFacilityForm";
import EmptyLayout from "@/components/custom-ui/EmptyLayout";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import UsersList from "@/components/settings/UsersList";
import ErrorCard from "@/components/custom-ui/ErrorCard";
function SettingsPage() {
  const { currentSports, currentFacilities, currentUser, setCurrentFacility } =
    useAppStore();
  const [isOpenAddSport, setIsOpenAddSport] = useState(false);
  const [isOpenAddFacility, setIsOpenAddFacility] = useState(false);
  const [isOpenUsers, setIsOpenUsers] = useState(false);

  const [selectedFacilityID, setSelectedFacilityID] = useState<string | null>(
    null
  );

  if (!currentUser) {
    return (
      <ErrorCard
        title="User not found"
        description="Please login to access this page."
        linkText="Go Back"
        redirectionLink={`/`}
      />
    );
  }

  return (
    <div className="p-2 space-y-4">
      <section className="flex flex-col gap-4">
        <div className="flex justify-between items-center gap-4">
          <h4 className="text-lg font-semibold">Sports</h4>
          <Button type="button" onClick={() => setIsOpenAddSport(true)}>
            <PlusIcon /> Add New Sport
          </Button>

          <Dialog open={isOpenAddSport} onOpenChange={setIsOpenAddSport}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adding a Sport</DialogTitle>
                <DialogDescription>
                  Fill all the required fields
                </DialogDescription>
              </DialogHeader>
              <CreateSportForm setClose={() => setIsOpenAddSport(false)} />
            </DialogContent>
          </Dialog>
        </div>
        {currentSports.length === 0 ? (
          <EmptyLayout>No Sports Found</EmptyLayout>
        ) : (
          <div className="flex-1 grid grid-cols-1 gap-2">
            {currentSports.map((item) => {
              return <div key={`sport-item-${item.id}`}>{item.name}</div>;
            })}
          </div>
        )}
      </section>
      <section className="flex flex-col gap-4">
        <div className="flex justify-between items-center gap-4">
          <h4 className="text-lg font-semibold">Facilities</h4>
          <Button type="button" onClick={() => setIsOpenAddFacility(true)}>
            <PlusIcon /> Add New Facility
          </Button>

          <Dialog open={isOpenAddFacility} onOpenChange={setIsOpenAddFacility}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adding a Facility</DialogTitle>
                <DialogDescription>
                  Fill all the required fields.
                </DialogDescription>
              </DialogHeader>
              <CreateFacilityForm
                setClose={() => setIsOpenAddFacility(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid md:flex gap-4">
          <div className="w-full md:max-w-sm">
            {currentFacilities.length === 0 ? (
              <EmptyLayout>No Facilities Found</EmptyLayout>
            ) : (
              <div className="flex-1 grid grid-cols-1 gap-2">
                {currentFacilities.map((item) => {
                  const facitlitySports = currentSports.filter((s) =>
                    item.sportIDs.includes(s.id)
                  );
                  return (
                    <div
                      key={`facility-item-${item.id}`}
                      className={cn(
                        "cursor-pointer text-start rounded-lg border"
                      )}
                    >
                      <div className="flex p-4">
                        <div className="flex-1">
                          <div className="flex-1">{item.name}</div>
                          <div className="flex flex-wrap gap-2">
                            {facitlitySports.map((fs) => (
                              <Badge key={`${item.id}-${fs.id}`}>
                                {fs.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            asChild
                            variant={"secondary"}
                            size={"icon"}
                            onClick={() => {
                              setCurrentFacility(item);
                            }}
                          >
                            <Link href={"/admin"}>
                              <LayoutDashboardIcon />
                            </Link>
                          </Button>
                          <Button
                            type="button"
                            variant={"secondary"}
                            size={"icon"}
                            onClick={() => {
                              setIsOpenUsers(true);
                              setSelectedFacilityID(item.id);
                            }}
                          >
                            <Users2Icon />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
      <Dialog open={isOpenUsers} onOpenChange={setIsOpenUsers}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Users</DialogTitle>
            <DialogDescription>
              Admins or staffs for this facility
            </DialogDescription>
          </DialogHeader>
          <UsersList facilityID={selectedFacilityID} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SettingsPage;
