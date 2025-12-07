// src/features/seller/Toko/TokoCreationPage.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createToko, type TokoPayload } from "@/services/tokoService";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";

const TokoCreationPage: React.FC = () => {
    const navigate = useNavigate();
    const { checkAuth } = useAuth();
    
    const [formData, setFormData] = useState<Omit<TokoPayload, 'logo'>>({
        nama_toko: "",
        alamat: "",
        no_telp: "",
        deskripsi: "",
    });
    const [logoFile, setLogoFile] = useState<File | null>(null); 
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.nama_toko) newErrors.nama_toko = "Nama Toko wajib diisi";
        if (!formData.alamat) newErrors.alamat = "Alamat wajib diisi";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors({}); 
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setLogoFile(file || null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validate()) return; 

        setIsLoading(true);
        const submitToast = toast.loading("Membuat Toko...");

        const payload: TokoPayload = {
            ...formData,
            logo: logoFile || undefined, 
        };

        try {
            const newToko = await createToko(payload);

            await checkAuth(); 

            toast.success(`Toko ${newToko.nama_toko} berhasil dibuat!`, { id: submitToast });
            
            navigate("/seller/products"); 

        } catch (err: any) { 
            console.error("Gagal membuat toko:", err);
            
            if (err.response?.status === 422 && err.response.data.errors) {
                setErrors(err.response.data.errors);
                toast.error("Validasi gagal. Periksa form.", { id: submitToast });
            } else {
                toast.error(err.response?.data?.message || "Gagal membuat toko.", { id: submitToast });
            }
        } finally {
            setIsLoading(false);
        }
    };
    if (isLoading) {
        return (
            <div className="text-center py-20 text-gray-500">
                Memuat data produk...
            </div>
        );
    }
    
    return (
        <div className="max-w-3xl mx-auto space-y-8 bg-white p-8 rounded-xl shadow-2xl">
            <h2 className="text-3xl font-bold text-orange-600 border-b pb-4">
                👋 Selamat Datang! Buat Toko Anda
            </h2>
            <p className="text-gray-600">
                Lengkapi detail di bawah ini untuk mulai menjual.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Nama Toko */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nama Toko <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="nama_toko"
                        value={formData.nama_toko}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        required
                    />
                    {errors.nama_toko && <p className="text-red-500 text-xs mt-1">{errors.nama_toko}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Alamat Lengkap <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="alamat"
                        value={formData.alamat}
                        onChange={handleChange}
                        rows={3}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 resize-none"
                        required
                    />
                    {errors.alamat && <p className="text-red-500 text-xs mt-1">{errors.alamat}</p>}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nomor Telepon
                        </label>
                        <input
                            type="text"
                            name="no_telp"
                            value={formData.no_telp}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        />
                        {errors.no_telp && <p className="text-red-500 text-xs mt-1">{errors.no_telp}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Deskripsi Singkat Toko
                        </label>
                        <input
                            type="text"
                            name="deskripsi"
                            value={formData.deskripsi}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Logo Toko
                    </label>
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/jpg"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition text-lg">
                    {isLoading ? "Memproses..." : "Daftarkan Toko Saya"}
                </button>
            </form>
        </div>
    );
};

export default TokoCreationPage;