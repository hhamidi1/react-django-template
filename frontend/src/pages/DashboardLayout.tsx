import { Outlet } from "react-router-dom";
import { SideBar, HeaderBar, MobileSidebar } from "../components";
import { Container } from "react-bootstrap";
import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  name: string;
}

export interface DashboardContextProps {
  user: User;
  showSidebar: boolean;
  isDarkTheme: boolean;
  toggleDarkTheme: () => void;
  toggleSidebar: () => void;
  logoutUser: (e: React.MouseEvent) => Promise<void>;
}

const DashboardContext = createContext<DashboardContextProps | undefined>(undefined);

function DashboardLayout({ isDarkThemeEnabled }: { isDarkThemeEnabled: boolean }) {
  const [user, setUser] = useState<User>({ name: 'hhamidi' });
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(isDarkThemeEnabled);

  const toggleDarkTheme = () => {
    const newDarkThemeValue = !isDarkTheme;
    setIsDarkTheme(newDarkThemeValue)
    localStorage.setItem('darkTheme', `${newDarkThemeValue}`)
    console.log('toggle dark theme');
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  useEffect(() => {
    setUser({name: "Meow"})
  }, [])

  const logoutUser = async (e: React.MouseEvent) => {
    e.preventDefault()
    console.log('logout user');
  };

  return (
    <DashboardContext.Provider value={{ user, showSidebar, isDarkTheme, toggleDarkTheme, toggleSidebar, logoutUser }}>
      <div className="d-flex">
        <div className={`${isDarkTheme ? 'bg-dark' : 'bg-secondary'} ${showSidebar ? 'sidebar' : 'sidebar-collapse'}`}>
          <SideBar />
        </div>
        <div className="w-100 dashboard-content">
          <MobileSidebar />
          <div>
            <HeaderBar />
            <Container>
              <Outlet />
            </Container>
          </div>
        </div>
      </div>
    </DashboardContext.Provider>
  );
}

export const useDashboardContext = () => useContext(DashboardContext)
export default DashboardLayout;
