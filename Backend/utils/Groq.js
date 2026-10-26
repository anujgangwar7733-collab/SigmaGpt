import "dotenv/config";

const getOpenAIAPIResponse = async (message) => {
    const apiKey = (process.env.GROQ_API_KEY || "").trim();
    if (!apiKey) {
        console.error("GROQ_API_KEY is not defined in environment variables!");
        return "Backend Error: GROQ_API_KEY environment variable is not set in Vercel backend settings.";
    }

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: "openai/gpt-oss-20b",
            messages: [{
                role: "user",
                content: message
            }]
        })
    };

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", options);
        const data = await response.json();
        
        if (data.choices && data.choices.length > 0) {
            return data.choices[0].message.content;
        } else {
            console.error("Groq API Error:", data);
            return data?.error?.message || "Sorry, I could not generate a response.";
        }
    } catch (err) {
        console.error("Fetch Error:", err);
        return "An error occurred while contacting the AI service.";
    }
}

export default getOpenAIAPIResponse;
