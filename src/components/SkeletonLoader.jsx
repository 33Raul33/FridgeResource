import React from 'react';

export default function SkeletonLoader({ panicMode }) {
    const sh = panicMode ? 'shimmer-panic' : 'shimmer';

    const Card = ({ delay = 0 }) => (
        <div className={`rounded-2xl p-5 border transition-colors duration-600 ${panicMode ? 'bg-gray-900 border-red-900/30' : 'bg-white border-gray-100'}`}
            style={{ animationDelay: `${delay}ms` }}>
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className={`h-6 rounded-lg mb-2 w-3/4 ${sh}`} />
                    <div className={`h-4 rounded-md w-1/2 ${sh}`} />
                </div>
                <div className={`w-12 h-12 rounded-xl ml-3 ${sh}`} />
            </div>
            <div className="flex gap-2 mb-4">
                <div className={`h-6 w-16 rounded-full ${sh}`} />
                <div className={`h-6 w-20 rounded-full ${sh}`} />
                <div className={`h-6 w-14 rounded-full ${sh}`} />
            </div>
            <div className="space-y-2">
                {[90, 75, 85, 60, 70].map((w, i) => (
                    <div key={i} className="flex gap-3 items-center">
                        <div className={`w-5 h-5 rounded-full flex-shrink-0 ${sh}`} />
                        <div className={`h-4 rounded-md flex-1 ${sh}`} style={{ maxWidth: `${w}%` }} />
                    </div>
                ))}
            </div>
            <div className={`mt-4 h-14 rounded-xl ${sh}`} />
        </div>
    );

    return (
        <div className="w-full">
            <div className={`flex items-center gap-3 mb-6 p-4 rounded-2xl border transition-colors duration-600 ${panicMode ? 'bg-red-950/40 border-red-900/50' : 'bg-green-50 border-green-100'
                }`}>
                <span className="text-3xl animate-bounce">👨‍🍳</span>
                <div>
                    <p className={`text-sm transition-colors duration-600 ${panicMode ? 'text-red-300' : 'text-green-800'}`} style={{ fontWeight: 600 }}>
                        {panicMode ? '¡Modo urgencia activado!' : 'El chef está pensando...'}
                    </p>
                    <p className={`text-xs transition-colors duration-600 ${panicMode ? 'text-red-500' : 'text-green-500'}`}>
                        {panicMode ? 'Buscando recetas de menos de 10 minutos 🚨' : 'Combinando ingredientes mágicamente 🪄'}
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card delay={0} /><Card delay={150} /><Card delay={300} />
            </div>
        </div>
    );
}
