import { signIn } from 'next-auth/react'
import { styled, useTheme } from '@mui/material/styles'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Alert from '@mui/material/Alert'
import Wrapper from 'src/views/pages/auth/Wrapper'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import Box from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import Checkbox from '@mui/material/Checkbox'
import Collapse from '@mui/material/Collapse'
import Link from 'next/link'
import MuiCard from '@mui/material/Card'
import MuiFormControlLabel from '@mui/material/FormControlLabel'
import themeConfig from 'src/configs/themeConfig'
import toast from 'react-hot-toast'
import Typography from '@mui/material/Typography'
import Input from 'src/@core/custom/Input'
import InputPassword from 'src/@core/custom/InputPassword'
import Button from 'src/@core/custom/Button'
import validator from 'validator'

const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '25rem' }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`
}))

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    color: theme.palette.text.secondary
  }
}))

const Page = () => {
  const router = useRouter()
  const theme = useTheme()

  const model = {
    email: '',
    password: ''
  }

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState({})
  const [formData, setFormData] = useState(model)

  const [rememberMe, setRememberMe] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if ('welcome' in router.query) {
        setFormData({ ...formData, email: router.query.welcome })
        try {
          const response = await axios.post('/api/auths', { act: 'welcome', email: router.query.welcome })
          if (response.data?.status === 'pending') setMessage({ type: 'success', text: 'Confirme seu email' })
        } catch (error) {
          setMessage({ type: 'error', text: error?.response?.data?.message || error?.message })
        }
      }
    }

    fetchData()
  }, [])

  const Check = formData => {
    let errors = {}
    Object.entries(formData).forEach(([name, value]) => {
      if (value === '') {
        errors = { ...errors, [name]: '*Campo obrigatório' }
      } else {
        if (name === 'email') {
          if (!validator.isEmail(value)) errors = { ...errors, email: 'Email inválido' }
        }
      }
    })
    setErrors(errors)

    return errors
  }

  const handleReSend = async e => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await axios.post('/api/auths', { act: 'resend', email: formData.email })
      if (response.data) toast.success('Novo código enviado!')
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = e => {
    const { name, value, checked } = e.target
    const New = { ...formData, [name]: value }
    setFormData(New)
    Check(New)
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (Object.keys(Check(formData)).length !== 0) return

    try {
      setLoading(true)
      const credentials = { redirect: false, email: formData.email, password: formData.password }
      const response = await signIn('credentials', credentials)
      if (!response.ok) {
        if (response.error.includes('Confirme')) router.replace(`/login/?welcome=${formData.email}`)
        throw new Error(response.error)
      }
      router.replace(router.query.returnUrl || '/')
    } catch (error) {
      if (!error.message.includes('Confirme')) setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  const dataProps = { formData, handleChange, errors, sx: { mb: 4 } }

  return (
    <Box className='content-center'>
      <Wrapper>
        <Card>
          <CardContent sx={{ p: theme => `${theme.spacing(10.5, 8, 8)} !important` }}>
            <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img alt={`${themeConfig.NameApp}`} src={`/images/logo-${theme.palette.mode}.png`} width={200} />
            </Box>
            <Box sx={{ my: 6 }}>
              <Typography variant='h3' sx={{ mb: 1.5 }}>
                Acessar sua conta
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>Faça login para ver mais</Typography>
            </Box>
            <Collapse in={Boolean(message.text)} sx={{ mb: 4 }}>
              <Alert severity={message.type === 'error' ? 'error' : 'success'}>{message.text}</Alert>
              {message.type === 'success' && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Typography sx={{ color: 'text.secondary', mr: 2 }}>Caso não tenha recebido:</Typography>
                  <Button onClick={handleReSend} variant='contained' loading={loading} sx={{ p: 1, fontSize: '10px' }}>
                    Reenviar
                  </Button>
                </Box>
              )}
            </Collapse>
            <form onSubmit={handleSubmit}>
              <Input sx={{ mb: 4 }} label='Email' placeholder='email@email.com' name='email' {...dataProps} />
              <InputPassword sx={{ mb: 4 }} label='password' name='password' {...dataProps} />
              <Box sx={{ mb: 1.75, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <FormControlLabel
                  label='Lembre de mim'
                  control={<Checkbox checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />}
                />
                <Typography component={LinkStyled} href='auth/password/forgot'>
                  Esqueceu sua senha?
                </Typography>
              </Box>
              <Box sx={{ position: 'relative' }}>
                <Button fullWidth type='submit' variant='contained' loading={loading} sx={{ mb: 4 }}>
                  Login
                </Button>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Typography sx={{ color: 'text.secondary', mr: 2 }}>Novo em nossa plataforma?</Typography>
                <Typography href='/register' component={LinkStyled}>
                  Cadastrar
                </Typography>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Wrapper>
    </Box>
  )
}
Page.getLayout = page => <BlankLayout>{page}</BlankLayout>
Page.guestGuard = true

export default Page
