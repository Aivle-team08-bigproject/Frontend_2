import { lazy, Suspense, type ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './shared/ProtectedRoute'

const PractitionerDashboardMain = lazy(() => import('./pages/PractitionerDashboard/PractitionerDashboardMain'))
const TaskList = lazy(() => import('./pages/PractitionerDashboard/TaskList'))
const TaskLookup = lazy(() => import('./pages/PractitionerDashboard/TaskLookup'))
const AdminDashboard = lazy(() => import('./pages/PractitionerDashboard/AdminDashboard'))
const MemberManagement = lazy(() => import('./pages/DeveloperDashboard/MemberManagement'))
const RequirementAnalysisRegister = lazy(() => import('./pages/TaskFlow/RequirementAnalysisRegister'))
const AnalysisInProgress = lazy(() => import('./pages/TaskFlow/AnalysisInProgress'))
const TaskDetail = lazy(() => import('./pages/TaskFlow/TaskDetail'))
const ReviewFeedback = lazy(() => import('./pages/TaskFlow/ReviewFeedback'))
const DataSelectionInProgress = lazy(() => import('./pages/TaskFlow/DataSelectionInProgress'))
const SampleDataFeedback = lazy(() => import('./pages/TaskFlow/SampleDataFeedback'))
const DataProcessingInProgress = lazy(() => import('./pages/TaskFlow/DataProcessingInProgress'))
const FinalOutputFeedback = lazy(() => import('./pages/TaskFlow/FinalOutputFeedback'))
const FinalOutputFull = lazy(() => import('./pages/TaskFlow/FinalOutputFull'))
const TaskComplete = lazy(() => import('./pages/TaskFlow/TaskComplete'))
const LoginPage = lazy(() => import('./pages/SystemPages/LoginPage'))
const SignupPage = lazy(() => import('./pages/SystemPages/SignupPage'))
const LegalPage = lazy(() => import('./pages/SystemPages/LegalPage'))
const NotFoundPage = lazy(async () => ({ default: (await import('./pages/SystemPages/ErrorPage')).NotFoundPage }))
const ServerErrorPage = lazy(async () => ({ default: (await import('./pages/SystemPages/ErrorPage')).ServerErrorPage }))
const NoticeListPage = lazy(() => import('./pages/Notices/NoticeListPage'))
const NoticeDetailPage = lazy(() => import('./pages/Notices/NoticeDetailPage'))
const NoticeCreatePage = lazy(() => import('./pages/Notices/NoticeCreatePage'))
const NoticeEditPage = lazy(() => import('./pages/Notices/NoticeEditPage'))
const NoticeManagePage = lazy(() => import('./pages/Notices/NoticeManagePage'))

function protectedPage(page: ReactNode) {
  return <ProtectedRoute>{page}</ProtectedRoute>
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div role="status">페이지를 불러오는 중입니다.</div>}>
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
        <Route path="/dashboard/task-lookup" element={protectedPage(<TaskLookup />)} />
        <Route path="/dashboard/overview" element={protectedPage(<AdminDashboard />)} />
        <Route path="/notices" element={protectedPage(<NoticeListPage />)} />
        <Route path="/notices/manage" element={protectedPage(<NoticeManagePage />)} />
        <Route path="/notices/new" element={protectedPage(<NoticeCreatePage />)} />
        <Route path="/notices/:noticeId/edit" element={protectedPage(<NoticeEditPage />)} />
        <Route path="/notices/:noticeId" element={protectedPage(<NoticeDetailPage />)} />
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
        <Route path="/tasks/:requestNo/runs/:runId/final-feedback/full" element={protectedPage(<FinalOutputFull />)} />
        <Route path="/tasks/:requestNo/runs/:runId/complete" element={protectedPage(<TaskComplete />)} />
        <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
