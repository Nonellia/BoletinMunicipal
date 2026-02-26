"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Input, 
  Button, 
  Alert,
  Link
} from "@heroui/react";
import { useAuth } from "@/context/auth-context";
import axios from "axios";
import { Eye, EyeOff, Lock, User, ArrowRight } from "lucide-react";

const API_URL = "https://funcionlog.mrg-pruebas.site";

const AdminLoginPage = () => {
  const router = useRouter();
  const { login, user, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const toggleVisibility = () => setIsVisible(!isVisible);

  useEffect(() => {
    if (!authLoading && user) {
      router.push("/formularios");
    }
  }, [user, authLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const response = await axios.post(`${API_URL}/login`, formData);
      login(response.data.access_token);
      router.push("/formularios");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Credenciales incorrectas o error de conexión");
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) return null;

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-[#0f172a] p-4 font-sans">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]"></div>
      </div>

      <Card className="w-full max-w-md shadow-2xl border-none bg-slate-900/50 backdrop-blur-xl z-10 py-4 px-2">
        <CardHeader className="flex flex-col gap-2 items-center pb-6">
          <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-500/20 mb-2">
            <Lock className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Panel de Administración
          </h1>
          <p className="text-slate-400 text-center">
            Ingresa tus credenciales para acceder al gestor
          </p>
        </CardHeader>
        <CardBody className="gap-6">
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <Input
              label="Usuario"
              placeholder="Ingresa tu usuario"
              variant="flat"
              labelPlacement="outside"
              startContent={<User className="text-slate-500 w-4 h-4" />}
              classNames={{
                inputWrapper: "bg-slate-800/50 group-data-[focus=true]:bg-slate-800",
                label: "text-slate-300 font-medium",
                input: "text-white"
              }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Input
              label="Contraseña"
              placeholder="••••••••"
              variant="flat"
              labelPlacement="outside"
              type={isVisible ? "text" : "password"}
              startContent={<Lock className="text-slate-500 w-4 h-4" />}
              endContent={
                <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                  {isVisible ? (
                    <EyeOff className="text-slate-500 w-4 h-4" />
                  ) : (
                    <Eye className="text-slate-500 w-4 h-4" />
                  )}
                </button>
              }
              classNames={{
                inputWrapper: "bg-slate-800/50 group-data-[focus=true]:bg-slate-800",
                label: "text-slate-300 font-medium",
                input: "text-white"
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button 
                type="submit" 
                color="primary" 
                size="lg"
                endContent={!isLoading && <ArrowRight className="w-4 h-4" />}
                isLoading={isLoading}
                className="font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
            >
              Iniciar Sesión
            </Button>
          </form>

          <div className="flex flex-col gap-3 mt-4 items-center">
            {error && (
              <Alert color="danger" variant="flat" className="bg-red-500/10 border-none text-red-400">
                {error}
              </Alert>
            )}
          </div>
        </CardBody>
      </Card>
      
      <p className="mt-8 text-slate-600 text-sm z-10">
        © 2026 Municipalidad de Nonellia - Sistema Legislativo
      </p>
    </div>
  );
};

export default AdminLoginPage;
