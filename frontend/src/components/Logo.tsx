import logo from '../assets/images/logo.svg'

interface Size {
  width?: string;
  height?: string;
}

function Logo({ width, height }: Size) {
  return (
    <img src={logo} alt="logo-img" width={width} height={height} className='logo' />
  )
}

export default Logo