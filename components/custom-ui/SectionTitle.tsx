import React, { ReactNode } from "react";

type SectionTitleProps = {
  children: ReactNode;
};
function SectionTitle({ children }: SectionTitleProps) {
  return <h4 className="font-semibold">{children}</h4>;
}

export default SectionTitle;
