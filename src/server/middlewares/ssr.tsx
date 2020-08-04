import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
  gql,
} from "@apollo/client";
import { renderToStringWithData } from "@apollo/client/react/ssr";
import { RequestHandler } from "express";
import fetch from "cross-fetch";
import React from "react";
import LaunchesPast from "../../client/LaunchesPast";

export default (): RequestHandler => async (req, res, next) => {
  const link = createHttpLink({
    uri: "http://localhost:3000/graphql",
    fetch,
  });

  const cache = new InMemoryCache();

  const book = {
    id: "5",
    __typename: "Book",
    book: "The latest book",
    author: {
      name: "Chris",
      location: "Barcelona",
      age: "100",
      __typename: "Author",
    },
  };

  const query = gql`
    query getTest {
      books {
        id
        book
        author {
          name
          location
          age
        }
      }
    }
  `;

  cache.writeQuery({
    query,
    data: {
      books: [book],
    },
  });

  const client = new ApolloClient({
    ssrMode: true,
    link,
    cache,
  });

  console.log("Before", client.extract());
  console.log("====================");

  const appTree = (
    <ApolloProvider client={client}>
      <LaunchesPast />
    </ApolloProvider>
  );

  renderToStringWithData(appTree).then((content) => {
    const initialState = client.extract();

    console.log("After", client.extract());
    console.log("====================");

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
