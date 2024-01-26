import { Link } from 'react-router-dom'
import './Products.scss'
import { useGetProductsQuery } from '../../services/api'

export default function Products() {
  function titleToSlug(id: string, title: string) {
    return `${id}-${title.toLowerCase().replace(/ /g, '-')}`
  }

  const { data, isFetching } = useGetProductsQuery()
  return (
    <>
      <h1>Products</h1>
        {
          data && (
          <ul className='producrs'>
            {data.map((product: Record<string, any>) => (
              <li key={product.id}>
                <Link to={`/${titleToSlug(product.id, product.title)}`}>{product.title}</Link>
              </li>
            ))}
          </ul>
          )
        }
    </>
  )
}