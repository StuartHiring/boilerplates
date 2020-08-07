import { gql, InMemoryCache } from "@apollo/client";
import { Request, Response } from "express";

export default (req: Request, res: Response): InMemoryCache => {
  const cache = new InMemoryCache();

  const book = {
    id: "5",
    __typename: "Book",
    book: "The latest book",
    author: {
      name: "Chris",
      location: "Barcelona",
      age: 100,
      __typename: "Author",
    },
  };

  const query = gql`
    {
      books
      url
      resObject {
        bib_key
      }
    }
  `;

  cache.writeQuery({
    query,
    data: {
      books: [book],
      url: req.baseUrl,
      resObject: res.locals.openLibraryResponse,
    },
  });

  return cache;
};
