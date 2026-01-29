"use client";
import { Button } from "@/components/ui/button";
import { db } from "@/firebase";
import { DB_COLLECTION, DB_METHOD_STATUS } from "@/lib/config";
import { dbUpdateDocument } from "@/lib/firebase/actions";
import { useAppStore } from "@/lib/store";
import { TUser } from "@/typings";
import { doc, onSnapshot } from "firebase/firestore";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function SyncUserPage() {
  const params = useParams();
  const { id } = params;
  const { currentFirebaseUser } = useAppStore();
  const userID = id as string;
  const [userData, setUserData] = useState<TUser | null>(null);
  useEffect(() => {
    if (!userID) return;
    const unsubscribe = onSnapshot(
      doc(db, DB_COLLECTION.USERS, userID),
      (doc) => {
        setUserData((doc.data() as TUser) || null);
      },
    );

    return () => unsubscribe();
  }, [userID]);

  console.log({ currentFirebaseUser });
  const onUpdateData = async () => {
    const res = await dbUpdateDocument(DB_COLLECTION.USERS, userID, {
      uid: currentFirebaseUser?.uid,
    });
    if (res.status === DB_METHOD_STATUS.ERROR) {
      console.error(res.message);
      return;
    }
    toast.success("User account synched");
  };
  return (
    <div className="p-4">
      {userData?.uid ? (
        <div className="flex flex-col items-center justify-center">
          <div className="font-semibold">Already Synched</div>
        </div>
      ) : (
        <Button onClick={onUpdateData} type="button">
          Sync Account
        </Button>
      )}
    </div>
  );
}

export default SyncUserPage;
