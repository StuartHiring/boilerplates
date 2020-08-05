import { gql, InMemoryCache } from "@apollo/client";
import { Request } from "express";

export default (req: Request): InMemoryCache => {
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
      url
    }
  `;

  cache.writeQuery({
    query,
    data: {
      books: [book],
      url: req.baseUrl,
    },
  });

  return cache;
};
