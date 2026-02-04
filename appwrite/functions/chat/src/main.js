import { Client, Databases, ID } from 'node-appwrite';
import fetch from 'node-fetch';

export default async ({ req, res, log, error }) => {
    // Environment variables expected in Appwrite Function settings:
    // PERPLEXITY_API_KEY
    // APPWRITE_FUNCTION_PROJECT_ID
    // APPWRITE_FUNCTION_ENDPOINT
    // APPWRITE_API_KEY (Project API Key with database permissions)
    
    const client = new Client()
        .setEndpoint(process.env.APPWRITE_FUNCTION_ENDPOINT)
        .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
        .setKey(process.env.APPWRITE_API_KEY);

    if (req.method === 'POST') {
        const { message } = JSON.parse(req.body);
        const apiKey = process.env.PERPLEXITY_API_KEY;

        if (!apiKey) {
            return res.json({ error: 'AI provider not configured' }, 500);
        }

        try {
            const response = await fetch('https://api.perplexity.ai/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'sonar-pro',
                    messages: [
                        { role: 'system', content: 'You are a helpful culinary assistant for Alimenta, a minimalist recipe archive. Provide concise, high-fidelity culinary advice.' },
                        { role: 'user', content: message }
                    ]
                })
            });

            const data = await response.json();
            return res.json({ reply: data.choices[0].message.content });
        } catch (err) {
            error(err.message);
            return res.json({ error: 'Failed to communicate with AI' }, 500);
        }
    }

    return res.json({ error: 'Method not allowed' }, 405);
};
