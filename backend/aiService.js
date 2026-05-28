// backend/services/aiService.js

const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Analisa o conteúdo e sugere hashtags e melhorias
const analyseContent = async (title, body, social_network) => {
  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `És um especialista em marketing de redes sociais. Analisa o seguinte conteúdo para ${social_network} e responde APENAS em JSON válido sem markdown, sem explicações, sem texto extra.

Título: ${title}
Conteúdo: ${body}

Responde exactamente neste formato:
{
  "hashtags": ["hashtag1", "hashtag2", "hashtag3"],
  "improvements": "sugestão de melhoria do conteúdo",
  "best_time": "melhor horário para publicar"
}`
        }
      ]
    });

    const text = response.content[0].text;
    return JSON.parse(text);
  } catch (err) {
    console.error('Erro na análise de conteúdo:', err);
    return null; // se a IA falhar o card é guardado na mesma sem sugestão
  }
};

module.exports = { analyseContent };
