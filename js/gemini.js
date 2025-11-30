// Gemini API Integration
// Reminder: Paste your Gemini API key here before running the app.

const GEMINI_API_KEY = 'YOUR_API_KEY_HERE';

// System prompt for wellness coaching
const SYSTEM_PROMPT = `You are a warm and friendly wellness micro-coach.
You help users feel better with tiny, safe, realistic habits.
Your tone is simple, supportive and slightly witty.

Guidelines:
1. Suggest only small habits that take 1 to 3 minutes.
2. Keep advice beginner-friendly and safe.
3. No medical claims, warnings or diagnoses.
4. Always output five sections in this format:

Physical Reset:
[one short movement habit]

Mind Reset:
[one short breathing or calming habit]

Lifestyle Boost:
[one small habit for mood or energy]

Honest Insight:
[one friendly, relatable one-liner]

Daily Suggestion:
[one practical action for the rest of the day]

Keep the reply short, clear and human.`;

// List available Gemini models
async function listAvailableModels() {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
        throw new Error('Gemini API key not set. Please add your API key to gemini.js');
    }

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models?key=${GEMINI_API_KEY}`
        );

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        const models = data.models || [];

        // Filter models that support generateContent
        const availableModels = models
            .filter(model => model.supportedGenerationMethods?.includes('generateContent'))
            .map(model => model.name.replace('models/', ''));

        return availableModels;
    } catch (error) {
        console.error('Error listing models:', error);
        // Return fallback models if ListModels fails
        return ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-1.5-flash', 'gemini-1.5-pro'];
    }
}

// Try to generate content with a specific model
async function tryModel(modelName, prompt) {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
        throw new Error('Gemini API key not set. Please add your API key to gemini.js');
    }

    const url = `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: prompt
                }]
            }]
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Model ${modelName} failed: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error(`Invalid response from ${modelName}`);
    }

    return data.candidates[0].content.parts[0].text;
}

// Generate wellness response using Gemini API
async function generateWellnessResponse(checkInData) {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
        throw new Error('Gemini API key not set. Please add your API key to gemini.js');
    }

    // Build user prompt from check-in data
    let userPrompt = `User's check-in:\n`;
    if (checkInData.sleep !== undefined) {
        userPrompt += `Sleep: ${checkInData.sleep} hours\n`;
    }
    if (checkInData.mood !== undefined) {
        userPrompt += `Mood: ${checkInData.mood}\n`;
    }
    if (checkInData.stress !== undefined) {
        userPrompt += `Stress level: ${checkInData.stress}/5\n`;
    }
    if (checkInData.water !== undefined) {
        userPrompt += `Water intake: ${checkInData.water}ml\n`;
    }
    if (checkInData.movement !== undefined) {
        userPrompt += `Movement level: ${checkInData.movement}\n`;
    }

    // Combine system prompt and user data
    const fullPrompt = `${SYSTEM_PROMPT}\n\n${userPrompt}`;

    // Priority order for models
    const priorityModels = [
        'gemini-2.5-flash',
        'gemini-2.5-pro',
        'gemini-2.0-flash',
        'gemini-1.5-flash',
        'gemini-1.5-pro'
    ];

    // Try to get available models first
    let modelsToTry = priorityModels;
    try {
        const availableModels = await listAvailableModels();
        if (availableModels.length > 0) {
            // Reorder priority models based on what's available
            modelsToTry = priorityModels.filter(m => availableModels.includes(m));
            // Add any other available models
            availableModels.forEach(m => {
                if (!modelsToTry.includes(m)) {
                    modelsToTry.push(m);
                }
            });
        }
    } catch (error) {
        console.warn('Could not list models, using fallback order:', error);
    }

    // Try each model in order
    let lastError = null;
    for (const model of modelsToTry) {
        try {
            console.log(`Trying model: ${model}`);
            const response = await tryModel(model, fullPrompt);
            return parseWellnessResponse(response);
        } catch (error) {
            console.warn(`Model ${model} failed:`, error);
            lastError = error;
            continue;
        }
    }

    // If all models failed, throw the last error
    throw lastError || new Error('All models failed to generate response');
}

// Parse Gemini response into structured format
function parseWellnessResponse(responseText) {
    const sections = {
        physicalReset: '',
        mindReset: '',
        lifestyleBoost: '',
        honestInsight: '',
        dailySuggestion: ''
    };

    // Split by section headers
    const lines = responseText.split('\n');
    let currentSection = null;
    let currentContent = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (line.toLowerCase().includes('physical reset:')) {
            if (currentSection) {
                sections[currentSection] = currentContent.join(' ').trim();
            }
            currentSection = 'physicalReset';
            currentContent = [];
            // Extract content after colon if present
            const afterColon = line.split(':').slice(1).join(':').trim();
            if (afterColon) {
                currentContent.push(afterColon);
            }
        } else if (line.toLowerCase().includes('mind reset:')) {
            if (currentSection) {
                sections[currentSection] = currentContent.join(' ').trim();
            }
            currentSection = 'mindReset';
            currentContent = [];
            const afterColon = line.split(':').slice(1).join(':').trim();
            if (afterColon) {
                currentContent.push(afterColon);
            }
        } else if (line.toLowerCase().includes('lifestyle boost:')) {
            if (currentSection) {
                sections[currentSection] = currentContent.join(' ').trim();
            }
            currentSection = 'lifestyleBoost';
            currentContent = [];
            const afterColon = line.split(':').slice(1).join(':').trim();
            if (afterColon) {
                currentContent.push(afterColon);
            }
        } else if (line.toLowerCase().includes('honest insight:')) {
            if (currentSection) {
                sections[currentSection] = currentContent.join(' ').trim();
            }
            currentSection = 'honestInsight';
            currentContent = [];
            const afterColon = line.split(':').slice(1).join(':').trim();
            if (afterColon) {
                currentContent.push(afterColon);
            }
        } else if (line.toLowerCase().includes('daily suggestion:')) {
            if (currentSection) {
                sections[currentSection] = currentContent.join(' ').trim();
            }
            currentSection = 'dailySuggestion';
            currentContent = [];
            const afterColon = line.split(':').slice(1).join(':').trim();
            if (afterColon) {
                currentContent.push(afterColon);
            }
        } else if (currentSection && line) {
            currentContent.push(line);
        }
    }

    // Save last section
    if (currentSection) {
        sections[currentSection] = currentContent.join(' ').trim();
    }

    // Fallback: if parsing failed, try to extract from raw text
    if (!sections.physicalReset && !sections.mindReset) {
        // Try alternative parsing
        const parts = responseText.split(/\n\s*\n/);
        if (parts.length >= 5) {
            sections.physicalReset = parts[0].replace(/physical reset:?/i, '').trim();
            sections.mindReset = parts[1].replace(/mind reset:?/i, '').trim();
            sections.lifestyleBoost = parts[2].replace(/lifestyle boost:?/i, '').trim();
            sections.honestInsight = parts[3].replace(/honest insight:?/i, '').trim();
            sections.dailySuggestion = parts[4].replace(/daily suggestion:?/i, '').trim();
        }
    }

    // Ensure all sections have content
    Object.keys(sections).forEach(key => {
        if (!sections[key] || sections[key].trim() === '') {
            const defaults = {
                physicalReset: 'Take a 1-minute stretch break. Stand up and reach for the sky, then touch your toes.',
                mindReset: 'Take 3 deep breaths. Inhale slowly for 4 counts, hold for 4, exhale for 4.',
                lifestyleBoost: 'Drink a glass of water and step outside for 30 seconds of fresh air.',
                honestInsight: 'Every small step counts. You\'re doing better than you think.',
                dailySuggestion: 'Try to take a 5-minute walk during your next break.'
            };
            sections[key] = defaults[key] || 'No suggestion available.';
        }
    });

    return sections;
}

