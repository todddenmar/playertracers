"use client";
import { SettingsIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { dbFetchCollection } from "@/lib/firebase/actions";
import { DB_METHOD_STATUS } from "@/lib/config";
import { useAppStore } from "@/lib/store";
import { TFacility, TSport } from "@/typings";

function Header() {
  const { setCurrentSports, setCurrentFacilities } = useAppStore();
  useEffect(() => {
    const fetchSports = async () => {
      const res = await dbFetchCollection("sports");
      if (res.status === DB_METHOD_STATUS.ERROR) {
        console.error(res.message);
        return;
      }
      setCurrentSports((res.data as TSport[]) || []);
    };
    fetchSports();
    const fetchFacilities = async () => {
      const res = await dbFetchCollection("facilities");
      if (res.status === DB_METHOD_STATUS.ERROR) {
        console.error(res.message);
        return;
      }
      setCurrentFacilities((res.data as TFacility[]) || []);
    };
    fetchFacilities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <Button size={"icon"} type="button">
        <Link href={"/settings"}>
          <SettingsIcon />
        </Link>
      </Button>
    </div>
  );
}

export default Header;
