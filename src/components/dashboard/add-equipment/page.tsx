import EquipmentForm from "@/components/dashboard/EquipmentForm";
import PrivateRoute from "@/components/PrivateRoute";

export default function AddEquipmentPage() {
  return (
    <PrivateRoute roles={["owner"]}>
      <EquipmentForm />
    </PrivateRoute>
  );
}