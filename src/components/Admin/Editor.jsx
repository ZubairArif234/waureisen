import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import TextStyle from '@tiptap/extension-text-style';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import { Mark } from '@tiptap/core';
import TextAlign from '@tiptap/extension-text-align';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import '../../Editor.css'; 
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  List, 
  ListOrdered,
  Link2,
  Plus,
  Minus,
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  Heading1,
  Heading2
} from 'lucide-react';

// Custom extension for font size
const FontSize = Mark.create({
  name: 'fontSize',

  addAttributes() {
    return {
      size: {
        default: 'normal',
        parseHTML: element => element.style.fontSize || 'normal',
        renderHTML: attributes => {
          if (!attributes.size || attributes.size === 'normal') {
            return {}
          }
          return {
            style: `font-size: ${attributes.size}`
          }
        },
      }
    }
  },

  parseHTML() {
    return [
      {
        style: 'font-size',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', HTMLAttributes, 0]
  },

  addCommands() {
    return {
      setFontSize: size => ({ chain }) => {
        return chain()
          .setMark(this.name, { size })
          .run()
      },
      unsetFontSize: () => ({ chain }) => {
        return chain()
          .unsetMark(this.name)
          .run()
      },
    }
  },
});

// Function to convert markdown to HTML
const convertMarkdownToHTML = (markdownContent) => {
  if (!markdownContent) return '';
  
  let htmlContent = markdownContent;
  
  // Convert headers
  htmlContent = htmlContent.replace(/^# (.*$)/gm, '<h1>$1</h1>');
  htmlContent = htmlContent.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  htmlContent = htmlContent.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  
  // Convert bold and italic
  htmlContent = htmlContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  htmlContent = htmlContent.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Convert unordered lists
  htmlContent = htmlContent.replace(/^\s*[\-\*] (.*$)/gm, '<li>$1</li>');
  
  // Convert ordered lists
  htmlContent = htmlContent.replace(/^\s*\d+\. (.*$)/gm, '<li>$1</li>');
  
  // Group list items
  let inList = false;
  let listType = '';
  const lines = htmlContent.split('\n');
  
  htmlContent = lines.map(line => {
    if (line.includes('<li>')) {
      if (!inList) {
        // Start a new list
        inList = true;
        listType = line.match(/^\s*\d/) ? 'ol' : 'ul';
        return `<${listType}>${line}`;
      }
      return line;
    } else if (inList) {
      // End the list
      inList = false;
      return `</${listType}>${line}`;
    }
    return line;
  }).join('\n');
  
  // Close any open list at the end
  if (inList) {
    htmlContent += `</${listType}>`;
  }
  
  return htmlContent;
};

const Editor = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      Document,
      StarterKit.configure({
        heading: true,
        document: false,
        paragraph: false
      }),
      Paragraph.configure({
        HTMLAttributes: {
          class: 'text-base',
        },
      }),
      Text,
      TextStyle,
      FontSize,
      Bold.configure(),
      Italic.configure(),
      Underline.configure(),
      BulletList.configure({
        HTMLAttributes: {
          class: 'list-disc ml-4'
        }
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: 'list-decimal ml-4'
        }
      }),
      ListItem,
      TextAlign.configure({
        types: ['paragraph', 'heading'],
        alignments: ['left', 'center', 'right'],
        defaultAlignment: 'left',
      })
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange && onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[300px] text-gray-700'
      }
    }
  });

  useEffect(() => {
    if (editor && content) {
      try {
        // Process markdown to HTML before setting content
        const processedContent = convertMarkdownToHTML(content);
        
        // Only update if the content has changed
        if (editor.getHTML() !== processedContent) {
          editor.commands.setContent(processedContent);
        }
      } catch (error) {
        console.error("Error processing content:", error);
        // Fallback to original content if processing fails
        editor.commands.setContent(content);
      }
    }
  }, [editor, content]);

  const increaseFontSize = () => {
    if (!editor) return;
    
    const currentSize = editor.getAttributes('fontSize').size;
    let newSize;
    
    if (!currentSize || currentSize === 'normal') {
      newSize = '1.2em';
    } else {
      const currentEm = parseFloat(currentSize);
      newSize = `${(currentEm + 0.2).toFixed(1)}em`;
    }
    
    editor.chain().focus().setFontSize(newSize).run();
  };
  
  const decreaseFontSize = () => {
    if (!editor) return;
    
    const currentSize = editor.getAttributes('fontSize').size;
    let newSize;
    
    if (!currentSize || currentSize === 'normal') {
      newSize = '0.8em';
    } else {
      const currentEm = parseFloat(currentSize);
      if (currentEm <= 0.8) return;
      newSize = `${(currentEm - 0.2).toFixed(1)}em`;
    }
    
    editor.chain().focus().setFontSize(newSize).run();
  };

  if (!editor) return null;

  return (
    <div className="border border-gray-200 rounded-lg">
      <div className="overflow-x-auto bg-[#FEFCF5]">
        <div className="flex items-center gap-2 border-b p-2 min-w-max md:min-w-0">
          {/* Text formatting */}
          <div className="flex items-center border-r pr-2">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-1.5 rounded hover:bg-gray-100 min-w-[28px] flex justify-center ${
                editor.isActive('bold') ? 'bg-gray-200' : ''
              }`}
              title="Bold"
            >
              <BoldIcon className="w-4 h-4 text-gray-700" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-1.5 rounded hover:bg-gray-100 min-w-[28px] flex justify-center ${
                editor.isActive('italic') ? 'bg-gray-200' : ''
              }`}
              title="Italic"
            >
              <ItalicIcon className="w-4 h-4 text-gray-700" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`p-1.5 rounded hover:bg-gray-100 min-w-[28px] flex justify-center ${
                editor.isActive('underline') ? 'bg-gray-200' : ''
              }`}
              title="Underline"
            >
              <UnderlineIcon className="w-4 h-4 text-gray-700" />
            </button>
          </div>

          {/* Headings */}
          <div className="flex items-center border-r pr-2">
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`p-1.5 rounded hover:bg-gray-100 min-w-[28px] flex justify-center ${
                editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''
              }`}
              title="Heading 1"
            >
              <Heading1 className="w-4 h-4 text-gray-700" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`p-1.5 rounded hover:bg-gray-100 min-w-[28px] flex justify-center ${
                editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''
              }`}
              title="Heading 2"
            >
              <Heading2 className="w-4 h-4 text-gray-700" />
            </button>
          </div>

          {/* Font Size Controls */}
          <div className="flex items-center border-r pr-2">
            <button
              onClick={increaseFontSize}
              className="p-1.5 rounded hover:bg-gray-100"
              title="Increase font size"
            >
              <Plus className="w-4 h-4 text-gray-700" />
            </button>
            <button
              onClick={decreaseFontSize}
              className="p-1.5 rounded hover:bg-gray-100"
              title="Decrease font size"
            >
              <Minus className="w-4 h-4 text-gray-700" />
            </button>
          </div>

          {/* Text Alignment */}
          <div className="flex items-center border-r pr-2">
            <button
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={`p-1.5 rounded hover:bg-gray-100 ${
                editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''
              }`}
              title="Align left"
            >
              <AlignLeft className="w-4 h-4 text-gray-700" />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              className={`p-1.5 rounded hover:bg-gray-100 ${
                editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''
              }`}
              title="Align center"
            >
              <AlignCenter className="w-4 h-4 text-gray-700" />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={`p-1.5 rounded hover:bg-gray-100 ${
                editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''
              }`}
              title="Align right"
            >
              <AlignRight className="w-4 h-4 text-gray-700" />
            </button>
          </div>

          {/* Lists */}
          <div className="flex items-center border-r pr-2">
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-1.5 rounded hover:bg-gray-100 ${
                editor.isActive('bulletList') ? 'bg-gray-200' : ''
              }`}
              title="Bullet list"
            >
              <List className="w-4 h-4 text-gray-700" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-1.5 rounded hover:bg-gray-100 ${
                editor.isActive('orderedList') ? 'bg-gray-200' : ''
              }`}
              title="Numbered list"
            >
              <ListOrdered className="w-4 h-4 text-gray-700" />
            </button>
          </div>

          {/* Link
          <div className="flex items-center">
            <button
              onClick={() => {
                const url = window.prompt('Enter the URL:')
                if (url) {
                  editor.chain().focus().setLink({ href: url }).run()
                }
              }}
              className={`p-1.5 rounded hover:bg-gray-100 ${
                editor.isActive('link') ? 'bg-gray-200' : ''
              }`}
              title="Insert link"
            >
              <Link2 className="w-4 h-4 text-gray-700" />
            </button>
          </div> */}
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="bg-white p-4">
        <EditorContent editor={editor} className="prose prose-sm sm:prose-base max-w-none min-h-[300px]" />
      </div>
    </div>
  );
};

export default Editor;