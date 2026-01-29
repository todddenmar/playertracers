import React, { useState } from "react";
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
import { TMembership } from "@/typings";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EditFacilityMemberForm } from "@/components/forms/EditFacilityMemberForm";

type FacilityMemberActionButtonProps = {
  member: TMembership;
};
function FacilityMemberActionButton({
  member,
}: FacilityMemberActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  return (
    <div>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button size={"icon"} type="button" variant={"ghost"}>
            <EllipsisVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setIsOpen(false);
              setIsOpenEdit(true);
            }}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem>Subscription</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isOpenEdit} onOpenChange={setIsOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Member</DialogTitle>
            <DialogDescription>
              Please fill the required fields.
            </DialogDescription>
          </DialogHeader>
          <EditFacilityMemberForm
            member={member}
            setClose={() => setIsOpenEdit(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default FacilityMemberActionButton;
