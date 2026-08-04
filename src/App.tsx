import type { ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import PractitionerDashboardMain from './pages/PractitionerDashboard/PractitionerDashboardMain'
import TaskList from './pages/PractitionerDashboard/TaskList'
import MyTaskStatus from './pages/PractitionerDashboard/MyTaskStatus'
import TaskLookup from './pages/PractitionerDashboard/TaskLookup'
import AdminDashboard from './pages/PractitionerDashboard/AdminDashboard'
import DeveloperDashboardMain from './pages/DeveloperDashboard/DeveloperDashboardMain'
import MemberManagement from './pages/DeveloperDashboard/MemberManagement'
import RequirementAnalysisRegister from './pages/TaskFlow/RequirementAnalysisRegister'
import AnalysisInProgress from './pages/TaskFlow/AnalysisInProgress'
import TaskDetail from './pages/TaskFlow/TaskDetail'
import ReviewFeedback from './pages/TaskFlow/ReviewFeedback'
import DataSelectionInProgress from './pages/TaskFlow/DataSelectionInProgress'
import SampleDataFeedback from './pages/TaskFlow/SampleDataFeedback'
import DataProcessingInProgress from './pages/TaskFlow/DataProcessingInProgress'
import FinalOutputFeedback from './pages/TaskFlow/FinalOutputFeedback'
import TaskComplete from './pages/TaskFlow/TaskComplete'
import LoginPage from './pages/SystemPages/LoginPage'
import SignupPage from './pages/SystemPages/SignupPage'
import LegalPage from './pages/SystemPages/LegalPage'
import { NotFoundPage, ServerErrorPage } from './pages/SystemPages/ErrorPage'
import ProtectedRoute from './shared/ProtectedRoute'

function protectedPage(page: ReactNode) {
  return <ProtectedRoute>{page}</ProtectedRoute>
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/legal/terms" element={<LegalPage type="terms" />} />
        <Route path="/legal/privacy" element={<LegalPage type="privacy" />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="/500" element={<ServerErrorPage />} />
        <Route path="/dashboard" element={protectedPage(<PractitionerDashboardMain />)} />
        <Route path="/dashboard/tasks" element={protectedPage(<TaskList />)} />
        <Route path="/dashboard/my-tasks" element={protectedPage(<MyTaskStatus />)} />
        <Route path="/dashboard/task-lookup" element={protectedPage(<TaskLookup />)} />
        <Route path="/dashboard/overview" element={protectedPage(<AdminDashboard />)} />
        <Route path="/dev-dashboard" element={protectedPage(<DeveloperDashboardMain />)} />
        <Route path="/dev-dashboard/members" element={protectedPage(<MemberManagement />)} />
        <Route path="/tasks/register" element={protectedPage(<RequirementAnalysisRegister />)} />
        <Route path="/tasks/analyzing" element={<Navigate to="/tasks/register" replace />} />
        <Route path="/tasks/:requestNo/runs/:runId/detail" element={protectedPage(<TaskDetail />)} />
        <Route path="/tasks/:requestNo/runs/:runId/analyzing" element={protectedPage(<AnalysisInProgress />)} />
        <Route path="/tasks/:requestNo/runs/:runId/review" element={protectedPage(<ReviewFeedback />)} />
        <Route path="/tasks/:requestNo/runs/:runId/selection" element={protectedPage(<DataSelectionInProgress />)} />
        <Route path="/tasks/:requestNo/runs/:runId/sample-feedback" element={protectedPage(<SampleDataFeedback />)} />
        <Route path="/tasks/:requestNo/runs/:runId/processing" element={protectedPage(<DataProcessingInProgress />)} />
        <Route path="/tasks/:requestNo/runs/:runId/final-feedback" element={protectedPage(<FinalOutputFeedback />)} />
        <Route path="/tasks/:requestNo/runs/:runId/complete" element={protectedPage(<TaskComplete />)} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
