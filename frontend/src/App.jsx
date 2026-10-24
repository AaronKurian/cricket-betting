import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AdminRoute, GuestRoute, PlayerRoute, ProtectedRoute } from './auth/RouteGuards'
import { AuthProvider } from './auth/AuthContext'
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
import SettlementPage from './pages/SettlementPage'
import SignupPage from './pages/SignupPage'
import UserManagementPage from './pages/UserManagementPage'

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
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/predictions" element={<MyPredictionsPage />} />
            </Route>

            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/matches" element={<MatchManagementPage />} />
              <Route path="/admin/users" element={<UserManagementPage />} />
              <Route path="/admin/settlements" element={<SettlementPage />} />
              <Route path="/admin/audit-logs" element={<AuditLogsPage />} />
            </Route>

            <Route path="/matches" element={<MatchesPage />} />
            <Route path="/matches/:id" element={<MatchDetailsPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
