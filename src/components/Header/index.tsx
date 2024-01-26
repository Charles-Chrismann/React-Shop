import { Link } from 'react-router-dom';
import './Header.scss'
import { useCart } from '../../providers/Cart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBasketShopping } from '@fortawesome/free-solid-svg-icons';

export default function Header() {
  const { cart } = useCart()

  return (
    <header>
      <Link to="/">Home</Link>
      <Link to="/cart">
        <FontAwesomeIcon icon={faBasketShopping} /> ({cart.reduce((acc, item) => acc + item.quantityInCart, 0)})
      </Link>
    </header>
  )
}
