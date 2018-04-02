# Front-end challenge simple API

## Getting started

### Install MongoDB
```bash
brew install mongodb
```

### Install dependencies
```bash
yarn
```

### Run MongoDB daemon
```bash
brew services start mongodb
```

### Start
```bash
yarn start
```

Signup :
```bash
curl -X POST http://localhost:8000/signup -d username=user -d password=user
```

Signin :
```bash
curl -X POST http://localhost:8000/signin -d username=user -d password=user
```

You can now check out [GraphiQL explorer](http://localhost:3000/graphiql/explorer) to try the API.