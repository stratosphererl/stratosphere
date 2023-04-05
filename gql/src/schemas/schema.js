const { userDef, userResolvers } = require("./user");
const { statsDef, statsResolvers } = require("./stats");
const { generalDefs, generalResolvers } = require("./general");
const { mergeTypeDefs, mergeResolvers } = require("@graphql-tools/merge");

const typeDefs = mergeTypeDefs([userDef, statsDef, generalDefs]);

const resolvers = mergeResolvers([
  userResolvers,
  statsResolvers,
  generalResolvers,
]);

module.exports = { typeDefs, resolvers };
