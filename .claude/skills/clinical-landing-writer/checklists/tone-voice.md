# Patrón de voz heredado de `/servicios/*`

## Registro general
- Profesional-cercano. No académico seco, no coloquial gracioso.
- Segunda persona en hero/subtitle (conecta con el lector).
- Tercera persona impersonal en secciones técnicas (whatItMeasures,
  validation).
- Primera persona plural (nosotros/Psicoprotego) solo en CTAs
  calibrados y en `privacy`.

## Léxico a favor

### Vocabulario clínico-acompañante
- "orientativo", "señal", "ayuda a", "puede indicar", "sugiere"
- "valoración", "acompañamiento", "apoyo profesional"
- "evalúa", "mide", "explora", "registra"

### Vocabulario de uso en contexto clínico
- "en el marco de una evaluación profesional"
- "como apoyo a tu proceso terapéutico"
- "para llevar a una primera consulta"
- "compartir con tu psicólogo/a o médico/a"
- "instrumento de uso clínico"
- "herramienta clínica de apoyo"

## Léxico a evitar

### Marketing/hype
- "descubre", "revela", "desvela"
- "test gratis", "online al instante", "rápido y fácil"
- emojis, signos de exclamación en títulos, mayúsculas enfáticas

### Lenguaje diagnóstico
- "tienes", "padeces", "sufres de" (referido a condiciones)
- "curar", "solucionar", "arreglar"
- "diagnostica", "confirma" (referido al test)

### Lenguaje de autocribado/autodecisión
- "averigua si tienes ansiedad"
- "comprueba tu nivel"
- "descubre si necesitas ayuda profesional"
- "evalúate a ti mismo/a"
- "si sale alto, busca ayuda" (lenguaje condicional binario que
  delega la decisión de consultar al resultado del test)
- "tu test", "tu puntuación" como sentencia (preferir "el resultado
  orientativo")

## Encuadre editorial fundamental: herramienta clínica, no autodiagnóstico

Este es **el principio rector más importante** del skill.

### El error a evitar

El usuario llega a la landing tras buscar "test ansiedad" en Google.
Si el contenido le dice *"haz el test y descubre si tienes ansiedad
y luego decide si pedir ayuda"*, el contenido está:

- Posicionando el test como sustituto de la consulta clínica.
- Trasladando al usuario una decisión que es del profesional.
- Generando ansiedad por anticipación al resultado.
- Comprometiendo la responsabilidad sanitaria de Psicoprotego.

### El encuadre correcto

El test es una **herramienta clínica de apoyo** al proceso diagnóstico
y al seguimiento terapéutico. Sus usuarios reales son:

1. **Personas en seguimiento por un profesional** que la usan como
   apoyo entre sesiones (registro de evolución).
2. **Personas que ya han decidido pedir ayuda** y la usan para llevar
   un registro orientativo a una primera consulta.
3. **Personas con dudas sobre cómo se sienten**, a quienes el test
   les puede ayudar a poner palabras a su experiencia, pero **la
   decisión de consultar nace de su sufrimiento, no del resultado**.
4. **Profesionales clínicos y estudiantes** que consultan la
   herramienta y su validación científica.

### Cómo aplicarlo

- En `hero.subtitle`: conectar con síntoma vivido (mantenido), pero
  añadir una **micro-frase de encuadre** sobre uso en contexto.
- En `whoIsItFor`: poner los perfiles 1-4 anteriores en
  `indications`. Eliminar formulaciones como "personas que quieran
  saber si tienen ansiedad".
- En `howItWorks`: situar el uso en el flujo clínico (antes de
  consulta, en seguimiento, como apoyo).
- En `interpretation`: el resultado **orienta**, no dicta. El CTA
  no es "si sales en moderado/grave busca ayuda profesional"; es
  "comparte este resultado con tu profesional para interpretarlo
  juntos".
- En `faq`: incluir explícitamente preguntas tipo "¿Debo ir al
  psicólogo o al médico de cabecera?", "¿esto sustituye una consulta?".
- En `validation`: la información científica se mantiene íntegra y
  abierta — sirve a clínicos, estudiantes y a usuarios que quieran
  profundizar.

### Reflejo en CTA

- **Mínimo / Leve:** sin CTA comercial. Comentario neutro: "comparte
  con tu profesional si tienes uno".
- **Moderado:** CTA muy suave (no "ven a Psicoprotego"). Algo como:
  *"si quieres comentar este resultado en consulta y no tienes
  psicólogo/a de referencia, podemos ayudarte a empezar"*. Lenguaje
  de proceso, no de venta.
- **Grave:** sin CTA comercial. 024 + invitación a hablar con
  profesional sanitario (psicólogo, psiquiatra, médico de familia)
  según preferencia/disponibilidad.

## Metáforas permitidas (según /servicios/*)
- Sensaciones corporales ("el pecho apretado", "la mente que no
  para") — SOLO en hero/subtitle/interpretation, no en secciones
  técnicas.
- Comparaciones pedagógicas ("como una herida que necesita
  procesarse") — solo con moderación.

## Frases modelo (de /servicios/*)
- "Es un espacio para..." (en lugar de "te ofrecemos...")
- "Muchas personas acuden cuando..." (en lugar de "tú deberías venir si...")
- "Puede ser algo parecido a..." (en lugar de "es igual que...")

## Anclas de voz — fragmentos literales de `/servicios/*`

Estos son fragmentos reales de las páginas de servicios de
psicoprotego.es. Úsalos como referencia del registro exacto que
debe tener el contenido de tests. NO los copies literalmente en
el output (son propiedad de la web corporativa); usa su **cadencia,
longitud de frase, y elección léxica**.

### Ancla 1 — hero/body emocional (de `/servicios/terapia-individual-adultos/`)

"La terapia individual es un espacio solo para ti. Un lugar
confidencial donde explorar qué te está pasando, entender por qué
y encontrar formas de sentirte mejor. Sin juicios. A tu ritmo.

No necesitas estar en crisis para venir a terapia. Tampoco hace
falta que llegues al límite para pedir ayuda. Muchas personas
acuden simplemente porque sienten que algo no funciona, aunque
no sepan exactamente qué."

### Ancla 2 — descripción de síntoma vivido (de `/servicios/terapia-individual-adultos/`)

"Vives en alerta constante. El pecho apretado, la mente que no
para, la sensación de que algo malo va a pasar. Eres como Jason
Bourne, buscas vías de escape en todos los sitios por si acaso.
Te pones siempre en la peor de las situaciones posibles."

### Ancla 3 — descripción técnica con autoridad (de `/servicios/terapia-emdr/`)

"La terapia EMDR (Desensibilización y Reprocesamiento por
Movimientos Oculares) es un enfoque psicoterapéutico altamente
eficaz y basado en evidencia científica para tratar traumas,
estrés postraumático (TEPT), ansiedad intensa, fobias, duelos
complicados y otras experiencias adversas que siguen impactando
en el presente. Desarrollada por la Dra. Francine Shapiro en la
década de 1980, la EMDR está reconocida por la Organización
Mundial de la Salud (OMS), la Asociación Americana de Psicología
(APA) y numerosas guías clínicas internacionales como uno de los
tratamientos de elección para el trauma."

### Ancla 4 — limitaciones honestas (de `/servicios/psicoterapia-online/`)

"En casos de crisis aguda (ideación suicida grave, descompensación
psicótica), online puede no ser suficiente → derivamos a urgencias
o presencial inmediato."

### Cómo usar las anclas

- **Hero/subtitle** de test → imitar cadencia de Ancla 1 y 2:
  frases cortas, metáfora corporal, reconocimiento del síntoma
  sin dramatismo.
- **whatItMeasures / validation** → imitar Ancla 3: precisión técnica
  con instituciones citadas, sin rebajar.
- **whoIsItFor.limitations** → imitar Ancla 4: honestidad directa,
  sin eufemismos, con flecha de derivación si aplica.

## Auto-check de voz (para Fase 3)

Al revisar contenido, preguntarse:

1. ¿Podría aparecer este párrafo en `/servicios/*` sin que chirriara?
2. ¿Estamos usando metáforas corporales donde tiene sentido, o
   estamos siendo académicos por inercia?
3. ¿Hay alguna frase que sonaría rara leída en voz alta por Cristina
   o Emmanuel ante un paciente?
