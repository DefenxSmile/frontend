import { Box } from '@mui/material'
import FloorPlanEditor from '../../components/FloorPlanEditor/FloorPlanEditor'
import './AdminPage.scss'

const AdminPage = () => {
  return (
    <Box className="admin-page" sx={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Box sx={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
        <FloorPlanEditor />
      </Box>
    </Box>
  )
}

export default AdminPage

