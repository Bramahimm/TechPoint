const CheckoutSkeleton = () => (
  <div className="max-w-4xl mx-auto p-4 md:p-6 bg-gray-50 min-h-screen">
    <div className="animate-pulse space-y-6">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div> {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri */}
        <div className="lg:col-span-2 space-y-6">
          {/* Skeleton Form Alamat */}
          <div className="bg-white p-6 rounded-xl shadow-md h-64">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-6 bg-gray-100 rounded"></div>
              <div className="h-6 bg-gray-100 rounded"></div>
              <div className="h-6 bg-gray-100 rounded"></div>
              <div className="h-16 bg-gray-100 rounded"></div>
            </div>
          </div>

          {/* Skeleton Produk */}
          <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-4 items-center py-2">
                <div className="w-12 h-12 bg-gray-200 rounded flex-shrink-0"></div>
                <div className="flex-grow space-y-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-1/6"></div>
              </div>
            ))}
          </div>

          {/* Skeleton Pembayaran */}
          <div className="bg-white p-6 rounded-xl shadow-md h-40">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="flex gap-2">
              <div className="h-8 w-1/3 bg-gray-100 rounded"></div>
              <div className="h-8 w-1/3 bg-gray-100 rounded"></div>
              <div className="h-8 w-1/3 bg-gray-100 rounded"></div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan Ringkasan */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-md h-48">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-100 rounded"></div>
              <div className="h-4 bg-gray-100 rounded"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="h-12 bg-gray-300 rounded-xl"></div>{" "}
          {/* Tombol Submit */}
        </div>
      </div>
    </div>
  </div>
);

export default CheckoutSkeleton;
