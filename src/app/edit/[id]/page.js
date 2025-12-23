import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import EditProduct from "@/components/EditPage/EditPage";

export default function EditProductPage({ params }) {
  return (
    <ProtectedRoute>
      <EditProduct productId={params.id} />
    </ProtectedRoute>
  );
}
