// components/ResumenesForm.jsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  FiSave,
  FiTrash2,
  FiEdit2,
  FiCalendar,
  FiFileText,
  FiTag,
  FiType,
  FiList,
  FiLink,
  FiImage,
  FiX,
  FiBold,
  FiItalic,
  FiUnderline,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
} from "react-icons/fi";

const API_URL = "http://localhost:8000";

// Componente de editor mejorado con manejo correcto del cursor
const SimpleEditor = ({ value, onChange, placeholder }) => {
  const [isMounted, setIsMounted] = useState(false);
  const editorRef = useRef(null);
  const lastSelectionRef = useRef(null);
  const isComposingRef = useRef(false); // Para manejar composición de IME (idiomas asiáticos)

  // Inicializar el editor
  useEffect(() => {
    setIsMounted(true);

    // Inicializar con el valor proporcionado
    if (editorRef.current && value !== undefined) {
      // Solo actualizar si el contenido realmente cambió
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || "";
      }
    }
  }, [value]);

  // Guardar la posición del cursor de manera más confiable
  const saveSelection = useCallback(() => {
    if (!editorRef.current) return;

    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      // Verificar que el rango esté dentro del editor
      if (editorRef.current.contains(range.commonAncestorContainer)) {
        lastSelectionRef.current = {
          startContainer: range.startContainer,
          startOffset: range.startOffset,
          endContainer: range.endContainer,
          endOffset: range.endOffset,
        };
      }
    }
  }, []);

  // Restaurar la posición del cursor
  const restoreSelection = useCallback(() => {
    if (!editorRef.current || !lastSelectionRef.current) {
      // Si no hay selección guardada, poner cursor al final
      moveCursorToEnd();
      return;
    }

    try {
      const selection = window.getSelection();
      const range = document.createRange();

      // Intentar restaurar la selección guardada
      range.setStart(
        lastSelectionRef.current.startContainer,
        lastSelectionRef.current.startOffset,
      );
      range.setEnd(
        lastSelectionRef.current.endContainer,
        lastSelectionRef.current.endOffset,
      );

      selection.removeAllRanges();
      selection.addRange(range);
    } catch (error) {
      // Si falla, poner cursor al final
      moveCursorToEnd();
    }
  }, []);

  // Mover cursor al final del contenido
  const moveCursorToEnd = useCallback(() => {
    if (!editorRef.current) return;

    const selection = window.getSelection();
    const range = document.createRange();

    // Seleccionar el último nodo de texto
    const lastChild = editorRef.current.lastChild;
    if (lastChild && lastChild.nodeType === Node.TEXT_NODE) {
      range.setStart(lastChild, lastChild.textContent.length);
      range.setEnd(lastChild, lastChild.textContent.length);
    } else {
      // Si no hay nodo de texto, poner el rango al final del editor
      range.selectNodeContents(editorRef.current);
      range.collapse(false);
    }

    selection.removeAllRanges();
    selection.addRange(range);
    editorRef.current.focus();
  }, []);

  // Manejar cambios en el contenido
  const handleInput = useCallback(
    (e) => {
      if (isComposingRef.current) return; // Ignorar durante composición IME

      const newHtml = e.currentTarget.innerHTML;

      // Guardar selección antes de actualizar
      saveSelection();

      // Actualizar el valor del padre
      onChange(newHtml);

      // Restaurar selección después de la actualización
      setTimeout(restoreSelection, 0);
    },
    [onChange, saveSelection, restoreSelection],
  );

  // Manejar eventos de composición (para idiomas como chino, japonés, etc.)
  const handleCompositionStart = useCallback(() => {
    isComposingRef.current = true;
  }, []);

  const handleCompositionEnd = useCallback(() => {
    isComposingRef.current = false;
    handleInput({ currentTarget: editorRef.current });
  }, [handleInput]);

  // Manejar foco
  const handleFocus = useCallback(() => {
    if (!editorRef.current) return;

    // Si está vacío, asegurarse de que haya contenido para que el cursor aparezca
    if (
      !editorRef.current.innerHTML ||
      editorRef.current.innerHTML === "<br>"
    ) {
      editorRef.current.innerHTML = "";
    }

    // Guardar la selección inicial
    setTimeout(() => {
      saveSelection();
    }, 0);
  }, [saveSelection]);

  // Función para ejecutar comandos con manejo adecuado del cursor
  const execCommand = useCallback(
    (command, value = null) => {
      if (!editorRef.current) return;

      editorRef.current.focus();
      saveSelection();

      // Ejecutar el comando nativo
      const success = document.execCommand(command, false, value);

      if (success) {
        // Obtener nuevo contenido
        const newHtml = editorRef.current.innerHTML;
        onChange(newHtml);

        // Restaurar selección
        setTimeout(restoreSelection, 0);
      }

      return success;
    },
    [onChange, saveSelection, restoreSelection],
  );

  // Manejar teclas especiales
  const handleKeyDown = useCallback(
    (e) => {
      // Guardar selección antes de cualquier tecla importante
      if (e.key === "Enter" || e.key === "Backspace" || e.key === "Delete") {
        saveSelection();
      }

      // Manejar Enter para nueva línea
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        execCommand("insertHTML", "<br><br>");
      }

      // Atajos de teclado
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "b":
            e.preventDefault();
            execCommand("bold");
            break;
          case "i":
            e.preventDefault();
            execCommand("italic");
            break;
          case "u":
            e.preventDefault();
            execCommand("underline");
            break;
          case "z":
            if (!e.shiftKey) {
              e.preventDefault();
              execCommand("undo");
            }
            break;
          case "y":
            if (e.shiftKey || e.ctrlKey) {
              e.preventDefault();
              execCommand("redo");
            }
            break;
        }
      }
    },
    [execCommand, saveSelection],
  );

  // Insertar elementos específicos
  const insertList = useCallback(
    (type) => {
      if (!editorRef.current) return;

      editorRef.current.focus();
      saveSelection();

      // Crear lista con placeholder
      const listHtml =
        type === "ul"
          ? "<ul><li>•&nbsp;</li></ul>"
          : "<ol><li>1.&nbsp;</li></ol>";

      // Insertar y actualizar
      const success = document.execCommand("insertHTML", false, listHtml);

      if (success) {
        const newHtml = editorRef.current.innerHTML;
        onChange(newHtml);

        // Mover cursor al interior del primer elemento de la lista
        setTimeout(() => {
          const listItem = editorRef.current.querySelector("li");
          if (listItem) {
            const range = document.createRange();
            const selection = window.getSelection();

            // Buscar el nodo de texto dentro del li
            let textNode = listItem.firstChild;
            while (textNode && textNode.nodeType !== Node.TEXT_NODE) {
              textNode = textNode.nextSibling;
            }

            if (textNode) {
              range.setStart(textNode, 0);
              range.setEnd(textNode, 0);
            } else {
              // Si no hay nodo de texto, crear uno
              const text = document.createTextNode("");
              listItem.appendChild(text);
              range.setStart(text, 0);
              range.setEnd(text, 0);
            }

            selection.removeAllRanges();
            selection.addRange(range);
          }
        }, 10);
      }
    },
    [onChange, saveSelection],
  );

  const insertLink = useCallback(() => {
    saveSelection();
    const url = prompt("Ingresa la URL del enlace:", "https://");
    if (url) {
      execCommand("createLink", url);
    }
  }, [execCommand, saveSelection]);

  const insertImage = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imgHtml = `<img src="${event.target.result}" alt="Imagen" style="max-width: 100%; border-radius: 8px; margin: 10px 0;" />`;
          execCommand("insertHTML", imgHtml);
        };
        reader.readAsDataURL(file);
      }
    };

    input.click();
  }, [execCommand]);

  const clearFormatting = useCallback(() => {
    execCommand("removeFormat");
    execCommand("unlink");
  }, [execCommand]);

  // Estado de los botones de formato
  const [formatState, setFormatState] = useState({
    bold: false,
    italic: false,
    underline: false,
    justifyLeft: true,
    justifyCenter: false,
    justifyRight: false,
  });

  // Actualizar estado de los botones
  const updateFormatState = useCallback(() => {
    if (!editorRef.current) return;

    setFormatState({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      justifyLeft:
        document.queryCommandValue("justify") === "left" ||
        !document.queryCommandValue("justify"),
      justifyCenter: document.queryCommandValue("justify") === "center",
      justifyRight: document.queryCommandValue("justify") === "right",
    });
  }, []);

  // Efecto para actualizar estado de formato
  useEffect(() => {
    if (!editorRef.current) return;

    const handleSelectionChange = () => {
      updateFormatState();
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () =>
      document.removeEventListener("selectionchange", handleSelectionChange);
  }, [updateFormatState]);

  if (!isMounted) {
    return (
      <div className="min-h-[300px] border-2 border-dashed border-gray-300 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 animate-pulse">
        <div className="h-12 bg-gray-200/50 rounded-t-lg"></div>
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-200/30 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200/30 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200/30 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-2 border-gray-300 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Barra de herramientas */}
      <div className="flex flex-wrap items-center gap-1 p-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-300">
        {/* Negrita */}
        <button
          type="button"
          onClick={() => execCommand("bold")}
          className={`p-2 rounded-lg transition-all ${formatState.bold ? "bg-purple-100 text-purple-700 border border-purple-300" : "hover:bg-gray-200 text-gray-700"}`}
          title="Negrita (Ctrl+B)"
        >
          <FiBold size={16} />
        </button>

        {/* Cursiva */}
        <button
          type="button"
          onClick={() => execCommand("italic")}
          className={`p-2 rounded-lg transition-all ${formatState.italic ? "bg-purple-100 text-purple-700 border border-purple-300" : "hover:bg-gray-200 text-gray-700"}`}
          title="Cursiva (Ctrl+I)"
        >
          <FiItalic size={16} />
        </button>

        {/* Subrayado */}
        <button
          type="button"
          onClick={() => execCommand("underline")}
          className={`p-2 rounded-lg transition-all ${formatState.underline ? "bg-purple-100 text-purple-700 border border-purple-300" : "hover:bg-gray-200 text-gray-700"}`}
          title="Subrayado (Ctrl+U)"
        >
          <FiUnderline size={16} />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Alineación */}
        <button
          type="button"
          onClick={() => execCommand("justifyLeft")}
          className={`p-2 rounded-lg transition-all ${formatState.justifyLeft ? "bg-blue-100 text-blue-700 border border-blue-300" : "hover:bg-gray-200 text-gray-700"}`}
          title="Alinear izquierda"
        >
          <FiAlignLeft size={16} />
        </button>
        <button
          type="button"
          onClick={() => execCommand("justifyCenter")}
          className={`p-2 rounded-lg transition-all ${formatState.justifyCenter ? "bg-blue-100 text-blue-700 border border-blue-300" : "hover:bg-gray-200 text-gray-700"}`}
          title="Centrar"
        >
          <FiAlignCenter size={16} />
        </button>
        <button
          type="button"
          onClick={() => execCommand("justifyRight")}
          className={`p-2 rounded-lg transition-all ${formatState.justifyRight ? "bg-blue-100 text-blue-700 border border-blue-300" : "hover:bg-gray-200 text-gray-700"}`}
          title="Alinear derecha"
        >
          <FiAlignRight size={16} />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Listas */}
        <button
          type="button"
          onClick={() => insertList("ul")}
          className="p-2 rounded-lg hover:bg-gray-200 text-gray-700 transition flex items-center gap-1"
          title="Lista con viñetas"
        >
          <FiList size={16} />
        </button>
        <button
          type="button"
          onClick={() => insertList("ol")}
          className="p-2 rounded-lg hover:bg-gray-200 text-gray-700 transition"
          title="Lista numerada"
        >
          1.
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Enlaces e imágenes */}
        <button
          type="button"
          onClick={insertLink}
          className="p-2 rounded-lg hover:bg-gray-200 text-gray-700 transition flex items-center gap-1"
          title="Insertar enlace"
        >
          <FiLink size={16} />
        </button>
        <button
          type="button"
          onClick={insertImage}
          className="p-2 rounded-lg hover:bg-gray-200 text-gray-700 transition flex items-center gap-1"
          title="Insertar imagen"
        >
          <FiImage size={16} />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        {/* Limpiar formato */}
        <button
          type="button"
          onClick={clearFormatting}
          className="p-2 rounded-lg hover:bg-gray-200 text-gray-700 transition flex items-center gap-1"
          title="Limpiar formato"
        >
          <FiX size={16} />
        </button>

        <div className="ml-auto flex items-center gap-2 text-xs text-gray-500">
          <span className="px-2 py-1 bg-gray-200 rounded">
            {value?.replace(/<[^>]+>/g, "").length || 0} caracteres
          </span>
        </div>
      </div>

      {/* Área de edición principal */}
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[300px] p-4 focus:outline-none prose prose-sm max-w-none text-gray-700 bg-white cursor-text"
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={saveSelection}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        onClick={saveSelection}
        onMouseUp={saveSelection}
        suppressContentEditableWarning
        data-placeholder={placeholder}
        style={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      />

      {/* Placeholder visual */}
      {(!value || value === "" || value === "<br>") && (
        <div className="absolute top-12 left-4 pointer-events-none text-gray-400">
          {placeholder}
        </div>
      )}

      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
        💡 El cursor ahora se mantiene en la posición correcta mientras escribes
      </div>
    </div>
  );
};

// El resto del componente ResumenesForm permanece igual...
export default function ResumenesForm() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const [resumenes, setResumenes] = useState([]);
  const [boletines, setBoletines] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [tiposBoletin, setTiposBoletin] = useState([]);

  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [mounted, setMounted] = useState(false);

  const contenido = watch("contenido", "");

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resumenesRes, boletinesRes, categoriasRes, tiposBoletinRes] =
        await Promise.all([
          axios.get(`${API_URL}/resumenes/`),
          axios.get(`${API_URL}/boletines/`),
          axios.get(`${API_URL}/categorias/`),
          axios.get(`${API_URL}/tipos-boletin/`),
        ]);

      setResumenes(resumenesRes.data);
      setBoletines(boletinesRes.data);
      setCategorias(categoriasRes.data);
      setTiposBoletin(tiposBoletinRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error al cargar datos");
    }
  };

  const handleEditorChange = (content) => {
    setValue("contenido", content, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    if (
      !data.contenido ||
      data.contenido.trim() === "" ||
      data.contenido === "<br>"
    ) {
      alert("Por favor, escribe algún contenido en el resumen");
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`${API_URL}/resumenes/${editingId}`, data);
        alert("✅ Resumen actualizado");
      } else {
        await axios.post(`${API_URL}/resumenes/`, data);
        alert("✨ Resumen creado");
      }
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    reset({
      contenido: "",
      fecha: "",
      id_categoria: "",
      id_boletin: "",
    });
    setEditingId(null);
  };

  const handleEdit = (resumen) => {
    reset({
      contenido: resumen.contenido || "",
      fecha: resumen.fecha,
      id_categoria: resumen.id_categoria,
      id_boletin: resumen.id_boletin,
    });
    setEditingId(resumen.id);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este resumen?")) return;

    try {
      await axios.delete(`${API_URL}/resumenes/${id}`);
      alert("🗑️ Resumen eliminado");
      fetchData();
    } catch (error) {
      console.error("Error:", error);
      alert("Error al eliminar");
    }
  };

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Formulario */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FiFileText className="text-purple-600" />
          {editingId ? "Editar Resumen" : "Nuevo Resumen"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Boletín *
  </label>
  
  {/* Mostrar estado de carga */}
  {boletines.length === 0 ? (
    <div className="text-center py-4 text-gray-500">
      Cargando boletines...
    </div>
  ) : (
    <>
      {/* Debug info - eliminar después */}
      <div className="mb-2 p-2 bg-yellow-50 text-xs text-gray-600 rounded">
        <div>Boletines cargados: {boletines.length}</div>
        <div>Tipos de boletín cargados: {tiposBoletin?.length || 0}</div>
        <div>Primer boletín: {JSON.stringify(boletines[0] || {})}</div>
      </div>
      
      <select
        {...register("id_boletin", { required: "Selecciona un boletín" })}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg"
      >
        <option value="">Seleccionar...</option>
        
        {boletines.map((boletin) => {
          // Versión simple para debug
          console.log(`Procesando boletin ${boletin.id}:`, boletin);
          
          // Intentar encontrar el tipo
          const tipo = tiposBoletin?.find(t => 
            t.id === boletin.id_tipo_boletin || 
            t.id === boletin.tipo_boletin_id ||
            t.id === boletin.tipo_id
          );
          
          return (
            <option key={boletin.id} value={boletin.id}>
              {/* Mostrar información básica */}
              ID: {boletin.id} | 
              Edición: {boletin.edicion || "N/A"} | 
              Fecha: {boletin.fecha ? new Date(boletin.fecha).toLocaleDateString() : "N/A"} |
              Tipo ID: {boletin.id_tipo_boletin || boletin.tipo_boletin_id || "N/A"}
            </option>
          );
        })}
      </select>
    </>
  )}
  
  {errors.id_boletin && (
    <p className="mt-1 text-sm text-red-600">
      {errors.id_boletin.message}
    </p>
  )}
</div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría *
            </label>
            <select
              {...register("id_categoria", {
                required: "Selecciona una categoría",
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              disabled={categorias.length === 0}
            >
              <option value="">Seleccionar...</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
            {errors.id_categoria && (
              <p className="mt-1 text-sm text-red-600">
                {errors.id_categoria.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha *
            </label>
            <input
              type="date"
              {...register("fecha", { required: "La fecha es requerida" })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />
            {errors.fecha && (
              <p className="mt-1 text-sm text-red-600">
                {errors.fecha.message}
              </p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contenido *
            </label>
            <input
              type="hidden"
              {...register("contenido", {
                required: "El contenido es requerido",
                validate: (value) =>
                  (value && value.trim() !== "" && value !== "<br>") ||
                  "Escribe contenido",
              })}
            />

            <SimpleEditor value={contenido} onChange={handleEditorChange} />

            {errors.contenido && (
              <p className="mt-1 text-sm text-red-600">
                {errors.contenido.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Guardar Resumen"}
          </button>
        </form>
      </div>

      {/* Lista de resúmenes */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Resúmenes</h3>

        {resumenes.length === 0 ? (
          <p className="text-gray-500">No hay resúmenes</p>
        ) : (
          <div className="space-y-4">
            {resumenes.map((resumen) => (
              <div
                key={resumen.id}
                className="border rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">
                      {categorias.find((c) => c.id === resumen.id_categoria)
                        ?.nombre || "Sin categoría"}
                    </p>
                    <p className="text-sm text-gray-600">
                      📅 {new Date(resumen.fecha).toLocaleDateString()}
                    </p>
                    <div
                      className="mt-2 text-sm text-gray-500 line-clamp-2"
                      dangerouslySetInnerHTML={{
                        __html:
                          resumen.contenido
                            ?.replace(/<[^>]+>/g, " ")
                            .substring(0, 100) + "...",
                      }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(resumen)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDelete(resumen.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
