// src/services/tokoService.ts (File Baru)

import api from "@/services/api";
import type { Toko } from "@/types/product";

export interface TokoPayload {
  nama_toko: string;
  alamat: string;
  no_telp?: string;
  deskripsi?: string;
  logo?: File;
}

export interface TokoStatusResponse {
  has_shop: boolean;
  message: string;
  data: Toko | null;
}

export const getTokoStatus = async (): Promise<TokoStatusResponse> => {
  const response = await api.get<TokoStatusResponse>("/toko/me");
  return response.data;
};

export const createToko = async (data: TokoPayload): Promise<Toko> => {
  const formData = new FormData();

  formData.append("nama_toko", data.nama_toko);
  formData.append("alamat", data.alamat);
  if (data.no_telp) formData.append("no_telp", data.no_telp);
  if (data.deskripsi) formData.append("deskripsi", data.deskripsi);
  if (data.logo) formData.append("logo", data.logo);

  const response = await api.post<{ message: string; data: Toko }>(
    "/toko",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response.data.data;
};
