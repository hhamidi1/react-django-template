import { NavLinkSComponent, Logo } from "."

function Sidebar() {

  return (
    <div className="p-2">
      <div className="sidebar-logo d-flex justify-content-center align-item-center">
        <header className="d-flex justify-content-center align-item-center p-1">
          <Logo width={"70%"} />
        </header>
      </div>
      <NavLinkSComponent isSidebar />
    </div>
  )
}

export default Sidebar