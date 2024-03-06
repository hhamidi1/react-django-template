import { Container, Button } from "react-bootstrap";
import { Link, useRouteError, isRouteErrorResponse } from "react-router-dom"
import img from '../assets/images/not-found.svg'

function Error() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return (
        <Container fluid className="align-items-center justify-content-center">
          <div className="m-5 d-flex justify-content-center align-items-center">
            <img src={img} alt="not-found" width={'50%'} />
          </div>
          <div className="m-5">
            <p className="text-center">We can't seems to find the page you are looking for</p>
            <div className="d-flex justify-content-center align-items-center">
              <Button className='mx-2 text-center'>
                <Link to='/dashboard' className='landing-btn'>Back to Home</Link>
              </Button>
            </div>
          </div>
        </Container>
      )
    }
  }

  return (
    <Container>
      <h3>Error Page</h3>
      <Button className='mx-2'>
        <Link to='/' className='landing-btn'>Back to Home</Link>
      </Button>
    </Container>
  )
}

export default Error