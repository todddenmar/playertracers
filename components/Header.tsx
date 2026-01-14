"use client";
import { SettingsIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  dbFetchCollection,
  dbFetchDocument,
  dbFetchSubCollection,
} from "@/lib/firebase/actions";
import { DB_COLLECTION, DB_METHOD_STATUS } from "@/lib/config";
import { useAppStore } from "@/lib/store";
import { TFacility, TMembership, TSport } from "@/typings";
import UserAvatarButton from "./custom-ui/UserAvatarButton";
import Image from "next/image";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";
import Cookies from "js-cookie";
function Header() {
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    setCurrentSports,
    setCurrentFacilities,
    setCurrentUser,
    setCurrentFacility,
    setCurrentMembers,
  } = useAppStore();

  useEffect(() => {
    const id = Cookies.get("facilityID");
    if (id) {
      const fetchFacility = async () => {
        const res = await dbFetchDocument({
          collectionName: DB_COLLECTION.FACILITIES,
          id: id,
        });
        if (res.status === DB_METHOD_STATUS.ERROR) {
          console.error(res.message);
          return;
        }
        if (res.data) {
          console.log({ res: res.data });
          setCurrentFacility(res.data as TFacility);
        }
      };
      fetchFacility();

      const fetchMembers = async () => {
        const res = await dbFetchSubCollection({
          collectionName: DB_COLLECTION.FACILITIES,
          id: id,
          collectionName2: DB_COLLECTION.MEMBERS,
        });
        if (res.status === DB_METHOD_STATUS.ERROR) {
          console.error(res.message);
          return;
        }
        if (res.data) {
          setCurrentMembers(res.data as TMembership[]);
        }
      };
      fetchMembers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const isAdminEmail =
          process.env.NEXT_PUBLIC_ADMIN_EMAIL === firebaseUser.email;
        setIsAdmin(isAdminEmail);
        setCurrentUser({
          emailAddress: firebaseUser.email || "",
          displayName: firebaseUser.displayName || "",
          photoURL: firebaseUser.photoURL,
        });
        console.log({ firebaseUser });
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
    <div className="flex p-4 justify-between items-center">
      <Link href={"/"} className="flex items-center gap-2">
        <div className="w-10 relative h-10">
          <Image
            src={"/images/logo.png"}
            alt="app-logo"
            fill
            sizes="100%"
            priority
            className="object-contain relative"
          />
        </div>
        <span className="font-bold font-main">PlayerTracers</span>
      </Link>
      <div className="flex items-center gap-2">
        {isAdmin && (
          <Button asChild size={"icon"} type="button" variant={"secondary"}>
            <Link href={"/settings"}>
              <SettingsIcon />
            </Link>
          </Button>
        )}
        <UserAvatarButton />
      </div>
    </div>
  );
}

export default Header;
