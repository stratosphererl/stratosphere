const { userDef, userResolvers } = require("./user");
const { statsDef, statsResolvers } = require("./stats");
const { mergeTypeDefs, mergeResolvers } = require("@graphql-tools/merge");

const resolvers = mergeResolvers([userResolvers, statsResolvers]);
const typeDefs = mergeTypeDefs([userDef, statsDef]);

module.exports = { typeDefs, resolvers };
