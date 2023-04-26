const { userDef, userResolvers } = require("./user");
const { statsDef, statsResolvers } = require("./stats");
const { replayDef, replayResolvers } = require("./replay");

const { mergeTypeDefs, mergeResolvers } = require("@graphql-tools/merge");

const resolvers = mergeResolvers([
  userResolvers,
  statsResolvers,
  replayResolvers,
]);
const typeDefs = mergeTypeDefs([userDef, statsDef, replayDef]);

module.exports = { typeDefs, resolvers };
