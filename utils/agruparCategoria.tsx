import type { Documento } from "@/types/Boletin";

export const agruparPorCategoria = (
  docs: (Documento & { categoria?: any })[]
) => {
  return docs.reduce<Record<string, typeof docs>>((acc, doc) => {
    const categoria =
      typeof doc.categoria === "object"
        ? doc.categoria?.nombre
        : doc.categoria || "Sin categoría";

    if (!acc[categoria]) acc[categoria] = [];
    acc[categoria].push(doc);

    return acc;
  }, {});
};
