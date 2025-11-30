import { translate } from 'google-translate-api-x';

export async function translateText(text: string, targetLang: string) {
  try {
    // 'forceBatch: false' ajuda a evitar erros em algumas requisições
    const res = await translate(text, { 
      to: targetLang,
      forceBatch: false 
    });
    
    return res.text;
  } catch (error) {
    console.error('Erro na tradução:', error);
    return text; // Fallback: retorna o original se der erro
  }
}