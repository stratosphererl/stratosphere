const { userDef, userResolvers } = require("./user");
const { statsDef, statsResolvers } = require("./stats");
const { generalDefs, generalResolvers } = require("./general");
const { replayDef, replayResolvers } = require("./replay");
const { mlDef, mlResolvers } = require("./ml");
const { mergeTypeDefs, mergeResolvers } = require("@graphql-tools/merge");

const typeDefs = mergeTypeDefs([userDef, statsDef, replayDef, mlDef]);

const resolvers = mergeResolvers([
  userResolvers,
  statsResolvers,
  replayResolvers,
  mlResolvers,
]);

module.exports = { typeDefs, resolvers };
