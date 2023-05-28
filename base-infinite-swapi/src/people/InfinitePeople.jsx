import InfiniteScroll from "react-infinite-scroller";

import { useInfiniteQuery } from "@tanstack/react-query";

import { Person } from "./Person";

const initialUrl = "https://swapi.dev/api/people/";
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfinitePeople() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
    isError,
    error,
  } = useInfiniteQuery(
    ["sw-people"],
    ({ pageParam = initialUrl }) => fetchUrl(pageParam),
    // page 조회 함수
    // 첫 fetch에 pageParam이 정의되도록 default value를 설정
    // 이 쿼리펑션이 resolve되기 전까지 data는 당연히 undefined
    {
      getNextPageParam: (lastPage) => lastPage.next || undefined,
      // lastPage는 page 조회 함수의 리턴값
      // 이 함수가 undefined를 리턴하면 hasNextPage는 false가 된다
    }
  );

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (isError) {
    return <div>Error! {error.toString()}</div>;
  }

  return (
    <>
      {isFetching && <div className="loading">Loading...</div>}
      <InfiniteScroll loadMore={fetchNextPage} hasMore={hasNextPage}>
        {data.pages.map((pageData) =>
          pageData.results.map((person) => {
            return (
              <Person
                key={person.name}
                name={person.name}
                hairColor={person.hair_color}
                eyeColor={person.eyeColor}
              />
            );
          })
        )}
      </InfiniteScroll>
    </>
  );
}
