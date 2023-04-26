const { gql } = require("apollo-server-express");
const { GraphQLUpload } = require("graphql-upload");

const generalDefs = gql`
  # The implementation for this scalar is provided by the
  # 'GraphQLUpload' export from the 'graphql-upload' package
  # in the resolver map below.
  scalar Upload

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  type Query {
    otherFields: Boolean!
  }
`;

const generalResolvers = {
  // This maps the `Upload` scalar to the implementation provided
  // by the `graphql-upload` package.
  Upload: GraphQLUpload,
  Query: {
    otherFields: () => true,
  },
  Mutation: {},
};

module.exports = { generalDefs, generalResolvers };
