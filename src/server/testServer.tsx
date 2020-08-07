import {
  gql,
  ApolloProvider,
  InMemoryCache,
  ApolloClient,
  useQuery,
  createHttpLink,
} from "@apollo/client";
import { renderToStringWithData } from "@apollo/client/react/ssr";
import React from "react";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import fetch from "cross-fetch";

const BOOKS = [
  {
    __typename: "Book",
    id: "1",
    book: "Harry Potter",
    author: {
      __typename: "Author",
      name: "JK Rowling",
    },
  },
];

const typeDefs = gql`
  type Book {
    book: String!
    author: Author
    id: ID!
  }
  type Author {
    name: String
  }
  type Query {
    books: [Book]
  }
`;

const resolvers = {
  Query: {
    books: (parent, args, context) => {
      console.log("Is this even resolved?");
      return BOOKS;
    },
  },
};

const GET_BOOKS = gql`
  query GetBooks {
    books {
      id
      book
      author
    }
  }
`;

const TestComponent = () => {
  const { data: bookData, loading, error } = useQuery(GET_BOOKS);

  /**
   * What is the expected render here?
   * Is it just Harry Potter or is it an array of Harry Potter and Lord of the Rings
   */
  return <div>{JSON.stringify(bookData)}</div>;
};

const expressServer = () => {
  const app = express();
  const apolloServer = new ApolloServer({ typeDefs, resolvers });

  apolloServer.applyMiddleware({ app });

  // SSR Middleware
  app.use((req, res, next) => {
    const link = createHttpLink({
      uri: "http://localhost:3000/graphql",
      fetch, // cross-fetch
    });
    const cache = new InMemoryCache();

    const book = {
      __typename: "Book",
      id: "1000",
      book: "Lord of the Rings",
      author: {
        __typename: "Author",
        name: "Tolkien",
      },
    };

    cache.writeQuery({
      query: gql`
        {
          books {
            id
            book
            author {
              name
            }
          }
        }
      `,
      data: {
        books: [book],
      },
    });

    const client = new ApolloClient({
      ssrMode: true,
      link,
      cache,
    });

    const appTree = (
      <ApolloProvider client={client}>
        <TestComponent />
      </ApolloProvider>
    );

    console.log(JSON.stringify(client.cache.extract())); // The root query object contains the books with __ref pointing to the ID of Lord of the Rings

    renderToStringWithData(appTree).then((content) => {
      const initialState = client.cache.extract();
      console.log(JSON.stringify(client.cache.extract())); // The root query object has been overwritten by the __ref pointing to Harry Potter
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
  });
  app.listen(9000, (...cb) => {
    if (cb && cb.length) {
      // eslint-disable-next-line no-console
      console.error(cb);
    }
    // eslint-disable-next-line no-console
    console.log(`listening on port: ${9000}`);
  });
};

expressServer();
