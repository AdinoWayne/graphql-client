import { ApolloClient, InMemoryCache } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { setContext } from '@apollo/client/link/context';
import { split, HttpLink } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";

const WS_URL = `ws://localhost:5000/subscriptions`;
const BASE_GRAPHQL_URL = `http://localhost:5000/api/graphql/`;
const token = localStorage.getItem("accessToken");
// ... or create a GraphQL client instance to send requests
const wsLink = new WebSocketLink({
    uri: WS_URL,
    options: {
        lazy: true,
        reconnect: true,
        connectionParams: () => {
            return {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                    Accept: 'application/json'
                },
            }
        },
    },
});

const httpLink = new HttpLink({
    uri: BASE_GRAPHQL_URL,
    credentials: "include",
    headers: {
        Authorization: token ? `Bearer ${token}` : "",
        Accept: 'application/json'
    }
});

const link = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wsLink,
    httpLink
);

const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
});

export function setGraphqlHeaders() {
    const token = localStorage.getItem("accessToken");
    const authLink = setContext((_, {headers}) => {
      return {
        headers: {
          ...headers,
          Authorization: token ? `Bearer ${token}` : "",
        },
      };
    });
    client.setLink(authLink.concat(httpLink));
}

export default client;