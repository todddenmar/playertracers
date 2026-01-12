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
import { useState } from "react";
import { Button } from "../ui/button";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { toast } from "sonner";
function UserAvatarButton() {
  const { currentUser, setCurrentUser } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const onSignOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        toast.success("Signed out successfully");
        setCurrentUser(null);
      })
      .catch((error) => {
        // An error happened.
        console.error(error);
      });
  };
  return (
    <div>
      {currentUser ? (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger>
            <Avatar>
              {currentUser.photoURL && (
                <AvatarImage src={currentUser.photoURL} />
              )}
              <AvatarFallback>{`${currentUser.displayName}`}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{currentUser?.displayName}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setIsOpen(false);
              }}
            >
              <Link href={"/settings"}>Settings</Link>
            </DropdownMenuItem>
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
