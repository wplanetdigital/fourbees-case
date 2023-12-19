import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { styled } from '@mui/material/styles'

import Box from '@mui/material/Box'
import Icon from 'src/@core/components/icon'
import MuiTabList from '@mui/lab/TabList'
import MuiTabPanel from '@mui/lab/TabPanel'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'

import Tab1 from './components/profile'
import Tab2 from './components/password'
import Tab3 from './components/activities'

const TabList = styled(MuiTabList)(({ theme }) => ({
  borderBottom: '0 !important',
  '&, & .MuiTabs-scroller': {
    boxSizing: 'content-box',
    padding: theme.spacing(1.25, 1.25, 2),
    margin: `${theme.spacing(-1.25, -1.25, -2)} !important`
  },
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .Mui-selected': {
    boxShadow: theme.shadows[2],
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`
  },
  '& .MuiTab-root': {
    lineHeight: 1,
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      color: theme.palette.primary.main
    }
  }
}))

const TabPanel = styled(MuiTabPanel)({
  padding: '1.5rem 0 !important'
})

const Page = () => {
  const router = useRouter()
  const [value, setValue] = useState(router.query.tab || '1')

  const handleChange = (e, tab) => {
    setValue(tab)
  }

  useEffect(() => {
    setValue(router.query.tab || '1')
  }, [router.query.tab])

  return (
    <TabContext value={value}>
      <TabList onChange={handleChange} aria-label='exemplo de abas personalizadas'>
        <Tab
          value='1'
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
              <Icon fontSize='1.25rem' icon='tabler:user' /> Detalhes do Perfil
            </Box>
          }
        />
        <Tab
          value='2'
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
              <Icon fontSize='1.25rem' icon='tabler:lock' /> Detalhes de Login
            </Box>
          }
        />
        <Tab
          value='3'
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 2 } }}>
              <Icon fontSize='1.25rem' icon='tabler:clipboard-text' /> Registro de Atividades
            </Box>
          }
        />
      </TabList>
      <TabPanel value='1'>
        <Tab1 />
      </TabPanel>
      <TabPanel value='2'>
        <Tab2 />
      </TabPanel>
      <TabPanel value='3'>
        <Tab3 />
      </TabPanel>
    </TabContext>
  )
}
Page.acl = { action: 'read', subject: 'member' }

export default Page
