import React from 'react';

const DIET_OPTIONS = [
    { value: 'all', label: 'Todo' },
    { value: 'vegan', label: 'Vegano 🌱' },
    { value: 'keto', label: 'Keto 🥑' },
];

export default function Header({ diet, setDiet, panicMode }) {
    return (
        <header className={`sticky top-0 z-40 w-full border-b transition-all duration-600 ${panicMode ? 'bg-gray-950 border-red-900/40' : 'bg-white/80 border-green-100 backdrop-blur-md'
            }`}>
            <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
                {/* Logo */}
                <div className="flex items-center gap-2 select-none">
                    <span className="text-2xl" role="img" aria-label="fridge">🧊</span>
                    <div>
                        <h1 className={`text-xl leading-none tracking-tight transition-colors duration-600 ${panicMode ? 'text-red-400' : 'text-green-800'
                            }`} style={{ fontWeight: 800 }}>Fridge Rescue</h1>
                        <p className={`text-xs leading-none mt-0.5 transition-colors duration-600 ${panicMode ? 'text-red-600' : 'text-green-500'
                            }`}>v2.0</p>
                    </div>
                </div>
                {/* Diet Selector */}
                <nav className="flex gap-1 bg-gray-100/80 rounded-full p-1" aria-label="Filtro de dieta">
                    {DIET_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => setDiet(opt.value)}
                            aria-pressed={diet === opt.value}
                            className={`px-3 py-1.5 rounded-full text-sm transition-all duration-200 whitespace-nowrap cursor-pointer ${diet === opt.value
                                    ? panicMode ? 'bg-red-600 text-white shadow-sm' : 'bg-green-700 text-white shadow-sm'
                                    : panicMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-800'
                                }`}
                            style={{ fontWeight: 500 }}
                        >{opt.label}</button>
                    ))}
                </nav>
            </div>
        </header>
    );
}
