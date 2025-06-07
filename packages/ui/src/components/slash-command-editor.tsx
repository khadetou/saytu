"use client"

import * as React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeSanitize from "rehype-sanitize"
import { cn } from "@workspace/ui/lib/utils"
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Heading1, 
  Heading2, 
  Heading3,
  Link,
  Image,
  Table
} from "lucide-react"

interface SlashCommand {
  id: string
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  action: (editor: HTMLTextAreaElement) => void
}

interface SlashCommandEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  minHeight?: string
}

export function SlashCommandEditor({
  value,
  onChange,
  placeholder = "Tapez / pour voir les commandes...",
  className,
  disabled = false,
  minHeight = "300px",
}: SlashCommandEditorProps) {
  const [showCommands, setShowCommands] = React.useState(false)
  const [commandPosition, setCommandPosition] = React.useState({ top: 0, left: 0 })
  const [selectedCommand, setSelectedCommand] = React.useState(0)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const commandsRef = React.useRef<HTMLDivElement>(null)

  const insertText = (text: string, cursorOffset = 0) => {
    if (!textareaRef.current) return
    
    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    
    const newValue = value.substring(0, start) + text + value.substring(end)
    onChange(newValue)
    
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + text.length + cursorOffset, start + text.length + cursorOffset)
    }, 0)
  }

  const slashCommands: SlashCommand[] = [
    {
      id: "h1",
      label: "Titre 1",
      description: "Grand titre",
      icon: Heading1,
      action: () => insertText("# ", 0)
    },
    {
      id: "h2",
      label: "Titre 2",
      description: "Titre moyen",
      icon: Heading2,
      action: () => insertText("## ", 0)
    },
    {
      id: "h3",
      label: "Titre 3",
      description: "Petit titre",
      icon: Heading3,
      action: () => insertText("### ", 0)
    },
    {
      id: "bold",
      label: "Gras",
      description: "Texte en gras",
      icon: Bold,
      action: () => insertText("**texte en gras**", -2)
    },
    {
      id: "italic",
      label: "Italique",
      description: "Texte en italique",
      icon: Italic,
      action: () => insertText("*texte en italique*", -1)
    },
    {
      id: "list",
      label: "Liste à puces",
      description: "Liste non ordonnée",
      icon: List,
      action: () => insertText("- Élément de liste\n- ", 0)
    },
    {
      id: "ordered-list",
      label: "Liste numérotée",
      description: "Liste ordonnée",
      icon: ListOrdered,
      action: () => insertText("1. Premier élément\n2. ", 0)
    },
    {
      id: "quote",
      label: "Citation",
      description: "Bloc de citation",
      icon: Quote,
      action: () => insertText("> Citation\n", 0)
    },
    {
      id: "code",
      label: "Code",
      description: "Bloc de code",
      icon: Code,
      action: () => insertText("```\ncode\n```", -4)
    },
    {
      id: "link",
      label: "Lien",
      description: "Lien hypertexte",
      icon: Link,
      action: () => insertText("[texte du lien](url)", -4)
    },
    {
      id: "image",
      label: "Image",
      description: "Insérer une image",
      icon: Image,
      action: () => insertText("![alt text](url)", -4)
    },
    {
      id: "table",
      label: "Tableau",
      description: "Tableau simple",
      icon: Table,
      action: () => insertText("| Colonne 1 | Colonne 2 |\n|-----------|----------|\n| Cellule 1 | Cellule 2 |\n", 0)
    }
  ]

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showCommands) {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedCommand((prev) => (prev + 1) % slashCommands.length)
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedCommand((prev) => (prev - 1 + slashCommands.length) % slashCommands.length)
      } else if (e.key === "Enter") {
        e.preventDefault()
        executeCommand(slashCommands[selectedCommand])
      } else if (e.key === "Escape") {
        setShowCommands(false)
      }
    }
  }

  const executeCommand = (command: SlashCommand) => {
    if (!textareaRef.current) return
    
    // Remove the "/" that triggered the command
    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const newValue = value.substring(0, start - 1) + value.substring(start)
    onChange(newValue)
    
    setTimeout(() => {
      command.action(textarea)
      setShowCommands(false)
      setSelectedCommand(0)
    }, 0)
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    
    const textarea = e.target
    const cursorPosition = textarea.selectionStart
    const textBeforeCursor = newValue.substring(0, cursorPosition)
    
    // Check if user typed "/"
    if (textBeforeCursor.endsWith("/")) {
      const rect = textarea.getBoundingClientRect()
      const lineHeight = 20
      const lines = textBeforeCursor.split("\n").length - 1
      
      setCommandPosition({
        top: rect.top + (lines * lineHeight) + 25,
        left: rect.left + 10
      })
      setShowCommands(true)
      setSelectedCommand(0)
    } else {
      setShowCommands(false)
    }
  }

  return (
    <div className={cn("relative", className)}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Editor */}
        <div className="space-y-2">
          <div className="text-sm text-gray-400">Éditeur</div>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "w-full rounded-md border border-[#4a5568] bg-[#1a1a1a] text-white placeholder:text-gray-400",
              "focus:border-[#3182ce] focus:ring-1 focus:ring-[#3182ce] focus:outline-none",
              "resize-none font-mono text-sm p-4",
              className
            )}
            style={{ minHeight }}
          />
        </div>

        {/* Live Preview */}
        <div className="space-y-2">
          <div className="text-sm text-gray-400">Aperçu</div>
          <div 
            className="rounded-md border border-[#4a5568] bg-[#2d3748] p-4 overflow-auto"
            style={{ minHeight }}
          >
            {value ? (
              <div className="prose prose-sm max-w-none prose-invert">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeSanitize]}
                  components={{
                    h1: ({ children }) => <h1 className="text-xl font-bold mb-3 text-white">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-lg font-semibold mb-2 text-white">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-base font-medium mb-2 text-white">{children}</h3>,
                    p: ({ children }) => <p className="mb-2 leading-relaxed text-gray-300">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1 text-gray-300">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1 text-gray-300">{children}</ol>,
                    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-[#3182ce] pl-4 italic text-gray-400 mb-2">
                        {children}
                      </blockquote>
                    ),
                    code: ({ children, className }) => {
                      const isInline = !className
                      return isInline ? (
                        <code className="bg-[#1a1a1a] px-1 py-0.5 rounded text-sm font-mono text-[#3182ce]">
                          {children}
                        </code>
                      ) : (
                        <pre className="bg-[#1a1a1a] p-3 rounded-md overflow-x-auto mb-2">
                          <code className="text-sm font-mono text-gray-300">{children}</code>
                        </pre>
                      )
                    },
                    a: ({ children, href }) => (
                      <a href={href} className="text-[#3182ce] hover:underline" target="_blank" rel="noopener noreferrer">
                        {children}
                      </a>
                    ),
                    table: ({ children }) => (
                      <table className="border-collapse border border-[#4a5568] mb-2">
                        {children}
                      </table>
                    ),
                    th: ({ children }) => (
                      <th className="border border-[#4a5568] px-2 py-1 bg-[#1a1a1a] text-white font-medium">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="border border-[#4a5568] px-2 py-1 text-gray-300">
                        {children}
                      </td>
                    ),
                  }}
                >
                  {value}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="text-gray-500 text-sm italic">
                Commencez à taper pour voir l'aperçu...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Slash Commands Menu */}
      {showCommands && (
        <div
          ref={commandsRef}
          className="fixed z-50 bg-[#2d3748] border border-[#4a5568] rounded-md shadow-lg max-h-64 overflow-y-auto"
          style={{
            top: commandPosition.top,
            left: commandPosition.left,
            minWidth: "250px"
          }}
        >
          {slashCommands.map((command, index) => (
            <div
              key={command.id}
              className={cn(
                "flex items-center gap-3 px-3 py-2 cursor-pointer text-sm",
                index === selectedCommand
                  ? "bg-[#3182ce] text-white"
                  : "text-gray-300 hover:bg-[#4a5568]"
              )}
              onClick={() => executeCommand(command)}
            >
              <command.icon className="w-4 h-4" />
              <div>
                <div className="font-medium">{command.label}</div>
                <div className="text-xs opacity-75">{command.description}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
