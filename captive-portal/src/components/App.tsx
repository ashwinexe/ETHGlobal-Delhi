import { AppKitProvider } from './AppKitProvider'
import { SiweProvider } from '../contexts/SiweContext'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'
import Login from '../pages/Login'
import Welcome from '../pages/Welcome'
import { useAccount } from 'wagmi'
import { useSiwe } from '../contexts/SiweContext'
import Loading from './Loading'

function App() {
  return (
    <AppKitProvider>
      <SiweProvider>
        <Router>
          <ManagedRoutes />
        </Router>
      </SiweProvider>
    </AppKitProvider>
  )
}

const ManagedRoutes = () => {
  const { isConnected, isConnecting } = useAccount()
  const { isAuthenticated, isLoading: siweLoading } = useSiwe()

  const isLoading = isConnecting || siweLoading
  const isLoggedIn = isConnected && isAuthenticated

  const page = isLoading ? <Loading /> : isLoggedIn ? <Welcome /> : <Login />

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/welcome" element={page} />
    </Routes>
  )
}

export default App
