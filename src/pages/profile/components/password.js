import { useState } from 'react'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import parse from 'react-html-parser'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import toast from 'react-hot-toast'
import InputPassword from 'src/@core/custom/InputPassword'
import Button from 'src/@core/custom/Button'
import { isStrong, areStrong } from 'src/@core/custom/ValidatorPassword'

const Component = () => {
  const User = useSession().data.user

  const model = {
    id: User.id,
    password: '',
    password1: '',
    password2: ''
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
        if (name === 'password') {
          const response = isStrong(value)
          if (response) errors = { ...errors, password: parse(response) }
          errors = response ? { ...errors, password: parse(response) } : errors
        }
        if (name === 'password1') {
          const response = areStrong(value, formData.password2)
          if (response) errors = { ...errors, password1: parse(response) }
        }
        if (name === 'password2') {
          const response = areStrong(value, formData.password1)
          if (response) errors = { ...errors, password2: parse(response) }
        }
      }
    })
    setErrors(errors)

    return errors
  }

  const handleChange = e => {
    const { name, value } = e.target
    const New = { ...formData, [name]: value }
    setFormData(New)
    Check(New)
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (Object.keys(Check(formData)).length !== 0) return

    try {
      const response = await axios.put('/api/profile', { act: 'password', formData })
      if (response.data) toast.success('Salvo com sucesso!')
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  const dataProps = { formData, handleChange, errors }

  return (
    <Card>
      <CardHeader title='Detalhes do Login' />
      <CardContent sx={{ pt: 0 }}>
        <form noValidate autoComplete='off' onSubmit={handleSubmit}>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <InputPassword name='password' label='Senha Atual' {...dataProps} />
            </Grid>
            <Grid item xs={12} sm={6}></Grid>
            <Grid item xs={12} sm={6}>
              <InputPassword name='password1' label='Nova Senha' {...dataProps} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputPassword name='password2' label='Confirmar Senha' {...dataProps} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='h6'>Requisitos da Senha:</Typography>
              <Box component='ul' sx={{ pl: 6, mb: 0, '& li': { mb: 1.5, color: 'text.secondary' } }}>
                <li>Mínimo de 8 caracteres.</li>
                <li>Pelo menos uma letra maiúscula.</li>
                <li>Pelo menos uma letra minúscula.</li>
                <li>Pelo menos um número.</li>
                <li>Pelo menos um caractere especial (como $, @, !, %, *, ?, ou &).</li>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Button variant='contained' type='submit' loading={loading} sx={{ mr: 4 }}>
                Salvar Alterações
              </Button>
              <Button type='reset' variant='tonal' color='secondary' onClick={() => reset()}>
                Resetar
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default Component
