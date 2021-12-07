import { GraphQLClient } from 'graphql-request'

const BASE_GRAPHQL_URL = `http://localhost:5000/api/graphql/`;
const token = localStorage.getItem("accessToken");
// ... or create a GraphQL client instance to send requests
const client = new GraphQLClient(BASE_GRAPHQL_URL, { headers: {
    authorization: 'Bearer ' + token,
    Accept: 'application/json'
} })

export default client;