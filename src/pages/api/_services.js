import database from 'src/configs/database'
import { v4 as uuid } from 'uuid'
import bcrypt from 'bcryptjs'

class db {
  constructor() {
    this.db = null
  }
  async init() {
    this.db = await database()
  }
  _users = () => this.db.collection('users')
  _userActivity = () => this.db.collection('userActivity')
  _products = () => this.db.collection('products')
}

class register extends db {
  async signIn(email, password, role) {
    await this.init()

    const User = await this._users().findOne({ email })
    if (User) throw new Error('E-mail inválido, já existe')

    const id = uuid()
    const token = uuid()
    const hash = await bcrypt.hash(password, 10)

    await this._users().insertOne({
      id,
      role,
      email,
      password: hash,
      status: 'pending',
      created_at: new Date(),
      updated_at: new Date(),
      email_verified_at: '',
      verified_at: '',
      remember_token: token,
      fullname: '',
      phone: '',
      zipcode: '',
      fulladdress: '',
      cpf: '',
      number: '',
      obs: '',
      avatar: ''
    })

    const { sendMail } = await import('./mail/auth/activate')
    await sendMail(email, token)

    return id
  }
}

class userActivity extends db {
  async insert(userId, description, req) {
    await this.init()

    const userAgent = await import('express-useragent')
    const useragent = userAgent.parse(req.headers['user-agent'])
    const requestIp = await import('request-ip')
    const geoip = await import('geoip-lite')

    const ip = requestIp.getClientIp(req)
    const geo = geoip.lookup(ip)
    const device = useragent.isMobile ? 'Mobile' : useragent.isTablet ? 'Tablet' : 'Desktop'

    await this._userActivity().insertOne({
      id: uuid(),
      userId,
      description,
      ip_address: ip,
      browser: useragent.browser,
      version: useragent.version,
      os: useragent.os,
      platform: useragent.platform,
      source: useragent.source,
      device,
      geo,
      created_at: new Date()
    })
  }

  async list(userId) {
    await this.init()

    return await this._userActivity().find({ userId }).sort({ created_at: -1 }).toArray()
  }

  async listAll() {
    await this.init()

    return await this._userActivity().find().sort({ created_at: -1 }).toArray()
  }
}

class auths extends db {
  async welcome(email) {
    await this.init()
    const User = await this._users().findOne({ email })
    if (!User) throw new Error('Usuário não encontrado')

    return User
  }

  async resend(email) {
    await this.init()
    const User = await this._users().findOne({ email })
    if (!User) throw new Error('Usuário não encontrado')

    const token = uuid()
    await this._users().updateOne({ id: User.id }, { $set: { remember_token: token } })

    const { sendMail } = await import('./mail/auth/activate')
    await sendMail(email, token)

    return User
  }

  async activate(remember_token) {
    await this.init()
    const User = await this._users().findOne({ remember_token })
    if (!User) throw new Error('Usuário não encontrado')

    await this._users().updateOne(
      { remember_token },
      { $set: { status: 'active', remember_token: '', email_verified_at: new Date(), verified_at: new Date() } }
    )

    return User
  }

  async forgot(email) {
    await this.init()
    const User = await this._users().findOne({ email })
    if (!User) throw new Error('Usuário não encontrado')

    const token = uuid()
    await this._users().updateOne({ id: User.id }, { $set: { remember_token: token } })

    const { sendMail } = await import('./mail/auth/forgot')
    await sendMail(email, token)

    return User
  }

  async reset(remember_token, password) {
    await this.init()
    const User = await this._users().findOne({ remember_token })
    if (!User) throw new Error('Usuário não encontrado')

    await this._users().updateOne(
      { remember_token },
      { $set: { password: await bcrypt.hash(password, 10), remember_token: '', updated_at: new Date() } }
    )

    return User
  }

  async token(remember_token) {
    await this.init()
    const User = await this._users().findOne({ remember_token })
    if (!User) throw new Error('Usuário não encontrado')

    return User
  }
}

class user extends db {
  async auth(email, password) {
    await this.init()

    const User = await this._users().findOne({ email })

    if (!User) throw new Error('Usuário não encontrado')
    if (User.status === 'pending') throw new Error('Confirme seu e-mail')
    if (User.status === 'block') throw new Error('Usuário bloqueado')

    const match = await bcrypt.compare(password, User.password)
    if (!match) throw new Error('Senha incorreta')

    // const { sendMail } = await import('./mail/auth/verify-email')
    // await sendMail(email, Math.floor(Math.random() * 1000000))

    return User
  }

  async find(id) {
    await this.init()
    const User = await this._users().findOne({ id })
    if (!User) throw new Error('Usuário não encontrado')

    return User
  }

  async update(id, formData) {
    await this.init()
    await this._users().updateOne({ id }, { $set: formData })
  }

  async change(id, password, password1, userpassword) {
    await this.init()
    const match = await bcrypt.compare(password, userpassword)
    if (!match) throw new Error('Senha incorreta')

    await this._users().updateOne(
      { id },
      { $set: { password: await bcrypt.hash(password1, 10), updated_at: new Date() } }
    )
  }
}

class products extends db {
  async create(formData) {
    await this.init()
    await this._products().insertOne({ id: uuid(), ...formData, created_at: new Date() })
  }

  async list(userId) {
    await this.init()

    return await this._products().find({ userId }).sort({ created_at: -1 }).toArray()
  }

  async find(id) {
    await this.init()
    const Product = await this._products().findOne({ id })
    if (!Product) throw new Error('Não encontrado')

    return Product
  }

  async status(id, status) {
    await this.init()
    await this._products().updateOne({ id }, { $set: { status } })
  }

  async delete(id) {
    await this.init()
    await this._products().deleteOne({ id })
  }
}

export { register, auths, user, userActivity, products }
