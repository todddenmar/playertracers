import { TFacilityUser } from "@/typings";
import { useEffect, useState } from "react";
import EmptyLayout from "../custom-ui/EmptyLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateNewFacilityUserForm } from "../forms/CreateNewFacilityUserForm";
import { useAppStore } from "@/lib/store";
import FacilityUserActionButton from "./action-buttons/FacilityUserActionButton";
import { Badge } from "../ui/badge";
import _ from "lodash";

type UsersListProps = {
  facilityID: string | null;
};

function UsersList({ facilityID }: UsersListProps) {
  const { currentFacilities } = useAppStore();
  const [users, setUsers] = useState<TFacilityUser[]>([]);
  const [tabValue, setTabValue] = useState("users-list");

  const facility = currentFacilities.find((item) => item.id === facilityID);

  useEffect(() => {
    const onSetFacilityUsers = () => {
      if (!facilityID) return;
      setUsers(facility?.users || []);
    };
    onSetFacilityUsers();
  }, [facility, currentFacilities, facilityID]);

  if (!facility) return <EmptyLayout>Facility Not Found</EmptyLayout>;
  return (
    <div>
      <Tabs
        value={tabValue}
        onValueChange={setTabValue}
        defaultValue="users-list"
        className="w-full"
      >
        <TabsList>
          <TabsTrigger value="users-list">Users</TabsTrigger>
          <TabsTrigger value="create">Create</TabsTrigger>
        </TabsList>
        <TabsContent value="users-list">
          <div className="space-y-4">
            {users.length === 0 ? (
              <EmptyLayout>No users yet</EmptyLayout>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {users.map((user) => (
                  <div
                    key={`user-item-${user.id}`}
                    className="border rounded-lg p-4 flex items-center gap-2"
                  >
                    <div className="flex-1">
                      <div className="capitalize">
                        {user.firstName} {user.lastName}
                      </div>
                      <Badge>{_.startCase(user.roleType.toLowerCase())}</Badge>
                    </div>
                    <FacilityUserActionButton
                      facility={facility}
                      facilityUser={user}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="create">
          <div className="border rounded-lg p-4">
            <CreateNewFacilityUserForm
              facility={facility}
              setClose={() => setTabValue("users-list")}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default UsersList;
