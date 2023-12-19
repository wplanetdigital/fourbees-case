import { MongoClient } from 'mongodb'

async function database() {
  const client = await new MongoClient(process.env.MONGODB_URI).connect()

  return client.db(process.env.MONGODB_DATABASE)
}

export default database
