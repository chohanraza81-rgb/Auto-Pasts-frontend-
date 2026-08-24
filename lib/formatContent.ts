export function autoFormatContent(text: string): string {
  if (!text) return '';
  if (/<[a-z][\s\S]*>/i.test(text)) return text; // already HTML

  // Pre-process: add newlines before common patterns
  let processed = text
    .replace(/(\d+\.\s+[A-Z][^\n]{2,80})/g, '\n\n$1')
    .replace(/(?:\n|^)([A-Z][A-Z\s]{2,80})(?:\n|$)/g, '\n\n$1\n')
    .replace(/(Q:\s*[^\n]+)/g, '\n\n$1')
    .replace(/(Method\s+\d+[^\n]*)/g, '\n\n$1')
    .replace(/(PART\s+\d+[^\n]*)/g, '\n\n$1')
    .replace(/(FINAL\s+WORD[^\n]*)/g, '\n\n$1')
    .replace(/(Rule\s+of\s+Thumb[^\n]*)/g, '\n\n$1')
    .replace(/(Where\s+I\s+Buy\s+Parts[^\n]*)/g, '\n\n$1')
    .replace(/(Last\s+Updated[^\n]*)/g, '\n\n$1');

  const blocks = processed.split(/\n\s*\n/);
  let html = '';

  blocks.forEach(block => {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return;

    const blockText = lines.join(' ');

    // Heading detection
    const isHeading =
      blockText.length < 80 &&
      (
        blockText === blockText.toUpperCase() ||
        /^(FAQ|Q:|Method \d|Rule of Thumb|Final Verdict|Where I Buy Parts|The Real Cost|RockAuto vs|Step-by-Step|PART \d|FINAL WORD|\d+\.)/i.test(blockText)
      );

    if (isHeading) {
      html += `<h2>${blockText}</h2>`;
      return;
    }

    if (lines.length > 1 && /^\d+\.\s+.+/.test(lines[0]) && lines[0].length < 80) {
      html += `<h3>${lines[0]}</h3>`;
      lines.shift();
    }

    // Detect bullet list (all lines start with - or *)
    if (lines.every(line => /^[-*]\s+/.test(line))) {
      const listItems = lines.map(line => `<li>${line.replace(/^[-*]\s*/, '')}</li>`).join('');
      html += `<ul>${listItems}</ul>`;
    }
    // Detect numbered list (lines start with digit followed by . or ))
    else if (lines.every(line => /^\d+[.)]\s+/.test(line))) {
      const listItems = lines.map(line => `<li>${line.replace(/^\d+[.)]\s*/, '')}</li>`).join('');
      html += `<ol>${listItems}</ol>`;
    }
    else {
      const content = lines.join('<br>');
      html += `<p>${content}</p>`;
    }
  });

  return html;
}
