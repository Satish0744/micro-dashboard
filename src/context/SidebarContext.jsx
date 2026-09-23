import { createContext, useContext, useEffect, useState } from 'react';

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem('mf_sidebar_collapsed') === 'true'
  );

  useEffect(() => {
    localStorage.setItem('mf_sidebar_collapsed', String(collapsed));
  }, [collapsed]);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, toggle: () => setCollapsed((c) => !c) }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);