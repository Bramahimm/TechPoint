interface ProductFormActionsProps {
  isEdit: boolean;
  isSubmitting: boolean;
}

const ProductFormActions: React.FC<ProductFormActionsProps> = ({
  isEdit,
  isSubmitting,
}) => {
  return (
    <div className="pt-6 border-t">
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-bold py-4 rounded-lg transition text-lg">
        {isSubmitting
          ? "Menyimpan..."
          : isEdit
          ? "Simpan Perubahan"
          : "Tambahkan Produk"}
      </button>
    </div>
  );
};

export default ProductFormActions;
