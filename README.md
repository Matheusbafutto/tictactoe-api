# Tic Tac Toe graphQL API

This is a graphQL API which can serve users who want to play tic tac toe. This project was based of [this graphQL tutorial](https://www.howtographql.com/graphql-js/0-introduction/) and functions in a similar fashion.

## Serving the API

### Intallation and Setup
```

git clone git@github.com:Matheusbafutto/tictactoe-api.git
cd tictactoe-api
yarn or npm install
prisma deploy

```

OBS:
* This Readme assumes you have the prisma cli globally installed in your machine. Instructions on its installation can be found [here](https://www.prisma.io/docs/prisma-cli-and-configuration/using-the-prisma-cli-alx4/).
* If you are reading this readme it is probably safe  to assume you have node and either npm or yarn installed in your computer, but in case not, [this link](https://www.dyclassroom.com/howto-mac/how-to-install-nodejs-and-npm-on-mac-using-homebrew) could be helpful.
* Using prisma Demo MySQL server is recommended, for this you will need to create a [prisma cloud account](https://www.prisma.io/cloud) and use their database.

### Running API

From root directory:
```
node src/index.js
```

## Documentation

### Using the API
Mutations login and signup provide authentication token which must be placed in header for a player to be able to make other graphQL Queries and Mutations.

On header:
```
Authorization: 'Bearer [Auth token here]'
```

### Mutations

1. signup(name: String!, email:String!, password: String!): AuthPayload! - AuthPayload contains both the newly created user and the auth token.

2. login(email:String!, password:String!): AuthPayload! - If email and password are valid, returns AuthPayload contains both the user and the auth token. Else throws exception.

3. startGame: Game! - creates a new Game instance assigned to the user whose auth token is being used.

4. play(row:Int!, col:Int!, gameId:String!): Game! - User from valid auth token on header inputs a row and a col within the 3x3 tic tac toe table. If row and col map to empty slot, marks slot with player ball symbol. API randomly marks 'x' on an available empty spot. Returns Game with updated state.

### Queries

1. user(id: ID!): User! - returns required fields from user with the id specified

2. finishedGames: [Game!] - returns required fields from finished games associated with the user within the auth token.

3. unfinishedGames: [Game!] - returns required fields from unfinished games associated with the user within the auth token.

4. wonGames: [Game!] - returns required fields from won games associated with the user within the auth token.

5. lostGames: [Game!] - returns required fields from lost games associated with the user within the auth token.

6. drawGames: [Game!] - returns required fields from draw games associated with the user within the auth token.
