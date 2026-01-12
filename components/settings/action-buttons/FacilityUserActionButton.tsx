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
import { EditFacilityUserForm } from "@/components/forms/EditFacilityUserForm";
import { TFacility, TFacilityUser } from "@/typings";

type FacilityUserActionButtonProps = {
  facility: TFacility;
  facilityUser: TFacilityUser;
};
function FacilityUserActionButton({
  facility,
  facilityUser,
}: FacilityUserActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
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
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Facility User</DialogTitle>
            <DialogDescription>
              Please fill all required fields.
            </DialogDescription>
          </DialogHeader>
          <EditFacilityUserForm
            facility={facility}
            facilityUser={facilityUser}
            setClose={() => setIsEditOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default FacilityUserActionButton;
