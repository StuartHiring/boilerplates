import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
  gql,
} from "@apollo/client";
import { renderToStringWithData } from "@apollo/client/react/ssr";
import { RequestHandler, Request, Response } from "express";
import fetch from "cross-fetch";
import React from "react";
import LaunchesPast from "../../client/LaunchesPast";

export default (
  configureCache: (req: Request, res: Response) => InMemoryCache
): RequestHandler => async (req, res, next) => {
  const link = createHttpLink({
    uri: "http://localhost:3000/graphql",
    fetch,
  });

  const cache = configureCache ? configureCache(req, res) : new InMemoryCache();

  const client = new ApolloClient({
    ssrMode: true,
    link,
    cache,
  });

  const appTree = (
    <ApolloProvider client={client}>
      <LaunchesPast />
    </ApolloProvider>
  );

  renderToStringWithData(appTree).then((content) => {
    const initialState = client.extract();

    const html = `
        <!doctype html>
        <html>
            <head />
            <body>
            <div id="root">${content}</div>
                <script>window.__APOLLO_STATE__=${JSON.stringify(
                  initialState
                ).replace(/</g, "\\u003c")}</script>
                <script src="/main.js"></script>
            </body>
        </html>`;

    res.status(200);
    res.send(html);
    res.end();
  });
};
