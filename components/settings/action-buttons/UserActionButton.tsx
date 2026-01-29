import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EllipsisVerticalIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TUser } from "@/typings";
import { REPEATING_TEXT } from "@/lib/config";
import Link from "next/link";
import { EditUserForm } from "@/components/forms/EditFacilityUserForm";

type UserActionButtonProps = {
  user: TUser;
};
function UserActionButton({ user }: UserActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isOpenLink, setIsOpenLink] = useState(false);
  return (
    <div>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button size={"icon"} variant={"secondary"}>
            <EllipsisVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Facility User</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setIsOpen(false);
              setIsEditOpen(true);
            }}
          >
            Edit User
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setIsOpen(false);
              setIsOpenLink(true);
            }}
          >
            Sync User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update User</DialogTitle>
            <DialogDescription>
              {REPEATING_TEXT.formDescription}
            </DialogDescription>
          </DialogHeader>
          <EditUserForm user={user} setClose={() => setIsEditOpen(false)} />
        </DialogContent>
      </Dialog>

      {isOpenLink && (
        <Dialog open={isOpenLink} onOpenChange={setIsOpenLink}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Firebase User</DialogTitle>
              <DialogDescription>
                {REPEATING_TEXT.formDescription}
              </DialogDescription>
            </DialogHeader>
            <div>
              <Button type="button" asChild className="w-full">
                <Link href={"/sync-user/" + user.id} target="_blank">
                  Go To Assignment Link
                </Link>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default UserActionButton;
