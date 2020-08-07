import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  NormalizedCacheObject,
  createHttpLink,
} from "@apollo/client";
import { renderRoutes } from "react-router-config";
import routes from "../shared/routes";

declare global {
  interface Window {
    __APOLLO_STATE__: NormalizedCacheObject;
  }
}

const link = createHttpLink({
  uri: "/graphql",
});

const client = new ApolloClient({
  link,
  cache: new InMemoryCache().restore(window.__APOLLO_STATE__),
});

ReactDOM.hydrate(
  <ApolloProvider client={client}>
    <BrowserRouter>{renderRoutes(routes)}</BrowserRouter>
  </ApolloProvider>,
  document.getElementById("root")
);

// @ts-ignore
if (module.hot) {
  // @ts-ignore
  module.hot.accept();
}
