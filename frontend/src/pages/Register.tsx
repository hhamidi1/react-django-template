import { Container, Form, Button } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { Logo, FormBasic } from "../components"
import { useState, useEffect } from "react"
import axios, {AxiosError} from "axios";

interface FormValue {
  username: string;
  email: string;
  password: string;
  re_password: string;
  userDetail: {
    Role?: number;
    First_name: string;
    Last_name: string;
  };
}

interface Role{
  Role_id: number;
  Role_name: string;
  Role_description: string;
}

function Register() {

  const navigate = useNavigate();
  const initialFormState: FormValue = {
    username: '',
    email: '',
    password: '',
    re_password: '',
    userDetail: {
      Role: 0,
      First_name: '',
      Last_name: '', // You can set the default value for Role as per your requirements
    },
  }

  const [formValues, setFormValues] = useState<FormValue>(initialFormState);
  const [role, setRole] = useState<Role[]>([])
  const [response, setResponse] = useState({})

  const formValue = [
    {
      type: 'text',
      placeholder: 'First Name',
      controlId: 'First_Name',
      label: 'First Name',
      value: formValues.userDetail.First_name,
      name: 'First_name',
    },
    {
      type: 'text',
      placeholder: 'Last Name',
      controlId: 'Last_Name',
      label: 'Last Name',
      value: formValues.userDetail.Last_name,
      name: 'Last_name',
    },
    {
      type: 'text',
      placeholder: 'Username',
      controlId: 'Username',
      label: 'Username',
      value: formValues.username,
      name: 'username',
    },
    {
      type: 'email',
      placeholder: 'Email Address',
      controlId: 'Email_Address',
      label: 'Email Address',
      value: formValues.email,
      name: 'email',
    },
    {
      type: 'password',
      placeholder: 'Password',
      controlId: 'Password',
      label: 'Password',
      value: formValues.password,
      name: 'password',
    },
    {
      type: 'password',
      placeholder: 'Re-enter Your Password',
      controlId: 're_password',
      label: 'Re-enter Your Password',
      value: formValues.re_password,
      name: 're_password',
    },
  ]

  useEffect(() => {
    // Assuming you have an async function to fetch data using Axios
    const fetchRoleData = async () => {
      try {
        if (import.meta.env.DEV) {
          const response = await axios.get<Role[]>(`${import.meta.env.VITE_API_DEV}/auth/role/`);
          const roleData: Role[] = response.data; // Assuming the response.data is of type Role
          // Update the state with the fetched data
          setRole(roleData);
        } else {
          const response = await axios.get<Role[]>(`${import.meta.env.VITE_API_PROD}/auth/role/`);
          const roleData: Role[] = response.data; // Assuming the response.data is of type Role
          // Update the state with the fetched data
          setRole(roleData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    // Call the fetchData function
    fetchRoleData();
  }, []);

  const handleChange = ( event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;

    if (name === 'First_name' || name === 'Last_name' || name === 'Role'){
      setFormValues((prevValues) => ({
      ...prevValues,
      userDetail:{
        ...prevValues.userDetail,
        [name]: value,
      }
      }));
    } else {
      setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
      }));
    }
  };

  const submit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (formValues.password !== formValues.re_password) {
        alert("Passwords don't match");
    }
    try {
      if (import.meta.env.DEV) {
        const res = await axios.post(`${import.meta.env.VITE_API_DEV}/auth/register/`, formValues);
        setResponse(res.data);
        navigate('/login')
      } else {
        const res = await axios.post(`${import.meta.env.VITE_API_PROD}/auth/register/`, formValues);
        setResponse(res.data);
      }
    } catch (error) {
      // console.error('Error submitting data:', error);
      if (axios.isAxiosError(error) && error.response) {
        setResponse(error);
        alert(error.response.data.email)
      } else {
        // Use type assertion here
        setResponse({ 'Error submitting data:': (error as AxiosError).message });
      }
    }
  };

  console.log(response)

  return (
    <div className="w-100 main-div d-flex align-items-center justify-content-center vh-100">
      <Container className="border-top border-primary border-3 w-50 p-3 shadow p-3 mb-5 bg-white rounded">
        <Form onSubmit={submit}>
          <Logo />
          <div className="p-3">
            <h4>Register</h4>
          </div>
          {
            formValue.map((val, key) => {
              return (
                <FormBasic key={key} type={val.type} placeholder={val.placeholder} controlId={val.controlId} label={val.label} name={val.name} value={val.value} onChangeMethod={(e) => handleChange(e)}/>
              )
            })
          }
          <Form.Label>Role</Form.Label>
          <Form.Select name="Role" value={formValues.userDetail.Role} onChange={(e) => handleChange(e)}>
            <option value="0">Please Select</option>
            {
              role.map((data, key) => (
                <option key={key} value={data.Role_id}>{data.Role_name}</option>
              ))
            }
          </Form.Select>
          <Button variant="primary" type="submit" className="w-100 mt-4">
            Submit
          </Button>
        </Form>
        <div className="my-3">
          <p>Already a member? <Link to='/login' className="text-primary fw-bold">Login Here</Link> </p>
        </div>
      </Container>
    </div>
  )
}

export default Register