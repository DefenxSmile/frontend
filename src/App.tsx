import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import HomePage from './pages/HomePage/HomePage'
import { AdminClientsPage, AdminEditorPage, AdminViewerPage } from './pages/AdminPage'
import UserPage from './pages/UserPage/UserPage'
import './App.scss'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminClientsPage />} />
        <Route path="/admin/editor/:clientId" element={<AdminEditorPage />} />
        <Route path="/admin/viewer/:clientId" element={<AdminViewerPage />} />
        <Route path="/user" element={<UserPage />} />
      </Routes>
    </Layout>
  )
}

export default App
