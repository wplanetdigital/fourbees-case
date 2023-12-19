import { auths, userActivity } from './_services'

export default async function handler(req, res) {
  const { method } = req
  const { act } = req.body

  switch (method) {
    case 'POST':
      switch (act) {
        case 'welcome':
          try {
            const { email } = req.body
            const User = await new auths().welcome(email)

            return res.status(200).json(User)
          } catch (error) {
            return res.status(500).json({ message: error.message })
          }
          break

        case 'resend':
          try {
            const { email } = req.body
            const User = await new auths().resend(email)
            await new userActivity().insert(User.id, `User ${act}`, req)

            return res.status(200).json({ message: 'OK' })
          } catch (error) {
            return res.status(500).json({ message: error.message })
          }
          break

        case 'activate':
          try {
            const { token } = req.body
            const User = await new auths().activate(token)
            await new userActivity().insert(User.id, `User ${act}`, req)

            return res.status(200).json({ message: 'OK' })
          } catch (error) {
            return res.status(500).json({ message: error.message })
          }
          break

        case 'forgot':
          try {
            const { email } = req.body.formData
            const User = await new auths().forgot(email)
            await new userActivity().insert(User.id, `User ${act}`, req)

            return res.status(200).json({ message: 'OK' })
          } catch (error) {
            return res.status(500).json({ message: error.message })
          }
          break

        case 'reset':
          try {
            const { token, password } = req.body.formData
            const User = await new auths().reset(token, password)
            await new userActivity().insert(User.id, `User ${act} password`, req)

            return res.status(200).json({ message: 'OK' })
          } catch (error) {
            return res.status(500).json({ message: error.message })
          }
          break

        case 'token':
          try {
            const { token } = req.body
            const User = await new auths().token(token)

            return res.status(200).json(User)
          } catch (error) {
            return res.status(500).json({ message: error.message })
          }
          break

        default:
          res.status(500).end()
      }

    default:
      res.status(405).end()
  }
}
