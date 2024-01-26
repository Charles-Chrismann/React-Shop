import'./Cart.scss';
import { useCart } from '../../providers/Cart'

export default function Cart() {
  const { cart, addToCart, delFromCart } = useCart()
  return (
    <div className="cart">
      <h1>Cart</h1>
      <div className="articles">
        {cart.filter(p => p.quantityInCart > 0).map((product) => (
          <div key={product.id} className="article">
            <h4>{product.title}</h4>
            <div>
              <button onClick={() => addToCart(product)}>+</button>
              <p>{product.quantityInCart}</p>
              <button onClick={() => delFromCart(product)}>-</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}