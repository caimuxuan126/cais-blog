export default function CategoryFilter({ categories, active, onSelect }) {
  return (
    <div className="cat-filter">
      {categories.map(c => (
        <button
          key={c}
          className={`cat-tab ${active === c ? 'active' : ''}`}
          onClick={() => onSelect(c)}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
