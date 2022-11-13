# Around the U.S. Back End

## Description

Backend implemented in Node.js for the Around the US project. Server can return a list of cards, a list of all users, and can get a specific user by ID. User info and avatar can be edited, and cards can be liked, unliked, and deleted.

## Technologies and techniques

Code was written in Javascript, using Node.js and the Express.js package. Data is stored in a MongoDB database. Postman was used to verify that the server was working.

## Project Features

10 different requests can be sent to the server:

GET /users — returns all users

GET /users/:userId - returns a user by _id

POST /users — creates a new user 

GET /cards — returns all cards

POST /cards — creates a new card

DELETE /cards/:cardId — deletes a card by _id 

PATCH /users/me — update profile

PATCH /users/me/avatar — update avatar

PUT /cards/:cardId/likes — like a card

DELETE /cards/:cardId/likes — unlike a card 

## Directories

`/routes` — routing files.

'/controllers' - code for what happens on each route

'/models' - builds the schemas for the database and turns them into models

## Running the Project

`npm run start` — to launch the server.

`npm run dev` — to launch the server with the hot reload feature.
