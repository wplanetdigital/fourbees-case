import { styled, useTheme } from '@mui/material/styles'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Alert from '@mui/material/Alert'
import Wrapper from 'src/views/pages/auth/Wrapper'
import axios from 'axios'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import Box from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import Checkbox from '@mui/material/Checkbox'
import Collapse from '@mui/material/Collapse'
import Link from 'next/link'
import MenuItem from '@mui/material/MenuItem'
import MuiCard from '@mui/material/Card'
import MuiFormControlLabel from '@mui/material/FormControlLabel'
import parse from 'react-html-parser'
import themeConfig from 'src/configs/themeConfig'
import Typography from '@mui/material/Typography'
import Input from 'src/@core/custom/Input'
import InputPassword from 'src/@core/custom/InputPassword'
import Button from 'src/@core/custom/Button'
import validator from 'validator'
import { isStrong, areStrong } from 'src/@core/custom/ValidatorPassword'

const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '25rem' }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`
}))

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(1.75),
  '& .MuiFormControlLabel-label': {
    color: theme.palette.text.secondary
  }
}))

const Page = () => {
  const router = useRouter()
  const theme = useTheme()

  const model = {
    email: '',
    emailconfirm: '',
    password: '',
    role: 'member',
    agreed: false
  }

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState({})
  const [formData, setFormData] = useState(model)

  const Check = formData => {
    let errors = {}
    Object.entries(formData).forEach(([name, value]) => {
      if (value === '') {
        errors = { ...errors, [name]: '*Campo obrigatório' }
      } else {
        if (name === 'email') {
          if (!validator.isEmail(value)) errors = { ...errors, email: 'Email inválido' }
        }
        if (name === 'emailconfirm') {
          if (!(value === formData.email)) errors = { ...errors, emailconfirm: 'Emails não são correspondentes.' }
        }
        if (name === 'password') {
          const response = isStrong(value)
          if (response) errors = { ...errors, password: parse(response) }
        }
        if (name === 'agreed') {
          setMessage('')
          if (!value) {
            errors = { ...errors, agreed: 'false' }
            setMessage({ type: 'error', text: 'Para prosseguir, é necessário aceitar os Termos de Serviço.' })
          }
        }
      }
    })
    setErrors(errors)

    return errors
  }

  const handleChange = e => {
    const { name, value, checked } = e.target
    const New = { ...formData, [name]: name === 'agreed' ? checked : value }
    setFormData(New)
    Check(New)
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (Object.keys(Check(formData)).length !== 0) return

    try {
      setLoading(true)
      const response = await axios.post('/api/register/', formData)
      if (response.data) router.replace(`/login/?welcome=${formData.email}`)
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || error.message })
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
                Crie a sua conta
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>Inscreva-se para ver mais</Typography>
            </Box>
            <Collapse in={Boolean(message.text)}>
              <Alert severity={message.type} sx={{ mb: 4 }}>
                {message.text}
              </Alert>
            </Collapse>
            <form onSubmit={handleSubmit}>
              <Input
                name='email'
                label='Email'
                placeholder='email@email.com'
                {...dataProps}
                onPaste={e => e.preventDefault()}
              />
              <Input
                name='emailconfirm'
                label='Confirmar email'
                placeholder='email@email.com'
                {...dataProps}
                onPaste={e => e.preventDefault()}
              />
              <InputPassword label='password' name='password' onPaste={e => e.preventDefault()} {...dataProps} />
              <Input
                name='role'
                type='email'
                label='Tipo de conta'
                {...dataProps}
                select
                defaultValue='member'
                onPaste={e => e.preventDefault()}
              >
                <MenuItem value='producer'>Produtor</MenuItem>
                <MenuItem value='coproducer'>Co-Produtor</MenuItem>
                <MenuItem value='member'>Membro</MenuItem>
              </Input>
              <FormControlLabel
                control={<Checkbox checked={formData.agreed} onChange={handleChange} />}
                name='agreed'
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Typography sx={{ color: 'text.secondary' }}>eu concordo com</Typography>
                    <Typography component={LinkStyled} href='/' onClick={e => e.preventDefault()} sx={{ ml: 1 }}>
                      política de privacidade
                    </Typography>
                  </Box>
                }
              />
              <Box sx={{ position: 'relative' }}>
                <Button fullWidth type='submit' variant='contained' loading={loading} sx={{ mb: 4 }}>
                  Cadastrar
                </Button>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Typography sx={{ color: 'text.secondary', mr: 2 }}>já tem uma conta?</Typography>
                <Typography component={LinkStyled} href='/login'>
                  Login
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
