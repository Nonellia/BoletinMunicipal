"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader, Input, Button, Tabs, Tab, Alert } from "@heroui/react";
import { useAuth } from "@/context/auth-context";
import axios from "axios";

const API_URL = "https://funcionlog.mrg-pruebas.site";

const LoginPage = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Login form state
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("username", loginUsername);
    formData.append("password", loginPassword);

    try {
      const response = await axios.post(`${API_URL}/login`, formData);
      login(response.data.access_token);
      router.push("/formularios");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await axios.post(`${API_URL}/register`, {
        username: regUsername,
        email: regEmail,
        password: regPassword,
      });
      setSuccess("Usuario registrado exitosamente. Ahora puedes iniciar sesión.");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Error al registrarse");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-tr from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="flex flex-col gap-1 items-center pb-0">
          <h1 className="text-3xl font-bold text-indigo-700">Boletín Municipal</h1>
          <p className="text-default-500">Gestión de documentos y boletines</p>
        </CardHeader>
        <CardBody>
          <Tabs fullWidth aria-label="Opciones de acceso" color="primary">
            <Tab key="login" title="Ingresar">
              <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-4">
                <Input
                  label="Usuario"
                  placeholder="Tu nombre de usuario"
                  variant="bordered"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  required
                />
                <Input
                  label="Contraseña"
                  placeholder="********"
                  type="password"
                  variant="bordered"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
                <Button 
                    type="submit" 
                    color="primary" 
                    variant="shadow" 
                    isLoading={isLoading}
                    className="font-bold"
                >
                  Iniciar Sesión
                </Button>
              </form>
            </Tab>
            <Tab key="register" title="Registrarse">
              <form onSubmit={handleRegister} className="flex flex-col gap-4 mt-4">
                <Input
                  label="Usuario"
                  placeholder="Nombre de usuario elegido"
                  variant="bordered"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  required
                />
                <Input
                  label="Correo Electrónico"
                  placeholder="ejemplo@municipio.gov"
                  type="email"
                  variant="bordered"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                />
                <Input
                  label="Contraseña"
                  placeholder="Min. 8 caracteres"
                  type="password"
                  variant="bordered"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                />
                <Button 
                    type="submit" 
                    color="secondary" 
                    variant="shadow" 
                    isLoading={isLoading}
                    className="font-bold"
                >
                  Crear Cuenta
                </Button>
              </form>
            </Tab>
          </Tabs>

          {error && (
            <Alert color="danger" title="Error" className="mt-4">
              {error}
            </Alert>
          )}

          {success && (
            <Alert color="success" title="Completado" className="mt-4">
              {success}
            </Alert>
          )}
        </CardBody>
      </Card>
      
      <p className="mt-8 text-default-400 text-sm">
        © 2026 Municipalidad de Nonellia - Sistema Legislativo
      </p>
    </div>
  );
};

export default LoginPage;