import { getSession } from 'next-auth/react'

export default async function session(req, res) {
  const session = await getSession({ req })
  res.send(session)
}