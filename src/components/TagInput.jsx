import React, { useState, useRef, useEffect, useId } from 'react';

const QUICK_INGREDIENTS = [
    { emoji: '🥚', label: 'Huevo' },
    { emoji: '🧅', label: 'Cebolla' },
    { emoji: '🥔', label: 'Patata' },
    { emoji: '🍚', label: 'Arroz' },
    { emoji: '🍗', label: 'Pollo' },
    { emoji: '🍅', label: 'Tomate' },
    { emoji: '🧄', label: 'Ajo' },
    { emoji: '🧀', label: 'Queso' },
];

function Tag({ label, onRemove, panicMode }) {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 10);
        return () => clearTimeout(t);
    }, []);

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm cursor-default select-none
      ${panicMode ? 'bg-red-900/60 text-red-200 border border-red-700/50' : 'bg-green-100 text-green-800 border border-green-200'}
      ${visible ? 'tag-enter' : 'opacity-0 scale-50'}`} style={{ fontWeight: 500 }}>
            {label}
            <button onClick={onRemove} aria-label={`Eliminar ${label}`}
                className={`w-4 h-4 flex items-center justify-center rounded-full text-xs leading-none transition-colors cursor-pointer ${panicMode ? 'hover:bg-red-700 text-red-400 hover:text-white' : 'hover:bg-green-300 text-green-500 hover:text-green-900'
                    }`} style={{ fontWeight: 700 }}>×</button>
        </span>
    );
}

export default function TagInput({ ingredients, setIngredients, panicMode }) {
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef(null);
    const inputId = useId();

    const addIngredient = (value) => {
        const trimmed = value.trim();
        if (!trimmed) return;
        const cap = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
        if (!ingredients.includes(cap)) setIngredients(prev => [...prev, cap]);
        setInputValue('');
    };

    const removeIngredient = (label) =>
        setIngredients(prev => prev.filter(i => i !== label));

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addIngredient(inputValue); }
        if (e.key === 'Backspace' && inputValue === '' && ingredients.length > 0)
            removeIngredient(ingredients[ingredients.length - 1]);
    };

    const handleQuickAdd = (label) => {
        if (!ingredients.includes(label)) setIngredients(prev => [...prev, label]);
        inputRef.current?.focus();
    };

    return (
        <div className="w-full">
            {/* Tag area */}
            <div
                className={`min-h-16 w-full rounded-2xl border-2 p-3 flex flex-wrap gap-2 items-center cursor-text transition-all duration-600 ${panicMode
                        ? 'bg-gray-900 border-red-800/60 focus-within:border-red-600'
                        : 'bg-white border-green-200 focus-within:border-green-500'
                    }`}
                onClick={() => inputRef.current?.focus()}
                role="group"
                aria-label="Área de ingredientes"
            >
                {ingredients.map(ing => (
                    <Tag key={ing} label={ing} onRemove={() => removeIngredient(ing)} panicMode={panicMode} />
                ))}
                <input
                    id={inputId}
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={() => { if (inputValue) addIngredient(inputValue); }}
                    placeholder={ingredients.length === 0 ? 'Escribe un ingrediente y pulsa Enter...' : 'Añade más...'}
                    className={`ingredient-input flex-1 min-w-32 bg-transparent text-sm outline-none transition-colors duration-600 placeholder:opacity-50 ${panicMode ? 'text-gray-200 placeholder:text-gray-500' : 'text-gray-700 placeholder:text-gray-400'
                        }`}
                    aria-label="Añadir ingrediente"
                />
            </div>

            {/* Hint */}
            <p className={`text-xs mt-1.5 ml-1 transition-colors duration-600 ${panicMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Pulsa <kbd className={`px-1 rounded text-xs ${panicMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>Enter</kbd> o{' '}
                <kbd className={`px-1 rounded text-xs ${panicMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>,</kbd> para añadir ·{' '}
                <kbd className={`px-1 rounded text-xs ${panicMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>⌫</kbd> para eliminar el último
            </p>

            {/* Quick add pantry grid */}
            <div className="mt-4">
                <p className={`text-xs uppercase tracking-widest mb-2 transition-colors duration-600 ${panicMode ? 'text-gray-500' : 'text-gray-400'
                    }`} style={{ fontWeight: 500 }}>Despensa rápida</p>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {QUICK_INGREDIENTS.map(({ emoji, label }) => {
                        const added = ingredients.includes(label);
                        return (
                            <button
                                key={label}
                                onClick={() => handleQuickAdd(label)}
                                disabled={added}
                                aria-pressed={added}
                                title={label}
                                className={`quick-btn flex flex-col items-center gap-1 p-2.5 rounded-xl text-xs border transition-all duration-200 cursor-pointer disabled:cursor-default ${added
                                        ? panicMode
                                            ? 'bg-red-900/40 border-red-800/40 text-red-400 opacity-50'
                                            : 'bg-green-100 border-green-300 text-green-700 opacity-60'
                                        : panicMode
                                            ? 'bg-gray-800 border-gray-700 text-gray-300 hover:border-red-600 hover:bg-gray-700'
                                            : 'bg-white border-gray-200 text-gray-600 hover:border-green-400 hover:bg-green-50'
                                    }`}
                                style={{ fontWeight: 500 }}
                            >
                                <span className="text-xl">{emoji}</span>
                                <span className="leading-none">{added ? '✓' : label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
