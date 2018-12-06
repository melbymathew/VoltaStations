const { ApolloServer, gql } = require('apollo-server');

// This is a (sample) collection of stations we'll be able to query
// the GraphQL server for.  A more complete example might fetch
// from an existing data source like a REST API or database.
const stations = [
  {
    id: 'f9831517-e87d-427c-a86e-4b0fcd2d55b7',
    lin: '001-0001-001-01',
    name: 'Pearlridge Center 01',
  },
  {
    id: 'f9831517-e87d-427c-a86e-4b0fcd2d55b7',
    lin: '001-0001-001-01',
    name: 'Pearlridge Center 01',
  },
];

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  # This "Station" type can be used in other type declarations.
  type Station {
    id: String
    lin: String
    name: String
  }

  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
    stations: [Station]
  }
`;

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "stations" array above.
const resolvers = {
  Query: {
    stations: () => stations,
  },
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({ typeDefs, resolvers });

// This `listen` method launches a web-server. 
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});