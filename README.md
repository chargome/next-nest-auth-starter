# next-nest-auth-starter

This repo contains two completely isolated projects: a `NestJS`-based API-server and a `NextJS`-based client that connects to it.

The api-server uses `passport` and `express-session` for handling server-side sessions and exposes endpoints via REST.

## setup API-server
- `cd api-server`
- create a `.env.development` and `.env.test` file with your database connection string (e.g.`DATABASE_URL="file:./dev.db"`)
- `npm i`
- `npm start:dev`
- you can play around and create some users using the .`.http` files in the auth module.

## setup client
- `cd client`
- create a `.env.local` that contains your database backend connection url (`NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
`)
- `npm i`
- `npm run dev`
