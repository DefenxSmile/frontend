import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import HomePage from './pages/HomePage/HomePage'
import UserPage from './pages/UserPage/UserPage'
import AdminPage from './pages/AdminPage/AdminPage'
import VenuePage from './pages/VenuePage/VenuePage'

import './App.scss'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/venue" element={<VenuePage />} />
        <Route path="/user" element={<UserPage />} />
      </Routes>
    </Layout>
  )
}

export default App
