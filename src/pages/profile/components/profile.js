import { styled } from '@mui/material/styles'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import axios from 'axios'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import toast from 'react-hot-toast'
import Typography from '@mui/material/Typography'
import Input from 'src/@core/custom/Input'
import Button from 'src/@core/custom/Button'

import { cpf } from 'cpf-cnpj-validator'

const ImgStyled = styled('img')(({ theme }) => ({
  width: 100,
  height: 100,
  marginRight: theme.spacing(6),
  borderRadius: theme.shape.borderRadius
}))

const validarCEP = async value => {
  try {
    const response = await axios.get(`https://viacep.com.br/ws/${value}/json/`)
    if (response.data.erro) return false
    const { logradouro, complemento, bairro, localidade, uf, cep } = response.data

    return `${logradouro}${complemento ? `, ${complemento}` : ''}, ${bairro}, ${localidade} - ${uf}, ${cep}`
  } catch (error) {
    return false
  }
}

const Cap = text => text.toLowerCase().replace(/(^|\s)\S/g, match => match.toUpperCase())

const Component = () => {
  const User = useSession().data.user

  const model = {
    id: User.id || '',
    avatar: User.avatar || '',
    fullname: User.fullname || '',
    email: User.email || '',
    cpf: User.cpf || '',
    phone: User.phone || '',
    zipcode: User.zipcode || '',
    fulladdress: User.fulladdress || '',
    number: User.number || '',
    obs: User.obs || ''
  }

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState({})
  const [formData, setFormData] = useState(model)

  const [inputValue, setInputValue] = useState('')
  const [imgSrc, setImgSrc] = useState(User.avatar || '/images/avatars/1.png')

  const handleImage = file => {
    const reader = new FileReader()
    const { files } = file.target
    if (files && files.length !== 0) {
      if (files[0].size > 800 * 1024) {
        toast.error('O arquivo é maior que 800K. Por favor, selecione um arquivo menor.')

        return
      }
      if (!['image/png', 'image/jpeg'].includes(files[0].type)) {
        toast.error('Tipo de arquivo inválido. Apenas PNG ou JPEG são permitidos.')

        return
      }
      reader.onload = () => {
        setImgSrc(reader.result)
        setFormData({ ...formData, avatar: reader.result })
      }
      reader.readAsDataURL(files[0])
      if (reader.result !== null) {
        setInputValue(reader.result)
      }
    }
  }

  const handleImageReset = () => {
    setInputValue('')
    setImgSrc('/images/avatars/1.png')
    setFormData({ ...formData, avatar: '' })
  }

  const handleCheckAddress = async formData => {
    try {
      const endereco = await validarCEP(formData.zipcode)
      if (endereco) setFormData({ ...formData, fulladdress: endereco })
      else throw new Error()
    } catch (error) {
      setErrors({ ...errors, zipcode: 'Endereço inválido' })
    }
  }

  const Check = formData => {
    let errors = {}
    Object.entries(formData).forEach(([name, value]) => {
      if (value === '') {
        if (!['obs', 'avatar', 'fulladdress'].includes(name)) {
          errors = { ...errors, [name]: '*Campo obrigatório' }
        }
      } else {
        if (name === 'zipcode') {
          if (value.length !== 9) {
            errors = { ...errors, zipcode: 'Endereço inválido' }
            setFormData({ ...formData, fulladdress: '' })
          } else handleCheckAddress(formData)
        }
        if (name === 'cpf') {
          if (!cpf.isValid(value)) errors = { ...errors, cpf: 'CPF inválido' }
        }
      }
    })
    setErrors(errors)

    return errors
  }

  const handleChange = e => {
    const { name, value } = e.target
    const New = { ...formData, [name]: name === 'fullname' ? Cap(value) : value }
    setFormData(New)
    Check(New)
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (Object.keys(Check(formData)).length !== 0) return

    try {
      const response = await axios.put('/api/profile', { act: 'profile', formData })
      if (response.data) toast.success('Salvo com sucesso!')
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  const dataProps = { formData, handleChange, errors }

  return (
    <Card>
      <CardHeader title='Detalhes do Perfil' />
      <form onSubmit={handleSubmit}>
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ImgStyled src={imgSrc} alt='Foto de Perfil' />
            <Box>
              <Button component='label' variant='contained' sx={{ mr: 4 }}>
                Carregar imagem
                <input hidden type='file' value={inputValue} accept='image/png, image/jpeg' onChange={handleImage} />
              </Button>
              <Button color='secondary' variant='tonal' onClick={handleImageReset}>
                Sem imagem
              </Button>
              <Typography sx={{ mt: 4, color: 'text.disabled' }}>
                Permitido PNG ou JPEG. Tamanho máximo de 800K.
              </Typography>
            </Box>
          </Box>
        </CardContent>
        <Divider />
        <CardContent>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={4}>
              <Input name='fullname' label='Nome completo' placeholder='João da Silva' {...dataProps} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Input
                name='cpf'
                label='CPF'
                placeholder='000.000.000-00'
                {...dataProps}
                options={{ numericOnly: true, delimiters: ['.', '.', '-'], blocks: [3, 3, 3, 2] }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Input name='email' label='Email' placeholder='joao.silva@example.com' {...dataProps} disabled />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Input
                name='phone'
                label='WhatsApp / Telefone'
                placeholder='(00) 0000 0000 '
                {...dataProps}
                options={{ phone: true, phoneRegionCode: 'BR' }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Input
                name='zipcode'
                label='CEP'
                placeholder='00000-000'
                {...dataProps}
                options={{ numericOnly: true, delimiters: ['-'], blocks: [5, 3] }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Input name='fulladdress' label='Endereço' placeholder='Endereço' {...dataProps} disabled />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Input name='number' label='Número' placeholder='123' {...dataProps} />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Input name='obs' label='Complemento' placeholder='AP 2 / BL 2' {...dataProps} />
            </Grid>
            <Grid item xs={12} sx={{ pt: theme => `${theme.spacing(6.5)} !important` }}>
              <Button type='submit' variant='contained' loading={loading} sx={{ mr: 4 }}>
                Salvar Alterações
              </Button>
              <Button type='reset' variant='tonal' color='secondary' onClick={() => setFormData(model)}>
                Resetar
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </form>
    </Card>
  )
}

export default Component
