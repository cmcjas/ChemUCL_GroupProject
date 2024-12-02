import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  res.json(user);
}