// app/admin/blog/components/MarkdownEditor.tsx
'use client';

import { useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Image as ImageIcon,
  Link as LinkIcon,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code
} from 'lucide-react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function MarkdownEditor({ value, onChange, placeholder = 'Write your content here...' }: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<string>('write');
  const [selectionStart, setSelectionStart] = useState<number>(0);
  const [selectionEnd, setSelectionEnd] = useState<number>(0);
  
  const textareaRef = useCallback((textareaElement: HTMLTextAreaElement) => {
    if (textareaElement !== null) {
      textareaElement.setSelectionRange(selectionStart, selectionEnd);
    }
  }, [selectionStart, selectionEnd]);

  const handleSelection = (event: React.MouseEvent<HTMLTextAreaElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
    const target = event.target as HTMLTextAreaElement;
    setSelectionStart(target.selectionStart);
    setSelectionEnd(target.selectionEnd);
  };

  const insertMarkdown = (markdownBefore: string, markdownAfter: string = '') => {
    const newValue = 
      value.substring(0, selectionStart) + 
      markdownBefore + 
      value.substring(selectionStart, selectionEnd) + 
      markdownAfter + 
      value.substring(selectionEnd);
    
    onChange(newValue);
    
    // Calculate new cursor position
    const newPosition = selectionStart + markdownBefore.length;
    setSelectionStart(newPosition);
    setSelectionEnd(newPosition + (selectionEnd - selectionStart));
  };

  const format = {
    bold: () => insertMarkdown('**', '**'),
    italic: () => insertMarkdown('*', '*'),
    h1: () => insertMarkdown('# '),
    h2: () => insertMarkdown('## '),
    h3: () => insertMarkdown('### '),
    list: () => insertMarkdown('- '),
    orderedList: () => insertMarkdown('1. '),
    link: () => insertMarkdown('[', '](url)'),
    image: () => insertMarkdown('![alt text](', ')'),
    quote: () => insertMarkdown('> '),
    code: () => insertMarkdown('```\n', '\n```')
  };

  return (
    <div className="rounded-md border">
      <Tabs defaultValue="write" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between border-b px-3">
          <TabsList className="h-10">
            <TabsTrigger value="write">Write</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          
          {activeTab === 'write' && (
            <div className="flex items-center space-x-1">
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                onClick={format.bold} 
                title="Bold"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                onClick={format.italic} 
                title="Italic"
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                onClick={format.h1} 
                title="Heading 1"
              >
                <Heading1 className="h-4 w-4" />
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                onClick={format.h2} 
                title="Heading 2"
              >
                <Heading2 className="h-4 w-4" />
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                onClick={format.h3} 
                title="Heading 3"
              >
                <Heading3 className="h-4 w-4" />
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                onClick={format.list} 
                title="Bullet List"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                onClick={format.orderedList} 
                title="Numbered List"
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                onClick={format.link} 
                title="Link"
              >
                <LinkIcon className="h-4 w-4" />
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                onClick={format.image} 
                title="Image"
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                onClick={format.quote}
                title="Quote" 
              >
                <Quote className="h-4 w-4" />
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                onClick={format.code}
                title="Code Block" 
              >
                <Code className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        
        <TabsContent value="write" className="p-0">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onClick={handleSelection}
            onKeyUp={handleSelection}
            placeholder={placeholder}
            className="border-0 focus-visible:ring-0 resize-none min-h-[300px] rounded-none"
          />
        </TabsContent>
        
        <TabsContent value="preview" className="p-4 prose prose-sm max-w-none">
          {value ? (
            <ReactMarkdown>{value}</ReactMarkdown>
          ) : (
            <p className="text-muted-foreground">Nothing to preview</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
