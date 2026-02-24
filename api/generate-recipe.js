import { GoogleGenerativeAI } from '@google/generative-ai';

const DIET_LABELS = {
    vegan: 'Vegana (sin carne, sin pescado, sin lácteos, sin huevos)',
    keto: 'Cetogénica (muy bajo en carbohidratos, alta en grasas y proteínas)',
    all: 'Sin restricciones',
};

function buildPrompt(ingredients, diet, panicMode) {
    const dietLabel = DIET_LABELS[diet] ?? DIET_LABELS.all;
    const panicLabel = panicMode
        ? 'SÍ — todas las recetas deben poder hacerse en 10 minutos o menos'
        : 'NO';

    return `Eres un Chef experto en cocina de aprovechamiento y creatividad culinaria.
Genera exactamente 3 recetas usando los ingredientes disponibles.
Puedes asumir que el usuario tiene sal, pimienta, aceite de oliva y condimentos básicos.

Ingredientes: ${ingredients.join(', ')}
Dieta: ${dietLabel}
Modo pánico (urgencia de tiempo): ${panicLabel}

Reglas estrictas:
- Devuelve EXACTAMENTE 3 recetas
- "dificultad" solo puede ser "Fácil", "Media" o "Difícil"
- "tiempo_minutos" debe ser un número entero (ej: 15)
- Cada receta debe tener entre 4 y 7 instrucciones
- Si el modo pánico está activo, "tiempo_minutos" ≤ 10 en todas las recetas
- "dieta" debe ser "🌱 Vegano", "🥑 Keto", o null si no aplica

Devuelve estrictamente un JSON válido con esta estructura:
{
  "recipes": [
    {
      "titulo": "Nombre creativo y apetecible del plato",
      "descripcion": "Una frase breve y seductora",
      "emoji": "emoji representativo del plato",
      "tiempo_minutos": 15,
      "dificultad": "Fácil",
      "instrucciones": [
        "Paso 1 detallado con técnica culinaria",
        "Paso 2...",
        "..."
      ],
      "consejo_chef": "Un tip profesional que marque la diferencia",
      "dieta": null
    }
  ]
}`;
}

export default async function handler(req, res) {
    if (req.method !== 'POST')
        return res.status(405).json({ error: 'Método no permitido' });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey)
        return res.status(500).json({
            error: '🔑 GEMINI_API_KEY no configurada en las variables de entorno.',
        });

    const { ingredients = [], diet = 'all', panicMode = false } = req.body ?? {};

    if (!Array.isArray(ingredients) || ingredients.length < 2)
        return res.status(400).json({
            error: '¡Añade algo más! El chef necesita al menos 2 ingredientes.',
        });

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            generationConfig: {
                responseMimeType: 'application/json',
                temperature: 0.85,
                maxOutputTokens: 2048,
            },
        });

        const result = await model.generateContent(buildPrompt(ingredients, diet, panicMode));
        const rawText = result.response.text();

        let parsed;
        try {
            parsed = JSON.parse(rawText);
        } catch {
            throw new Error('Gemini devolvió una respuesta que no era JSON válido.');
        }

        if (!parsed.recipes || !Array.isArray(parsed.recipes))
            throw new Error('El formato de respuesta de Gemini no incluía el array de recetas.');

        return res.status(200).json({ recipes: parsed.recipes });

    } catch (err) {
        console.error('[Fridge Rescue] Gemini error:', err.message);
        return res.status(500).json({
            error: `¡Vaya! El chef se ha tomado un descanso. Inténtalo de nuevo. (${err.message})`,
        });
    }
}
