import { forwardRef } from 'react';
import { useDashboardContext, DashboardContextProps } from "../pages/DashboardLayout";
import links from "../utils/links";
import { NavLinks } from "../utils/links";
import { NavLink } from "react-router-dom";
import { Nav } from "react-bootstrap";

interface Props {
  isSidebar?: boolean;
}

const NavLinksComponent = forwardRef<HTMLDivElement, Props>(({ isSidebar }: Props, ref) => {
  const context = useDashboardContext() as DashboardContextProps;
  const { toggleSidebar, showSidebar }: { toggleSidebar: () => void; showSidebar: boolean; } = context ?? {};

  return (
    <Nav ref={ref} className="flex-column text-center w-100">
      {links.map((link) => {
        const { text, path, icon }: NavLinks = link;
        return (
          <NavLink end to={path} key={text} onClick={isSidebar ? undefined : toggleSidebar} className='my-2 mobile-sidenav text-dark'>
            {!showSidebar && isSidebar ? <span>{icon}</span> : <span>{icon}{text}</span>}
          </NavLink>
        );
      })}
    </Nav>
  );
});

export default NavLinksComponent;
