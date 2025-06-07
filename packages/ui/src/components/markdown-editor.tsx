"use client"

import * as React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeSanitize from "rehype-sanitize"
import { Textarea } from "@workspace/ui/components/textarea"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Eye, Edit, Bold, Italic, Link, List, ListOrdered, Quote, Code } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  minHeight?: string
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Écrivez votre contenu en Markdown...",
  className,
  disabled = false,
  minHeight = "200px",
}: MarkdownEditorProps) {
  const [isPreview, setIsPreview] = React.useState(false)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const insertMarkdown = (before: string, after: string = "") => {
    if (!textareaRef.current) return
    
    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end)
    onChange(newText)
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
    }, 0)
  }

  const toolbarButtons = [
    { icon: Bold, action: () => insertMarkdown("**", "**"), title: "Gras" },
    { icon: Italic, action: () => insertMarkdown("*", "*"), title: "Italique" },
    { icon: Link, action: () => insertMarkdown("[", "](url)"), title: "Lien" },
    { icon: List, action: () => insertMarkdown("- "), title: "Liste à puces" },
    { icon: ListOrdered, action: () => insertMarkdown("1. "), title: "Liste numérotée" },
    { icon: Quote, action: () => insertMarkdown("> "), title: "Citation" },
    { icon: Code, action: () => insertMarkdown("`", "`"), title: "Code" },
  ]

  return (
    <div className={cn("space-y-2", className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b pb-2">
        <div className="flex items-center space-x-1">
          {toolbarButtons.map((button, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={button.action}
              disabled={disabled || isPreview}
              title={button.title}
              className="h-8 w-8 p-0"
            >
              <button.icon className="h-4 w-4" />
            </Button>
          ))}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={!isPreview ? "default" : "ghost"}
            size="sm"
            onClick={() => setIsPreview(false)}
            className="h-8"
          >
            <Edit className="h-4 w-4 mr-1" />
            Éditer
          </Button>
          <Button
            variant={isPreview ? "default" : "ghost"}
            size="sm"
            onClick={() => setIsPreview(true)}
            className="h-8"
          >
            <Eye className="h-4 w-4 mr-1" />
            Aperçu
          </Button>
        </div>
      </div>

      {/* Editor/Preview */}
      <div className="relative">
        {!isPreview ? (
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={cn("resize-none font-mono text-sm", className)}
            style={{ minHeight }}
          />
        ) : (
          <Card className="min-h-[200px]">
            <CardContent className="p-4">
              {value ? (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeSanitize]}
                    components={{
                      h1: ({ children }) => <h1 className="text-2xl font-bold mb-4">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-xl font-semibold mb-3">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-lg font-medium mb-2">{children}</h3>,
                      p: ({ children }) => <p className="mb-3 leading-relaxed">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
                      li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-3">
                          {children}
                        </blockquote>
                      ),
                      code: ({ children, className }) => {
                        const isInline = !className
                        return isInline ? (
                          <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono">
                            {children}
                          </code>
                        ) : (
                          <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto mb-3">
                            <code className="text-sm font-mono">{children}</code>
                          </pre>
                        )
                      },
                      a: ({ children, href }) => (
                        <a href={href} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {value}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="text-muted-foreground text-sm italic">
                  Aucun contenu à afficher
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Help text */}
      {!isPreview && (
        <div className="text-xs text-muted-foreground">
          Vous pouvez utiliser la syntaxe Markdown. 
          <span className="font-mono"> **gras** *italique* [lien](url) `code` </span>
        </div>
      )}
    </div>
  )
}
