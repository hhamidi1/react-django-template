import { BsFillSunFill, BsFillMoonFill } from 'react-icons/bs';
import { useDashboardContext, DashboardContextProps } from "../pages/DashboardLayout";

function ThemeToggle() {

  const context = useDashboardContext() as DashboardContextProps
  const { isDarkTheme, toggleDarkTheme }: { isDarkTheme: boolean; toggleDarkTheme: () => void } = context ?? {};

  return (
    <div onClick={toggleDarkTheme}>
      {isDarkTheme ? <BsFillSunFill className="text-light" /> : <BsFillMoonFill />}
    </div>
  )
}

export default ThemeToggle