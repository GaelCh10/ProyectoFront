import React, { createContext, useState } from "react";

export const SideContext = createContext();
export default function SideBarContext({ children }) {
  const [sideActivo, setSideActivo] = useState(false);

  return <SideContext.Provider value={{sideActivo, setSideActivo}}>
    {children}
  </SideContext.Provider>;
}
