# stripe-integration-app
Example App to integrate a Stripe account to manage payments.

## Backend Stack
### `NodeJS` `TypeScript` `SQLite3` `Sequelize ORM`

## Frontend Stack
### `ReactJS` `TypeScript` `Bootstrap`

## Integration
### `Stripe` `JWT`

## To run Backend:

### `cp .env.template .env`
And open .env file and modify with these environment variables:

```
DATABASE_USER=root
DATABASE_PASSWORD=password
DATABASE_NAME=stripe-app
DATABASE_HOST=localhost
PORT=4000 
JWT_SECRET=JWT_SECRET
STRIPE_PUBLIC_KEY=STRIPE_PUBLIC_KEY
STRIPE_SECRET_KEY=STRIPE_SECRET_KEY
UI_URL=http://localhost:3000
```

### `npm install`
### `npm run dev`

Server running on: [http://localhost:4000](http://localhost:4000)

## To run Frontend:

### `cp .env.template .env`
And open .env file and modify with these environment variables:

```
PORT=3000
REACT_APP_API_URL=http://localhost:4000
REACT_APP_STRIPE_PUBLIC_KEY=STRIPE_PUBLIC_KEY
```

### `npm install`
### `npm start`

UI running on: [http://localhost:3000](http://localhost:3000)
