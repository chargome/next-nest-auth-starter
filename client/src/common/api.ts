if (!process.env.BACKEND_URL) {
  throw new Error('missing env vars');
}

export const BACKEND_URL = process.env.BACKEND_URL;
