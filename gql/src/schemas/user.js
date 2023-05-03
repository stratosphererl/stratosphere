const { gql } = require("apollo-server-express");
const fetch = require("node-fetch");
const {
  USER_SERVICE_URL,
  USER_SERVICE_PORT,
  AUTH_TOKEN,
} = require("../config/datasources");

const userDef = gql`
  type User {
    id: Int!
    platform: String!
    username: String!
    date_created: String!
    number_of_replays: Int!
    wins: Int!
    losses: Int!
    total_goals: Int!
    total_assists: Int!
    total_saves: Int!
    total_shots: Int!
  }

  extend type Query {
    user(id: Int!): User
    users(
      page: Int = 1
      limit: Int = 10
      platform: String = "both"
      username: String
    ): [User]
  }

  type Mutation {
    createUser(id: Int!, platform: String!, username: String!): User
    deleteUser(id: Int!): User
  }
`;

const userResolvers = {
  Query: {
    user: (parent, args, context, info) => {
      return fetch(
        `http://${USER_SERVICE_URL}:${USER_SERVICE_PORT}/api/v1/users/${args.id}`
      ).then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      });
    },
    users: (parent, args, context, info) => {
      let usernamePath = "";
      if (args.username !== undefined) {
        usernamePath = `&username=${args.username}`;
      }
      return fetch(
        `http://${USER_SERVICE_URL}:${USER_SERVICE_PORT}/api/v1/users?page=${args.page}&limit=${args.limit}&platform=${args.platform}${usernamePath}`
      ).then((res) => {
        console.log(res);
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      });
    },
  },
  Mutation: {
    createUser: (parent, args, context, info) => {
      return fetch(
        `http://${USER_SERVICE_URL}:${USER_SERVICE_PORT}/api/v1/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AUTH_TOKEN}`,
            accept: "application/json",
          },
          body: JSON.stringify({
            id: args.id,
            platform: args.platform,
            username: args.username,
          }),
        }
      ).then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      });
    },
    deleteUser: (parent, args, context, info) => {
      return fetch(
        `http://${USER_SERVICE_URL}:${USER_SERVICE_PORT}/api/v1/users/${args.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AUTH_TOKEN}`,
            accept: "application/json",
          },
        }
      ).then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      });
    },
  },
};

module.exports = { userDef, userResolvers };
