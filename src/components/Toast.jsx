import React, { useEffect, useState } from 'react';

export default function Toast({ message, type = 'success', onDismiss }) {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 10);
        return () => clearTimeout(t);
    }, []);

    const ok = type === 'success';

    return (
        <div role="alert" aria-live="assertive" onClick={onDismiss}
            className={`fixed top-4 left-1/2 z-50 cursor-pointer transition-all duration-400 ${visible ? '-translate-x-1/2 translate-y-0 opacity-100' : '-translate-x-1/2 -translate-y-6 opacity-0'
                }`} style={{ maxWidth: '90vw', width: '380px' }}>
            <div className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl shadow-xl border text-sm ${ok ? 'bg-white border-green-200 text-gray-800 shadow-green-100' : 'bg-red-950 border-red-800/50 text-red-200 shadow-red-950'
                }`} style={{ fontWeight: 500 }}>
                <span className="text-lg flex-shrink-0">{ok ? '✅' : '❌'}</span>
                <span className="flex-1 leading-snug">{message}</span>
                <button aria-label="Cerrar notificación"
                    className={`flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full text-xs transition-colors cursor-pointer ${ok ? 'text-gray-400 hover:bg-gray-100 hover:text-gray-600' : 'text-red-400 hover:bg-red-900 hover:text-red-200'
                        }`}
                    onClick={e => { e.stopPropagation(); onDismiss(); }}>×</button>
            </div>
            {/* 4s Progress bar */}
            <div className={`mt-1 h-0.5 rounded-full overflow-hidden mx-1 ${ok ? 'bg-green-100' : 'bg-red-900'}`}>
                <div className={`h-full rounded-full ${ok ? 'bg-green-500' : 'bg-red-600'}`}
                    style={{ animation: 'toastProgress 4s linear forwards' }} />
            </div>
        </div>
    );
}
