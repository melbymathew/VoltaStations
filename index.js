const { ApolloServer, gql } = require('apollo-server');
const axios = require('axios');

const getStations = async (args) => {
  try {
    const baseUrl = 'https://api.voltaapi.com/v1/stations';
    let fullUrl = baseUrl;
    if(args.stationFilter) {
      fullUrl += getFilterQueryString(args.stationFilter);
    }
    console.log(fullUrl);
    return await axios.get(encodeURI(fullUrl));
  } catch (error) {
    console.error(error)
  }
};

const getFilterQueryString = ({ search_term, available, top, left, bottom, right, status, limit, offset, order_by, sort_dir }) => {
  let filterPart = '?'
  if(search_term) {
    filterPart += 's=' + search_term + '&'
  }
  if(available) {
    filterPart += 'available=' + available + '&'
  }
  if(top) {
    filterPart += 'top=' + top + '&'
  }
  if(left) {
    filterPart += 'left=' + left + '&'
  }
  if(bottom) {
    filterPart += 'bottom=' + bottom + '&'
  }
  if(right) {
    filterPart += 'right=' + right + '&'
  }
  if(status) {
    filterPart += 'status=' + status + '&'
  }
  if(limit) {
    filterPart += 'limit=' + limit + '&'
  }
  if(offset) {
    filterPart += 'offset=' + offset + '&'
  }
  if(order_by) {
    filterPart += 'orderby=' + order_by + '&'
  }
  if(sort_dir) {
    filterPart += 'sortdir=' + sort_dir + '&'
  }

  return filterPart;
};

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.
  scalar GraphQLDate

  enum Type {
    Point
  }
  enum Status {
    uc
    a
    ns
    d
  }
  enum SortDir {
    asc
    desc
  }
  type Location {
    type: Type
    coordinates: [Float]
  }
  type Meter {
    id: String
    oem: String
    station_id: String
    state: String
  }
  # This "Station" type can be used in other type declarations.
  type Station {
    id: String
    lin: String
    name: String
    status: String
    location: Location
    street_address: String
    city: String
    state: String
    zip_code: String
    pay_to_park: Boolean
    completion_date: GraphQLDate
    meters: [Meter]
    public: Boolean
  }

  input StationFilter {
    search_term: String
    available: String
    top: Float
    left: Float
    bottom: Float
    right: Float
    status: Status
    limit: Int
    offset: Int
    order_by: String
    sort_dir: SortDir
  }

  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
    stations(stationFilter: StationFilter): [Station]
  }
`;

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "stations" array above.
const resolvers = {
  Query: {
    stations: async (obj, args, context) => {
      const resp = await getStations(args);
      return resp.data;
    }

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