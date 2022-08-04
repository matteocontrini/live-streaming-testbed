# Testbed client

## Running the simulation

```sh
./run.sh
```

## Development setup

For development, run the frontend build command:

```sh
cd testbed/client/frontend
npm ci
npm run dev
```

In another shell, run the Node.js application, which also serves the frontend build:

```sh
cd testbed/client
npm ci
npm run dev
```
