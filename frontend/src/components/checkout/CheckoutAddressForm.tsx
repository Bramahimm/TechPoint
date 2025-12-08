// src/components/checkout/CheckoutAddressForm.tsx
import React from "react";
import { BANDAR_LAMPUNG_SHIPPING} from "@/utils/constants";
import type { LocalCourier } from "@/utils/constants";
import { MapPin, Phone, User, Truck } from "lucide-react";

interface AddressFormProps {
  addressState: {
    receiverName: string;
    phone: string;
    fullAddress: string;
    kecamatan: string;
  };
  onFieldChange: (field: string, value: string) => void;
  selectedCourier: string | null; 
    setSelectedCourier: (courier: string) => void; 
  selectedKecamatan: string;
}

const CheckoutAddressForm: React.FC<AddressFormProps> = ({
  addressState,
  onFieldChange,
  selectedCourier,
  setSelectedCourier,
  selectedKecamatan,
}) => (
  <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
    <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
      <MapPin className="w-5 h-5 text-red-500" /> Alamat Pengiriman
    </h2>

    {/* Nama Penerima */}
    <div className="flex items-center gap-3">
      <User className="w-5 h-5 text-gray-400 flex-shrink-0" />
      <input
        type="text"
        placeholder="Nama Penerima"
        value={addressState.receiverName}
        onChange={(e) => onFieldChange("receiverName", e.target.value)}
        className="w-full border-b focus:border-orange-500 outline-none p-1 transition"
        required
      />
    </div>

    {/* Nomor Telepon */}
    <div className="flex items-center gap-3">
      <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
      <input
        type="tel"
        placeholder="Nomor Telepon"
        value={addressState.phone}
        onChange={(e) => onFieldChange("phone", e.target.value)}
        className="w-full border-b focus:border-orange-500 outline-none p-1 transition"
        required
      />
    </div>

    {/* Kecamatan Dropdown */}
    <div className="flex items-center gap-3">
      <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
      <select
        value={addressState.kecamatan}
        onChange={(e) => onFieldChange("kecamatan", e.target.value)}
        className="w-full border-b focus:border-orange-500 outline-none p-1 bg-white"
        required>
        <option value="" disabled>
          Pilih Kecamatan Bandar Lampung
        </option>
        {BANDAR_LAMPUNG_SHIPPING.map((rate) => (
          <option key={rate.kecamatan} value={rate.kecamatan}>
            {rate.kecamatan} (Ongkir: {rate.rate.toLocaleString("id-ID")})
          </option>
        ))}
      </select>
    </div>

    {/* Alamat Lengkap */}
    <textarea
      placeholder="Alamat Lengkap (Jalan, Nomor Rumah, Patokan)"
      value={addressState.fullAddress}
      onChange={(e) => onFieldChange("fullAddress", e.target.value)}
      className="w-full border rounded-lg p-2 resize-none focus:border-orange-500 outline-none h-24"
      required
    />

    {/* Opsi Kurir Lokal */}
    <h3 className="font-semibold text-gray-700 flex items-center gap-2 pt-2">
      <Truck className="w-5 h-5 text-gray-500" /> Opsi Kurir Lokal
    </h3>
    <div className="flex gap-4">
      {["Kurir Internal", "COD"].map((courier) => (
        <button
          key={courier}
          type="button"
          onClick={() => setSelectedCourier(courier as LocalCourier)}
          className={`p-2 text-sm border rounded-lg transition-colors font-medium
                        ${
                          selectedCourier === courier
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white hover:bg-gray-100 border-gray-300"
                        }`}>
          {courier}
        </button>
      ))}
    </div>

    {/* Info Ongkir */}
    {selectedKecamatan && (
      <p className="text-sm text-green-600 mt-2">
        * Ongkir ke **{selectedKecamatan}** adalah **
        {BANDAR_LAMPUNG_SHIPPING.find(
          (r) => r.kecamatan === selectedKecamatan
        )?.rate.toLocaleString("id-ID")}
        **.
      </p>
    )}
  </div>
);

export default CheckoutAddressForm;
