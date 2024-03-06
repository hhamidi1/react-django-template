import { useDashboardContext, DashboardContextProps } from "../pages/DashboardLayout";
import { Container, Fade } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import logo from '../assets/images/logo.svg';
import { NavLinks } from "../utils/links";
import { NavLink } from "react-router-dom";
import { Nav } from "react-bootstrap";
import links from "../utils/links";

function MobileSidebar() {
  const context = useDashboardContext() as DashboardContextProps
  const { showSidebar, toggleSidebar }: { showSidebar: boolean | undefined; toggleSidebar: () => void; } = context ?? {};

  return (
    <div className={showSidebar ? 'mobile-sidebar bg-dark bg-opacity-25 position-absolute z-1 p-5 vh-100' : 'd-none'}>
      <Container className="bg-white p-2 border rounded">
        <span onClick={toggleSidebar}>
          <FaTimes />
        </span>
        <header className="d-flex justify-content-center">
          <img src={logo} alt="" width='30%' />
        </header>
        <Fade appear={true} in={showSidebar} className="d-flex justify-content-center align-item-center">
          {/* <NavLinkSComponent isSidebar={false} /> */}
          <Nav className="flex-column text-center">
            {links.map((link) => {
              const { text, path, icon }: NavLinks = link;
              return (
                <NavLink end to={path} key={text} onClick={toggleSidebar} className='my-2 mobile-sidenav text-dark'>
                  <span>{icon}{text}</span>
                </NavLink>
              );
            })}
          </Nav>
        </Fade>
      </Container>
    </div>
  );
}

export default MobileSidebar;
