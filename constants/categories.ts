import {
  FileText,
  Gavel,
  Megaphone,
  ShoppingCart,
  Users,
  Accessibility,
} from "lucide-react";

export const categorias = [
  { id: "todas", nombre: "Todas las categorías", icon: FileText },
  { id: "legislacion", nombre: "Legislación", icon: Gavel },
  { id: "avisos", nombre: "Avisos Oficiales", icon: Megaphone },
  { id: "edictos", nombre: "Edictos", icon: FileText },
  { id: "contrataciones", nombre: "Contrataciones", icon: ShoppingCart },
  { id: "recursos-humanos", nombre: "Recursos Humanos", icon: Users },
  { id: "accesibilidad", nombre: "Accesibilidad", icon: Accessibility },
];

export const ITEMS_PER_PAGE = 10;

export const tabs = [
  // "Todos",ç
  "2025",

];