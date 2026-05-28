// backend/services/aiService.js

const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Analisa o conteúdo e sugere hashtags e melhorias
const analyseContent = async (title, body, social_network, scheduled_date) => {
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
Data planeada: ${scheduled_date || 'não definida'}

Responde exactamente neste formato:
{
  "hashtags": ["hashtag1", "hashtag2", "hashtag3"],
  "improvements": "sugestão de melhoria do conteúdo",
  "best_time": "melhor horário para publicar"
  "date_feedback": "feedback sobre a data planeada vs melhor dia para publicar"
}`
        }
      ]
    });

    const text = response.content[0].text;
    return JSON.parse(text);
  } catch (err) {
    console.error('Erro na análise de conteúdo:', err);
    throw err;
  }  
};

// Prevê métricas quando o card é publicado
const predictMetrics = async (title, body, social_network) => {
  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `És um especialista em análise de redes sociais. Com base neste conteúdo para ${social_network}, prevê o potencial de métricas. Responde APENAS em JSON válido sem markdown, sem explicações, sem texto extra.

Título: ${title}
Conteúdo: ${body}

Responde exactamente neste formato:
{
  "reach": "estimativa de alcance em número",
  "likes": "estimativa de likes em número",
  "comments": "estimativa de comentários em número",
  "shares": "estimativa de partilhas em número",
  "analysis": "breve análise do potencial do conteúdo"
}`
        }
      ]
    });

    const text = response.content[0].text;
    return JSON.parse(text);
  } catch (err) {
    console.error('Erro na previsão de métricas:', err);
    throw err;
  }
};

module.exports = { analyseContent, predictMetrics };
