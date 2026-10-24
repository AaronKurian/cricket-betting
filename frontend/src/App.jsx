import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AdminRoute, GuestRoute, PlayerRoute, ProtectedRoute } from './auth/RouteGuards'
import { AuthProvider, useAuth } from './auth/AuthContext'
import AdminLayout from './components/AdminLayout'
import PlayerLayout from './components/PlayerLayout'
import AuditLogsPage from './pages/AuditLogsPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import DashboardPage from './pages/DashboardPage'
import LandingPage from './pages/LandingPage'
import LeaderboardPage from './pages/LeaderboardPage'
import LoginPage from './pages/LoginPage'
import MatchDetailsPage from './pages/MatchDetailsPage'
import MatchManagementPage from './pages/MatchManagementPage'
import MatchesPage from './pages/MatchesPage'
import MyPredictionsPage from './pages/MyPredictionsPage'
import NotFoundPage from './pages/NotFoundPage'
import SignupPage from './pages/SignupPage'
import UserManagementPage from './pages/UserManagementPage'

function RoleAwareLayout() {
  const { user } = useAuth()
  return user?.role === 'admin' ? <AdminLayout /> : <PlayerLayout />
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<PlayerRoute />}>
              <Route element={<PlayerLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/predictions" element={<MyPredictionsPage />} />
              </Route>
            </Route>

            <Route element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="/admin/matches" element={<MatchManagementPage />} />
                <Route path="/admin/users" element={<UserManagementPage />} />
                <Route path="/admin/audit-logs" element={<AuditLogsPage />} />
              </Route>
            </Route>

            <Route element={<RoleAwareLayout />}>
              <Route path="/matches" element={<MatchesPage />} />
              <Route path="/matches/:id" element={<MatchDetailsPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
