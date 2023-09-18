# Project Title

Samespace Backend Assignment

## Description

This project is a simple CRUD (Create, Read, Update, Delete) application using Node.js, Express.js, and MySQL. It also has Automation testing functionality.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install the software and how to install them:

- Node.js
- MySQL

### Installing

A step by step series of examples that tell you how to get a development environment running:

1. Clone the repository to your local machine using `git clone https://github.com/raushan27/samespace_backend.git`.
2. Navigate to the project directory.
3. Install the dependencies using `npm install`.
4. Create a `.env` file in the root directory of the project, and add your database configuration:
   ```
   HOST=<your-database-host>
   USER=<your-database-user>
   PASSWORD=<your-database-password>
   DATABASE=<your-database-name>
   PORT=<your-server-port>
   ```
5. Run the server using `node index.js`.

Now, you should be able to access the application at `http://localhost:<your-server-port>`.

### Running the tests

- Test the api by using `npm test`
- It should test 13 different testcases covering different aspects of api

### Dependencies

- Node.js
- Express.js
- MySQL
- dotenv
- body-parser
- jest

## Functionality

The application provides the following routes:

- `POST /:collection`: Create a new document in the specified collection.
- `GET /:collection/:id`: Read a document with the specified ID from the specified collection.
- `POST /:collection/:id`: Update a document with the specified ID in the specified collection.
- `DELETE /:collection/:id`: Delete a document with the specified ID from the specified collection.
- `GET /:collection/`: Get all documents from the specified collection.

## Authors

Raushan Vadshah
raushanvadshah@gmail.com

## Version History

- 0.1
  - Initial Release
