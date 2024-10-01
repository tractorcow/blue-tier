## Blue Tier

A silly tier list tool I came up with.

## Getting Started

### Setup NVM

See https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating for instructions on how to install NVM.

If you don't want to install NVM, just make sure you have node 20.

```bash
nvm install 20
nvm use
```

### Setup DB

Setup a postgres database, and create an .env file in the root directory. Copy .env.example
and update the DB credentials.

Once the database is setup, run the following commands to create the tables:

```bash
make install
make migrate
```

### Run the site

```bash
make watch
```

Then the site should be available at `http://localhost:3000`.
