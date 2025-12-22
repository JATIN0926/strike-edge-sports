import ProductDetail from "@/components/Products/ProductDetail";

export default function ProductDetailPage({ params }) {
    return <ProductDetail productId={params.id} />;
  }
  