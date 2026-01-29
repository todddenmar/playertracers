import EmptyLayout from "@/components/custom-ui/EmptyLayout";
import SectionTitle from "@/components/custom-ui/SectionTitle";
import { Input } from "@/components/ui/input";
import { DB_COLLECTION, DB_METHOD_STATUS } from "@/lib/config";
import { dbUpdateDocument } from "@/lib/firebase/actions";
import { useAppStore } from "@/lib/store";
import { TFacility, TFacilityUser, TRoleType, TUser } from "@/typings";
import _ from "lodash";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
interface AssignUserFormProps {
  facility: TFacility | null;
}
function AssignUserForm({ facility }: AssignUserFormProps) {
  const { currentUsers, setCurrentFacilities, currentFacilities } =
    useAppStore();
  const [searchInput, setSearchInput] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<TUser[]>([]);

  const onAddFacilityUser = async (facilityUser: TFacilityUser) => {
    if (!facility) return;
    const updatedUsers = [...(facility.facilityUsers || []), facilityUser];
    const res = await dbUpdateDocument(DB_COLLECTION.FACILITIES, facility?.id, {
      facilityUsers: updatedUsers,
    });
    if (res.status === DB_METHOD_STATUS.ERROR) {
      console.error(res.message);
      return;
    }
    const updatedFacility: TFacility = {
      ...facility,
      facilityUsers: updatedUsers,
    };
    const updatedFacilities = currentFacilities.map((item) =>
      item.id === facility.id ? updatedFacility : item,
    );
    toast.success("Added facility user");
    setCurrentFacilities(updatedFacilities);
  };
  useEffect(() => {
    const onSearching = () => {
      if (!searchInput || searchInput.length < 3) {
        return;
      }
      const res = currentUsers?.filter(
        (item) =>
          _.toLower(item.firstName).includes(_.toLower(searchInput)) ||
          _.toLower(item.lastName).includes(_.toLower(searchInput)) ||
          _.toLower(item.emailAddress).includes(_.toLower(searchInput)),
      );
      setFilteredUsers(res || []);
    };
    onSearching();
  }, [searchInput, currentUsers]);
  if (!facility) {
    return <EmptyLayout>Facility Not Found</EmptyLayout>;
  }
  return (
    <div className="space-y-4">
      <div className="capitalize">{facility.name}</div>
      <div className="border rounded-lg p-4 space-y-4">
        <SectionTitle>Search User To Assign</SectionTitle>
        <Input
          value={searchInput}
          onChange={(val) => setSearchInput(val.target.value)}
        />
        {filteredUsers.length === 0 ? (
          <EmptyLayout>No Users Found</EmptyLayout>
        ) : (
          <div className="space-y-2">
            {filteredUsers.map((item) => {
              const isAlreadyAssigned = facility.facilityUsers?.find(
                (f) => f.userID === item.uid,
              );
              return (
                <div
                  key={`user-item-${item.id}`}
                  className="border rounded-lg p-2 text-sm flex items-center gap-4"
                >
                  <div>
                    <div className="capitalize flex-1">{`${item.firstName} ${item.lastName}`}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.emailAddress}
                    </div>
                  </div>
                  {!isAlreadyAssigned && (
                    <Select
                      onValueChange={(val) => {
                        onAddFacilityUser({
                          roleType: val as TRoleType,
                          userID: item.id,
                        });
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MANAGER">Manager</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default AssignUserForm;
