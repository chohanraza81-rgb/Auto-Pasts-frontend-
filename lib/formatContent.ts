export function autoFormatContent(text: string): string {
  if (!text) return '';
  if (/<[a-z][\s\S]*>/i.test(text)) return text; // already HTML

  const blocks = text.split(/\n\s*\n/);
  let html = '';

  blocks.forEach(block => {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return;

    const blockText = lines.join(' ');
    // Heading detection
    if (
      blockText.length < 80 &&
      (blockText === blockText.toUpperCase() || /^(FAQ|Q:|Method \d|Rule of Thumb|Final Verdict|Where I Buy Parts|The Real Cost|RockAuto vs|Step-by-Step|PART \d|FINAL WORD)/i.test(blockText))
    ) {
      html += `<h2>${blockText}</h2>`;
      return;
    }

    if (lines.length > 1 && /^\d+\.\s+.+/.test(lines[0]) && lines[0].length < 80) {
      html += `<h3>${lines[0]}</h3>`;
      lines.shift();
    }

    const content = lines.join('<br>');
    if (content.includes('<br>- ') || content.includes('<br>* ')) {
      const items = content.split('<br>').filter(item => item.trim().startsWith('-') || item.trim().startsWith('*'));
      const listItems = items.map(item => `<li>${item.replace(/^[-*]\s*/, '')}</li>`).join('');
      html += `<ul>${listItems}</ul>`;
    } else {
      html += `<p>${content}</p>`;
    }
  });

  return html;
}
