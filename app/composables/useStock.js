export function useStock() {
  const isInStock = (card) => {
    if (!card) return false

    // type 2 = always out of stock
    if (card.type === 2) return false

    // type 1 = managed stock
    if (card.type === 1 && Number(card.stock) === 0) return false

    return true
  }

  const stockLabel = (card) => {
    if (!card) return ''
    if (card.type === 0) return 'In Stock'
    if (isInStock(card)) return 'Limited Stock'
    return 'Out of Stock'
  }

  return { isInStock, stockLabel }
}
