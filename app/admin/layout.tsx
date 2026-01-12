"use client";
import { ADMIN_LINKS } from "@/lib/config";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

function AdminLayout({ children }: { children: ReactNode }) {
  const { currentFacility } = useAppStore();
  const pathname = usePathname();
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
                  : "text-muted-foreground border-transparent"
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
