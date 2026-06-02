import { ProductDetailPanel } from '../components/product/ProductDetailPanel'
import type { RecommendedProduct } from '../types/product'

interface ProductDetailProps {
  product: RecommendedProduct
}

export function ProductDetail({ product }: ProductDetailProps) {
  return <ProductDetailPanel product={product} />
}

