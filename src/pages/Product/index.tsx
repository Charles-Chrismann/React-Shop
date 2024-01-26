import { FormEvent, ReactNode, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useCreateCommentMutation, useGetCommentsQuery, useGetProductsQuery } from '../../services/api'
import { useCart } from '../../providers/Cart'
import './Product.scss'

export default function Product() {
  function slugToTitle(slug: string) {
    return {
      title: slug.substring(3, slug.length).split('-').map((word) => word[0].toUpperCase() + word.slice(1)).join(' '),
      id: slug.substring(0, 2),
    }
  }

  const { id } = useParams<{id: string}>()
  let { data, isFetching } = useGetProductsQuery()
  const commentsQuery : Record<string, unknown> = useGetCommentsQuery({ id: slugToTitle(id!).id })
  const [createComment] = useCreateCommentMutation()
  const { cart, addToCart, setLastAdded, delFromCart } = useCart()

  const product = data?.find((product: Record<string, any>) => product.title.toLowerCase() === slugToTitle(id!).title.toLowerCase())

  const [inputs, setInputs] = useState({
    username: '',
    comment: '',
  });

  const handleChange = (event: FormEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInputs({ ...inputs, [name]: value })
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createComment({ id: product.id, username: inputs.username, comment: inputs.comment })
    setInputs({ username: '', comment: '' })
  }
  return (
    <div className='product'>
      <h1>Product {id}</h1>

      <div className='divim'>
        {product && <img src={product.image} alt="product" />}
      </div>

      <div className='add'>
        <button type="button" onClick={() => { addToCart(product); }}>+</button>
        <p>{cart && (cart.find(pro => pro.id === product.id)?.quantityInCart ?? 0)}</p>
        <button type="button" onClick={() => { delFromCart(product); }}>-</button>
      </div>


      <div className='comments'>
        <h2>Comments</h2>
        <form onSubmit={handleSubmit}>
          <input placeholder='username' type="text" name="username" value={inputs.username || ''} onChange={handleChange} />
          <input placeholder='comment' type="text" name="comment" value={inputs.comment || ''} onChange={handleChange} />
          <input type="submit" value="Submit" />
        </form>
      <ul>
        {
          commentsQuery.data as ReactNode
          && [...(commentsQuery.data as { id: number, username: string, comment: string }[])]
            .reverse().map((comment) => (
              <li key={comment.id}>
                <p className='username'>{comment.username}</p>
                <p>{comment.comment}</p>
              </li>
            ))
        }
      </ul>
      </div>
    </div>
  )
}
