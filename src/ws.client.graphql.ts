import { createClient } from 'graphql-ws'

const BASE_GRAPHQL_URL = `ws://127.0.0.1:5000/subscriptions`;
const token = localStorage.getItem("accessToken");

const client = createClient({
    url: BASE_GRAPHQL_URL,
});

export default client;