const { userDef, userResolvers } = require("./user");
const { statsDef, statsResolvers } = require("./stats");
const { generalDefs, generalResolvers } = require("./general");
const { replayDef, replayResolvers } = require("./replay");
const { mergeTypeDefs, mergeResolvers } = require("@graphql-tools/merge");

const typeDefs = mergeTypeDefs([userDef, statsDef, replayDef]);

const resolvers = mergeResolvers([
  userResolvers,
  statsResolvers,
  replayResolvers,
]);

module.exports = { typeDefs, resolvers };
