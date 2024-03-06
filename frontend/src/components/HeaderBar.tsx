import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap"
import { GiHamburgerMenu } from "react-icons/gi";
import { Logo, ThemeToggle } from "."
import { useDashboardContext, DashboardContextProps, User } from "../pages/DashboardLayout";
// import useMediaQuery from "../hooks/useMediaQuery";
import { FaUserCircle } from "react-icons/fa";

function HeaderBar() {

  // const isDesktop = useMediaQuery('(min-width: 960px)')

  const context = useDashboardContext() as DashboardContextProps
  const { user, logoutUser, toggleSidebar, isDarkTheme }: { user: User; logoutUser: (e: React.MouseEvent) => Promise<void>; toggleSidebar: () => void; isDarkTheme: boolean } = context ?? {};

  return (
    <Navbar bg={isDarkTheme ? "dark" : "secondary"} data-bs-theme="light" sticky="top" className="z-0 header-bar">
      <Container fluid>
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
          <Nav className="text-white" onClick={toggleSidebar}>
            <GiHamburgerMenu size={30} />
          </Nav>
          <Navbar.Brand href="/dashboard">
            <Logo width='60%' />
            <h4 className="logo-text">Dashboard</h4>
          </Navbar.Brand>

          <div className="d-flex justify-content-center align-item-center">

            <div className="p-1 me-2">
              <ThemeToggle />
            </div>

            <Nav className="bg-primary border rounded d-flex justify-content-center align-items-center">
              <NavDropdown title="" id="basic-nav-dropdown" drop="start">
                <NavDropdown.Item onClick={logoutUser}>Profile</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logoutUser}>Logout</NavDropdown.Item>
              </NavDropdown>
              <FaUserCircle /> <span className="p-2">{user.name}</span>
            </Nav>
          </div>


        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default HeaderBar