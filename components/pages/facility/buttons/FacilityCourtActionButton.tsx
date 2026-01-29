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
import { TCourt } from "@/typings";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EditNewFacilityCourtForm } from "@/components/forms/EditFacilityCourtForm";
import { REPEATING_TEXT } from "@/lib/config";

type FacilityCourtActionButtonProps = {
  court: TCourt;
};
function FacilityCourtActionButton({ court }: FacilityCourtActionButtonProps) {
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
          <DropdownMenuLabel>{court.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setIsOpen(false);
              setIsOpenEdit(true);
            }}
          >
            Edit
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isOpenEdit} onOpenChange={setIsOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Court</DialogTitle>
            <DialogDescription>
              {REPEATING_TEXT.formDescription}
            </DialogDescription>
          </DialogHeader>
          <EditNewFacilityCourtForm
            court={court}
            setClose={() => setIsOpenEdit(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default FacilityCourtActionButton;
