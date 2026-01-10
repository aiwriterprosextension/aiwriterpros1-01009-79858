/**
 * Export format utilities for generating various article output formats
 * Includes styled HTML, WordPress-compatible HTML, and plain text
 */

/**
 * Generates beautifully styled HTML with embedded CSS
 * Following Google's SEO best practices
 */
export function generateStyledHtml(htmlContent: string, title: string): string {
  const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="index, follow">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${extractMetaDescription(htmlContent)}">
  <link rel="canonical" href="https://yoursite.com/articles/${slug}">
  
  <!-- Open Graph / Social Media -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${extractMetaDescription(htmlContent)}">
  
  <!-- Schema.org Article Markup -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "${escapeHtml(title)}",
    "description": "${extractMetaDescription(htmlContent)}",
    "author": {
      "@type": "Organization",
      "name": "Your Site Name"
    },
    "datePublished": "${new Date().toISOString()}"
  }
  </script>
  
  <style>
    /* CSS Reset & Base */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    :root {
      --primary: #2563eb;
      --primary-dark: #1d4ed8;
      --secondary: #10b981;
      --text: #1f2937;
      --text-light: #6b7280;
      --bg: #ffffff;
      --bg-alt: #f9fafb;
      --border: #e5e7eb;
      --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
      --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
      --radius: 8px;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      font-size: 18px;
      line-height: 1.7;
      color: var(--text);
      background: var(--bg);
      -webkit-font-smoothing: antialiased;
    }
    
    /* Layout */
    .article-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 24px 80px;
    }
    
    @media (max-width: 768px) {
      .article-container {
        padding: 24px 16px 60px;
      }
      body {
        font-size: 16px;
      }
    }
    
    /* Typography - SEO Optimized Hierarchy */
    h1 {
      font-size: 2.5em;
      font-weight: 800;
      line-height: 1.2;
      margin-bottom: 1em;
      color: var(--text);
      letter-spacing: -0.02em;
    }
    
    h2 {
      font-size: 1.875em;
      font-weight: 700;
      line-height: 1.3;
      margin-top: 2em;
      margin-bottom: 0.75em;
      padding-bottom: 0.5em;
      border-bottom: 2px solid var(--border);
      color: var(--text);
    }
    
    h3 {
      font-size: 1.5em;
      font-weight: 600;
      line-height: 1.4;
      margin-top: 1.5em;
      margin-bottom: 0.5em;
      color: var(--text);
    }
    
    h4 {
      font-size: 1.25em;
      font-weight: 600;
      line-height: 1.4;
      margin-top: 1.25em;
      margin-bottom: 0.5em;
      color: var(--text);
    }
    
    p {
      margin-bottom: 1.25em;
      color: var(--text);
    }
    
    /* Links - Affiliate Style */
    a {
      color: var(--primary);
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;
    }
    
    a:hover {
      color: var(--primary-dark);
      text-decoration: underline;
    }
    
    /* CTA Buttons */
    .cta-button, a[href*="amazon"], a[href*="amzn"] {
      display: inline-block;
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
      color: white !important;
      padding: 12px 28px;
      border-radius: 50px;
      font-weight: 600;
      font-size: 1em;
      text-decoration: none !important;
      box-shadow: var(--shadow);
      transition: transform 0.2s, box-shadow 0.2s;
      margin: 8px 0;
    }
    
    .cta-button:hover, a[href*="amazon"]:hover, a[href*="amzn"]:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }
    
    /* Lists */
    ul, ol {
      margin: 1.25em 0;
      padding-left: 1.5em;
    }
    
    li {
      margin-bottom: 0.5em;
      padding-left: 0.25em;
    }
    
    li::marker {
      color: var(--primary);
    }
    
    /* Tables - Responsive & Styled */
    .table-wrapper {
      overflow-x: auto;
      margin: 1.5em 0;
      border-radius: var(--radius);
      box-shadow: var(--shadow);
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      background: var(--bg);
    }
    
    th {
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
      color: white;
      font-weight: 600;
      padding: 14px 16px;
      text-align: left;
    }
    
    td {
      padding: 12px 16px;
      border-bottom: 1px solid var(--border);
    }
    
    tr:nth-child(even) {
      background: var(--bg-alt);
    }
    
    tr:hover {
      background: #f0f9ff;
    }
    
    /* Blockquotes */
    blockquote {
      border-left: 4px solid var(--primary);
      padding: 1em 1.5em;
      margin: 1.5em 0;
      background: var(--bg-alt);
      border-radius: 0 var(--radius) var(--radius) 0;
      font-style: italic;
      color: var(--text-light);
    }
    
    blockquote p:last-child {
      margin-bottom: 0;
    }
    
    /* Images */
    img {
      max-width: 100%;
      height: auto;
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      margin: 1.5em 0;
    }
    
    figure {
      margin: 2em 0;
    }
    
    figcaption {
      text-align: center;
      font-size: 0.9em;
      color: var(--text-light);
      margin-top: 0.75em;
    }
    
    /* Code */
    code {
      background: var(--bg-alt);
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
      font-size: 0.9em;
    }
    
    pre {
      background: #1f2937;
      color: #e5e7eb;
      padding: 1.25em;
      border-radius: var(--radius);
      overflow-x: auto;
      margin: 1.5em 0;
    }
    
    pre code {
      background: transparent;
      padding: 0;
    }
    
    /* Callout Boxes */
    .callout, .note, .tip, .warning {
      padding: 1.25em 1.5em;
      margin: 1.5em 0;
      border-radius: var(--radius);
      border-left: 4px solid;
    }
    
    .callout, .note {
      background: #eff6ff;
      border-color: var(--primary);
    }
    
    .tip {
      background: #ecfdf5;
      border-color: var(--secondary);
    }
    
    .warning {
      background: #fef3c7;
      border-color: #f59e0b;
    }
    
    /* Pros/Cons Boxes */
    .pros-cons {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5em;
      margin: 2em 0;
    }
    
    @media (max-width: 600px) {
      .pros-cons {
        grid-template-columns: 1fr;
      }
    }
    
    .pros, .cons {
      padding: 1.5em;
      border-radius: var(--radius);
    }
    
    .pros {
      background: #ecfdf5;
      border: 1px solid #10b981;
    }
    
    .cons {
      background: #fef2f2;
      border: 1px solid #ef4444;
    }
    
    .pros h4, .cons h4 {
      margin-top: 0;
      margin-bottom: 1em;
    }
    
    .pros h4 {
      color: #059669;
    }
    
    .cons h4 {
      color: #dc2626;
    }
    
    /* FAQ Section - Schema Ready */
    .faq-section {
      margin: 2.5em 0;
    }
    
    .faq-item {
      border: 1px solid var(--border);
      border-radius: var(--radius);
      margin-bottom: 1em;
      overflow: hidden;
    }
    
    .faq-question {
      background: var(--bg-alt);
      padding: 1em 1.5em;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .faq-answer {
      padding: 1em 1.5em;
      border-top: 1px solid var(--border);
    }
    
    /* Rating Stars */
    .rating {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      color: #fbbf24;
      font-size: 1.25em;
    }
    
    /* Progress Indicator / TOC */
    .progress-bar {
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--primary), var(--secondary));
      z-index: 1000;
      transition: width 0.1s;
    }
    
    /* Print Styles */
    @media print {
      body {
        font-size: 12pt;
      }
      .article-container {
        max-width: 100%;
        padding: 0;
      }
      a {
        color: var(--text) !important;
      }
      .cta-button {
        background: var(--bg-alt) !important;
        color: var(--text) !important;
        border: 1px solid var(--border);
      }
    }
  </style>
</head>
<body>
  <div class="progress-bar" id="progress"></div>
  <main class="article-container">
    <article itemscope itemtype="https://schema.org/Article">
      ${wrapTablesForResponsive(htmlContent)}
    </article>
  </main>
  
  <script>
    // Reading progress indicator
    window.addEventListener('scroll', () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      document.getElementById('progress').style.width = scrolled + '%';
    });
    
    // Wrap tables for mobile responsiveness
    document.querySelectorAll('table').forEach(table => {
      if (!table.parentElement.classList.contains('table-wrapper')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'table-wrapper';
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
      }
    });
    
    // Add external link attributes
    document.querySelectorAll('a[href^="http"]').forEach(link => {
      if (!link.hostname.includes(window.location.hostname)) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer sponsored');
      }
    });
  </script>
</body>
</html>`;
}

/**
 * Generates WordPress-compatible HTML for import
 * Uses WordPress Gutenberg block comments for proper parsing
 */
export function generateWordPressHtml(htmlContent: string, title: string): string {
  // Convert content to WordPress block format
  let wpContent = htmlContent;
  
  // Wrap headings in WordPress heading blocks
  wpContent = wpContent.replace(/<h1([^>]*)>(.*?)<\/h1>/gi, 
    '<!-- wp:heading {"level":1} -->\n<h1$1>$2</h1>\n<!-- /wp:heading -->');
  wpContent = wpContent.replace(/<h2([^>]*)>(.*?)<\/h2>/gi, 
    '<!-- wp:heading -->\n<h2$1>$2</h2>\n<!-- /wp:heading -->');
  wpContent = wpContent.replace(/<h3([^>]*)>(.*?)<\/h3>/gi, 
    '<!-- wp:heading {"level":3} -->\n<h3$1>$2</h3>\n<!-- /wp:heading -->');
  wpContent = wpContent.replace(/<h4([^>]*)>(.*?)<\/h4>/gi, 
    '<!-- wp:heading {"level":4} -->\n<h4$1>$2</h4>\n<!-- /wp:heading -->');
  
  // Wrap paragraphs
  wpContent = wpContent.replace(/<p([^>]*)>(.*?)<\/p>/gi, 
    '<!-- wp:paragraph -->\n<p$1>$2</p>\n<!-- /wp:paragraph -->');
  
  // Wrap lists
  wpContent = wpContent.replace(/<ul([^>]*)>([\s\S]*?)<\/ul>/gi, 
    '<!-- wp:list -->\n<ul$1>$2</ul>\n<!-- /wp:list -->');
  wpContent = wpContent.replace(/<ol([^>]*)>([\s\S]*?)<\/ol>/gi, 
    '<!-- wp:list {"ordered":true} -->\n<ol$1>$2</ol>\n<!-- /wp:list -->');
  
  // Wrap tables
  wpContent = wpContent.replace(/<table([^>]*)>([\s\S]*?)<\/table>/gi, 
    '<!-- wp:table -->\n<figure class="wp-block-table"><table$1>$2</table></figure>\n<!-- /wp:table -->');
  
  // Wrap blockquotes
  wpContent = wpContent.replace(/<blockquote([^>]*)>([\s\S]*?)<\/blockquote>/gi, 
    '<!-- wp:quote -->\n<blockquote class="wp-block-quote"$1>$2</blockquote>\n<!-- /wp:quote -->');
  
  // Wrap images
  wpContent = wpContent.replace(/<img([^>]*)>/gi, 
    '<!-- wp:image -->\n<figure class="wp-block-image"><img$1></figure>\n<!-- /wp:image -->');
  
  // Create CTA buttons for affiliate links
  wpContent = wpContent.replace(
    /<a([^>]*)(amazon|amzn)([^>]*)>(.*?)<\/a>/gi,
    '<!-- wp:buttons -->\n<div class="wp-block-buttons"><!-- wp:button {"backgroundColor":"vivid-cyan-blue"} -->\n<div class="wp-block-button"><a class="wp-block-button__link wp-element-button has-vivid-cyan-blue-background-color has-background"$1$2$3>$4</a></div>\n<!-- /wp:button --></div>\n<!-- /wp:buttons -->'
  );

  return `<!-- WordPress Import Format -->
<!-- Post Title: ${escapeHtml(title)} -->
<!-- 
  INSTRUCTIONS:
  1. In WordPress, go to Posts > Add New
  2. Switch to the Code Editor (click ⋮ menu > Code editor)
  3. Paste this entire content
  4. Switch back to Visual Editor to see formatted content
  5. Set your featured image and categories
  6. Publish!
-->

${wpContent}

<!-- 
  YOAST SEO SETTINGS (copy these to your SEO plugin):
  Title: ${escapeHtml(title)}
  Meta Description: ${extractMetaDescription(htmlContent)}
  Focus Keyword: Extract from your title
-->`;
}

/**
 * Generates plain text from HTML content
 */
export function generatePlainText(htmlContent: string): string {
  // Create a temporary element to parse HTML
  const temp = document.createElement('div');
  temp.innerHTML = htmlContent;
  
  // Get text content and clean it up
  let text = temp.textContent || temp.innerText || '';
  
  // Clean up whitespace
  text = text
    .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
    .replace(/\n\s*\n/g, '\n\n')  // Normalize paragraph breaks
    .trim();
  
  return text;
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Extract first 160 characters for meta description
 */
function extractMetaDescription(htmlContent: string): string {
  const text = generatePlainText(htmlContent);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  let description = '';
  
  for (const sentence of sentences) {
    if ((description + sentence).length <= 155) {
      description += sentence.trim() + '. ';
    } else {
      break;
    }
  }
  
  if (!description && text.length > 0) {
    description = text.substring(0, 155).trim() + '...';
  }
  
  return description.trim().replace(/"/g, '&quot;');
}

/**
 * Wrap tables in responsive container
 */
function wrapTablesForResponsive(html: string): string {
  return html.replace(
    /<table([^>]*)>([\s\S]*?)<\/table>/gi,
    '<div class="table-wrapper"><table$1>$2</table></div>'
  );
}
