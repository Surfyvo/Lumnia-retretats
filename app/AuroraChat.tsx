'use client';

import { useEffect, useRef, useState } from 'react';

type ChatMessage = {
  id: number;
  role: 'user' | 'assistant';
  text: string;
};

type SpeechRecognitionAlternativeLike = { transcript: string };
type SpeechRecognitionResultLike = ArrayLike<SpeechRecognitionAlternativeLike>;
type SpeechRecognitionEventLike = Event & { results: ArrayLike<SpeechRecognitionResultLike> };
type SpeechRecognitionErrorLike = Event & { error: string };
type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};
type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;
type SpeechRecognitionWindow = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

const GREETING: ChatMessage = {
  id: 0,
  role: 'assistant',
  text: "Hello, I’m Aurora. I can tell you about Yvonne’s work in guest intelligence, hospitality operations and applied AI — or help you find the best way to get in touch.",
};

const SUGGESTIONS = [
  'What is guest intelligence?',
  'How can LumnIA help a hotel?',
  'How can I speak with Yvonne?',
];

const chatSpanish: Record<string, string> = {
  'Hello, I’m Aurora. I can tell you about Yvonne’s work in guest intelligence, hospitality operations and applied AI — or help you find the best way to get in touch.': 'Hola, soy Aurora. Puedo contarte sobre el trabajo de Yvonne en inteligencia del huésped, operaciones hoteleras e IA aplicada, o ayudarte a encontrar la mejor forma de contactar con ella.',
  'What is guest intelligence?': '¿Qué es la inteligencia del huésped?', 'How can LumnIA help a hotel?': '¿Cómo puede ayudar LumnIA a un hotel?', 'How can I speak with Yvonne?': '¿Cómo puedo hablar con Yvonne?',
  'LumnIA’s guest intelligence assistant': 'Asistente de inteligencia del huésped de LumnIA', 'Turn voice replies off': 'Desactivar respuestas por voz', 'Turn voice replies on': 'Activar respuestas por voz',
  'Voice replies are off.': 'Las respuestas por voz están desactivadas.', 'Voice replies are on.': 'Las respuestas por voz están activadas.', 'Close Aurora chat': 'Cerrar el chat de Aurora', 'Conversation': 'Conversación', 'Read Aurora’s reply aloud': 'Leer en voz alta la respuesta de Aurora', 'Read aloud': 'Leer en voz alta', 'Aurora is thinking…': 'Aurora está pensando…', 'Suggested questions': 'Preguntas sugeridas', 'Your message': 'Tu mensaje', 'Ask Aurora…': 'Pregunta a Aurora…',
  'Stop voice input': 'Detener entrada de voz', 'Dictate a message': 'Dictar un mensaje', 'Stop listening': 'Dejar de escuchar', 'Send message': 'Enviar mensaje', 'Please don’t share sensitive information. Dictation uses your browser’s speech service; only the transcript goes to Aurora. Messages are sent to OpenAI.': 'No compartas información sensible. El dictado utiliza el servicio de voz de tu navegador; Aurora solo recibe la transcripción. Los mensajes se envían a OpenAI.', 'Book a call ↗': 'Reservar una llamada ↗', 'Close': 'Cerrar', 'Ask Aurora': 'Pregunta a Aurora',
  'Spoken replies are not available in this browser.': 'Este navegador no permite respuestas habladas.', 'Aurora is speaking…': 'Aurora está hablando…', 'Aurora could not speak this reply.': 'Aurora no ha podido leer esta respuesta.', 'Voice input is not available in this browser. You can still type or listen to replies.': 'Este navegador no permite entrada de voz. Aun así, puedes escribir o escuchar las respuestas.', 'Allow microphone access in your browser to dictate.': 'Permite el acceso al micrófono en el navegador para dictar.', 'No microphone was found. You can still type your message.': 'No se encontró ningún micrófono. Puedes escribir el mensaje.', 'No speech was detected. Please try again.': 'No se detectó voz. Inténtalo de nuevo.', 'Your browser could not connect to its speech service. Please try again.': 'El navegador no pudo conectarse al servicio de voz. Inténtalo de nuevo.', 'Dictation added. You can edit it before sending.': 'Dictado añadido. Puedes editarlo antes de enviarlo.', 'Voice input could not start. Please try again or type your message.': 'No se pudo iniciar la entrada de voz. Inténtalo de nuevo o escribe el mensaje.', 'Aurora could not reply. Please try again or email Yvonne.': 'Aurora no pudo responder. Inténtalo de nuevo o escribe a Yvonne.', 'I’m having trouble responding just now. Please try again, or email Yvonne at yvonne.cordoba@lumniai.com.': 'Aurora tiene problemas para responder ahora. Inténtalo de nuevo o escribe a Yvonne a yvonne.cordoba@lumniai.com.',
};

function chatText(text: string, language: 'en' | 'es') {
  return language === 'es' ? chatSpanish[text] ?? text : text;
}

export function AuroraChat({ language }: { language: 'en' | 'es' }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [voiceReplies, setVoiceReplies] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([{ ...GREETING, text: chatText(GREETING.text, language) }]);
  const nextId = useRef(1);
  const messageListRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const speechLanguageRef = useRef('en-US');

  function stopSpeaking() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  function speak(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setVoiceStatus(chatText('Spoken replies are not available in this browser.', language));
      return;
    }

    stopSpeaking();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = speechLanguageRef.current;
    utterance.rate = 0.96;
    utterance.onstart = () => setVoiceStatus(chatText('Aurora is speaking…', language));
    utterance.onend = () => setVoiceStatus('');
    utterance.onerror = () => setVoiceStatus(chatText('Aurora could not speak this reply.', language));
    const languageCode = speechLanguageRef.current.split('-')[0].toLowerCase();
    const matchingVoice = window.speechSynthesis.getVoices().find((voice) => voice.lang.toLowerCase().startsWith(languageCode));
    if (matchingVoice) utterance.voice = matchingVoice;
    window.speechSynthesis.speak(utterance);
  }

  function startListening() {
    const SpeechRecognition = (window as SpeechRecognitionWindow).SpeechRecognition
      ?? (window as SpeechRecognitionWindow).webkitSpeechRecognition;
    if (sending) return;
    if (!SpeechRecognition) {
      setVoiceStatus(chatText('Voice input is not available in this browser. You can still type or listen to replies.', language));
      return;
    }

    setVoiceStatus('');
    const recognition = new SpeechRecognition();
    recognition.lang = speechLanguageRef.current;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript?.trim();
      if (transcript) {
        setDraft((current) => current.trim() ? `${current.trim()} ${transcript}` : transcript);
        setVoiceStatus(chatText('Dictation added. You can edit it before sending.', language));
      }
    };
    recognition.onerror = (event) => {
      const messages: Record<string, string> = {
        'not-allowed': 'Allow microphone access in your browser to dictate.',
        'audio-capture': 'No microphone was found. You can still type your message.',
        'no-speech': 'No speech was detected. Please try again.',
        network: 'Your browser could not connect to its speech service. Please try again.',
      };
      setVoiceStatus(chatText(messages[event.error] ?? 'Voice input could not start. Please try again or type your message.', language));
    };
    recognition.onend = () => {
      setListening(false);
      recognitionRef.current = null;
    };

    try {
      recognitionRef.current = recognition;
      setListening(true);
      recognition.start();
    } catch {
      recognitionRef.current = null;
      setListening(false);
      setVoiceStatus('Voice input could not start. Please try again or type your message.');
    }
  }

  useEffect(() => {
    speechLanguageRef.current = language === 'es' ? 'es-ES' : 'en-US';
    setMessages((current) => current.length === 1 && current[0].id === 0
      ? [{ ...GREETING, text: chatText(GREETING.text, language) }]
      : current);

    return () => {
      recognitionRef.current?.abort();
      stopSpeaking();
    };
  }, [language]);

  useEffect(() => {
    messageListRef.current?.scrollTo({ top: messageListRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, sending, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  async function sendMessage(suggestedText?: string) {
    const text = (suggestedText ?? draft).trim();
    if (!text || sending) return;

    const userMessage: ChatMessage = { id: nextId.current++, role: 'user', text };
    const updatedMessages = [...messages, userMessage].slice(-12);
    setMessages(updatedMessages);
    setDraft('');
    setSending(true);

    try {
      const response = await fetch('/api/aurora', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(({ role, text: content }) => ({ role, content })),
        }),
      });
      const result: { reply?: string; error?: string } = await response.json();
      if (!response.ok || !result.reply) {
        const assistantMessage: ChatMessage = {
          id: nextId.current++,
          role: 'assistant',
          text: result.error || chatText('Aurora could not reply. Please try again or email Yvonne.', language),
        };
        setMessages((current) => [...current, assistantMessage].slice(-12));
        return;
      }
      const assistantMessage: ChatMessage = { id: nextId.current++, role: 'assistant', text: result.reply };
      setMessages((current) => [...current, assistantMessage].slice(-12));
      if (voiceReplies) speak(result.reply);
    } catch {
      const errorMessage: ChatMessage = {
        id: nextId.current++,
        role: 'assistant',
        text: chatText('I’m having trouble responding just now. Please try again, or email Yvonne at yvonne.cordoba@lumniai.com.', language),
      };
      setMessages((current) => [...current, errorMessage].slice(-12));
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="aurora-widget">
      {open && (
        <section id="aurora-panel" className="aurora-panel" aria-label={chatText('Chat with Aurora', language)}>
          <header className="aurora-header">
            <div className="aurora-mark" aria-hidden="true">✦</div>
            <div className="aurora-heading">
              <strong>Aurora</strong>
              <span>{chatText('LumnIA’s guest intelligence assistant', language)}</span>
            </div>
            <button
              className={`aurora-voice-toggle${voiceReplies ? ' aurora-voice-toggle-active' : ''}`}
              type="button"
              aria-pressed={voiceReplies}
              onClick={() => {
                if (voiceReplies) stopSpeaking();
                setVoiceReplies((enabled) => !enabled);
                setVoiceStatus(chatText(voiceReplies ? 'Voice replies are off.' : 'Voice replies are on.', language));
              }}
              title={chatText(voiceReplies ? 'Turn voice replies off' : 'Turn voice replies on', language)}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 5 6 9H3v6h3l5 4V5Z" />
                {voiceReplies && <><path d="M15.5 8.5a5 5 0 0 1 0 7" /><path d="M18.5 5.5a9 9 0 0 1 0 13" /></>}
              </svg>
              <span className="aurora-sr-only">{chatText(voiceReplies ? 'Turn voice replies off' : 'Turn voice replies on', language)}</span>
            </button>
            <button
              className="aurora-close"
              type="button"
              onClick={() => {
                recognitionRef.current?.abort();
                setListening(false);
                stopSpeaking();
                setOpen(false);
              }}
              aria-label={chatText('Close Aurora chat', language)}
            >×</button>
          </header>

          <div className="aurora-messages" ref={messageListRef} role="log" aria-label={chatText('Conversation', language)} aria-live="polite" aria-relevant="additions text">
            {messages.map((message) => (
              <div className={`aurora-message-row aurora-message-row-${message.role}`} key={message.id}>
                <p className={`aurora-message aurora-message-${message.role}`}>{message.text}</p>
                {message.role === 'assistant' && (
                  <button className="aurora-read-aloud" type="button" onClick={() => speak(message.text)} aria-label={chatText('Read Aurora’s reply aloud', language)} title={chatText('Read aloud', language)}>
                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5 6 9H3v6h3l5 4V5Z" /><path d="M15.5 8.5a5 5 0 0 1 0 7" /></svg>
                  </button>
                )}
              </div>
            ))}
            {sending && <p className="aurora-typing" role="status"><span /> {chatText('Aurora is thinking…', language)}</p>}
          </div>

          {messages.length === 1 && (
            <div className="aurora-suggestions" aria-label={chatText('Suggested questions', language)}>
              {SUGGESTIONS.map((suggestion) => (
                <button key={suggestion} type="button" disabled={sending} onClick={() => { void sendMessage(chatText(suggestion, language)); }}>
                  {chatText(suggestion, language)}
                </button>
              ))}
            </div>
          )}

          <form className="aurora-form" onSubmit={(event) => { event.preventDefault(); void sendMessage(); }}>
            <label className="aurora-sr-only" htmlFor="aurora-input">{chatText('Your message', language)}</label>
            <input
              id="aurora-input"
              ref={inputRef}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={chatText('Ask Aurora…', language)}
              maxLength={1200}
              disabled={sending}
              autoComplete="off"
            />
            <button
              className={`aurora-mic${listening ? ' aurora-mic-listening' : ''}`}
              type="button"
              disabled={sending}
              aria-label={chatText(listening ? 'Stop voice input' : 'Dictate a message', language)}
              aria-pressed={listening}
              title={chatText(listening ? 'Stop listening' : 'Dictate a message', language)}
              onClick={() => {
                if (listening) recognitionRef.current?.stop();
                else startListening();
              }}
            >{listening ? '■' : <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="3" width="6" height="12" rx="3" /><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 18v3m-4 0h8" /></svg>}</button>
            <button type="submit" disabled={sending || !draft.trim()} aria-label={chatText('Send message', language)}>↑</button>
          </form>

          {voiceStatus && <p className="aurora-voice-status" role="status">{voiceStatus}</p>}
          <div className="aurora-footer">
            <span>{chatText('Please don’t share sensitive information. Dictation uses your browser’s speech service; only the transcript goes to Aurora. Messages are sent to OpenAI.', language)}</span>
            <a href="https://calendly.com/yvonne-cordoba-lumniai" target="_blank" rel="noreferrer">{chatText('Book a call ↗', language)}</a>
          </div>
        </section>
      )}

      <button
        className={`aurora-launcher${open ? ' aurora-launcher-open' : ''}`}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="aurora-panel"
      >
        <span aria-hidden="true">✦</span>{chatText(open ? 'Close' : 'Ask Aurora', language)}
      </button>
    </div>
  );
}
