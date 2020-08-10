import { HttpLink } from "apollo-link-http";
import {
  makeExecutableSchema,
  mergeSchemas,
  makeRemoteExecutableSchema,
  introspectSchema,
} from "graphql-tools";
import fetch from "cross-fetch";
import { GraphQLSchema } from "graphql";
import typeDefs from "./localSchema/typeDefs";
import resolvers from "./localSchema/resolvers";

const createSchema = async (): Promise<GraphQLSchema> => {
  const localSchema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const link = new HttpLink({ uri: "https://api.spacex.land/graphql/", fetch });
  const spacexSchema = await introspectSchema(link);

  const remoteSchema = makeRemoteExecutableSchema({
    schema: spacexSchema,
    link,
  });

  return mergeSchemas({
    schemas: [localSchema, remoteSchema],
  });
};

export default createSchema;
