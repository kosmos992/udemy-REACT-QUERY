import InfiniteScroll from "react-infinite-scroller";

import { useInfiniteQuery } from "@tanstack/react-query";

import { Species } from "./Species";

const initialUrl = "https://swapi.dev/api/species/";
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfiniteSpecies() {
  // TODO: get data for InfiniteScroll via React Query

  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery(
    ["sw-species"],
    ({ pageParam = initialUrl }) => fetchUrl(pageParam),
    {
      getNextPageParam: (lastPage) => lastPage.next || undefined,
    }
  );

  if (isLoading) return <div className="loading">Loading...</div>;

  return (
    <InfiniteScroll loadMore={fetchNextPage} hasMore={hasNextPage}>
      {data.pages.map((pageData) =>
        pageData.results.map((each) => {
          return (
            <Species
              key={each.name}
              name={each.name}
              language={each.language}
              // eyeColor={each.eyeColor}
            />
          );
        })
      )}
    </InfiniteScroll>
  );
}
