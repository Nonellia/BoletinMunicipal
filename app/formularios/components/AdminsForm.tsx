"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Input, 
  Button, 
  Alert,
  Divider,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User as UserInfo,
  Chip,
  Spinner
} from "@heroui/react";
import axios from "axios";
import { UserPlus, User, Mail, Lock, Eye, EyeOff, ShieldCheck, RefreshCw } from "lucide-react";

const API_URL = "https://funcionlog.mrg-pruebas.site";

interface AdminUser {
  id: number;
  username: string;
  email: string;
  is_active: number;
  created_at: string;
}

const AdminsForm = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isUsersLoading, setIsUsersLoading] = useState(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Form state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const toggleVisibility = () => setIsVisible(!isVisible);

  const fetchUsers = useCallback(async () => {
    setIsUsersLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (err: any) {
      console.error("Error fetching users", err);
    } finally {
      setIsUsersLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitLoading(true);
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      setIsSubmitLoading(false);
      return;
    }

    try {
      await axios.post(`${API_URL}/register`, {
        username,
        email,
        password,
      });
      setSuccess(`Usuario ${username} creado exitosamente.`);
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      fetchUsers(); // Refresh list
    } catch (err: any) {
      setError(err.response?.data?.detail || "Error al registrar el usuario");
    } finally {
      setIsSubmitLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-4 space-y-8">
      {/* Formulario de Creación */}
      <Card className="shadow-lg border-none">
        <CardHeader className="flex flex-col gap-1 items-start px-6 pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Crear Administrador</h2>
          </div>
          <p className="text-gray-500">Registra un nuevo usuario con acceso al panel.</p>
        </CardHeader>
        <Divider className="my-4 mx-6 w-[calc(100%-48px)]" />
        <CardBody className="px-6 pb-8">
          <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <User className="w-4 h-4" /> Datos de Usuario
              </h3>
              <Input
                label="Nombre de Usuario"
                placeholder="usuario123"
                variant="bordered"
                labelPlacement="outside"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <Input
                label="Correo Electrónico"
                placeholder="admin@municipio.gov"
                type="email"
                variant="bordered"
                labelPlacement="outside"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <Lock className="w-4 h-4" /> Seguridad
              </h3>
              <Input
                label="Contraseña"
                placeholder="••••••••"
                variant="bordered"
                labelPlacement="outside"
                type={isVisible ? "text" : "password"}
                endContent={
                  <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                    {isVisible ? (
                      <EyeOff className="text-gray-400 w-4 h-4" />
                    ) : (
                      <Eye className="text-gray-400 w-4 h-4" />
                    )}
                  </button>
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Input
                label="Confirmar Contraseña"
                placeholder="••••••••"
                variant="bordered"
                labelPlacement="outside"
                type={isVisible ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="md:col-span-2 mt-4 space-y-4">
              <Button 
                  type="submit" 
                  color="primary" 
                  size="lg"
                  isLoading={isSubmitLoading}
                  startContent={!isSubmitLoading && <UserPlus className="w-5 h-5" />}
                  className="font-bold w-full md:w-auto"
              >
                Crear Administrador
              </Button>

              {error && (
                <Alert color="danger" variant="flat" title="Error">
                  {error}
                </Alert>
              )}

              {success && (
                <Alert color="success" variant="flat" title="Éxito">
                  {success}
                </Alert>
              )}
            </div>
          </form>
        </CardBody>
      </Card>

      {/* Listado de Usuarios */}
      <Card className="shadow-lg border-none">
        <CardHeader className="flex items-center justify-between px-6 pt-6 mb-2">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold text-gray-800">Administradores Existentes</h2>
            <p className="text-gray-500">Lista completa de usuarios con acceso al sistema.</p>
          </div>
          <Button 
            isIconOnly 
            variant="flat" 
            onClick={fetchUsers}
            isDisabled={isUsersLoading}
            className="text-indigo-600"
          >
            <RefreshCw className={`w-5 h-5 ${isUsersLoading ? "animate-spin" : ""}`} />
          </Button>
        </CardHeader>
        <CardBody className="px-6 pb-6 overflow-x-auto">
          {isUsersLoading && users.length === 0 ? (
            <div className="flex justify-center py-12">
              <Spinner label="Cargando usuarios..." />
            </div>
          ) : (
            <Table aria-label="Tabla de administradores" removeWrapper className="min-w-full">
              <TableHeader>
                <TableColumn>ADMINISTRADOR</TableColumn>
                <TableColumn>ESTADO</TableColumn>
                <TableColumn>FECHA CREACIÓN</TableColumn>
              </TableHeader>
              <TableBody emptyContent={"No hay usuarios registrados."}>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <UserInfo
                        name={u.username}
                        description={u.email}
                        avatarProps={{
                          src: `https://i.pravatar.cc/150?u=${u.id}`,
                          classNames: {
                            base: "bg-indigo-100 text-indigo-600",
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        color={u.is_active ? "success" : "danger"} 
                        variant="flat" 
                        size="sm"
                        className="font-medium"
                      >
                        {u.is_active ? "Activo" : "Inactivo"}
                      </Chip>
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm">
                      {new Date(u.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default AdminsForm;
