// import styled from 'styled-components'
import { Container, Navbar, Row, Col, Button } from 'react-bootstrap'
import main from '../assets/images/main.svg'
// import { Link } from 'react-router-dom'
import { Logo } from '../components'
import { useState, useEffect } from 'react'

function Landing() {

  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/test/')
      .then(res => res.json())
      .then(data => setData(data.data));
  })

  console.log(data)

  return (
    <Container fluid>
      <Navbar>
        <Logo />
      </Navbar>
      <Container className='mt-5'>
        <Row className='p-3 align-items-center justify-content-center'>
          <Col lg={6} className='justify-content-center'>
            <h1>
              Job <span className='text-primary'>Tracking</span> App
            </h1>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Pariatur laboriosam quos ab atque tempora. Natus, accusantium ex. Eum, incidunt hic veniam voluptatem qui ipsum quibusdam, eos ut quae ad sit?
            </p>
            <Button href='/register' className='mx-2' variant='primary'>
              Register
            </Button>
            <Button href='/login' className='mx-2' variant='primary'>
              Login / Demo User
            </Button>
          </Col>
          <Col lg={6} className='p-3 justify-content-center'>
            <img src={main} alt="job-hunt" width='70%' />
          </Col>
        </Row>
        <Row>
          {data}
        </Row>
      </Container>
    </Container>
  )
};

export default Landing