import { useEffect } from 'react'
import { useGetCommentsQuery } from '../services/api'

export default function Comments({ productId: string }) {
  console.log('the prod', productId)

  const { data, isFetching } = useGetCommentsQuery({ id: productId })

  useEffect(() => {
    console.log('data', data)
  }, [data])

  return (
    <>
      <h2>Comments</h2>
      {isFetching && <p>Loading...</p>}
      {data && data.map((comment) => (
        <div key={comment.id}>
          <p>{comment.body}</p>
          <p>{comment.email}</p>
        </div>
      ))}
      
    </>
  )
}