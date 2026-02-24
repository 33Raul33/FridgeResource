/**
 * Fridge Rescue v2.0 — API Client
 * POSTs to /api/generate-recipe (Vercel serverless function powered by Gemini 1.5 Flash).
 * The GEMINI_API_KEY stays server-side and is never exposed to the browser.
 */
export async function generateRecipes(ingredients, diet, panicMode) {
    const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients, diet, panicMode }),
    });

    if (!response.ok) {
        let msg = '¡Vaya! El chef se ha tomado un descanso. Inténtalo de nuevo.';
        try {
            const e = await response.json();
            msg = e.error ?? msg;
        } catch { }
        throw new Error(msg);
    }

    const data = await response.json();

    if (!data.recipes || !Array.isArray(data.recipes))
        throw new Error('El formato de respuesta del servidor no era el esperado.');

    return data.recipes;
}
