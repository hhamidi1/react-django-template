import { Form } from "react-bootstrap"

interface Props {
  type: string;
  placeholder: string;
  controlId: string;
  label: string;
  value: string;
  name: string;
  onChangeMethod: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

function FormBasic({ type, placeholder, controlId, label, value, onChangeMethod, name }: Props) {
  return (
    <Form.Group className="mb-3" controlId={`formBasic${controlId}`}>
      <Form.Label>{label}</Form.Label>
      <Form.Control name={name} type={type} placeholder={`Enter Your ${placeholder}`} value={value} onChange={(e:React.ChangeEvent<HTMLInputElement>) => onChangeMethod(e)} required/>
    </Form.Group>
  )
}

export default FormBasic