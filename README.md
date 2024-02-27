# Mero Calendar Assignment

This is a small demo application that was made for the [given assignment](https://docs.google.com/document/d/1InqCGSMupbu28M9ikwfqVR5_y5DfPixzxbI7S9bRXcE/edit)

## Prerequisites for running locally

- You need NodeJS installed on your machine. If you use [nvm](https://github.com/nvm-sh/nvm) to manage your NodeJS versions, you can use the version already committed in the `.nvmrc` file.
- [pnpm](https://pnpm.io/installation#using-corepack) is the package manager of choice

## Installing

Just run `pnpm install`

## Setting up the database

This app uses [Prisma](https://www.prisma.io/) alongside with an in-memory SQLite 3 database. To create the database file and apply the migrations, just run

```bash
pnpm prisma migrate dev
```

In case you need to generate just the types provided by prisma, run 

```bash
pnpm prisma generate
```

## Running the app locally

To run locally, you can use the `pnpm start` or `pnpm start:dev` scripts. This will open a server at `localhost:3000`.

There is a Swagger instance running at `localhost:3000/api` to directly test the API.


## Exploring the data

Prisma provides a easy to use database GUI, that can be accessed using

```bash
pnpm prisma studio
```
## NPM published package

This app was not published to npm, but the publishing command was tested with

```bash
npm publish --dry-run=true
```