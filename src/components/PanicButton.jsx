import React from 'react';

export default function PanicButton({ panicMode, setPanicMode }) {
    return (
        <div className="w-full flex flex-col items-center gap-3">
            {panicMode && (
                <div className="flex items-center gap-2 px-4 py-2 bg-red-950/60 border border-red-800/50 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs text-red-300" style={{ fontWeight: 500 }}>Modo urgencia activo — solo recetas &lt;10 min</span>
                </div>
            )}
            <div className="relative">
                {panicMode && (
                    <>
                        <span className="absolute inset-0 rounded-2xl bg-red-500/30 animate-ping" />
                        <span className="absolute inset-0 rounded-2xl bg-red-500/20 animate-ping" style={{ animationDelay: '0.3s' }} />
                    </>
                )}
                <button
                    onClick={() => setPanicMode(!panicMode)}
                    className={`relative z-10 flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-base text-white shadow-lg transition-all duration-300 cursor-pointer active:scale-95 float-bounce ${panicMode
                            ? 'bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 shadow-red-900/50'
                            : 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 shadow-orange-400/30'
                        }`}
                    style={{ fontWeight: 700 }}
                    aria-pressed={panicMode}
                    aria-label={panicMode ? 'Desactivar modo urgencia' : 'Activar modo urgencia: recetas en menos de 10 minutos'}
                >
                    <span className="text-lg">⚡</span>
                    <span>{panicMode ? '✓ En modo urgencia' : '¡SOCORRO! (Recetas < 10 min)'}</span>
                </button>
            </div>
            {!panicMode && <p className="text-xs text-gray-400 text-center">¿Sin tiempo? Actívalo para recetas ultrarrápidas</p>}
        </div>
    );
}
