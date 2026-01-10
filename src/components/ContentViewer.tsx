import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Copy, Download, Eye, FileCode, FileText, Edit3, Globe, ChevronDown } from 'lucide-react';
import { ArticleEditor } from './ArticleEditor';
import { toast } from '@/hooks/use-toast';
import TurndownService from 'turndown';
import DOMPurify from 'dompurify';
import { markdownToHtml } from '@/lib/markdown-to-html';
import { 
  generateStyledHtml, 
  generateWordPressHtml, 
  generatePlainText 
} from '@/lib/export-formats';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from './ui/dropdown-menu';

interface ContentViewerProps {
  content: string;
  onContentChange: (content: string) => void;
  format: 'markdown' | 'html' | 'richtext';
  articleTitle?: string;
  affiliateConfig?: {
    affiliateId?: string;
    ctaStyle?: string;
    ctaPlacement?: string;
  };
}

export const ContentViewer = ({ 
  content, 
  onContentChange, 
  format, 
  articleTitle = 'Article',
  affiliateConfig 
}: ContentViewerProps) => {
  const [activeTab, setActiveTab] = useState<string>('website');
  const [htmlContent, setHtmlContent] = useState('');
  const [markdownContent, setMarkdownContent] = useState('');
  const [plainTextContent, setPlainTextContent] = useState('');

  // Initialize content based on format
  useEffect(() => {
    if (format === 'markdown') {
      setMarkdownContent(content);
      const html = markdownToHtml(content);
      setHtmlContent(html);
      setPlainTextContent(generatePlainText(html));
    } else if (format === 'html') {
      setHtmlContent(content);
      const turndownService = new TurndownService();
      setMarkdownContent(turndownService.turndown(content));
      setPlainTextContent(generatePlainText(content));
    } else {
      setHtmlContent(content);
      const turndownService = new TurndownService();
      setMarkdownContent(turndownService.turndown(content));
      setPlainTextContent(generatePlainText(content));
    }
  }, [content, format]);

  const handleRichTextChange = (newContent: string) => {
    setHtmlContent(newContent);
    const turndownService = new TurndownService();
    setMarkdownContent(turndownService.turndown(newContent));
    setPlainTextContent(generatePlainText(newContent));
    onContentChange(newContent);
  };

  const handleMarkdownChange = (newMarkdown: string) => {
    setMarkdownContent(newMarkdown);
    const newHtml = markdownToHtml(newMarkdown);
    setHtmlContent(newHtml);
    setPlainTextContent(generatePlainText(newHtml));
    onContentChange(newMarkdown);
  };

  const handleCopy = (type: 'markdown' | 'html' | 'plaintext' | 'wordpress') => {
    let textToCopy = '';
    let label = '';
    
    switch (type) {
      case 'markdown':
        textToCopy = markdownContent;
        label = 'Markdown';
        break;
      case 'html':
        textToCopy = htmlContent;
        label = 'HTML';
        break;
      case 'plaintext':
        textToCopy = plainTextContent;
        label = 'Plain Text';
        break;
      case 'wordpress':
        textToCopy = generateWordPressHtml(htmlContent, articleTitle);
        label = 'WordPress HTML';
        break;
    }
    
    navigator.clipboard.writeText(textToCopy);
    toast({
      title: 'Copied to Clipboard',
      description: `${label} content copied successfully`,
    });
  };

  const handleExport = (type: 'markdown' | 'html' | 'styled-html' | 'wordpress' | 'plaintext') => {
    let exportContent = '';
    let filename = articleTitle.toLowerCase().replace(/\s+/g, '-');
    let extension = '';
    let mimeType = 'text/plain';
    
    switch (type) {
      case 'markdown':
        exportContent = markdownContent;
        extension = 'md';
        break;
      case 'html':
        exportContent = htmlContent;
        extension = 'html';
        mimeType = 'text/html';
        break;
      case 'styled-html':
        exportContent = generateStyledHtml(htmlContent, articleTitle);
        extension = 'html';
        mimeType = 'text/html';
        filename = `${filename}-styled`;
        break;
      case 'wordpress':
        exportContent = generateWordPressHtml(htmlContent, articleTitle);
        extension = 'html';
        mimeType = 'text/html';
        filename = `${filename}-wordpress`;
        break;
      case 'plaintext':
        exportContent = plainTextContent;
        extension = 'txt';
        break;
    }
    
    const blob = new Blob([exportContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Exported Successfully',
      description: `Article exported as ${type.toUpperCase().replace('-', ' ')}`,
    });
  };

  // Calculate word count
  const wordCount = plainTextContent.split(/\s+/).filter(word => word.length > 0).length;

  return (
    <div className="space-y-4">
      {/* Action Bar */}
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileText className="h-4 w-4" />
          <span>{wordCount.toLocaleString()} words</span>
        </div>
        
        <div className="flex gap-2">
          {/* Copy Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Copy
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Copy Format</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleCopy('markdown')}>
                <FileText className="h-4 w-4 mr-2" />
                Markdown
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCopy('html')}>
                <FileCode className="h-4 w-4 mr-2" />
                HTML
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCopy('plaintext')}>
                <Edit3 className="h-4 w-4 mr-2" />
                Plain Text
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCopy('wordpress')}>
                <Globe className="h-4 w-4 mr-2" />
                WordPress HTML
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Export Format</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleExport('markdown')}>
                <FileText className="h-4 w-4 mr-2" />
                Markdown (.md)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('html')}>
                <FileCode className="h-4 w-4 mr-2" />
                Basic HTML
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('styled-html')}>
                <Eye className="h-4 w-4 mr-2" />
                Styled HTML (Beautiful)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('wordpress')}>
                <Globe className="h-4 w-4 mr-2" />
                WordPress Import
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('plaintext')}>
                <Edit3 className="h-4 w-4 mr-2" />
                Plain Text (.txt)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="website" className="flex items-center gap-1">
            <Globe className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Website</span>
          </TabsTrigger>
          <TabsTrigger value="richtext" className="flex items-center gap-1">
            <Edit3 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Editor</span>
          </TabsTrigger>
          <TabsTrigger value="markdown" className="flex items-center gap-1">
            <FileText className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Markdown</span>
          </TabsTrigger>
          <TabsTrigger value="html" className="flex items-center gap-1">
            <FileCode className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">HTML</span>
          </TabsTrigger>
          <TabsTrigger value="plaintext" className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Plain</span>
          </TabsTrigger>
        </TabsList>

        {/* Website Preview - SEO Optimized View */}
        <TabsContent value="website" className="mt-4">
          <div className="border rounded-lg overflow-hidden bg-white">
            {/* Browser Chrome */}
            <div className="bg-muted border-b px-4 py-2 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 bg-background rounded px-3 py-1 text-xs text-muted-foreground truncate">
                https://yoursite.com/article/{articleTitle.toLowerCase().replace(/\s+/g, '-')}
              </div>
            </div>
            
            {/* Article Content - SEO Formatted */}
            <div className="p-6 md:p-8 lg:p-12 max-w-4xl mx-auto">
              <article 
                className="prose prose-lg max-w-none
                  prose-headings:font-bold prose-headings:tracking-tight
                  prose-h1:text-3xl prose-h1:md:text-4xl prose-h1:mb-6 prose-h1:text-foreground
                  prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:text-foreground
                  prose-h3:text-xl prose-h3:md:text-2xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-foreground
                  prose-h4:text-lg prose-h4:md:text-xl prose-h4:mt-6 prose-h4:mb-2 prose-h4:text-foreground
                  prose-p:text-base prose-p:leading-relaxed prose-p:mb-4 prose-p:text-foreground/90
                  prose-ul:my-4 prose-ul:pl-6 prose-li:my-1
                  prose-ol:my-4 prose-ol:pl-6
                  prose-table:border-collapse prose-table:w-full prose-table:my-6
                  prose-th:bg-muted prose-th:p-3 prose-th:text-left prose-th:font-semibold prose-th:border
                  prose-td:p-3 prose-td:border
                  prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                  prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:bg-muted/30 prose-blockquote:py-2
                  prose-img:rounded-lg prose-img:shadow-md prose-img:my-6
                  prose-strong:text-foreground prose-strong:font-semibold
                  dark:prose-invert
                "
                dangerouslySetInnerHTML={{ 
                  __html: DOMPurify.sanitize(htmlContent, {
                    ADD_ATTR: ['target', 'rel'],
                  }) 
                }}
              />
            </div>
          </div>
        </TabsContent>

        {/* Rich Text Editor */}
        <TabsContent value="richtext" className="mt-4">
          <ArticleEditor 
            content={htmlContent} 
            onChange={handleRichTextChange}
            placeholder="Edit your article content..."
          />
        </TabsContent>

        {/* Markdown View */}
        <TabsContent value="markdown" className="mt-4">
          <Textarea
            value={markdownContent}
            onChange={(e) => handleMarkdownChange(e.target.value)}
            className="min-h-[500px] font-mono text-sm"
            placeholder="# Your Markdown Content"
          />
        </TabsContent>

        {/* HTML View */}
        <TabsContent value="html" className="mt-4">
          <Textarea
            value={htmlContent}
            readOnly
            className="min-h-[500px] font-mono text-sm bg-muted"
            placeholder="<h1>Generated HTML</h1>"
          />
        </TabsContent>

        {/* Plain Text View */}
        <TabsContent value="plaintext" className="mt-4">
          <Textarea
            value={plainTextContent}
            readOnly
            className="min-h-[500px] font-mono text-sm bg-muted"
            placeholder="Your plain text content will appear here..."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
