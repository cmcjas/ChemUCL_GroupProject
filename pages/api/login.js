// Inside pages/api/login.js
import { setCookie } from 'nookies';
import { findUser } from 'db/queries/User';

export default async function handler(req, res) {
    const { email, password } = req.body;
  
    // Authenticate user here (replace this with your own logic)
    const user = await findUser(email);
  
    if (user) {
      const session = { ...user, role: 'admin' }; // Set role as a string
      setCookie({ res }, 'session', JSON.stringify(session), {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax',
      });
  
      res.status(200).json({ status: 'Logged in' });
    } else {
      res.status(401).json({ status: 'Unauthorized' });
    }
  }