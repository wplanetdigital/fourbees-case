import { user, userActivity } from './_services'

export default async function handler(req, res) {
  const { method } = req
  const { act } = req.body

  switch (method) {
    case 'POST':
      switch (act) {
        case 'activities':
          try {
            const { id } = req.body
            await new user().find(id)

            return res.status(200).json(await new userActivity().list(id))
          } catch (error) {
            return res.status(500).json({ message: error.message })
          }
          break

        default:
          res.status(500).end()
      }

    case 'PUT':
      switch (act) {
        case 'profile':
          try {
            const { formData } = req.body
            const { id } = formData
            await new user().find(id)
            await new user().update(id, formData)
            await new userActivity().insert(id, `Change ${act}`, req)

            return res.status(200).json({ message: 'OK' })
          } catch (error) {
            return res.status(500).json({ message: error.message })
          }
          break

        case 'password':
          try {
            const { id, password, password1 } = req.body.formData
            const User = await new user().find(id)
            await new user().change(id, password, password1, User.password)
            await new userActivity().insert(id, `Change ${act}`, req)

            return res.status(200).json({ message: 'OK' })
          } catch (error) {
            return res.status(500).json({ message: error.message })
          }
          break

        default:
          res.status(500).end()
      }

      break

    default:
      res.status(405).end()
  }
}
