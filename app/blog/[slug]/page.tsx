// app/blog/[slug]/page.tsx
import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';
import { notFound } from 'next/navigation';

// This is a server component that directly reads the HTML file
export default async function BlogPost({ params }: { params: { slug: string } }) {
  try {
    const { slug } = params;
    const filePath = path.join(process.cwd(), 'public', 'blog-content', `${slug}.html`);
    
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return notFound();
    }
    
    // Read HTML content from file
    const htmlContent = await fsPromises.readFile(filePath, 'utf-8');
    
    // Extract title from the HTML
    const titleMatch = htmlContent.match(/<title>(.*?)<\/title>/);
    const title = titleMatch ? titleMatch[1] : 'Blog Post';
    
    return (
      <div className="min-h-screen">
        <article 
          className="blog-content" 
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    );
  } catch (error) {
    console.error('Error loading blog post:', error);
    return notFound();
  }
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  try {
    const blogDir = path.join(process.cwd(), 'public', 'blog-content');
    
    // Check if directory exists
    if (!fs.existsSync(blogDir)) {
      return [];
    }
    
    const files = await fsPromises.readdir(blogDir);
    const htmlFiles = files.filter(file => file.endsWith('.html'));
    
    return htmlFiles.map(file => ({
      slug: file.replace('.html', ''),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}