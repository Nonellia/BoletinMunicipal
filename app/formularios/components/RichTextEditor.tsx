// components/RichTextEditor.jsx
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { useEffect, useState, useMemo } from 'react';
import {
  FiBold,
  FiItalic,
  FiUnderline,
  FiList,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiType,
  FiMinus,
  FiRotateCcw,
  FiRotateCw,
} from 'react-icons/fi';

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="border-b border-gray-200 p-2 flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-2 rounded ${editor.isActive('bold') 
          ? 'bg-blue-100 text-blue-600' 
          : 'text-gray-600 hover:bg-gray-100 disabled:text-gray-300'}`}
        title="Negrita (Ctrl+B)"
      >
        <FiBold />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-2 rounded ${editor.isActive('italic') 
          ? 'bg-blue-100 text-blue-600' 
          : 'text-gray-600 hover:bg-gray-100 disabled:text-gray-300'}`}
        title="Itálica (Ctrl+I)"
      >
        <FiItalic />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-2 rounded ${editor.isActive('underline') 
          ? 'bg-blue-100 text-blue-600' 
          : 'text-gray-600 hover:bg-gray-100'}`}
        title="Subrayado (Ctrl+U)"
      >
        <FiUnderline />
      </button>
      
      <div className="w-px h-6 bg-gray-300 mx-1" />
      
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded ${editor.isActive('heading', { level: 1 }) 
          ? 'bg-blue-100 text-blue-600' 
          : 'text-gray-600 hover:bg-gray-100'}`}
        title="Título 1"
      >
        <span className="font-bold text-lg">H1</span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded ${editor.isActive('heading', { level: 2 }) 
          ? 'bg-blue-100 text-blue-600' 
          : 'text-gray-600 hover:bg-gray-100'}`}
        title="Título 2"
      >
        <span className="font-bold">H2</span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 rounded ${editor.isActive('heading', { level: 3 }) 
          ? 'bg-blue-100 text-blue-600' 
          : 'text-gray-600 hover:bg-gray-100'}`}
        title="Título 3"
      >
        <span className="font-bold text-sm">H3</span>
      </button>
      
      <div className="w-px h-6 bg-gray-300 mx-1" />
      
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded ${editor.isActive('bulletList') 
          ? 'bg-blue-100 text-blue-600' 
          : 'text-gray-600 hover:bg-gray-100'}`}
        title="Lista con viñetas"
      >
        <FiList />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded ${editor.isActive('orderedList') 
          ? 'bg-blue-100 text-blue-600' 
          : 'text-gray-600 hover:bg-gray-100'}`}
        title="Lista numerada"
      >
        <FiList className="transform rotate-90" />
      </button>
      
      <div className="w-px h-6 bg-gray-300 mx-1" />
      
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={`p-2 rounded ${editor.isActive({ textAlign: 'left' }) 
          ? 'bg-blue-100 text-blue-600' 
          : 'text-gray-600 hover:bg-gray-100'}`}
        title="Alinear izquierda"
      >
        <FiAlignLeft />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={`p-2 rounded ${editor.isActive({ textAlign: 'center' }) 
          ? 'bg-blue-100 text-blue-600' 
          : 'text-gray-600 hover:bg-gray-100'}`}
        title="Centrar"
      >
        <FiAlignCenter />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={`p-2 rounded ${editor.isActive({ textAlign: 'right' }) 
          ? 'bg-blue-100 text-blue-600' 
          : 'text-gray-600 hover:bg-gray-100'}`}
        title="Alinear derecha"
      >
        <FiAlignRight />
      </button>
      
      <div className="w-px h-6 bg-gray-300 mx-1" />
      
      <button
        type="button"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className="p-2 rounded text-gray-600 hover:bg-gray-100"
        title="Línea horizontal"
      >
        <FiMinus />
      </button>
    </div>
  );
};

// Función para contar caracteres excluyendo HTML
const countCharacters = (htmlContent) => {
  if (!htmlContent) return 0;
  // Remover etiquetas HTML y contar caracteres
  const text = htmlContent.replace(/<[^>]+>/g, '');
  return text.length;
};

// Función para contar palabras
const countWords = (htmlContent) => {
  if (!htmlContent) return 0;
  const text = htmlContent.replace(/<[^>]+>/g, '');
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  return words.length;
};

export default function RichTextEditor({ value, onChange }) {
  const [mounted, setMounted] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right'],
        defaultAlignment: 'left',
      }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      onChange(content);
      setCharacterCount(countCharacters(content));
      setWordCount(countWords(content));
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4 prose-headings:mt-0 prose-headings:mb-2 prose-p:my-1',
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
      setCharacterCount(countCharacters(value));
      setWordCount(countWords(value));
    }
  }, [editor, value]);

  // Calcular conteos cuando se monta
  useEffect(() => {
    if (mounted && value) {
      setCharacterCount(countCharacters(value));
      setWordCount(countWords(value));
    }
  }, [mounted, value]);

  if (!mounted) {
    return (
      <div className="border border-gray-300 rounded-lg overflow-hidden min-h-[250px] bg-gray-50 animate-pulse">
        <div className="border-b border-gray-200 p-2 flex flex-wrap gap-2">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="w-8 h-8 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="p-4">
          <div className="h-4 bg-gray-200 rounded mb-3 w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded mb-3 w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500 transition">
      <MenuBar editor={editor} />
      <EditorContent  editor={editor}/>
      
      
      
      <div className="border-t border-gray-200 p-2 flex justify-between items-center text-xs text-gray-500 bg-gray-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="font-medium">Caracteres:</span>
            <span className="bg-white px-2 py-1 rounded border">{characterCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium">Palabras:</span>
            <span className="bg-white px-2 py-1 rounded border">{wordCount}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => editor?.commands.undo()}
            disabled={!editor?.can().undo()}
            className="px-3 py-1.5 hover:bg-gray-100 rounded border border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed flex items-center gap-1"
            title="Deshacer (Ctrl+Z)"
          >
            <FiRotateCcw size={14} />
            Deshacer
          </button>
          <button
            type="button"
            onClick={() => editor?.commands.redo()}
            disabled={!editor?.can().redo()}
            className="px-3 py-1.5 hover:bg-gray-100 rounded border border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed flex items-center gap-1"
            title="Rehacer (Ctrl+Y)"
          >
            <FiRotateCw size={14} />
            Rehacer
          </button>
          <button
            type="button"
            onClick={() => {
              editor?.commands.clearContent();
              setCharacterCount(0);
              setWordCount(0);
            }}
            className="px-3 py-1.5 hover:bg-gray-100 rounded border border-gray-300 text-gray-600"
            title="Limpiar todo"
          >
            Limpiar
          </button>
        </div>
      </div>
    </div>
  );
}