// components/rich-text-editor/menu-bar.tsx (updated)
import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    Bold,
    Heading1,
    Heading2,
    Heading3,
    Image as ImageIcon,
    Italic,
    List,
    ListOrdered,
    Strikethrough,
  } from "lucide-react";
  import { Editor } from "@tiptap/react";
  import { Toggle } from "../ui/toggle";
  import { useRef, useState } from "react";
  import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
  import { Label } from "../ui/label";
  import { Input } from "../ui/input";
  import { Button } from "../ui/button";
   
  export default function MenuBar({ editor }: { editor: Editor | null }) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [imageDialog, setImageDialog] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [imageAlt, setImageAlt] = useState('');
  
    if (!editor) {
      return null;
    }
  
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = (event) => {
          if (event.target?.result) {
            const url = event.target.result as string;
            // Open the dialog for setting alt text
            setImageUrl(url);
            setImageAlt(file.name.split('.')[0] || '');
            setImageDialog(true);
          }
        };
        
        reader.readAsDataURL(file);
        
        // Reset file input to allow selecting the same file again
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };
  
    const insertImage = () => {
      if (imageUrl && editor) {
        editor.chain().focus().setImage({ src: imageUrl, alt: imageAlt }).run();
        setImageDialog(false);
        setImageUrl('');
        setImageAlt('');
      }
    };
   
    const Options = [
      {
        icon: <Heading1 className="size-4" />,
        onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
        preesed: editor.isActive("heading", { level: 1 }),
      },
      {
        icon: <Heading2 className="size-4" />,
        onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        preesed: editor.isActive("heading", { level: 2 }),
      },
      {
        icon: <Heading3 className="size-4" />,
        onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
        preesed: editor.isActive("heading", { level: 3 }),
      },
      {
        icon: <Bold className="size-4" />,
        onClick: () => editor.chain().focus().toggleBold().run(),
        preesed: editor.isActive("bold"),
      },
      {
        icon: <Italic className="size-4" />,
        onClick: () => editor.chain().focus().toggleItalic().run(),
        preesed: editor.isActive("italic"),
      },
      {
        icon: <Strikethrough className="size-4" />,
        onClick: () => editor.chain().focus().toggleStrike().run(),
        preesed: editor.isActive("strike"),
      },
      {
        icon: <AlignLeft className="size-4" />,
        onClick: () => editor.chain().focus().setTextAlign("left").run(),
        preesed: editor.isActive({ textAlign: "left" }),
      },
      {
        icon: <AlignCenter className="size-4" />,
        onClick: () => editor.chain().focus().setTextAlign("center").run(),
        preesed: editor.isActive({ textAlign: "center" }),
      },
      {
        icon: <AlignRight className="size-4" />,
        onClick: () => editor.chain().focus().setTextAlign("right").run(),
        preesed: editor.isActive({ textAlign: "right" }),
      },
      {
        icon: <List className="size-4" />,
        onClick: () => editor.chain().focus().toggleBulletList().run(),
        preesed: editor.isActive("bulletList"),
      },
      {
        icon: <ListOrdered className="size-4" />,
        onClick: () => editor.chain().focus().toggleOrderedList().run(),
        preesed: editor.isActive("orderedList"),
      },
      {
        icon: <ImageIcon className="size-4" />,
        onClick: () => fileInputRef.current?.click(),
        preesed: false,
      }
    ];
   
    return (
      <>
        <div className="border rounded-md p-1 mb-1 bg-slate-50 space-x-2 z-50">
          {Options.map((option, index) => (
            <Toggle
              key={index}
              pressed={option.preesed}
              onPressedChange={option.onClick}
            >
              {option.icon}
            </Toggle>
          ))}
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>
  
        <Dialog open={imageDialog} onOpenChange={setImageDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Image</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="alt-text">Alt Text</Label>
                <Input
                  id="alt-text"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="Describe this image"
                />
              </div>
              {imageUrl && (
                <div className="mt-2">
                  <img 
                    src={imageUrl} 
                    alt={imageAlt} 
                    className="max-w-full max-h-64 mx-auto object-contain"
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setImageDialog(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={insertImage}>
                Insert Image
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }