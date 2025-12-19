"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { CreateSportForm } from "@/components/forms/CreateSportForm";
import { CreateFacilityForm } from "@/components/forms/CreateFacilityForm";
import EmptyLayout from "@/components/custom-ui/EmptyLayout";
import { Badge } from "@/components/ui/badge";
function SettingsPage() {
  const { currentSports, currentFacilities } = useAppStore();
  const [isOpenAddSport, setIsOpenAddSport] = useState(false);
  const [isOpenAddFacility, setIsOpenAddFacility] = useState(false);
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
                  className="border p-2 rounded-lg"
                >
                  <div>{item.name}</div>
                  <div>
                    {facitlitySports.map((fs) => (
                      <Badge key={`${item.id}-${fs.id}`}>{fs.name}</Badge>
                    ))}
                  </div>
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
