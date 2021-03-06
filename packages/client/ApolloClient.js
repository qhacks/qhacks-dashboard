import { InMemoryCache } from "apollo-cache-inmemory";
import { CachePersistor } from "apollo-cache-persist";
import { withClientState } from "apollo-link-state";
import { setContext } from "apollo-link-context";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { ApolloLink } from "apollo-link";
import axios from "axios";

import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "./Client";
import { resolvers, defaults, typeDefs } from "./cache";

const isProd = process.env.NODE_ENV === "production";
const isStaging = process.env.NODE_ENV === "staging";

const GRAPHQL_ENDPOINT =
  isProd || isStaging
    ? `https://${window.location.host}/graphql`
    : "http://localhost:3000/graphql";

const CLIENT_VERSION = "1.3.4";
const CLIENT_NAME = isProd
  ? "dashboard-web-client-prod"
  : isStaging
    ? "dashboard-web-client-staging"
    : "dashboard-web-dev";

// Gets a new access token using an existing refresh token
const getNewAccessToken = () => {
  console.log("[Token Refresh Info]: Attempting to refresh access token!");

  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

  if (refreshToken) {
    return axios.post("/oauth/refresh", {
      refreshToken
    });
  }

  return Promise.reject(new Error("No refresh token in local storage!"));
};

const apolloClientSetup = async () => {
  // Cache used for local state and query caching
  const cache = new InMemoryCache();

  // Link to manage local state via GraphQL
  const stateLink = withClientState({
    cache,
    resolvers,
    defaults,
    typeDefs
  });

  const persistor = await new CachePersistor({
    cache,
    storage: window.localStorage,
    debug: true
  });

  // Error handler link, will attempt operation retrys after refreshing access token
  const errorLink = onError(
    ({ graphQLErrors, networkError, operation, forward }) => {
      if (graphQLErrors) {
        // Check for an unauthenticated error and retry with refreshed token
        graphQLErrors.forEach((err) => {
          if (err.extensions.code === 401) {
            getNewAccessToken()
              .then((res) => {
                console.log(
                  "[Token Refresh Success]: Successfully refreshed access token!"
                );

                const newAccessToken = res.body.accessToken;
                const newRefreshToken = res.body.refreshToken;

                const oldHeaders = operation.getContext().headers;

                operation.setContext({
                  headers: {
                    ...oldHeaders,
                    authorization: `Bearer ${newAccessToken}`
                  }
                });

                // Set the new tokens in storage
                localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
                localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);

                // Retry the request!
                return forward(operation);
              })
              .catch((err) => {
                console.log(
                  `[Token Refresh Error]: Unable to refresh token: ${err}!`
                );
              });
          }
        });

        // Print all errors out to console
        graphQLErrors.map(({ message, locations, path }) =>
          console.log(
            `[GraphQL Error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        );
      }

      // Print any network errors
      if (networkError) {
        console.log(`[Network Error]: ${networkError}`);
      }
    }
  );

  // Sets authorization headers in context
  const authLink = setContext((_, previousContext) => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

    // Only set authorization headers if none exist
    // Mainly because error handler sets new tokens on retries
    //if (!previousContext.headers && !previousContext.headers.authorization) {
    return {
      ...previousContext,
      headers: {
        ...previousContext.headers,
        authorization: accessToken ? `Bearer ${accessToken}` : ""
      }
    };
  });

  // Identifies the client in Apollo Engine
  const clientIdentifierLink = new ApolloLink((operationArg, forward) => {
    const operation = operationArg;
    operation.extensions.clientInfo = {
      clientName: CLIENT_NAME,
      clientVersion: CLIENT_VERSION
    };

    operation.setContext({
      http: {
        includeExtensions: true
      }
    });

    return forward(operation);
  });

  // Terminating link to fetch data from server
  // NOTE: Reads request headers from context
  const networkLink = new HttpLink({
    uri: GRAPHQL_ENDPOINT
  });

  const apolloClient = new ApolloClient({
    cache,
    link: ApolloLink.from([
      errorLink,
      stateLink,
      authLink,
      clientIdentifierLink,
      networkLink
    ])
  });

  return {
    apolloClient,
    persistor
  };
};

export default apolloClientSetup;
