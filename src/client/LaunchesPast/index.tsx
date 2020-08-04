import React from "react";
import { gql, useQuery, useLazyQuery } from "@apollo/client";

type BookREsponse = {
  launchesPast: any[];
  test: string[];
  books: {
    id: any;
    book: string;
    author: {
      name: string;
    };
  }[];
};

const GET_LAUNCHES_PAST = gql`
  query GetLaunchesPast($limit: Int!) {
    launchesPast(limit: $limit) {
      mission_name
      launch_site {
        site_name_long
      }
    }
    test
    books {
      id
      book
      author {
        name
      }
    }
  }
`;

const LaunchesPast = () => {
  const { loading, error, data } = useQuery<BookREsponse>(GET_LAUNCHES_PAST, {
    variables: { limit: 3 },
  });

  const query = gql`
    query getBooks {
      books {
        id
        book
      }
    }
  `;
  // const { data: booksData } = useQuery(query);
  const [getBooksOndemand, { data: booksData }] = useLazyQuery(query);

  const [
    getAllLaunchesPast,
    { loading: loadingGetAllLaunches, data: allLaunchesData },
  ] = useLazyQuery(GET_LAUNCHES_PAST, {
    variables: { limit: 50 },
  });

  if (allLaunchesData && !loading && !error)
    // eslint-disable-next-line no-console
    console.log(allLaunchesData.launchesPast.length);

  return (
    <div>
      {/* <div>{JSON.stringify(data)}</div>
      <div>{JSON.stringify(booksData)}</div>
      <button type="button" onClick={() => getAllLaunchesPast()}>
        Click me!
      </button> */}
      {data?.books?.map((item) => (
        <div key={item.id}>
          {item.id}| {item.book} | {item.author.name}
        </div>
      ))}
      <div>==============================</div>
      {data?.test?.map((item) => (
        <div key={item}>{item}</div>
      ))}
      <button type="button" onClick={() => getBooksOndemand()}>
        Click me for books
      </button>
    </div>
  );
};

export default LaunchesPast;
