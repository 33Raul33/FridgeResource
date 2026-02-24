import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import TagInput from './components/TagInput';
import PanicButton from './components/PanicButton';
import SkeletonLoader from './components/SkeletonLoader';
import RecipeCard from './components/RecipeCard';
import Toast from './components/Toast';
import { generateRecipes } from './api/recipeApi';

const LS_KEY = 'fridgerescue_ingredients';

export default function App() {
    // Restore ingredients from localStorage on first render
    const [ingredients, setIngredients] = useState(() => {
        try {
            const saved = localStorage.getItem(LS_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const [diet, setDiet] = useState('all');
    const [panicMode, setPanicMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [recipes, setRecipes] = useState(null);
    const [error, setError] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [toast, setToast] = useState(null);

    // Persist ingredients to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem(LS_KEY, JSON.stringify(ingredients));
        } catch { }
    }, [ingredients]);

    // Auto-dismiss toast after 4 seconds
    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), 4000);
        return () => clearTimeout(t);
    }, [toast]);

    const showToast = (message, type = 'success') => setToast({ message, type });

    const handleGenerateRecipes = useCallback(async () => {
        if (ingredients.length < 2) {
            setError('¡Añade algo más para que el chef haga magia! Necesita al menos 2 ingredientes. 🪄');
            return;
        }
        setError(null);
        setLoading(true);
        setRecipes(null);
        setHasSearched(true);

        try {
            const result = await generateRecipes(ingredients, diet, panicMode);
            setRecipes(result);
            showToast(
                panicMode
                    ? `⚡ ${result.length} recetas express listas. ¡A cocinar!`
                    : `🎉 ¡${result.length} recetas rescatadas de tu nevera!`,
                'success'
            );
        } catch (err) {
            // Friendly error message as specified
            const friendlyMsg = '¡Vaya! El chef se ha tomado un descanso. Inténtalo de nuevo.';
            setError(`${friendlyMsg}${err.message ? ` (${err.message})` : ''}`);
            showToast(`😵 ${friendlyMsg}`, 'error');
        } finally {
            setLoading(false);
        }
    }, [ingredients, diet, panicMode]);

    // Clear all ingredients (Limpiar todo)
    const handleClearAll = () => {
        setIngredients([]);
        setRecipes(null);
        setError(null);
        setHasSearched(false);
        showToast('🧹 Lista de ingredientes limpiada.', 'success');
    };

    const handleReset = () => {
        setRecipes(null);
        setError(null);
        setHasSearched(false);
        setPanicMode(false);
    };

    return (
        <div className={`min-h-screen transition-colors duration-600 panic-bg ${panicMode ? 'bg-gray-950' : 'bg-[#fafaf7]'}`}>
            <Header diet={diet} setDiet={setDiet} panicMode={panicMode} />
            {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}

            <main className="max-w-3xl mx-auto px-4 py-8 pb-24">

                {/* ── Hero ── */}
                <section className="text-center mb-10">
                    {!panicMode && (
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-4 bg-green-100 text-green-700"
                            style={{ fontWeight: 500 }}>
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            Chef Michelin · Powered by Gemini 2.0 Flash Lite
                        </div>
                    )}
                    <h2 className={`text-4xl md:text-5xl leading-tight mb-3 transition-colors duration-600 ${panicMode ? 'text-red-400' : 'text-gray-900'
                        }`} style={{ fontWeight: 800 }}>
                        {panicMode ? '🚨 Modo Urgencia' : '¿Qué hay en tu nevera?'}
                    </h2>
                    <p className={`text-base md:text-lg max-w-md mx-auto transition-colors duration-600 ${panicMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                        {panicMode
                            ? 'Recetas ultrarrápidas para cuando el tiempo es lo que menos tienes.'
                            : 'Cuéntanos qué tienes y te decimos qué cocinar. Sin desperdicio, con estilo.'}
                    </p>
                </section>

                {/* ── Input card ── */}
                <section className={`rounded-3xl border p-5 md:p-7 mb-6 shadow-sm transition-colors duration-600 ${panicMode
                    ? 'bg-gray-900 border-red-900/30 shadow-red-950/50'
                    : 'bg-white border-gray-100 shadow-gray-100'
                    }`} aria-label="Añadir ingredientes">

                    {/* Label row with ingredient count + Limpiar todo */}
                    <div className="flex items-center justify-between mb-3 gap-2">
                        <label className={`block text-sm transition-colors duration-600 ${panicMode ? 'text-gray-300' : 'text-gray-700'
                            }`} style={{ fontWeight: 600 }}>
                            {panicMode ? '⚡ ¿Qué tienes a mano?' : '🧾 Mis ingredientes'}
                        </label>
                        <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-0.5 rounded-full transition-colors duration-200 ${ingredients.length >= 2
                                ? panicMode ? 'bg-red-900/40 text-red-400' : 'bg-green-100 text-green-700'
                                : panicMode ? 'bg-gray-800 text-gray-500' : 'bg-gray-100 text-gray-400'
                                }`}>
                                {ingredients.length} {ingredients.length === 1 ? 'ingrediente' : 'ingredientes'}
                                {ingredients.length < 2 && ' (mín. 2)'}
                            </span>
                            {ingredients.length > 0 && (
                                <button
                                    id="clear-all-btn"
                                    onClick={handleClearAll}
                                    className={`text-xs px-2.5 py-1 rounded-full border cursor-pointer transition-all duration-200 hover:scale-105 ${panicMode
                                        ? 'border-gray-700 text-gray-500 hover:border-red-700 hover:text-red-400'
                                        : 'border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500'
                                        }`}
                                    aria-label="Limpiar todos los ingredientes"
                                >
                                    🧹 Limpiar todo
                                </button>
                            )}
                        </div>
                    </div>

                    <TagInput ingredients={ingredients} setIngredients={setIngredients} panicMode={panicMode} />

                    {error && (
                        <div className={`mt-4 flex items-start gap-2 text-sm rounded-xl px-4 py-3 border ${panicMode
                            ? 'text-red-300 bg-red-950/40 border-red-900/40'
                            : 'text-red-600 bg-red-50 border-red-100'
                            }`}>
                            <span className="flex-shrink-0">⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Main CTA button */}
                    <button
                        onClick={handleGenerateRecipes}
                        disabled={loading}
                        aria-busy={loading}
                        id="rescue-btn"
                        aria-label="Generar recetas con mis ingredientes"
                        className={`mt-5 w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl text-base text-white transition-all duration-200 cursor-pointer
              disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] select-none shadow-lg ${panicMode
                                ? 'bg-gradient-to-r from-red-700 to-orange-700 hover:from-red-600 hover:to-orange-600 shadow-red-950/50'
                                : 'bg-gradient-to-r from-emerald-700 to-green-600 hover:from-emerald-800 hover:to-green-700 shadow-green-800/20'
                            }`}
                        style={{ fontWeight: 700 }}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                                El chef está cocinando tu respuesta...
                            </>
                        ) : (
                            <><span>🧑‍🍳</span><span>Rescatar mi nevera</span></>
                        )}
                    </button>
                </section>

                {/* ── Panic Button ── */}
                <section className="mb-8" aria-label="Modo urgencia">
                    <PanicButton panicMode={panicMode} setPanicMode={setPanicMode} />
                </section>

                {/* ── Results ── */}
                {(loading || recipes) && (
                    <section aria-label="Recetas generadas" aria-live="polite">
                        {recipes && !loading && (
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <h2 className={`text-xl transition-colors duration-600 ${panicMode ? 'text-gray-100' : 'text-gray-900'
                                        }`} style={{ fontWeight: 700 }}>
                                        {panicMode ? '⚡ Recetas express' : '🍽️ Tus recetas'}
                                    </h2>
                                    <p className={`text-sm transition-colors duration-600 ${panicMode ? 'text-gray-500' : 'text-gray-400'
                                        }`}>
                                        {recipes.length} receta{recipes.length !== 1 ? 's' : ''} generada{recipes.length !== 1 ? 's' : ''} por IA
                                    </p>
                                </div>
                                <button
                                    onClick={handleReset}
                                    className={`text-sm px-4 py-2 rounded-xl border cursor-pointer transition-all duration-200 hover:scale-105 ${panicMode
                                        ? 'border-gray-700 text-gray-400 hover:border-red-700 hover:text-red-400'
                                        : 'border-gray-200 text-gray-500 hover:border-green-400 hover:text-green-700'
                                        }`}
                                >↩ Volver a empezar</button>
                            </div>
                        )}
                        {loading
                            ? <SkeletonLoader panicMode={panicMode} />
                            : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {recipes.map((recipe, i) => (
                                        <RecipeCard
                                            key={recipe.titulo ?? recipe.name ?? i}
                                            recipe={recipe}
                                            index={i}
                                            panicMode={panicMode}
                                        />
                                    ))}
                                </div>
                            )
                        }
                    </section>
                )}

                {/* ── Empty state ── */}
                {!hasSearched && !loading && (
                    <section className="text-center py-12">
                        <div className="text-6xl mb-4">🥗</div>
                        <p className={`text-sm transition-colors duration-600 ${panicMode ? 'text-gray-600' : 'text-gray-400'
                            }`}>
                            Añade <strong>al menos 2 ingredientes</strong> y pulsa <strong>Rescatar mi nevera</strong>
                            {ingredients.length > 0 && (
                                <span className={`block mt-2 text-xs ${panicMode ? 'text-gray-700' : 'text-gray-400'}`}>
                                    💾 Tus {ingredients.length} ingrediente{ingredients.length !== 1 ? 's' : ''} están guardados
                                </span>
                            )}
                        </p>
                    </section>
                )}
            </main>

            <footer className={`text-center py-6 text-xs transition-colors duration-600 ${panicMode ? 'text-gray-700' : 'text-gray-400'
                }`}>
                Fridge Rescue v2.0 · Chef Michelin IA · Cocina inteligente
            </footer>
        </div>
    );
}
