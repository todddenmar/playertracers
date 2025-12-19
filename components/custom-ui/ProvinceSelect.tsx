import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PH_PROVINCES } from "@/lib/config";

type ProvinceSelectProps = {
  value: string | "";
  onChange: (value: string) => void;
};

const ProvinceSelect: React.FC<ProvinceSelectProps> = ({ value, onChange }) => {
  return (
    <div>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select Province" />
        </SelectTrigger>
        <SelectContent>
          {PH_PROVINCES.map((item, idx) => {
            return (
              <SelectItem key={`province-item-${idx}`} value={item}>
                {item}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProvinceSelect;
