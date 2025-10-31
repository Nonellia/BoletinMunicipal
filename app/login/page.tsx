"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const LoginRegister = () => {
  const router = useRouter();
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [ndni, setNdni] = useState(0);
  const [tipoUsuario, setTipoUsuario] = useState(0);
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (!usuario || !password || (isRegister && !nombreCompleto)) {
      setMessage("Por favor, completa todos los campos.");
      setLoading(false);
      return;
    }

    const endpoint = isRegister
      ? "http://127.0.0.1:8000/register"
      : "http://127.0.0.1:8000/login";

    const bodyData = isRegister
      ? { nombre_completo: nombreCompleto, ndni, tipo_usuario: tipoUsuario, usuario, password }
      : { usuario, password };

    // console.log("Datos enviados:", bodyData);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error en el servidor");
      }

      const data = await response.json();
      // console.log("Respuesta del servidor:", data);

      setMessage(
        isRegister
          ? "Usuario registrado exitosamente"
          : "Inicio de sesión exitoso"
      );
      if (!isRegister) {
        // Guardar usuario en localStorage para sesión
        localStorage.setItem("usuario", usuario);
        // Redirigir a /gestor
        router.replace("/gestor");
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : isRegister
          ? "Error al registrar usuario"
          : "Error al iniciar sesión";
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">
          {isRegister ? "Registrar Usuario" : "Iniciar Sesión"}
        </h1>

        {message && (
          <p
            className={`text-sm mb-4 text-center ${
              message.includes("exitosamente")
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        {isRegister && (
          <>
            <div className="mb-4">
              <label
                htmlFor="nombreCompleto"
                className="block text-sm font-medium text-gray-700"
              >
                Nombre Completo
              </label>
              <input
                id="nombreCompleto"
                type="text"
                value={nombreCompleto}
                onChange={(e) => setNombreCompleto(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="ndni"
                className="block text-sm font-medium text-gray-700"
              >
                DNI
              </label>
              <input
                id="ndni"
                type="number"
                value={ndni}
                onChange={(e) => setNdni(Number(e.target.value))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="tipoUsuario"
                className="block text-sm font-medium text-gray-700"
              >
                Tipo de Usuario
              </label>
              <input
                id="tipoUsuario"
                type="number"
                value={tipoUsuario}
                onChange={(e) => setTipoUsuario(Number(e.target.value))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
          </>
        )}

        <div className="mb-4">
          <label
            htmlFor="usuario"
            className="block text-sm font-medium text-gray-700"
          >
            Usuario
          </label>
          <input
            id="usuario"
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          disabled={loading}
        >
          {loading
            ? "Procesando..."
            : isRegister
            ? "Registrar"
            : "Ingresar"}
        </button>

        <div className="mt-4 text-center">
          <button
            type="button"
            className="text-indigo-600 hover:underline text-sm"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister
              ? "¿Ya tienes cuenta? Inicia sesión"
              : "¿No tienes cuenta? Regístrate"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginRegister;