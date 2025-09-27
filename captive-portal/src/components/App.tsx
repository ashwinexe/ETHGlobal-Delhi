import { AppKitProvider } from './AppKitProvider'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'
import Login from '../pages/Login'
import Welcome from '../pages/Welcome'
import { useAccount } from 'wagmi'
import Loading from './Loading'

function App() {
  return (
    <AppKitProvider>
      <Router>
        <ManagedRoutes />
      </Router>
    </AppKitProvider>
  )
}

const ManagedRoutes = () => {
  const { isConnected, isConnecting } = useAccount()

  const page = isConnecting ? (
    <Loading />
  ) : isConnected ? (
    <Welcome />
  ) : (
    <Login />
  )

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/welcome" element={page} />
    </Routes>
  )
}

export default App
