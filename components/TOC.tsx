import { useMemo } from 'react';

export default function TOC({ content }: { content: string }) {
  const headings = useMemo(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const h2s = Array.from(doc.querySelectorAll('h2'));
    return h2s.map((h2, index) => ({
      id: `heading-${index}`,
      text: h2.textContent || ''
    }));
  }, [content]);

  if (headings.length === 0) return null;

  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-6">
      <h2 className="font-semibold text-lg mb-2">Table of Contents</h2>
      <ul className="space-y-1">
        {headings.map(h => (
          <li key={h.id}>
            <a href={`#${h.id}`} className="text-primary hover:underline">{h.text}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
