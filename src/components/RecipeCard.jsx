import React, { useState } from 'react';

const DIFFICULTY_COLORS = {
    'Fácil': { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    'Media': { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
    'Difícil': { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
};

export default function RecipeCard({ recipe, index, panicMode }) {
    const [stepsExpanded, setStepsExpanded] = useState(false);

    // Support both old schema (name/steps/bonus) and new schema (titulo/instrucciones/consejo_chef)
    const title = recipe.titulo ?? recipe.name;
    const description = recipe.descripcion ?? recipe.description;
    const emoji = recipe.emoji ?? '🍽️';
    const timeLabel = recipe.tiempo_minutos != null
        ? `${recipe.tiempo_minutos} min`
        : (recipe.time ?? '—');
    const difficulty = recipe.dificultad ?? recipe.difficulty ?? 'Fácil';
    const steps = recipe.instrucciones ?? recipe.steps ?? [];
    const bonus = recipe.consejo_chef ?? recipe.bonus;
    const diet = recipe.dieta ?? recipe.diet;

    const diff = DIFFICULTY_COLORS[difficulty] || DIFFICULTY_COLORS['Fácil'];
    const visibleSteps = stepsExpanded ? steps : steps.slice(0, 3);

    return (
        <article
            className={`recipe-card card-enter rounded-2xl border overflow-hidden transition-colors duration-600 ${panicMode ? 'bg-gray-900 border-red-900/30' : 'bg-white border-gray-100'
                }`}
            style={{ animationDelay: `${index * 120}ms`, animationFillMode: 'both', opacity: 0 }}
            aria-label={`Receta: ${title}`}
        >
            {/* Top color stripe */}
            <div className={`h-1.5 w-full transition-colors duration-600 ${panicMode
                    ? 'bg-gradient-to-r from-red-600 via-orange-500 to-red-700'
                    : 'bg-gradient-to-r from-green-500 via-emerald-400 to-green-600'
                }`} />

            <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                        <h2 className={`text-lg leading-tight mb-1 transition-colors duration-600 ${panicMode ? 'text-gray-100' : 'text-gray-900'
                            }`} style={{ fontWeight: 700 }}>{title}</h2>
                        {description && (
                            <p className={`text-sm transition-colors duration-600 ${panicMode ? 'text-gray-400' : 'text-gray-500'
                                }`}>{description}</p>
                        )}
                    </div>
                    <span className="text-3xl flex-shrink-0 mt-0.5">{emoji}</span>
                </div>

                {/* Meta pills */}
                <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs transition-colors duration-600 ${panicMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'
                        }`} style={{ fontWeight: 500 }}>⏱️ {timeLabel}</span>

                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${diff.bg} ${diff.text}`}
                        style={{ fontWeight: 500 }}>
                        <span className={`w-1.5 h-1.5 rounded-full ${diff.dot}`} />{difficulty}
                    </span>

                    {diet && (
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs transition-colors duration-600 ${panicMode ? 'bg-red-950/60 text-red-300' : 'bg-green-50 text-green-700'
                            }`} style={{ fontWeight: 500 }}>{diet}</span>
                    )}
                </div>

                {/* Steps */}
                <div className="mb-4">
                    <h3 className={`text-xs uppercase tracking-widest mb-2 transition-colors duration-600 ${panicMode ? 'text-gray-500' : 'text-gray-400'
                        }`} style={{ fontWeight: 600 }}>Preparación</h3>
                    <ol className="space-y-2">
                        {visibleSteps.map((step, i) => (
                            <li key={i} className="flex gap-3 items-start">
                                <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs mt-0.5 transition-colors duration-600 ${panicMode ? 'bg-red-900/60 text-red-300' : 'bg-green-100 text-green-700'
                                    }`} style={{ fontWeight: 700 }}>{i + 1}</span>
                                <span className={`text-sm leading-relaxed transition-colors duration-600 ${panicMode ? 'text-gray-300' : 'text-gray-600'
                                    }`}>{step}</span>
                            </li>
                        ))}
                    </ol>
                    {steps.length > 3 && (
                        <button onClick={() => setStepsExpanded(!stepsExpanded)}
                            className={`mt-2 ml-8 text-xs underline underline-offset-2 cursor-pointer transition-colors ${panicMode ? 'text-red-400 hover:text-red-300' : 'text-green-600 hover:text-green-800'
                                }`} style={{ fontWeight: 500 }}>
                            {stepsExpanded ? '▲ Ver menos' : `▼ Ver ${steps.length - 3} pasos más`}
                        </button>
                    )}
                </div>

                <div className={`h-px mb-4 transition-colors duration-600 ${panicMode ? 'bg-gray-800' : 'bg-gray-100'}`} />

                {/* Consejo del Chef / Bonus */}
                {bonus && (
                    <div className={`rounded-xl p-3 flex gap-3 items-start transition-colors duration-600 ${panicMode ? 'bg-amber-950/40 border border-amber-900/40' : 'bg-orange-50 border border-orange-100'
                        }`}>
                        <span className="text-xl flex-shrink-0">👨‍🍳</span>
                        <div>
                            <p className={`text-xs uppercase tracking-wide mb-0.5 transition-colors duration-600 ${panicMode ? 'text-amber-400' : 'text-orange-600'
                                }`} style={{ fontWeight: 600 }}>Consejo del chef</p>
                            <p className={`text-sm transition-colors duration-600 ${panicMode ? 'text-amber-200' : 'text-orange-800'
                                }`}>{bonus}</p>
                        </div>
                    </div>
                )}
            </div>
        </article>
    );
}
