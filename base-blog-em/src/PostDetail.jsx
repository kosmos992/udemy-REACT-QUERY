import { useQuery, useMutation } from '@tanstack/react-query';

async function fetchComments(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
  );
  return response.json();
}

async function deletePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: 'DELETE' }
  );
  return response.json();
}

async function updatePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: 'PATCH', data: { title: 'REACT QUERY FOREVER!!!!' } }
  );
  return response.json();
}

export function PostDetail({ post }) {
  // replace with useQuery
  const { data, isLoading, isError, error } = useQuery(
    ['comments', post.id],
    () => fetchComments(post.id)
  );

  const updateMutation = useMutation(postId => updatePost(postId));

  // useQuery와는 무관
  const deleteMutation = useMutation(postId => deletePost(postId));

  if (isLoading) {
    return <div>Loading Comments...</div>;
  }
  if (isError) {
    return <div>{error.toString()}</div>;
  }

  return (
    <>
      <h3 style={{ color: 'blue' }}>{post.title}</h3>
      <button onClick={() => deleteMutation.mutate(post.id)}>Delete</button>
      {deleteMutation.isError && <p>Error deleting</p>}
      {deleteMutation.isLoading && <p>Deleting</p>}
      {deleteMutation.isSuccess && <p>Post has been deleted (사실아님)</p>}
      <button onClick={() => updateMutation.mutate(post.id)}>
        Update title
      </button>
      {updateMutation.isError && <p>Error updating</p>}
      {updateMutation.isLoading && <p>Updating</p>}
      {updateMutation.isSuccess && <p>Post has been updated (사실아님)</p>}
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map(comment => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}
