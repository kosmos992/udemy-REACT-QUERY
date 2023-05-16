import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query'; // 서버에서 fetch 시 사용할 훅
import { PostDetail } from './PostDetail';

const maxPostPage = 10;

async function fetchPosts(pageNum) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${pageNum}`
  );
  return response.json();
}

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  const queryClient = useQueryClient();

  // state값의 변화는 비동기적이므로, useEffect를 통해 확정적으로 state값이 변한 뒤 prefetch
  useEffect(() => {
    if (currentPage < maxPostPage) {
      const nextPage = currentPage + 1;

      // prefetch 하려면 쿼리 키가 같아야 한다.
      queryClient.prefetchQuery(['posts', nextPage], () =>
        fetchPosts(nextPage)
      );
    }
  }, [currentPage, queryClient]);

  // useQuery() 훅의 인자로 [쿼리이름], 쿼리함수(비동기)를 넘겨야
  const { data, isError, error, isLoading } = useQuery(
    ['posts', currentPage],
    () => fetchPosts(currentPage),
    {
      staleTime: 2000, // 밀리초
      keepPreviousData: true,
    }
  );
  if (isLoading) return <h3>Loading...</h3>;
  if (isError)
    return (
      <>
        <h3>Oops, something went wrong</h3>
        <p>{error.toString()}</p>
      </>
    );
  // 리액트 쿼리는 3번까지 시도 후 isError상태로 처리. error 자체도 있음

  /**
   * isFetching vs isLoading
   *
   * isFetching은 아직 비동기 쿼리 함수가 resolve 되지 않았을 시 True
   * isLoading은 isFetching의 부분집합으로, fetching에 캐시 데이터조차 없는 상태일 때 True
   *
   * 이 차이는 pagination 구현에 중요하게 작용할 것
   */

  /**
   * stale time이란, fetch해온 데이터가 유효한 시간을 의미함
   * 기본값은 0이며, 이는 서버로부터 받아온 데이터가 이미 유효기간이 지난것으로 여김을 의미함
   * refetch 필요 여부에 대한 판단 기준
   */

  /**
   * 캐시는 나중에 다시 쓰일 수 있을 만한 데이터를 위한 것
   * 쿼리는 활성화된 useQuery가 없을 시 cold storage에 들어감
   * 캐시 데이터는 cacheTime 이후 만료되며 기본값은 5분 - 마지막으로 활성화된 이후의 시간
   * 캐시 만료 후 데이터는 가비지 콜렉티드 됨
   * 캐시는 fetching 중 표시하기 위한 백업 데이터임
   */

  return (
    <>
      <ul>
        {data.map(post => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button
          disabled={currentPage <= 1}
          onClick={() => setCurrentPage(prevValue => prevValue - 1)}
        >
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button
          disabled={currentPage >= maxPostPage}
          onClick={() => setCurrentPage(prevValue => prevValue + 1)}
        >
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
