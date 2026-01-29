import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppStore } from "@/lib/store";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/firebase";
import { toast } from "sonner";
import { dbFetchCollectionWhere } from "@/lib/firebase/actions";
import { DB_COLLECTION, DB_METHOD_STATUS } from "@/lib/config";
import { TUser } from "@/typings";
function UserAvatarButton() {
  const { setCurrentUser, setCurrentFirebaseUser, currentFirebaseUser } =
    useAppStore();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const onSignOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        toast.success("Signed out successfully");
        setCurrentUser(null);
        setCurrentFirebaseUser(null);
      })
      .catch((error) => {
        // An error happened.
        console.error(error);
      });
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const isAdminEmail =
          process.env.NEXT_PUBLIC_ADMIN_EMAIL === firebaseUser.email;
        setIsAdmin(isAdminEmail);
        const hasData = await getUserData(firebaseUser);
        if (hasData) {
          console.log("has user data");
        }

        setCurrentFirebaseUser({
          email: firebaseUser.email || "",
          displayName: firebaseUser.displayName || "",
          photoURL: firebaseUser.photoURL,
          uid: firebaseUser.uid,
        });
        console.log({ firebaseUser });
      } else {
        setCurrentUser(null);
        setCurrentFirebaseUser(null);
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getUserData = async (user: User) => {
    const res = await dbFetchCollectionWhere({
      collectionName: DB_COLLECTION.USERS,
      fieldName: "uid",
      fieldValue: user.uid,
    });
    if (res.status === DB_METHOD_STATUS.ERROR) {
      console.log(res.message);
      return;
    }
    if (res.data) {
      const firebaseUser = res.data[0] as TUser;
      setCurrentUser(firebaseUser);
      if (firebaseUser) {
        return true;
      }
      return false;
    }
    return false;
  };
  return (
    <div>
      {currentFirebaseUser ? (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger>
            <Avatar>
              {currentFirebaseUser.photoURL && (
                <AvatarImage src={currentFirebaseUser.photoURL} />
              )}
              <AvatarFallback>{`${currentFirebaseUser.displayName}`}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>
              {currentFirebaseUser?.displayName}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {isAdmin && (
              <DropdownMenuItem
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                <Link href={"/settings"}>Settings</Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => {
                onSignOut();
              }}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link href={"/sign-in"}>
          <Button type="button">Sign In</Button>
        </Link>
      )}
    </div>
  );
}

export default UserAvatarButton;
