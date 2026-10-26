'use client';

import { cloneElement, isValidElement, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import Script from 'next/script';
import { canaryPaths } from './canaryPaths';
import { AuroraChat } from './AuroraChat';

const BOOKING_URL = 'https://calendly.com/yvonne-cordoba-lumniai';
const EMAIL_URL = 'mailto:yvonne.cordoba@lumniai.com?subject=Guest%20Intelligence%20Conversation';

type SiteLanguage = 'en' | 'es';

const spanishCopy: Record<string, string> = {
  'Primary navigation': 'Navegación principal', 'LumnIA home': 'Inicio de LumnIA', 'Choose language': 'Seleccionar idioma', 'English': 'Inglés', 'Spanish': 'Español', 'Book a call': 'Reservar una llamada',
  'Book a 30-min conversation': 'Reservar una conversación de 30 min', 'Email Yvonne': 'Escribir a Yvonne', 'Open Calendly directly': 'Abrir Calendly directamente',
  'Information in motion': 'Información en movimiento', 'The signal': 'La señal', 'Exceptional guest experiences': 'Las experiencias excepcionales de los huéspedes',
  'shouldn’t depend on someone remembering.': 'no deberían depender de que alguien las recuerde.', 'I design the intelligence behind them.': 'Diseño la inteligencia que las hace posibles.',
  'Guest Intelligence · Applied AI · Hospitality Operations': 'Inteligencia del Huésped · IA aplicada · Operaciones hoteleras', 'Founder of LumnIA': 'Fundadora de LumnIA',
  'Follow the guest signal': 'Sigue la señal del huésped', 'The journey': 'El recorrido', 'A baby cot request is captured, travels through hotel systems, then becomes suspended at a failed hand-off': 'Una solicitud de cuna queda registrada, viaja por los sistemas del hotel y se pierde en un traspaso fallido',
  'Guest signal': 'Señal del huésped', 'Baby cot requested before arrival.': 'Cuna solicitada antes de la llegada.', 'Captured · 84 days before stay': 'Registrada · 84 días antes de la estancia',
  'Context received': 'Contexto recibido', 'Operating without context': 'Operación sin contexto', 'Cot request': 'Solicitud de cuna', 'Suspended': 'En espera',
  'Systems continue': 'Los sistemas continúan', 'Room prepared': 'Habitación preparada', 'Arrival approaches': 'Se acerca la llegada', 'Context exists': 'El contexto existe', 'But it is not operationalised': 'Pero no se convierte en acción',
  'Reception · the inherited consequence': 'Recepción · la consecuencia heredada', 'The problem didn’t start at Reception.': 'El problema no empezó en Recepción.', 'It started where guest context stopped travelling.': 'Empezó donde dejó de circular el contexto del huésped.',
  'Guest Intelligence': 'Inteligencia del Huésped', 'Disconnected guest signals becoming structured context': 'Señales dispersas de los huéspedes convertidas en contexto estructurado', 'Usable': 'Utilizable', 'context': 'contexto', 'Returning guest memory': 'Memoria del huésped recurrente',
  'Guest data is not Guest Intelligence.': 'Los datos del huésped no son Inteligencia del Huésped.', 'Guest Intelligence is': 'La Inteligencia del Huésped es', 'usable context.': 'contexto útil.',
  'The ability of a hospitality organisation to capture, understand and activate guest context across the entire journey.': 'La capacidad de un negocio hotelero para recoger, comprender y activar el contexto del huésped durante todo su recorrido.',
  'Signals become context, intelligence and action': 'Las señales se convierten en contexto, inteligencia y acción', 'Signals': 'Señales', 'Context': 'Contexto', 'Intelligence': 'Inteligencia', 'Action': 'Acción',
  'The right information. The right person.': 'La información adecuada. La persona adecuada.', 'Before it becomes a problem.': 'Antes de que se convierta en un problema.',
  'The invisible intelligence layer': 'La capa invisible de inteligencia', 'Experience': 'Experiencia', 'The guest should feel the result —': 'El huésped debe sentir el resultado —', 'not see the machinery.': 'no ver la maquinaria.', 'AI handles complexity.': 'La IA gestiona la complejidad.', 'Humans create connection.': 'Las personas crean conexión.',
  'Territorial Intelligence': 'Inteligencia Territorial', 'Every guest experience': 'Cada experiencia del huésped', 'happens somewhere.': 'ocurre en un lugar.', 'Place is part of the data.': 'El lugar también es un dato.',
  'Across the Canary Islands, altitude, Atlantic movement, microclimate, culture, mobility and current conditions change what is relevant — here, now.': 'En las Islas Canarias, la altitud, el Atlántico, el microclima, la cultura, la movilidad y las condiciones del momento determinan qué es relevante aquí y ahora.',
  'Hotel': 'Hotel', 'Local environment': 'Entorno local', 'Island': 'Isla', 'Archipelago': 'Archipiélago', 'Atlantic context': 'Contexto atlántico', 'Property context': 'Contexto del alojamiento', 'Guest · Systems · Teams · Operations': 'Huésped · Sistemas · Equipos · Operaciones',
  'Territorial variables activated by the guest signal': 'Variables territoriales activadas por la señal del huésped', 'Altitude': 'Altitud', 'Microclimate': 'Microclima', 'North · humid': 'Norte · húmedo', 'Trade winds': 'Alisios', 'Active': 'Activos', 'Mobility': 'Movilidad', 'Relevant radius': 'Radio relevante', 'Current conditions': 'Condiciones actuales', 'Context updated': 'Contexto actualizado', 'Local area': 'Zona local',
  'Guest × Hotel × Territory': 'Huésped × Hotel × Territorio', 'Guest, hotel and territorial context progressively filter possibilities into relevance': 'El contexto del huésped, del hotel y del territorio filtra posibilidades hasta encontrar lo relevante', 'Guest context': 'Contexto del huésped', 'Preferences · intent · needs · history · mobility · companions · pace': 'Preferencias · intención · necesidades · historial · movilidad · acompañantes · ritmo', 'Hotel context': 'Contexto del hotel', 'Island · location · service proposition · capabilities · partners · resources': 'Isla · ubicación · propuesta de servicio · capacidades · colaboradores · recursos', 'Territorial context': 'Contexto territorial', 'Local area · distance · altitude · weather · culture · mobility · seasonality': 'Zona local · distancia · altitud · clima · cultura · movilidad · estacionalidad', 'Time / moment': 'Momento', 'Day of stay · current conditions · operational availability': 'Día de estancia · condiciones actuales · disponibilidad operativa', 'Relevance': 'Relevancia', 'Context understood': 'Contexto comprendido',
  '“I’d love to experience the Canary Islands beyond the obvious.”': '«Me encantaría descubrir las Islas Canarias más allá de lo evidente».', 'Possibility field': 'Campo de posibilidades', 'Context progressively removes noise': 'El contexto elimina progresivamente el ruido', 'Volcanic trail': 'Ruta volcánica', 'Local table': 'Mesa local', 'Night sky': 'Cielo nocturno', 'Coastal route': 'Ruta costera', 'Market morning': 'Mañana de mercado', 'Forest walk': 'Paseo por el bosque', 'Island craft': 'Artesanía isleña', 'Sea crossing': 'Travesía marítima', 'Village festival': 'Fiesta del pueblo', 'Vineyard landscape': 'Paisaje de viñedos', 'Rural workshop': 'Taller rural', 'Atlantic viewpoint': 'Mirador del Atlántico',
  'Context →': 'Contexto →', 'Relevance →': 'Relevancia →', 'Anticipation': 'Anticipación', 'Anticipation →': 'Anticipación →', 'More options don’t create a better guest experience.': 'Más opciones no crean una mejor experiencia para el huésped.', 'Better context does.': 'Un mejor contexto sí.', 'The hotel is not the destination.': 'El hotel no es el destino.', 'It is the interface between the guest and the place.': 'Es el vínculo entre el huésped y el lugar.',
  'Three intelligences': 'Tres inteligencias', 'Operational Intelligence': 'Inteligencia Operativa', 'Understand the person.': 'Comprender a la persona.', 'Who is this guest?': '¿Quién es este huésped?', 'Preferences · Intent · Needs · Memory · Behaviour · Context': 'Preferencias · Intención · Necesidades · Memoria · Comportamiento · Contexto', 'Enable the hotel to act.': 'Hacer posible que el hotel actúe.', 'What can this hotel actually do?': '¿Qué puede hacer realmente este hotel?', 'Teams · Systems · Processes · AI · Capabilities · Ownership · Timing': 'Equipos · Sistemas · Procesos · IA · Capacidades · Responsables · Tiempos', 'Understand the place.': 'Comprender el lugar.', 'What does this place make relevant now?': '¿Qué hace relevante este lugar ahora?', 'Island · Local area · Climate · Landscape · Culture · Mobility · Seasonality': 'Isla · Zona local · Clima · Paisaje · Cultura · Movilidad · Estacionalidad', 'Anticipatory': 'Anticipación', 'Understand the guest. Understand the operation. Understand the place.': 'Comprender al huésped. Comprender la operación. Comprender el lugar.',
  'LumnIA Framework': 'Marco LumnIA', 'One system. Seven evolving states.': 'Un sistema. Siete estados en evolución.', 'LumnIA Guest Intelligence Framework': 'Marco de Inteligencia del Huésped de LumnIA', 'Operations': 'Operaciones', 'Guest memory': 'Memoria del huésped', 'The seven evolving states of the LumnIA Guest Intelligence Framework': 'Los siete estados en evolución del Marco de Inteligencia del Huésped de LumnIA', 'Guest · Operation · Place': 'Huésped · Operación · Lugar', 'The next path exists before the signal arrives.': 'El siguiente camino existe antes de que llegue la señal.',
  'Human + Artificial Intelligence': 'Personas + Inteligencia Artificial', 'AI & Systems': 'IA y sistemas', 'Capture signals': 'Captar señales', 'Structure context': 'Estructurar contexto', 'Retrieve memory': 'Recuperar memoria', 'Identify patterns': 'Identificar patrones', 'Coordinate workflows': 'Coordinar flujos de trabajo', 'Automate repetitive work': 'Automatizar tareas repetitivas', 'Support anticipation': 'Facilitar la anticipación', 'Technology shouldn’t replace hospitality.': 'La tecnología no debería sustituir la hospitalidad.', 'It should remove what prevents people from delivering it.': 'Debería eliminar lo que impide ofrecerla.', 'Humans': 'Personas', 'Empathy': 'Empatía', 'Judgement': 'Criterio', 'Conversation': 'Conversación', 'Creativity': 'Creatividad', 'Sensitivity': 'Sensibilidad', 'Exception handling': 'Gestión de excepciones', 'Emotional connection': 'Conexión emocional',
  'The person behind the system': 'La persona detrás del sistema', 'Yvonne Córdoba · Hospitality & Guest Experience Expert · Applied AI · Guest Intelligence · Hospitality Operations · Founder of LumnIA': 'Yvonne Córdoba · Experta en Hospitalidad y Experiencia del Huésped · IA aplicada · Inteligencia del Huésped · Operaciones hoteleras · Fundadora de LumnIA',
  '“I came to AI from hospitality —': '«Llegué a la IA desde la hospitalidad —', 'not the other way around.': 'no al revés.', 'not the other way around.”': 'no al revés».', 'Yvonne Córdoba’s work begins with real hospitality operations, Guest Experience, customer journeys and service excellence. AI and automation are the tools she uses to redesign recurring failures at system level.': 'El trabajo de Yvonne Córdoba parte de las operaciones hoteleras reales, la Experiencia del Huésped, los recorridos del cliente y la excelencia en el servicio. Utiliza la IA y la automatización para rediseñar, desde el sistema, los fallos que se repiten.',
  'LumnIA is where this thinking becomes implementation.': 'LumnIA convierte esta visión en soluciones reales.', 'Methodology': 'Metodología', 'Implementation': 'Implementación', 'Experimentation': 'Experimentación', 'Selected hospitality experience': 'Experiencia hotelera seleccionada', 'Verified credentials': 'Credenciales verificadas', 'Speaking & projects': 'Charlas y proyectos', 'Details to be added': 'Detalles próximamente',
  'LumnIA wasn\'t born to automate hotels.': 'LumnIA no nació para automatizar hoteles.', 'It was born to help those who live and breathe hospitality create experiences their guests will never forget.': 'Nació para ayudar a quienes viven la hospitalidad a ofrecer experiencias que sus huéspedes no olviden.',
  'Work with Yvonne': 'Trabaja con Yvonne', 'Transform the experience.': 'Transforma la experiencia.', 'Redesign the system behind it.': 'Rediseña el sistema que la hace posible.', 'Business and Guest Experience transformation — not a catalogue of tools.': 'Transformación del negocio y de la Experiencia del Huésped, no un catálogo de herramientas.', 'Guest Intelligence Audit': 'Auditoría de Inteligencia del Huésped', 'Map the guest journey, information flow, systems, friction, hand-off failures, AI opportunities and business impact.': 'Analizar el recorrido del huésped, los flujos de información, los sistemas, las fricciones, los fallos en los traspasos, las oportunidades de IA y su impacto en el negocio.',
  'Intelligent Guest Journey Design': 'Diseño inteligente del recorrido del huésped', 'Design continuity from pre-arrival to post-stay — with guest memory, anticipation and clear departmental ownership.': 'Diseñar continuidad desde antes de la llegada hasta después de la estancia, con memoria del huésped, anticipación y responsables claros en cada departamento.', 'AI & Automation Architecture': 'Arquitectura de IA y automatización', 'Create intelligent workflows, conversational AI, guest memory systems and information routing around real hospitality operations.': 'Crear flujos de trabajo inteligentes, IA conversacional, sistemas de memoria del huésped y circulación de información adaptados a operaciones hoteleras reales.', 'Advisory · Training · Speaking': 'Asesoría · Formación · Conferencias', 'Guest Experience, Applied AI, human-centred automation and the operational future of intelligent hospitality.': 'Experiencia del Huésped, IA aplicada, automatización centrada en las personas y el futuro operativo de una hospitalidad inteligente.',
  'Not sure where to start?': '¿No sabes por dónde empezar?', 'Start with a conversation.': 'Empecemos conversando.', 'The connected signal': 'La señal conectada', 'Exceptional hospitality is not about knowing more.': 'La hospitalidad excepcional no consiste en saber más.', 'It is about knowing what matters —': 'Consiste en saber qué importa —', 'and acting on it at the right moment.': 'y actuar en el momento oportuno.', 'Guest Intelligence · Operational Intelligence · Territorial Intelligence · Applied AI · Hospitality Operations': 'Inteligencia del Huésped · Inteligencia Operativa · Inteligencia Territorial · IA aplicada · Operaciones hoteleras', 'Return to the signal ↑': 'Volver a la señal ↑',
  'Close booking': 'Cerrar reserva', 'Let’s talk.': 'Hablemos.', 'Choose a time for a 30-minute conversation about your guest journey, operations or hospitality intelligence challenge.': 'Elige una hora para conversar durante 30 minutos sobre el recorrido de tus huéspedes, tus operaciones o un reto de inteligencia hotelera.', 'Call availability information': 'Información sobre disponibilidad', 'CALL AVAILABILITY': 'HORARIO DE LLAMADAS', 'Monday–Friday, 10:00–14:00 (Canary Islands time).': 'De lunes a viernes, de 10:00 a 14:00 (hora de Canarias).', 'Can’t see a time? Email Yvonne.': '¿No encuentras un horario? Escribe a Yvonne.', 'Calendar connection pending': 'Conexión del calendario pendiente', 'The appointment schedule is ready to connect. Until then, email Yvonne directly to choose a time.': 'El calendario está listo para conectarse. Mientras tanto, escribe directamente a Yvonne para elegir una hora.', '30 minutes · booking and meeting details are shown in Calendly': '30 minutos · Calendly muestra los detalles de la reserva y la reunión',
  'Guest': 'Huésped', 'Pre-arrival': 'Antes de la llegada', 'CRM / PMS': 'CRM / PMS', 'Guest Experience': 'Experiencia del Huésped', 'Front Office': 'Recepción', 'Housekeeping': 'Pisos', 'Room readiness': 'Habitación lista',
  'Late arrival': 'Llegada tardía', 'Baby cot': 'Cuna', 'Quiet room': 'Habitación tranquila', 'Anniversary': 'Aniversario', 'Nut allergy': 'Alergia a los frutos secos', 'Airport transfer': 'Traslado al aeropuerto', 'Returning guest': 'Huésped recurrente', 'Celebration': 'Celebración', 'Dietary preference': 'Preferencia alimentaria', 'Room preference': 'Preferencia de habitación', 'Mobility request': 'Necesidad de movilidad', 'Special occasion': 'Ocasión especial', 'Preferred room location': 'Ubicación preferida de la habitación',
  'Data': 'Datos', 'Systems': 'Sistemas', 'AI': 'IA', 'Teams': 'Equipos', 'Listen': 'Escuchar', 'Guest signals': 'Señales del huésped', 'Understand': 'Comprender', 'Connect': 'Conectar', 'Systems & teams': 'Sistemas y equipos', 'Anticipate': 'Anticipar', 'Needs': 'Necesidades', 'Act': 'Actuar', 'Remember': 'Recordar', 'Learn': 'Aprender', 'Continuous improvement': 'Mejora continua',
  'Authentic silhouettes and relative positions of the eight Canary Islands': 'Siluetas auténticas y posiciones relativas de las ocho Islas Canarias', '2,100 m context': 'Contexto a 2.100 m',
};

function translateCopy(text: string, language: SiteLanguage) {
  if (language !== 'es') return text;
  const leading = text.match(/^\s*/)?.[0] ?? '';
  const trailing = text.match(/\s*$/)?.[0] ?? '';
  const key = text.slice(leading.length, text.length - trailing.length);
  if (!key) return text;
  return `${leading}${spanishCopy[key] ?? key}${trailing}`;
}

function localizeNode(node: ReactNode, language: SiteLanguage): ReactNode {
  if (typeof node === 'string') return translateCopy(node, language);
  if (Array.isArray(node)) return node.map((child) => localizeNode(child, language));
  if (!isValidElement<{ children?: ReactNode; [key: string]: unknown }>(node)) return node;
  if (typeof node.type !== 'string') return node;
  const props = { ...node.props };
  for (const attribute of ['aria-label', 'title', 'alt', 'placeholder'] as const) {
    if (typeof props[attribute] === 'string') props[attribute] = translateCopy(props[attribute], language);
  }
  if (node.props.children === undefined) return cloneElement(node, props);
  return cloneElement(node, props, localizeNode(node.props.children, language));
}

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: { url: string; parentElement: HTMLElement }) => void;
    };
  }
}

const journeyNodes = [
  'Guest', 'Pre-arrival', 'CRM / PMS', 'Guest Experience',
  'Front Office', 'Housekeeping', 'Room readiness', 'Guest',
];

const guestSignals = [
  'Late arrival', 'Baby cot', 'Quiet room', 'Anniversary', 'Nut allergy',
  'Airport transfer', 'Returning guest', 'Celebration', 'Dietary preference', 'Room preference',
  'Mobility request', 'Special occasion', 'Preferred room location',
];

const layers = ['Guest', 'Signals', 'Data', 'Context', 'Systems', 'AI', 'Teams', 'Operations', 'Experience'];

const framework = [
  ['Listen', 'Guest signals'], ['Understand', 'Context'], ['Connect', 'Systems & teams'],
  ['Anticipate', 'Needs'], ['Act', 'Operations'], ['Remember', 'Guest memory'], ['Learn', 'Continuous improvement'],
];

const services = [
  {
    title: 'Guest Intelligence Audit',
    text: 'Map the guest journey, information flow, systems, friction, hand-off failures, AI opportunities and business impact.',
  },
  {
    title: 'Intelligent Guest Journey Design',
    text: 'Design continuity from pre-arrival to post-stay — with guest memory, anticipation and clear departmental ownership.',
  },
  {
    title: 'AI & Automation Architecture',
    text: 'Create intelligent workflows, conversational AI, guest memory systems and information routing around real hospitality operations.',
  },
  {
    title: 'Advisory · Training · Speaking',
    text: 'Guest Experience, Applied AI, human-centred automation and the operational future of intelligent hospitality.',
  },
];

function GoldenNetwork({ connected = false }: { connected?: boolean }) {
  const connectedLabels = ['Guest', 'Context', 'Systems', 'Teams', 'Operations', 'Hotel', 'Territory', 'Experience', 'Memory'];
  return (
    <div className={`gold-network ${connected ? 'is-connected' : ''}`} aria-hidden="true">
      <span className="network-line nl-1" /><span className="network-line nl-2" />
      <span className="network-line nl-3" /><span className="network-line nl-4" />
      {connectedLabels.map((label, index) => <span className={`network-node nn-${index + 1}`} key={label}><i>{label}</i></span>)}
      <span className="network-pulse" />
    </div>
  );
}

function CanaryArchipelago({ language }: { language: SiteLanguage }) {
  const project = ([longitude, latitude]: readonly [number, number]) => [
    ((longitude + 18.25) / 5.1) * 1200,
    ((29.4 - latitude) / 1.95) * 500,
  ] as const;
  return (
    <svg className="archipelago-svg" viewBox="0 0 1200 500" role="img" aria-label={translateCopy('Authentic silhouettes and relative positions of the eight Canary Islands', language)}>
      <path className="atlantic-current current-one" d="M15 365 C245 250 430 420 660 280 S990 145 1190 208" />
      <path className="atlantic-current current-two" d="M10 405 C275 310 480 460 745 327 S1030 205 1190 246" />
      {canaryPaths.map((island, index) => {
        const label = project(island.centroid);
        return <g className={`island-group island-${index + 1}`} key={island.name} data-island={island.name}>
          <path className="island-halo" d={island.d} />
          <path className="island-shape" d={island.d} />
          <path className="island-contour contour-a" d={island.d} />
          <path className="island-contour contour-b" d={island.d} />
          <circle className="island-context-node" cx={label[0]} cy={label[1]} r="4" />
          <text className="island-name" x={label[0] + 10} y={label[1] + 4}>{island.name}</text>
        </g>
      })}
      <path className="territory-signal-path" d="M62 430 C210 338 260 328 405 248 S760 340 966 240 S1060 115 1130 35" />
      <circle className="territory-signal" r="5" />
    </svg>
  );
}

function ConversionActions({ onBook, placement, language }: { onBook: () => void; placement: 'nav' | 'hero' | 'work' | 'final'; language: SiteLanguage }) {
  const bookingLabel = placement === 'nav' ? 'Book a call' : 'Book a 30-min conversation';
  return (
    <div className={`conversion-actions conversion-${placement}`}>
      <button className="booking-cta" type="button" onClick={onBook}>{translateCopy(bookingLabel, language)} <span>↗</span></button>
      {placement !== 'nav' && <a className="email-cta" href={EMAIL_URL}>{translateCopy('Email Yvonne', language)} <span>↗</span></a>}
    </div>
  );
}

function CalendlyBookingWidget({ language }: { language: SiteLanguage }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bookingUrl = language === 'es' ? `${BOOKING_URL}?locale=es` : BOOKING_URL;

  const initializeWidget = () => {
    const container = containerRef.current;
    if (!container || !window.Calendly) return;
    container.replaceChildren();
    window.Calendly.initInlineWidget({ url: bookingUrl, parentElement: container });
  };

  useEffect(() => { initializeWidget(); }, [bookingUrl]);

  return (
    <div className="booking-frame-shell">
      <div
        ref={containerRef}
        className="booking-frame calendly-inline-widget"
        data-auto-load="false"
        style={{ minWidth: '320px', height: 'calc(100% - 38px)' }}
      />
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="afterInteractive"
        onReady={initializeWidget}
      />
      <a className="booking-direct" href={bookingUrl} target="_blank" rel="noreferrer">{translateCopy('Open Calendly directly', language)} <span>↗</span></a>
    </div>
  );
}

export default function Home() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [language, setLanguage] = useState<SiteLanguage>('en');

  useEffect(() => {
    document.documentElement.lang = language;
    window.dispatchEvent(new Event('resize'));
  }, [language]);

  const openBooking = () => {
    if (BOOKING_URL && window.matchMedia('(max-width: 767px)').matches) {
      window.open(BOOKING_URL, '_blank', 'noopener,noreferrer');
      return;
    }
    setBookingOpen(true);
  };

  useEffect(() => {
    if (!bookingOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setBookingOpen(false); };
    document.body.classList.add('booking-is-open');
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.classList.remove('booking-is-open');
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [bookingOpen]);

  useEffect(() => {
    const root = document.documentElement;
    const scenes = Array.from(document.querySelectorAll<HTMLElement>('.scene'));
    const canvas = document.querySelector<HTMLCanvasElement>('.narrative-signal');
    const context = canvas?.getContext('2d');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let ticking = false;

    const renderSignal = (sceneNumber: number, localProgress: number) => {
      if (!canvas || !context) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;
      if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      }
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);
      if (prefersReduced) return;
      if (width < 720) {
        context.beginPath(); context.moveTo(18, 0); context.lineTo(18, height);
        context.strokeStyle = 'rgba(194,160,90,.18)'; context.lineWidth = 1; context.stroke();
        const y = Math.max(12, Math.min(height - 12, localProgress * height));
        context.fillStyle = '#c2a05a'; context.beginPath(); context.arc(18, y, 3, 0, Math.PI * 2); context.fill();
        return;
      }

      const profiles = [
        [.46,.12,.64,.22,.77,.62,.98,.48], [.05,.31,.29,.36,.48,.47,.96,.53],
        [.04,.68,.31,.14,.60,.83,.96,.34], [.50,-.08,.50,.25,.50,.72,.50,1.08],
        [.06,.72,.28,.42,.66,.64,.96,.24], [.02,.52,.30,.16,.71,.84,.98,.48],
        [.04,.28,.28,.58,.67,.43,.97,.70], [.03,.66,.24,.16,.70,.70,.98,.31],
        [.03,.52,.33,.48,.68,.52,.98,.49], [.05,.75,.32,.52,.70,.36,.97,.18],
        [.03,.34,.30,.62,.68,.44,.98,.66], [.02,.72,.28,.18,.68,.76,.98,.24],
      ];
      const p = profiles[Math.max(0, Math.min(profiles.length - 1, sceneNumber - 1))];
      const point = (t: number) => {
        const mt = 1 - t;
        const x = mt ** 3 * p[0] + 3 * mt ** 2 * t * p[2] + 3 * mt * t ** 2 * p[4] + t ** 3 * p[6];
        const y = mt ** 3 * p[1] + 3 * mt ** 2 * t * p[3] + 3 * mt * t ** 2 * p[5] + t ** 3 * p[7];
        return [x * width, y * height] as const;
      };
      const breakScene = sceneNumber === 2;
      const travel = breakScene && localProgress > .46 ? Math.min(.55, localProgress) : Math.min(1, localProgress * 1.28);
      const drawRange = (start: number, end: number, stroke: string, lineWidth: number) => {
        context.beginPath();
        for (let index = 0; index <= 80; index++) {
          const t = start + (end - start) * (index / 80);
          const [x, y] = point(t);
          if (index) context.lineTo(x, y);
          else context.moveTo(x, y);
        }
        context.strokeStyle = stroke;
        context.lineWidth = lineWidth;
        context.stroke();
      };

      drawRange(0, breakScene ? .55 : 1, 'rgba(194,160,90,.13)', 1);
      if (breakScene) drawRange(.61, 1, 'rgba(247,243,236,.07)', 1);
      drawRange(0, travel, 'rgba(194,160,90,.72)', 1.15);
      const [orbX, orbY] = point(travel);
      const glow = context.createRadialGradient(orbX, orbY, 0, orbX, orbY, 18);
      glow.addColorStop(0, 'rgba(194,160,90,.95)'); glow.addColorStop(.2, 'rgba(194,160,90,.42)'); glow.addColorStop(1, 'rgba(194,160,90,0)');
      context.fillStyle = glow; context.beginPath(); context.arc(orbX, orbY, 18, 0, Math.PI * 2); context.fill();
      context.fillStyle = '#c2a05a'; context.beginPath(); context.arc(orbX, orbY, 3.2, 0, Math.PI * 2); context.fill();
    };

    const update = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const scrollMax = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
        const progress = prefersReduced ? 0.5 : Math.min(1, Math.max(0, window.scrollY / scrollMax));
        root.style.setProperty('--scroll-progress', progress.toFixed(4));
        let activeScene = 1;
        let activeLocal = 0;
        let nearest = Infinity;
        scenes.forEach((scene, index) => {
          const rect = scene.getBoundingClientRect();
          const local = prefersReduced ? 0.55 : Math.min(1, Math.max(0, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
          scene.style.setProperty('--scene-progress', local.toFixed(4));
          const phaseCount = Number(scene.dataset.phases || 1);
          scene.dataset.phase = String(Math.max(0, Math.min(phaseCount - 1, Math.floor(local * phaseCount))));
          const distance = Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2);
          if (distance < nearest) { nearest = distance; activeScene = index + 1; activeLocal = local; }
        });
        document.body.dataset.scene = String(activeScene).padStart(2, '0');
        document.body.dataset.phase = scenes[activeScene - 1]?.dataset.phase || '0';
        renderSignal(activeScene, activeLocal);
        ticking = false;
      });
    };

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle('is-visible', entry.isIntersecting));
    }, { threshold: 0.14 });
    scenes.forEach((scene) => revealObserver.observe(scene));

    const pointer = (event: PointerEvent) => {
      if (prefersReduced) return;
      root.style.setProperty('--pointer-x', ((event.clientX / window.innerWidth) - 0.5).toFixed(3));
      root.style.setProperty('--pointer-y', ((event.clientY / window.innerHeight) - 0.5).toFixed(3));
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    window.addEventListener('pointermove', pointer, { passive: true });
    return () => {
      revealObserver.disconnect();
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      window.removeEventListener('pointermove', pointer);
    };
  }, []);

  return localizeNode((
    <main id="top" lang={language}>
      <canvas className="narrative-signal" aria-hidden="true" />
      <div className="signal-telemetry" aria-hidden="true"><i /><span className="signal-state" /></div>
      <nav className="quiet-nav" aria-label="Primary navigation">
        <a className="wordmark" href="#top" aria-label="LumnIA home">Lumn<span>IA</span></a>
        <span className="nav-note">Tecnología con Alma</span>
        <div className="language-switch" role="group" aria-label="Choose language">
          <button type="button" lang="en" aria-label="English" aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>EN</button>
          <span aria-hidden="true">/</span>
          <button type="button" lang="es" aria-label="Spanish" aria-pressed={language === 'es'} onClick={() => setLanguage('es')}>ES</button>
        </div>
        <ConversionActions onBook={openBooking} placement="nav" language={language} />
      </nav>

      <div className="scene-rail" aria-hidden="true">
        <span className="rail-number" />
        <span className="rail-track"><i /></span>
        <span className="rail-label">Information in motion</span>
      </div>

      <section className="scene signal-scene" aria-labelledby="hero-title">
        <div className="atmosphere" aria-hidden="true" />
        <div className="signal-field" aria-hidden="true">
          <span className="depth-line depth-line-one" /><span className="depth-line depth-line-two" /><span className="depth-line depth-line-three" />
          <span className="signal-path" /><span className="signal-orb" />
          <span className="node node-one" /><span className="node node-two" /><span className="node node-three" />
        </div>
        <div className="hero-copy">
          <p className="eyebrow"><span>01</span> The signal</p>
          <h1 id="hero-title">Exceptional guest experiences <em>shouldn’t depend on someone remembering.</em></h1>
          <p className="declaration">I design the intelligence behind them.</p>
          <div className="hero-meta">
            <p>Guest Intelligence · Applied AI · Hospitality Operations</p>
            <p><strong>Yvonne Córdoba</strong><span>Founder of LumnIA</span></p>
          </div>
          <ConversionActions onBook={openBooking} placement="hero" language={language} />
          <a className="hero-scroll-cue" href="#journey">Follow the guest signal <span>↓</span></a>
        </div>
      </section>

      <section id="journey" className="scene journey-scene" data-phases="7" aria-labelledby="journey-title">
        <div className="journey-sticky">
          <div className="section-heading"><span>02</span><p>The journey</p></div>
          <div className="journey-diagram" aria-label="A baby cot request is captured, travels through hotel systems, then becomes suspended at a failed hand-off">
            <div className="journey-depth-grid" aria-hidden="true"><i /><i /><i /><i /></div>
            <div className="request-chip"><i />Guest signal <strong>Baby cot requested before arrival.</strong><span>Captured · 84 days before stay</span></div>
            <div className="journey-camera">
            <div className="journey-flow">
              {journeyNodes.map((item, index) => (
                <div className={`journey-node jn-${index + 1} ${index >= 4 ? 'after-break' : ''}`} key={`${item}-${index}`}>
                  <i /><span>{item}</span><small>{index < 4 ? 'Context received' : 'Operating without context'}</small>
                </div>
              ))}
              <span className="flow-line line-before" /><span className="flow-line line-after" />
              <span className="travelling-packet">Cot request</span>
              <span className="broken-signal"><i /><i /><b>Suspended</b></span>
            </div>
            </div>
            <div className="downstream-operation" aria-hidden="true"><span>Systems continue</span><span>Room prepared</span><span>Arrival approaches</span></div>
            <p className="context-lost">Context exists <span>But it is not operationalised</span></p>
          </div>
          <div className="impact-copy">
            <p className="display-label">Reception · the inherited consequence</p>
            <h2 id="journey-title">The problem didn’t start at Reception.</h2>
            <p>It started where guest context stopped travelling.</p>
          </div>
        </div>
      </section>

      <section className="scene intelligence-scene" data-phases="4" aria-labelledby="intelligence-title">
        <div className="section-heading"><span>03</span><p>Guest Intelligence</p></div>
        <div className="intelligence-layout">
          <div className="signal-cloud" aria-label="Disconnected guest signals becoming structured context">
            {guestSignals.map((signal, index) => <span className={`guest-signal gs-${index + 1}`} key={signal}>{signal}</span>)}
            <div className="context-links" aria-hidden="true">{Array.from({ length: 8 }).map((_, index) => <i key={index} />)}</div>
            <div className="context-core"><i />Usable<br />context</div>
            <div className="memory-node"><i />Returning guest memory</div>
          </div>
          <div className="intelligence-copy">
            <p className="kicker">Guest data is not Guest Intelligence.</p>
            <h2 id="intelligence-title">Guest Intelligence is <em>usable context.</em></h2>
            <p className="body-copy">The ability of a hospitality organisation to capture, understand and activate guest context across the entire journey.</p>
            <div className="process-sequence" aria-label="Signals become context, intelligence and action">
              {['Signals', 'Context', 'Intelligence', 'Action'].map((item, index) => <span key={item}><i>{String(index + 1).padStart(2, '0')}</i>{item}</span>)}
            </div>
            <p className="editorial-note">The right information. The right person. <strong>Before it becomes a problem.</strong></p>
          </div>
        </div>
      </section>

      <section className="scene layers-scene" data-phases="5" aria-labelledby="layers-title">
        <div className="section-heading light"><span>04</span><p>The invisible intelligence layer</p></div>
        <div className="layers-stage">
          <h2 id="layers-title" className="experience-word">Experience</h2>
          <div className="exploded-stack" aria-hidden="true">
            {layers.map((layer, index) => (
              <span key={layer} style={{ '--depth': index - 4 } as CSSProperties}>{layer}<i /></span>
            ))}
          </div>
          <div className="layer-thread" aria-hidden="true"><i /></div>
          <div className="experience-final">Experience</div>
        </div>
        <div className="layers-principle">
          <p>The guest should feel the result —<br />not see the machinery.</p>
          <strong>AI handles complexity.<br />Humans create connection.</strong>
        </div>
      </section>

      <section className="scene territory-scene" data-phases="6" aria-labelledby="territory-title">
        <div className="territory-copy">
          <div className="section-heading"><span>05</span><p>Territorial Intelligence</p></div>
          <h2 id="territory-title">Every guest experience <em>happens somewhere.</em></h2>
          <p className="territory-statement">Place is part of the data.</p>
          <p className="body-copy">Across the Canary Islands, altitude, Atlantic movement, microclimate, culture, mobility and current conditions change what is relevant — here, now.</p>
        </div>
        <div className="territory-camera">
          <div className="territory-scale" aria-hidden="true"><span>Hotel</span><i /> <span>Local environment</span><i /> <span>Island</span><i /> <span>Archipelago</span><i /> <span>Atlantic context</span></div>
          <div className="hotel-origin"><i /><strong>Property context</strong><span>Guest · Systems · Teams · Operations</span></div>
          <div className="archipelago-stage">
            <CanaryArchipelago language={language} />
            <div className="territory-readouts" aria-label="Territorial variables activated by the guest signal">
              <span className="tr-1">Island <i>Tenerife</i></span><span className="tr-2">Altitude <i>2,100 m context</i></span>
              <span className="tr-3">Microclimate <i>North · humid</i></span><span className="tr-4">Trade winds <i>Active</i></span>
              <span className="tr-5">Mobility <i>Relevant radius</i></span><span className="tr-6">Current conditions <i>Context updated</i></span>
            </div>
          </div>
          <div className="territory-focus" aria-hidden="true"><span>Archipelago</span><i>→</i><span>Island</span><i>→</i><span>Local area</span><i>→</i><span>Property</span><i>→</i><span>Guest</span></div>
        </div>
      </section>

      <section className="scene triad-scene" data-phases="5" aria-labelledby="triad-title">
        <div className="section-heading light"><span>06</span><p>Guest × Hotel × Territory</p></div>
        <div className="triad-layout">
          <div className="context-engine" aria-label="Guest, hotel and territorial context progressively filter possibilities into relevance">
            <div className="context-field guest-field"><span>01</span><strong>Guest context</strong><p>Preferences · intent · needs · history · mobility · companions · pace</p><i /></div>
            <div className="context-field hotel-field"><span>02</span><strong>Hotel context</strong><p>Island · location · service proposition · capabilities · partners · resources</p><i /></div>
            <div className="context-field territory-field"><span>03</span><strong>Territorial context</strong><p>Local area · distance · altitude · weather · culture · mobility · seasonality</p><i /></div>
            <div className="context-field moment-field"><span>04</span><strong>Time / moment</strong><p>Day of stay · current conditions · operational availability</p><i /></div>
            <div className="engine-core"><i />Relevance<span>Context understood</span></div>
            <span className="engine-route er-1" /><span className="engine-route er-2" /><span className="engine-route er-3" /><span className="engine-route er-4" />
          </div>
          <div className="filter-system">
            <p className="guest-quote">“I’d love to experience the Canary Islands beyond the obvious.”</p>
            <p className="possibility-label">Possibility field <span>Context progressively removes noise</span></p>
            <div className="options-field">
              {['Volcanic trail', 'Local table', 'Night sky', 'Coastal route', 'Market morning', 'Forest walk', 'Island craft', 'Sea crossing', 'Village festival', 'Vineyard landscape', 'Rural workshop', 'Atlantic viewpoint'].map((option, index) => (
                <span className={`option option-${index + 1}`} key={option}>{option}</span>
              ))}
            </div>
            <div className="filter-lenses" aria-hidden="true"><i className="lens-guest" /><i className="lens-hotel" /><i className="lens-territory" /><i className="lens-moment" /></div>
            <div className="filter-sequence"><span>Context</span><i>→</i><span>Relevance</span><i>→</i><span>Anticipation</span><i>→</i><span>Experience</span></div>
          </div>
        </div>
        <div className="triad-thesis">
          <h2 id="triad-title">More options don’t create a better guest experience. <em>Better context does.</em></h2>
          <p>The hotel is not the destination. <strong>It is the interface between the guest and the place.</strong></p>
        </div>
      </section>

      <section className="scene three-scene" aria-labelledby="three-title">
        <div className="section-heading"><span>07</span><p>Three intelligences</p></div>
        <div className="three-system">
          <div className="intelligence-axis"><span>01</span><h3>Guest Intelligence</h3><p>Understand the person.</p><small>Who is this guest?</small><b>Preferences · Intent · Needs · Memory · Behaviour · Context</b></div>
          <div className="intelligence-axis"><span>02</span><h3>Operational Intelligence</h3><p>Enable the hotel to act.</p><small>What can this hotel actually do?</small><b>Teams · Systems · Processes · AI · Capabilities · Ownership · Timing</b></div>
          <div className="intelligence-axis"><span>03</span><h3>Territorial Intelligence</h3><p>Understand the place.</p><small>What does this place make relevant now?</small><b>Island · Local area · Climate · Landscape · Culture · Mobility · Seasonality</b></div>
          <div className="convergence" aria-hidden="true"><i /><i /><i /></div>
        </div>
        <div className="anticipatory-core"><p>Anticipatory</p><h2 id="three-title">Guest Experience</h2><span>Understand the guest. Understand the operation. Understand the place.</span></div>
      </section>

      <section className="scene framework-scene" data-phases="7" aria-labelledby="framework-title">
        <div className="section-heading light"><span>08</span><p>LumnIA Framework</p></div>
        <div className="framework-intro">
          <p className="kicker">One system. Seven evolving states.</p>
          <h2 id="framework-title">LumnIA Guest Intelligence Framework</h2>
        </div>
        <div className="framework-machine">
          <div className="machine-network" aria-hidden="true">
            <span className="machine-path" /><span className="anticipated-path" /><span className="machine-cursor" />
            <span className="signal-input si-1" /><span className="signal-input si-2" /><span className="signal-input si-3" />
            <span className="operational-task task-1">Guest Experience</span><span className="operational-task task-2">Operations</span>
            <span className="persistent-memory"><i />Guest memory</span>
            {Array.from({ length: 11 }).map((_, index) => <i className={`mn-${index + 1}`} key={index} />)}
          </div>
          <div className="framework-state-copy" aria-label="The seven evolving states of the LumnIA Guest Intelligence Framework">
            {framework.map(([title, caption], index) => (
              <div className={`framework-state state-${index + 1}`} key={title}><span>{String(index + 1).padStart(2, '0')}</span><strong>{title}</strong><p>{caption}</p>{title === 'Understand' && <small>Guest · Operation · Place</small>}{title === 'Anticipate' && <small>The next path exists before the signal arrives.</small>}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="scene human-scene" aria-labelledby="human-title">
        <div className="section-heading"><span>09</span><p>Human + Artificial Intelligence</p></div>
        <div className="human-grid">
          <div className="capability-list system-list"><p>AI & Systems</p>{['Capture signals', 'Structure context', 'Retrieve memory', 'Identify patterns', 'Coordinate workflows', 'Automate repetitive work', 'Support anticipation'].map(x => <span key={x}>{x}</span>)}</div>
          <div className="human-centre"><i aria-hidden="true" /><strong>AI handles complexity.<br />Humans create connection.</strong><h2 id="human-title">Technology shouldn’t replace hospitality.</h2><p>It should remove what prevents people from delivering it.</p></div>
          <div className="capability-list people-list"><p>Humans</p>{['Empathy', 'Judgement', 'Conversation', 'Creativity', 'Sensitivity', 'Exception handling', 'Emotional connection'].map(x => <span key={x}>{x}</span>)}</div>
        </div>
      </section>

      <section className="scene authority-scene" aria-labelledby="authority-title">
        <div className="portrait-monogram" aria-hidden="true"><span>YC</span><i /></div>
        <div className="authority-copy">
          <div className="section-heading light"><span>10</span><p>The person behind the system</p></div>
          <p className="kicker authority-positioning">Yvonne Córdoba · Hospitality & Guest Experience Expert · Applied AI · Guest Intelligence · Hospitality Operations · Founder of LumnIA</p>
          <h2 id="authority-title">“I came to AI from hospitality — <em>not the other way around.</em>”</h2>
          <p className="body-copy">Yvonne Córdoba’s work begins with real hospitality operations, Guest Experience, customer journeys and service excellence. AI and automation are the tools she uses to redesign recurring failures at system level.</p>
          <p className="body-copy">LumnIA is where this thinking becomes implementation.</p>
          <div className="brand-manifesto" aria-live="polite">
            <p>LumnIA wasn't born to automate hotels.</p>
            <p>It was born to help those who live and breathe hospitality create experiences their guests will never forget.</p>
          </div>
          <p className="authority-method">Methodology <i>·</i> Systems <i>·</i> Implementation <i>·</i> Experimentation</p>
          <div className="authority-meta"><span>Selected hospitality experience</span><span>Verified credentials</span><span>Speaking & projects</span><small>Details to be added</small></div>
        </div>
      </section>

      <section id="work" className="scene work-scene" aria-labelledby="work-title">
        <div className="section-heading"><span>11</span><p>Work with Yvonne</p></div>
        <div className="work-intro"><h2 id="work-title">Transform the experience. <em>Redesign the system behind it.</em></h2><p>Business and Guest Experience transformation — not a catalogue of tools.</p></div>
        <div className="service-pathways">
          {services.map((service, index) => (
            <article key={service.title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{service.title}</h3><p>{service.text}</p><i>↗</i></article>
          ))}
        </div>
        <div className="work-conversion">
          <p>Not sure where to start?</p>
          <h3>Start with a conversation.</h3>
          <ConversionActions onBook={openBooking} placement="work" language={language} />
        </div>
      </section>

      <section id="contact" className="scene final-scene" aria-labelledby="final-title">
        <div className="section-heading light"><span>12</span><p>The connected signal</p></div>
        <GoldenNetwork connected />
        <div className="final-copy">
          <h2 id="final-title">Exceptional hospitality is not about knowing more.</h2>
          <p>It is about knowing what matters —<br /><em>and acting on it at the right moment.</em></p>
          <div className="final-brand"><strong>Yvonne Córdoba × LumnIA</strong><span>Guest Intelligence · Operational Intelligence · Territorial Intelligence · Applied AI · Hospitality Operations</span></div>
          <ConversionActions onBook={openBooking} placement="final" language={language} />
        </div>
        <footer><span>© Yvonne Córdoba · LumnIA</span><a href="#top">Return to the signal ↑</a></footer>
      </section>

      {bookingOpen && (
        <div className="booking-overlay" role="presentation" onMouseDown={() => setBookingOpen(false)}>
          <section className="booking-dialog" role="dialog" aria-modal="true" aria-labelledby="booking-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="booking-close" type="button" aria-label="Close booking" autoFocus onClick={() => setBookingOpen(false)}>×</button>
            <p className="booking-kicker">Yvonne Córdoba × LumnIA</p>
            <h2 id="booking-title">Let’s talk.</h2>
            <p className="booking-copy">Choose a time for a 30-minute conversation about your guest journey, operations or hospitality intelligence challenge.</p>
            <aside className="booking-info-note" role="note" aria-label="Call availability information">
              <span>CALL AVAILABILITY</span>
              <p>Monday–Friday, 10:00–14:00 (Canary Islands time). <a href={EMAIL_URL}>Can’t see a time? Email Yvonne.</a></p>
            </aside>
            {BOOKING_URL ? (
              <CalendlyBookingWidget language={language} />
            ) : (
              <div className="booking-pending">
                <span>Calendar connection pending</span>
                <p>The appointment schedule is ready to connect. Until then, email Yvonne directly to choose a time.</p>
                <a href={EMAIL_URL}>Email Yvonne <i>↗</i></a>
              </div>
            )}
            <p className="booking-method">30 minutes · booking and meeting details are shown in Calendly</p>
          </section>
        </div>
      )}
      <AuroraChat language={language} />
    </main>
  ), language);
}

