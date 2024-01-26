import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext({} as Record<string, unknown>);

export function CartProvider({ children }: {children: React.ReactNode}) {
  const [cart, setCart] = useState<Record<string, unknown>[]>([])
  const [lastAdded, setLastAdded] = useState<{item: string, rdm: string, action: "add" | 'del'} | null>(null)
  const [itemCount, setItemCount] = useState(0)

  function addToCart(productToAdd: Record<string, unknown>) {
    let product = cart.find(p => p.id === productToAdd.id)
    if (!product) {
      product = { ...productToAdd, quantityInCart: 1 }
      setCart([...cart, product])
    } else {
      product.quantityInCart += 1
      setCart([...cart])
    }
    // setItemCount(itemCount + 1)
    setLastAdded({ item: product.id, rdm: crypto.randomUUID() }) 
  }

  function delFromCart(productToDel: Record<string, unknown>) {
    let product = cart.find(p => p.id === productToDel.id)
    if (!product || product.quantityInCart === 0) {
      return
    } else {
      product.quantityInCart -= 1
      setCart([...cart])
    }
    setLastAdded({ item: product.id, rdm: crypto.randomUUID(), action: 'del' })
  }


  return (
    <CartContext.Provider value={{ cart, addToCart, lastAdded, setLastAdded, delFromCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
