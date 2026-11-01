import type { AIVerdictData, LangCode, VerbaSettings } from './types';
import { LANG_MAP } from './languages';

function buildSystemPrompt(langName: string, targetDefLang: string, customRequest: string): string {
  return `You are Verba's lexical AI verifier for learners reading ${langName}.
Analyze whether the queried word/compound is a real word in ${langName} (given optional sentence context).
Respond ONLY with valid JSON matching this schema:
{
  "verdict": "real" | "narrow" | "not_a_word" | "uncertain",
  "confidence": "high" | "medium" | "low",
  "shortMeaning": "concise gloss in ${targetDefLang} (2-5 words)",
  "meaning": "clear explanation in ${targetDefLang}",
  "reading": "pronunciation/reading if applicable",
  "registerNote": "if narrow: slang / coinage / journalese / proper noun / dialect",
  "exampleSentence": "natural example sentence in ${langName}",
  "exampleTranslation": "translation in ${targetDefLang}",
  "reasoning": "brief linguistic explanation"${customRequest ? `,\n  "customAnswer": "answer to the user's extra question"` : ''}
}`;
}

export async function runAiWordCheck(
  word: string,
  lang: LangCode,
  sentence: string | undefined,
  settings: VerbaSettings,
  targetDefLang = 'English'
): Promise<AIVerdictData> {
  const langName = LANG_MAP[lang]?.name || lang;
  const apiKey = settings.aiApiKey || (settings.aiProvider === 'gemini' ? settings.cloudVoiceApiKey : '');
  if (!apiKey) {
    throw new Error('No API key configured. Add a key under Settings → AI check.');
  }

  const sys = buildSystemPrompt(langName, targetDefLang, settings.aiCustomRequest);
  const userContent = [
    `Word: "${word}"`,
    settings.aiIncludeSentence && sentence ? `Surrounding sentence: "${sentence}"` : '',
    settings.aiCustomRequest ? `User extra request: ${settings.aiCustomRequest.slice(0, 1000)}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  let rawJsonText = '';

  if (settings.aiProvider === 'gemini') {
    const model = settings.aiModel || 'gemini-2.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      model
    )}:generateContent?key=${encodeURIComponent(apiKey)}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: sys }] },
        contents: [{ role: 'user', parts: [{ text: userContent }] }],
        generationConfig: { responseMimeType: 'application/json' },
      }),
    });
    if (!res.ok) throw new Error(`Gemini error (${res.status}): ${await res.text()}`);
    const data = await res.json();
    rawJsonText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  } else if (settings.aiProvider === 'claude') {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    };
    if (settings.aiWorkspaceId) headers['anthropic-workspace-id'] = settings.aiWorkspaceId;
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: settings.aiModel || 'claude-3-5-sonnet-latest',
        max_tokens: 700,
        system: sys,
        messages: [{ role: 'user', content: userContent }],
      }),
    });
    if (!res.ok) throw new Error(`Claude error (${res.status}): ${await res.text()}`);
    const data = await res.json();
    rawJsonText = data?.content?.[0]?.text || '';
  } else {
    // OpenAI or DeepSeek
    const endpoint =
      settings.aiProvider === 'deepseek'
        ? 'https://api.deepseek.com/chat/completions'
        : 'https://api.openai.com/v1/chat/completions';
    const model =
      settings.aiModel || (settings.aiProvider === 'deepseek' ? 'deepseek-chat' : 'gpt-4o-mini');
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: sys },
          { role: 'user', content: userContent },
        ],
      }),
    });
    if (!res.ok) throw new Error(`${settings.aiProvider} error (${res.status}): ${await res.text()}`);
    const data = await res.json();
    rawJsonText = data?.choices?.[0]?.message?.content || '';
  }

  const cleaned = rawJsonText.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
  const parsed = JSON.parse(cleaned);
  return {
    verdict: ['real', 'narrow', 'not_a_word', 'uncertain'].includes(parsed.verdict) ? parsed.verdict : 'uncertain',
    confidence: ['high', 'medium', 'low'].includes(parsed.confidence) ? parsed.confidence : 'medium',
    shortMeaning: String(parsed.shortMeaning || ''),
    meaning: String(parsed.meaning || ''),
    reading: parsed.reading ? String(parsed.reading) : undefined,
    registerNote: parsed.registerNote ? String(parsed.registerNote) : undefined,
    exampleSentence: parsed.exampleSentence ? String(parsed.exampleSentence) : undefined,
    exampleTranslation: parsed.exampleTranslation ? String(parsed.exampleTranslation) : undefined,
    reasoning: String(parsed.reasoning || ''),
    customAnswer: parsed.customAnswer ? String(parsed.customAnswer) : undefined,
    provider: settings.aiProvider,
    checkedAt: Date.now(),
  };
}

export function buildAskAiChatUrl(
  settings: VerbaSettings,
  params: {
    sentence: string;
    context: string;
    title: string;
    lang: LangCode;
    userQuestion: string;
    translation?: string;
  }
): { url: string; fullPrompt: string } {
  const langName = LANG_MAP[params.lang]?.name || params.lang;
  let prompt = (settings.askAiChatPromptTemplate || '')
    .replace(/\{language\}/g, langName)
    .replace(/\{title\}/g, params.title || 'Web page')
    .replace(/\{sentence\}/g, params.sentence)
    .replace(/\{context\}/g, params.context || params.sentence);

  if (params.translation) {
    prompt += `\nShown translation: "${params.translation}"`;
  }
  if (params.userQuestion.trim()) {
    prompt += `\n\nMy question: ${params.userQuestion.trim()}`;
  }

  const encoded = encodeURIComponent(prompt);
  let url = `https://chatgpt.com/?q=${encoded}`;
  switch (settings.askAiChatProvider) {
    case 'claude':
      url = `https://claude.ai/new?q=${encoded}`;
      break;
    case 'gemini':
      url = `https://gemini.google.com/app`;
      break;
    case 'perplexity':
      url = `https://www.perplexity.ai/search?q=${encoded}`;
      break;
    case 'custom':
      if (settings.askAiChatCustomUrl.startsWith('https://')) {
        url = settings.askAiChatCustomUrl.replace('{prompt}', encoded);
      }
      break;
  }
  return { url, fullPrompt: prompt };
}
