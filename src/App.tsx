import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import PractitionerDashboardMain from './pages/PractitionerDashboard/PractitionerDashboardMain'
import MyTaskStatus from './pages/PractitionerDashboard/MyTaskStatus'
import TaskLookup from './pages/PractitionerDashboard/TaskLookup'
import DeveloperDashboardMain from './pages/DeveloperDashboard/DeveloperDashboardMain'
import MemberManagement from './pages/DeveloperDashboard/MemberManagement'
import RequirementAnalysisRegister from './pages/TaskFlow/RequirementAnalysisRegister'

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
      </Routes>
    </BrowserRouter>
  )
}

export default App
