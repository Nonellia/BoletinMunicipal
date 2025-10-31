// estilos.ts - Estilos Tailwind CSS reutilizables para formularios

export const formContainer = {
  base: "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8",
  card: "max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8",
  header: "text-center mb-8",
  title: "text-3xl font-bold text-gray-800 mb-2",
  subtitle: "text-gray-600"
};

export const formStyles = {
  base: "space-y-6",
  field: "mb-5",
  label: "block text-sm font-medium text-gray-700 mb-2",
  input: "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
  select: "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
  textarea: "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
  fileUpload: {
    container: "mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg",
    innerContainer: "space-y-1 text-center",
    text: "flex text-sm text-gray-600 justify-center",
    uploadLabel: "relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500",
    input: "sr-only",
    hint: "text-xs text-gray-500"
  },
  grid: {
    twoCols: "grid grid-cols-1 md:grid-cols-2 gap-4"
  },
  button: {
    base: "w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
    primary: "bg-indigo-600 hover:bg-indigo-700",
    secondary: "bg-gray-600 hover:bg-gray-700",
    disabled: "opacity-70 cursor-not-allowed"
  },
  spinner: "animate-spin -ml-1 mr-3 h-5 w-5 text-white"
};

export const formLayout = {
  section: "mb-8",
  sectionTitle: "text-xl font-semibold text-gray-800 mb-4 border-b pb-2"
};

// Utilidades para construir clases condicionalmente
export const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ');
};