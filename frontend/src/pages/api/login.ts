import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_URL;

if (!BACKEND_URL) {
  throw new Error('missing env variable');
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const loginRes = await axios({
      url: `${BACKEND_URL}/auth/login`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        email: req.body.email,
        password: req.body.password,
      },
    });
    const cookie = loginRes.headers['set-cookie'];
    if (!cookie) {
      res.status(400).send({ error: 'login failed' });
    }
    res.setHeader('Set-Cookie', cookie || '').send(loginRes.data);
  } catch (error) {
    res.status(400).send({ error: 'login failed' });
  }
};

export default handler;
