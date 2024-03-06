import { RouterProvider, createBrowserRouter } from "react-router-dom"
import { HomeLayout, Register, Login, DashboardLayout, Error, Landing, AddJob, Stats, AllJobs, Profile, Admin } from "./pages"
import '../css/main.min.css'

const checkDefaultTheme = (): boolean => {
  const isDarkTheme = localStorage.getItem('darkTheme') === 'true'
  return isDarkTheme
}

const isDarkThemeEnabled = checkDefaultTheme()

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Landing />
      },
      {
        path: 'register',
        element: <Register />
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'dashboard',
        element: <DashboardLayout isDarkThemeEnabled={isDarkThemeEnabled} />,
        children: [
          {
            index: true,
            element: <AddJob />,
          },
          {
            path: 'stats',
            element: <Stats />
          },
          {
            path: 'all-jobs',
            element: <AllJobs />
          },
          {
            path: 'profile',
            element: <Profile />
          },
          {
            path: 'admin',
            element: <Admin />
          },
        ]
      },
    ]
  },
])

function App() {

  return (
    <RouterProvider router={router} />
  )
}

export default App
