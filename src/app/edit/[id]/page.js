import EditProduct from "@/components/EditPage/EditPage";

export default function EditProductPage({ params }) {
  return <EditProduct productId={params.id} />;
}
