import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { DataGrid } from '@mui/x-data-grid'
import axios from 'axios'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import CustomChip from 'src/@core/components/mui/chip'

const columns = [
  {
    flex: 0.15,
    field: 'created_at',
    headerName: 'Log Time',
    renderCell: ({ row }) => {
      const date = new Date(row.created_at)

      return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
    }
  },
  {
    flex: 0.15,
    field: 'description',
    headerName: 'Message',
    renderCell: ({ row }) => (
      <CustomChip
        rounded
        label={row.description}
        style={{
          fontSize: '12px',
          height: '25px'
        }}
      />
    )
  },
  {
    flex: 0.15,
    field: 'ip_address',
    headerName: 'IP Address'
  },
  {
    flex: 0.1,
    field: 'browser',
    headerName: 'browser'
  },
  {
    flex: 0.1,
    field: 'device',
    headerName: 'device'
  },
  {
    flex: 0.1,
    field: 'os',
    headerName: 'os'
  },
  {
    flex: 0.15,
    field: 'platform',
    headerName: 'platform'
  }
]

const Component = () => {
  const User = useSession().data.user
  const [rows, setRows] = useState([])

  const fetchData = async () => {
    try {
      const response = await axios.post('/api/profile', { act: 'activities', id: User.id })
      if (response.data) setRows(response.data)
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Card>
      <CardHeader title='Registro de Atividades' />
      <CardContent sx={{ pt: 0, height: 500 }}>
        <DataGrid rows={rows} columns={columns} rowHeight={40} pageSizeOptions={[5, 10]} />
      </CardContent>
    </Card>
  )
}

export default Component
