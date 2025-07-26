const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
const PORT = 3001;

app.use(cors());

app.get("/recipeStream", (req, res) => {
    const ingredients = req.query.ingredients;
    const mealType = req.query.mealType;
    const cuisine = req.query.cuisine;
    const cookingTime = req.query.cookingTime;
    const complexity = req.query.complexity;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const sendEvent = (chunk) => {
        let chunkResponse;
        if (chunk.choices[0].finish_reason === "stop") {
            res.write(`data: ${JSON.stringify({ action: "close" })}\n\n`);
        } else {
            if (
                chunk.choices[0].delta.role &&
                chunk.choices[0].delta.role === "assistant"
            ) {
                chunkResponse = {
                    action: "start",
                };
            } else {
                chunkResponse = {
                    action: "chunk",
                    chunk: chunk.choices[0].delta.content,
                };
            }
        }
        res.write(`data: ${JSON.stringify(chunkResponse)}\n\n`);
    };

    const prompt = [];
    prompt.push("You are a helpful AI assistant that generates recipes based on user preferences.");
    prompt.push("Generate a recipe that includes the following details:");
    if (ingredients) prompt.push(`[Ingredients: ${ingredients}]`);
    if (mealType) prompt.push(`[Meal Type: ${mealType}]`);
    if (cuisine) prompt.push(`[Cuisine: ${cuisine}]`);
    if (cookingTime) prompt.push(`[Cooking Time: ${cookingTime}]`);
    if (complexity) prompt.push(`[Complexity: ${complexity}]`);
    prompt.push("Please provide a detailed recipe, including steps for preparation, and cooking instructions. Only use ingredients provided.");
    prompt.push("Ensure the recipe is suitable for the specified meal type and cuisine.");
    prompt.push("The recipe should hightlight the main ingredients and provide clear instructions.");
    prompt.push("Use a friendly and engaging tone, as if you are a personal chef.");
    prompt.push("If the user has not provided any ingredients, suggest common ingredients for the specified meal type and cuisine.");
    prompt.push("Respond in a structured format with clear sections for ingredients and instructions.");
    prompt.push("Give the recipe a suitable name/title based on the ingredients, meal type, andcuisine.");
    prompt.push("If you cannot generate a recipe based on the provided details, respond with 'No recipe available.'");

    const messages = [
        {
            role: "system",
            content: prompt.join("\n"),
        },
    ];

    getOpenAIResponse(messages, sendEvent);

    // Clear interval and close connection on client disconnect
    req.on('close', () => {
        res.end();
    });
});

async function getOpenAIResponse(messages, callback) {
    const openai = new OpenAI();
    const aiModel = "gpt-4o-mini";

    try {
        const response = await openai.chat.completions.create({
            model: aiModel,
            messages: messages,
            temperature: 1,
            stream: true,
        })

        for await (const chunk of response) {
            callback(chunk);
        }

    } catch (error) {
        console.error("Error in OpenAI response:", error);
        callback({ error: "Failed to receive OpenAI response." });
    }
}

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

