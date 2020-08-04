import { gql } from "@apollo/client";

export default gql`
  type Book {
    book: String!
    author: Author
    id: ID!
  }

  type Author {
    name: String!
    location: String!
    age: Int!
  }

  type Query {
    books: [Book]
    book(id: ID!): Book
    authors: [Author]
    author(name: String!): Author
    test: [String]
  }
`;
