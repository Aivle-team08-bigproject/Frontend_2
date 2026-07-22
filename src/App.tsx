import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import PractitionerDashboardMain from './pages/PractitionerDashboard/PractitionerDashboardMain'
import MyTaskStatus from './pages/PractitionerDashboard/MyTaskStatus'
import TaskLookup from './pages/PractitionerDashboard/TaskLookup'
import DeveloperDashboardMain from './pages/DeveloperDashboard/DeveloperDashboardMain'
import MemberManagement from './pages/DeveloperDashboard/MemberManagement'
import RequirementAnalysisRegister from './pages/TaskFlow/RequirementAnalysisRegister'
import AnalysisInProgress from './pages/TaskFlow/AnalysisInProgress'
import ReviewFeedback from './pages/TaskFlow/ReviewFeedback'
import DataSelectionInProgress from './pages/TaskFlow/DataSelectionInProgress'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<PractitionerDashboardMain />} />
        <Route path="/dashboard/my-tasks" element={<MyTaskStatus />} />
        <Route path="/dashboard/task-lookup" element={<TaskLookup />} />
        <Route path="/dev-dashboard" element={<DeveloperDashboardMain />} />
        <Route path="/dev-dashboard/members" element={<MemberManagement />} />
        <Route path="/tasks/register" element={<RequirementAnalysisRegister />} />
        <Route path="/tasks/analyzing" element={<AnalysisInProgress />} />
        <Route path="/tasks/review" element={<ReviewFeedback />} />
        <Route path="/tasks/selection" element={<DataSelectionInProgress />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
