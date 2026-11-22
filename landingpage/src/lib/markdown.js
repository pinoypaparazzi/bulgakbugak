/* Converts article Markdown to HTML. Article content is written by the
   site owner only. When the Admin Panel exists, sanitize HTML on the
   server before saving (see docs/BACKEND-PLAN.md). */
import { marked } from 'marked';

marked.use({ gfm: true, breaks: false });

export function markdownToHtml(md = '') {
  return marked.parse(md);
}
