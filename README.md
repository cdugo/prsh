# prsh

Commands:

- npm dev: Start the development server
- npm build: Build & clean the project
- npm lint: Lint the project (Lint on save reccommended)



## Project setup

### Database setup
1. Create a new PostgresSQL database image using Docker:
```bash

docker run --name prsh -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres

```

2. Add the following environment variables to a new `.env` file in the root of the project:
```bash
DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/prsh"
```




3. Create a new database called `prsh` by running Prisma's migrate command:
```bash
npx prisma migrate dev
```

