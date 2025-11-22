// src/utils/handleError.ts

/**
 * Fungsi utilitas untuk menangani error dari operasi async (misalnya panggilan API).
 * Fungsi ini akan mencatat error ke console dan mengembalikan pesan yang aman untuk UI.
 *
 * @param error Objek error, bisa berupa Error, string, atau unknown.
 * @returns Pesan string yang aman untuk ditampilkan kepada pengguna.
 */
export default function handleError(error: unknown): string {
  const defaultMessage = "Terjadi kesalahan, coba lagi nanti.";
  let userMessage = defaultMessage;

  // 1. Tampilkan error di console untuk debugging
  console.error("--- ERROR DETAIL ---");
  console.error(error);
  console.error("--------------------");

  // 2. Tentukan pesan error yang aman untuk UI
  if (error && typeof error === "object" && "message" in error) {
    // Jika error memiliki properti 'message' (misalnya Error atau AxiosError)
    const errorMessage = (error as { message: unknown }).message;

    if (typeof errorMessage === "string" && errorMessage.trim().length > 0) {
      userMessage = errorMessage;
    }
  } else if (typeof error === "string" && error.trim().length > 0) {
    // Jika error adalah string
    userMessage = error;
  }

  // Jika pesan yang didapat terlalu teknis (misal 'Network Error'),
  // kita bisa pertimbangkan untuk mengembalikan pesan default.
  // Untuk kesederhanaan, kita kembalikan saja pesan yang didapat,
  // kecuali jika ia sama persis dengan pesan default kita.

  return userMessage;
}
