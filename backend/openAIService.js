const { OpenAI } = require('openai');
require('dotenv').config();

class OpenAIService {
    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPEN_AI_APIKEY,
        });
        this.cache = {
            trends: null,
            lastUpdated: null
        };
        this.CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
    }

    async analyzeTrends(newsItems) {
        // Return cache if still valid
        if (this.cache.trends && (Date.now() - this.cache.lastUpdated < this.CACHE_DURATION)) {
            console.log('Returning cached trends');
            return this.cache.trends;
        }

        if (!newsItems || newsItems.length === 0) return null;

        const newsText = newsItems.map(item => `${item.title}`).join('\n');

        const prompt = `
            Analyze the following news titles from Indonesia and identify:
            1. The top 5 trending topics/keywords.
            2. For each topic, provide a short, professional insight (1 sentence) in Indonesian.
            3. Identify the regions (cities/provinces) mentioned or relevant to the news, and for each region, provide a brief insight into why it's trending (1 sentence) in Indonesian.

            Format the response as a JSON object with this structure:
            {
                "trends": [
                    { "topic": "Name", "insight": "Insight text" },
                    ...
                ],
                "regionalInsights": [
                    { "region": "City/Province", "insight": "Insight text" },
                    ...
                ]
            }

            News Titles:
            ${newsText}
        `;

        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "You are a senior intelligence analyst. Output ONLY valid JSON." },
                    { role: "user", content: prompt }
                ],
                response_format: { type: "json_object" }
            });

            const result = JSON.parse(response.choices[0].message.content);
            
            // Cache the result
            this.cache.trends = result;
            this.cache.lastUpdated = Date.now();

            return result;
        } catch (error) {
            console.error('Error with OpenAI analysis:', error);
            return null;
        }
    }
}

module.exports = new OpenAIService();
