// import { useDashboardContext, DashboardContextProps } from "../pages/DashboardLayout";
import { useState } from 'react';
import { Container, Button } from "react-bootstrap";

function LogoutContainer() {
  const [showLogout, setShowLogout] = useState<boolean>(false)

  // const context = useDashboardContext() as DashboardContextProps

  return (
    <Container>
      <Button type="button" onClick={() => setShowLogout(!showLogout)}></Button>
    </Container>
  )
}

export default LogoutContainer