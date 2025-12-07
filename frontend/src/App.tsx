import AppRouter from "./router/index.tsx";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <div className="font-sans bg-gray-50 min-h-screen">
        <AppRouter />
      </div>
    </AuthProvider>
  );
}
