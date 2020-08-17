import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
  gql,
} from "@apollo/client";
import { StaticRouter } from "react-router-dom";
import { renderRoutes } from "react-router-config";
import { renderToStringWithData } from "@apollo/client/react/ssr";
import { RequestHandler, Request, Response } from "express";
import fetch from "cross-fetch";
import React from "react";
import { render } from "react-dom";
import routes from "../../shared/routes";
import LaunchesPast from "../../shared/components/LaunchesPast";

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

  // scss fails during ssr because typescript cannot read it? It's only when renderRoutes(routes) is used during
  // SSR that the scss files cannot load, client side they load perfectly fine. It might be something to do with
  // ts-node-dev?
  const appTree = (
    <ApolloProvider client={client}>
      <StaticRouter location={req.path} context={{}}>
        {/* {renderRoutes(routes)} */}
        <LaunchesPast />
      </StaticRouter>
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
