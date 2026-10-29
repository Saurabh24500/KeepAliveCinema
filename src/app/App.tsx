import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from '../features/auth/AuthProvider'
import { ProfileProvider } from '../features/profile/ProfileProvider'
import { router } from './router'

function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <RouterProvider router={router} />
      </ProfileProvider>
    </AuthProvider>
  )
}

export default App
