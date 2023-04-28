# GojekApp
Modular monolith service gojek app using Nx Workspace with Node.js and MongoDB

## Project setup
- Change filename `.env.example` to `.env` and configure it to access database and endpoint.
- Run `npm install` to install outside dependencies.

## Build the project
Run `npx nx build gojek-app` to build all modules.

## Run development server
Run `nx serve gojek-app` for a dev server. 

## Understand this workspace
Run `nx graph` to see a diagram of the dependencies of the projects.

## Endpoint List
You can see the endpoint documentation at [here](./doc/postman) (export and use using Postman)

### Why using Nx-Workspace?
- Support many feature (See [here](https://monorepo.tools/) to see how it compares to other tools)
- Using Typescript and support framework Express
- Has good documentation and has a short tutorial for the framework

### Data model
You can see data model at [here](./doc/postman/database_schema.png)

### Structure project
You can see structure project at [here](./doc/postman/graph.png)
