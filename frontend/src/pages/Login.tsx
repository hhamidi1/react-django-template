import { Container, Form, Button } from "react-bootstrap"
import { Link } from "react-router-dom"
import { Logo, FormBasic } from "../components"
import { useState } from "react"

interface Form {
  username: string;
  password: string;
}

function Login() {
  const [formValues, setFormValues] = useState<Form>({
    username: '',
    password: ''
  })

  const formValue = [
    {
      type: 'email',
      placeholder: 'Email Address',
      controlId: 'Email Address',
      label: 'EmailAddress',
      value: 'email',
      name: 'email',
    },
    {
      type: 'password',
      placeholder: 'Password',
      controlId: 'Password',
      label: 'Password',
      value: 'password',
      name: 'password',
    },
  ]

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  }

  console.log(formValues)

  return (
    <div className="w-100 main-div d-flex align-items-center justify-content-center vh-100">
      <Container className="border-top border-primary border-3 w-50 p-3 shadow p-3 mb-5 bg-white rounded">
        <Form>
          <Logo />
          <div className="p-3">
            <h4>Login</h4>
          </div>
          {
            formValue.map((val, key) => {
              return (
                <FormBasic key={key} type={val.type} placeholder={val.placeholder} controlId={val.controlId} label={val.label} value={val.value} name={val.name} onChangeMethod={handleChange} />
              )
            })
          }
          <Button variant="primary" type="submit" className="w-100 my-2">
            Submit
          </Button>

          <Button variant="primary" type="button" className="w-100 my-2">
            Explore the App
          </Button>
        </Form>
        <div className="my-3">
          <p>Not a member? <Link to='/register' className="text-primary fw-bold">Register Here</Link> </p>
        </div>
      </Container>
    </div>
  )
}

export default Login