// src/features/seller/SellerLayoutWrapper.tsx (TANPA TanStack Query)

import React, { useEffect, useState, useCallback } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getTokoStatus, type TokoStatusResponse } from '@/services/tokoService';

const SellerLayout: React.FC = () => (
    <div className="min-h-screen bg-gray-50 flex flex-col">

        <main className="flex-grow p-6 overflow-y-auto">
            <Outlet /> 
        </main>
    </div>
);

const SellerLayoutWrapper: React.FC = () => {
    const { user } = useAuth();
    const location = useLocation();

    const [tokoStatus, setTokoStatus] = useState<TokoStatusResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    const fetchTokoStatus = useCallback(async () => {
        if (!user) {
            setIsLoading(false);
            return;
        }
        
        setIsLoading(true);
        setError(null);
        try {
            const data = await getTokoStatus();
            setTokoStatus(data);
        } catch (err) {
            // Kita tetap mengizinkan error 403 atau 404 dari backend jika tidak punya toko
            // Cukup set status toko menjadi null jika terjadi error fetching
            setError(err);
            setTokoStatus({ has_shop: false, message: 'Failed to load status', data: null });
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchTokoStatus();
    }, [fetchTokoStatus]); // Jalankan fetch saat komponen dimount atau user berubah

    // 1. Loading State
    if (isLoading) {
        return <div className="text-center py-40 text-gray-500">Memuat status Toko...</div>;
    }
    
    // 2. Error State (Optional: Jika Anda ingin menampilkan error jika ada masalah server)
    if (error && tokoStatus?.has_shop === undefined) { 
        // Hanya tampilkan jika error bukan sekadar 403/404 yang berarti 'belum ada toko'
        return <div className="text-center py-40 text-red-500">Terjadi masalah koneksi server.</div>;
    }

    // 3. User Belum Punya Toko (Redirection)
    const isTokoCreationPath = location.pathname.includes('/seller/toko/create');
    
    // Logika: Jika has_shop false (atau status tidak ada) DAN user tidak sedang di halaman creation, redirect.
    if (tokoStatus && !tokoStatus.has_shop && !isTokoCreationPath) {
        return <Navigate to="/seller/toko/create" replace />;
    }

    // 4. User Sudah Punya Toko TAPI Coba Akses Toko Creation
    // Jika has_shop true DAN user sedang mencoba akses creation, redirect ke dashboard
    if (tokoStatus?.has_shop && isTokoCreationPath) {
        return <Navigate to="/seller/dashboard" replace />;
    }

    // 5. Render Layout
    return <SellerLayout />;
};

export default SellerLayoutWrapper;