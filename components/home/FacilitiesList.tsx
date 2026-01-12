"use client";
import { useAppStore } from "@/lib/store";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import Link from "next/link";

function FacilitiesList() {
  const { currentFacilities, currentSports } = useAppStore();
  return (
    <div className="flex flex-col gap-4">
      {currentFacilities.map((item) => {
        const facitlitySports = currentSports.filter((s) =>
          item.sportIDs.includes(s.id)
        );
        return (
          <div key={`facility-${item.id}`} className="border rounded-lg p-2">
            <div className="flex">
              <div className="flex-1">
                <div>{item.name}</div>
                <div className="flex flex-wrap gap-2">
                  {facitlitySports.map((fs) => (
                    <Badge key={`${item.id}-${fs.id}`}>{fs.name}</Badge>
                  ))}
                </div>
              </div>
              <Button>
                <Link href={`/facilities/${item.id}`}>View</Link>
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default FacilitiesList;
