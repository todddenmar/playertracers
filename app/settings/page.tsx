"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BadgeAlertIcon,
  BadgeCheckIcon,
  LayoutDashboardIcon,
  PlusIcon,
  UserIcon,
  Users2Icon,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { CreateSportForm } from "@/components/forms/CreateSportForm";
import { CreateFacilityForm } from "@/components/forms/CreateFacilityForm";
import EmptyLayout from "@/components/custom-ui/EmptyLayout";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import ErrorCard from "@/components/custom-ui/ErrorCard";
import Cookies from "js-cookie";
import SectionTitle from "@/components/custom-ui/SectionTitle";
import { dbFetchCollection } from "@/lib/firebase/actions";
import { DB_COLLECTION, DB_METHOD_STATUS } from "@/lib/config";
import { TFacility, TUser } from "@/typings";
import UserActionButton from "@/components/settings/action-buttons/UserActionButton";
import FacilityUsersList from "@/components/settings/FacilityUsersList";
import AssignUserForm from "@/components/settings/forms/AssignUserForm";
function SettingsPage() {
  const {
    currentSports,
    currentFacilities,
    currentUsers,
    currentFirebaseUser,
    setCurrentFacility,
    setCurrentUsers,
  } = useAppStore();
  const [isOpenAddSport, setIsOpenAddSport] = useState(false);
  const [isOpenAddFacility, setIsOpenAddFacility] = useState(false);
  const [isOpenUsers, setIsOpenUsers] = useState(false);

  const [selectedFacilityID, setSelectedFacilityID] = useState<string | null>(
    null,
  );

  const [facilityData, setFacilityData] = useState<TFacility | null>(null);

  useEffect(() => {
    const onSettingFacility = () => {
      const res = currentFacilities.find(
        (item) => item.id === selectedFacilityID,
      );
      if (res) {
        setFacilityData(res);
      }
    };
    onSettingFacility();
  }, [selectedFacilityID, currentFacilities]);

  useEffect(() => {
    const fetchCurrentUsers = async () => {
      const res = await dbFetchCollection(DB_COLLECTION.USERS);
      if (res.status === DB_METHOD_STATUS.ERROR) {
        console.error(res.message);
        return;
      }
      if (res.data) {
        setCurrentUsers(res.data as TUser[]);
      }
    };
    fetchCurrentUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const isAdmin =
    process.env.NEXT_PUBLIC_ADMIN_EMAIL === currentFirebaseUser?.email;
  if (!currentFirebaseUser) {
    return (
      <ErrorCard
        title="User not found"
        description="Please login to access this page."
        linkText="Go Back"
        redirectionLink={`/`}
      />
    );
  }
  if (!isAdmin) {
    return (
      <ErrorCard
        title="No Access"
        description="Please login as an admin."
        linkText="Go Back"
        redirectionLink={`/`}
      />
    );
  }

  return (
    <div className="p-2 space-y-4">
      <section className="flex flex-col gap-4">
        <div className="flex justify-between items-center gap-4">
          <SectionTitle>Sports</SectionTitle>
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
          <SectionTitle>Facilities</SectionTitle>
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
                    item.sportIDs.includes(s.id),
                  );
                  return (
                    <div
                      key={`facility-item-${item.id}`}
                      className={cn(
                        "cursor-pointer text-start rounded-lg border",
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
                              Cookies.set("facilityID", item.id, {
                                expires: 1, // days
                                path: "/",
                              });
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

      <section className="flex flex-col gap-4">
        <div className="flex justify-between items-center gap-4">
          <SectionTitle>Users</SectionTitle>
          <Button type="button" onClick={() => setIsOpenUsers(true)}>
            Add Users
          </Button>

          <Dialog open={isOpenUsers} onOpenChange={setIsOpenUsers}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Users</DialogTitle>
                <DialogDescription>
                  Admins or staffs for this facility
                </DialogDescription>
              </DialogHeader>
              <AssignUserForm facility={facilityData} />
              {selectedFacilityID && (
                <FacilityUsersList facilityID={selectedFacilityID} />
              )}
            </DialogContent>
          </Dialog>
        </div>
        {currentUsers.length === 0 ? (
          <EmptyLayout>No Users Found</EmptyLayout>
        ) : (
          <div className="flex-1 grid grid-cols-1 gap-2">
            {currentUsers.map((item) => {
              return (
                <div
                  key={`user-item-${item.id}`}
                  className="flex items-center gap-4"
                >
                  <div className="rounded-full h-12 aspect-square bg-muted flex flex-col items-center justify-center">
                    <UserIcon className="text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {`${item.firstName} ${item.lastName}`}{" "}
                      {item.uid ? (
                        <BadgeCheckIcon size={18} />
                      ) : (
                        <BadgeAlertIcon size={18} />
                      )}
                    </div>
                    <div className="text-muted-foreground">
                      {item.emailAddress}
                    </div>
                  </div>
                  <UserActionButton user={item} />
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default SettingsPage;
