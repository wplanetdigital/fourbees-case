import { register, userActivity } from './_services'

export default async function handler(req, res) {
  try {
    const { email, password, role } = req.body
    const userId = await new register().signIn(email, password, role)
    await new userActivity().insert(userId, 'Signed up', req)

    return res.status(200).json({ message: 'OK' })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
