import { useState } from 'react';

export default function TagInput({ tags, onChange }) {
  const [input, setInput] = useState('');

  const add = () => {
    const t = input.trim();
    if (!t || tags.includes(t) || tags.length >= 8) return;
    onChange([...tags, t]);
    setInput('');
  };

  const remove = (tag) => {
    onChange(tags.filter(t => t !== tag));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); add(); }
  };

  return (
    <div>
      <div className="tag-row">
        <input
          className="form-input tag-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入标签，按 Enter 添加"
          maxLength={12}
        />
        <button type="button" className="tag-add" onClick={add}>添加</button>
      </div>
      {tags.length > 0 && (
        <div className="tag-chips">
          {tags.map(t => (
            <span key={t} className="tag-chip">{t}
              <button type="button" className="tag-chip-del" onClick={() => remove(t)}>×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
