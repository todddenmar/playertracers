"use client";
import { ADMIN_LINKS, DB_COLLECTION, DB_METHOD_STATUS } from "@/lib/config";
import { dbFetchSubCollection } from "@/lib/firebase/actions";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { TCourt, TMembership } from "@/typings";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";

function AdminLayout({ children }: { children: ReactNode }) {
  const { currentFacility, setCurrentMembers, setCurrentCourts } =
    useAppStore();
  const pathname = usePathname();

  useEffect(() => {
    const fetchFacilityMembers = async () => {
      if (!currentFacility) return;
      const res = await dbFetchSubCollection({
        collectionName: DB_COLLECTION.FACILITIES,
        id: currentFacility.id,
        collectionName2: DB_COLLECTION.MEMBERS,
      });
      if (res.status === DB_METHOD_STATUS.ERROR) {
        console.error(res.message);
        return;
      }
      if (!res.data) return;
      const members = res.data as TMembership[];
      setCurrentMembers(members);
    };
    fetchFacilityMembers();

    const fetchFacilityCourts = async () => {
      if (!currentFacility) return;
      const res = await dbFetchSubCollection({
        collectionName: DB_COLLECTION.FACILITIES,
        id: currentFacility.id,
        collectionName2: DB_COLLECTION.COURTS,
      });
      if (res.status === DB_METHOD_STATUS.ERROR) {
        console.error(res.message);
        return;
      }
      if (!res.data) return;
      const courts = res.data as TCourt[];
      setCurrentCourts(courts.sort((a, b) => a.orderNumber - b.orderNumber));
    };
    fetchFacilityCourts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFacility]);

  return (
    <main className="flex flex-col gap-4">
      <h1 className="font-semibold text-2xl">{currentFacility?.name}</h1>
      <div className="flex items-center gap-4 w-full overflow-x-auto">
        {ADMIN_LINKS.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={`admin-link-${item.id}`}
              href={item.path}
              className={cn(
                "border-b",
                isActive
                  ? "border-white"
                  : "text-muted-foreground border-transparent",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
      <div className="flex-1 flex flex-col gap-4">{children}</div>
    </main>
  );
}

export default AdminLayout;
