import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { surname, email, password } = req.body;
    try {
      const newUser = await prisma.user.create({
        data: {
          surname,
          email,
          password
        }
      });
      return res.status(200).json(newUser);
    } catch (error) {
      return res.status(500).json({ error: 'Unable to create user' });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
