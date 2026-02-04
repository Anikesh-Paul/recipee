import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

console.log('API Key present:', !!process.env.PERPLEXITY_API_KEY);
if (process.env.PERPLEXITY_API_KEY) {
    console.log('Key prefix:', process.env.PERPLEXITY_API_KEY.substring(0, 5));
}

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Set global defaults for templates
app.use((req, res, next) => {
    res.locals.currentCategory = 'All';
    next();
});

// Mock database
let recipes = [
    {
        id: 1,
        title: "Classic Spaghetti Carbonara",
        description: "A traditional Italian pasta dish made with eggs, cheese, pancetta, and pepper.",
        ingredients: ["200g spaghetti", "100g pancetta", "2 large eggs", "50g Pecorino Romano", "50g Parmesan", "Black pepper"],
        instructions: "Cook pasta. Fry pancetta. Mix eggs and cheese. Combine all with a splash of pasta water.",
        image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&q=80&w=800",
        author: "Chef Mario",
        category: "Dinner"
    },
    {
        id: 2,
        title: "Fresh Avocado Toast",
        description: "Perfectly ripe avocado on toasted sourdough with chili flakes and a drizzle of olive oil.",
        ingredients: ["1 slice sourdough bread", "1 ripe avocado", "Lemon juice", "Chili flakes", "Olive oil", "Salt"],
        instructions: "Toast the bread. Mash avocado with lemon and salt. Spread on toast. Garnish with chili and oil.",
        image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=800",
        author: "Healthy Eater",
        category: "Breakfast"
    },
    {
        id: 3,
        title: "Spicy Thai Green Curry",
        description: "An aromatic and spicy curry with coconut milk, authentic Thai herbs, and fresh vegetables.",
        ingredients: ["400ml coconut milk", "2 tbsp green curry paste", "Chicken or Tofu", "Bamboo shoots", "Thai basil", "Fish sauce"],
        instructions: "Simmer curry paste with coconut milk. Add protein and vegetables. Season with fish sauce and basil.",
        image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&q=80&w=800",
        author: "Siam Kitchen",
        category: "Lunch"
    }
];

// Routes
app.get('/', (req, res) => {
    const category = req.query.category;
    const filteredRecipes = category && category !== 'All'
        ? recipes.filter(r => r.category === category)
        : recipes;
    res.render('index', { recipes: filteredRecipes, currentCategory: category || 'All' });
});

app.get('/recipe/:id', (req, res) => {
    const recipe = recipes.find(r => r.id === parseInt(req.params.id));
    if (!recipe) return res.status(404).send('Recipe not found');
    res.render('recipe', { recipe });
});

app.get('/add-recipe', (req, res) => {
    res.render('add-recipe');
});

app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    const apiKey = process.env.PERPLEXITY_API_KEY;
    
    console.log('Chat request received:', message);

    if (!apiKey) {
        console.error('API key missing from process.env');
        return res.status(500).json({ error: 'API key not configured' });
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

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Perplexity API error:', response.status, errorText);
            return res.status(response.status).json({ error: `API error: ${response.status}` });
        }

        const data = await response.json();
        res.json({ reply: data.choices[0].message.content });
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Failed to communicate with AI' });
    }
});

app.post('/api/recipes', (req, res) => {
    const { title, description, ingredients, instructions, image, author, category } = req.body;
    const newRecipe = {
        id: recipes.length + 1,
        title,
        description,
        ingredients: ingredients.split('\n').filter(i => i.trim() !== ''),
        instructions,
        image: image || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=800",
        author: author || "Anonymous",
        category: category || "Other"
    };
    recipes.push(newRecipe);
    res.redirect('/');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
