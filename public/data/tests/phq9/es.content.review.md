# Revisión clínica: PHQ-9 — es.content.json (v2)

**Estado:** `draft-pending-clinical-review`  
**Generado:** 2026-11-02 · `clinical-landing-writer-v2`  
**Fuente de investigación:** `.research/phq9.md` (motor: PubMed y Crossref; OpenAlex falló) + `.dossier.json`. Las seis referencias del bloque de validación están verificadas una a una en PubMed (metadatos y resumen).  
**Autora firmante (pendiente):** Cristina Domingo Gutiérrez (M-30745)  
**Revisor firmante (pendiente):** Emmanuel Rodríguez de Vera Ríos (M-18523)

---

> **Instrucciones para la revisión:**
> Como en el GAD-7, los `[REVISAR]` están aquí y no dentro de `es.content.json`: en cuanto el fichero no tiene `[PENDIENTE]`, la landing lo publica, y los marcadores se verían en la web.
> Tras la revisión, editar `es.content.json` directamente. Cambiar `status` a `"clinically-approved"` y completar `clinicallyApprovedBy` / `clinicallyApprovedAt`.

---

## ⚠️ Acciones pendientes de revisión humana

1. ~~**[Qué hacer con tu resultado]** **Rango Moderado-grave (15–19) sin 024.** La plantilla solo exige el 024 en «Grave». El GAD-7 no tiene este rango. ¿Se añade también aquí?~~ — **resuelto (Emmanuel, 2026-11-02): no.** El 024 solo en «Grave», también en la pantalla de resultados.
2. ~~**[Validación]** **Corte 12 en atención primaria española.** Muñoz-Navarro 2017 propone 12 para cribado en AP; la app usa 10 como inicio de «Moderado» (Kroenke 2001, Levis 2019). Los puntos de corte no se tocan; decidir si se mantiene la mención en el texto.~~ — **resuelto (Emmanuel, 2026-11-02): se mantiene.** El texto cita a Muñoz-Navarro 2017 y su propuesta de corte 12 en AP; la app sigue con los rangos de Kroenke 2001 (≥10 = Moderado), que no se tocan.
3. **[Validación]** **Diez-Quevedo 2001 valida el PHQ completo**, en pacientes hospitalizados, no específicamente el PHQ-9 en consulta. Está dicho así en el texto; confirmar que la frase «tiene una versión validada en España» (¿Qué mide?) os parece justa con [2] y [3].
4. **[Pregunta 9 (seguridad, para la auditoría)]** El texto explica el comportamiento real de la app (verificado en `scoringFunctions.ts:320`): cualquier respuesta distinta de «Nunca» en la pregunta 9 oculta la puntuación y muestra apoyo y teléfonos. Aparece en «Cómo funciona», en la limitación 2, en un párrafo de «Qué hacer con tu resultado» y en una FAQ nueva. Revisar redacción y tono en la auditoría de seguridad.
5. **[¿A quién está dirigido? — limitaciones 4 y 6]** Sin cita: problemas médicos/fármacos/sueño que suben la puntuación (como en el GAD-7) y que el PHQ-9 no explora fases de ánimo elevado (bipolaridad). La segunda se deduce de los ítems; confirmar redacción.
6. **[FAQ — frecuencia]** «Cada 2–4 semanas», sin cita, igual que en el GAD-7.
7. ~~**[Fuera de la skill: pantalla de resultados]** `es.json` → `results.normal` tiene textos que chocan con el tono de la landing: «ES RECOMENDABLE…», «ES IMPORTANTE…», «Tus síntomas indican una depresión grave…», «Contacta… HOY». No es parte de `es.content.json`; en el GAD-7 se ajustó el rango grave. Decidir si se revisa ahora o en la auditoría.~~ — **resuelto (Emmanuel, 2026-11-02): se revisa ahora.** `body` y `recommendation` de los cinco rangos reescritos con el criterio de la landing: orientativo, sin mayúsculas ni lenguaje diagnóstico, sin CTA comercial, 024 solo en «Grave». Títulos de categoría y bloque `crisis` sin tocar (este último, para la auditoría).
8. **[Fuera de la skill: metadata.json]** `validation.spanishValidation.note` dice «referencia exacta pendiente de completar manualmente». Se puede rellenar con Diez-Quevedo 2001 (doi 10.1097/00006842-200107000-00021). La skill no modifica metadata.

---

## Contenido en prosa

## Hero

**Título:**
Test PHQ-9: cuestionario orientativo de síntomas de depresión

**Subtítulo:**
Nueve preguntas sobre el ánimo, el interés por las cosas, el sueño, la energía y otros síntomas de las dos últimas semanas. El resultado te sirve como punto de partida para hablarlo con un profesional.

**Contexto clínico:**
Es una herramienta clínica de apoyo. Está pensada para usarse junto con un profesional, o para llevar un registro orientativo a una primera consulta.

**Badges:**
- Instrumento validado · 9 preguntas · 3-5 min · Sin registro · Datos en tu navegador

---

## ¿Qué mide este test?

El PHQ-9 es un cuestionario de nueve preguntas sobre cómo te has encontrado en las dos últimas semanas: si has tenido poco interés o alegría por hacer cosas, si te has sentido decaído o sin esperanza, si has dormido mal o demasiado, si has notado cansancio o poca energía, cambios en el apetito, si te has sentido mal contigo mismo, si te ha costado concentrarte, si te has movido o hablado más despacio de lo normal o, al contrario, has estado más inquieto, y si has tenido pensamientos de que estarías mejor muerto o de hacerte daño.

Cada pregunta corresponde a uno de los nueve síntomas con los que se define un episodio depresivo. Lo central es un ánimo bajo o una pérdida de interés por lo que antes importaba, que se mantienen la mayor parte del día durante al menos dos semanas y que se acompañan de otros síntomas, como cambios en el sueño, el apetito o la energía. Por eso el cuestionario pregunta por las últimas dos semanas y por la frecuencia de cada síntoma.

Lo desarrollaron Kroenke, Spitzer y Williams en 2001 como el módulo de depresión del Patient Health Questionnaire (PHQ). Es uno de los cuestionarios de depresión más utilizados en atención primaria y tiene una versión validada en España.

---

## ¿A quién está dirigido?

El PHQ-9 es un cuestionario que responde la propia persona. Se creó para detectar posibles casos de depresión y valorar su intensidad en atención primaria, y hoy también se usa para seguir la evolución en consulta. Su resultado no es un diagnóstico: indica si tiene sentido una valoración más completa.

Resulta especialmente útil para quienes ya están en proceso clínico y quieren complementar la valoración de su profesional, o para quienes han tomado la decisión de pedir ayuda y quieren llegar a esa primera cita con un punto de partida estructurado. También lo utilizan profesionales clínicos y estudiantes de ciencias de la salud para familiarizarse con el instrumento.

Si nunca has consultado y no sabes si lo que te pasa merece atención, el resultado puede ayudarte a ordenarlo, pero no responde del todo a esa pregunta. Para eso, lo mejor es hablarlo con un psicólogo, con tu médico de cabecera o con el servicio de salud mental más cercano.

**Indicaciones:**
- Personas en seguimiento por un profesional de salud mental que quieran apoyar la valoración o llevar un registro de síntomas entre sesiones.
- Personas que han decidido pedir ayuda y quieren disponer de un registro orientativo para llevar a una primera consulta.
- Personas con dudas sobre cómo se están sintiendo que quieren poner palabras a su experiencia antes de hablar con un profesional.
- Profesionales clínicos, estudiantes de Psicología o Medicina e investigadores que quieran consultar el instrumento y su validación.
- Pacientes de atención primaria a quienes su médico de cabecera ha recomendado completar el cuestionario como parte de la valoración.

**Limitaciones (revisar con atención):**
1. No es una herramienta diagnóstica. No sustituye la evaluación por parte de un profesional de la salud mental.
2. No es adecuado en una crisis o si ahora mismo tienes pensamientos de hacerte daño: en esos casos, la prioridad es hablar con alguien, no rellenar un cuestionario. Puedes llamar al 024, o al 112 si hay peligro inmediato.
3. Está pensado para mayores de 18 años: esta versión y sus puntos de corte se refieren a población adulta.
4. Algunos problemas médicos, ciertos fármacos o una mala racha de sueño pueden producir cansancio, cambios de apetito o dificultad para concentrarse, y subir la puntuación sin que haya un cuadro depresivo.
5. Una puntuación baja no descarta una depresión: el cuestionario no detecta todos los casos.
6. No pregunta por fases de ánimo muy elevado o acelerado, así que no permite distinguir una depresión de un trastorno bipolar. Eso requiere una valoración profesional.
7. La versión que usamos es la validada en España. En otros países hispanohablantes se usan versiones distintas.

---

## Cómo funciona

El test consta de 9 preguntas sobre cómo te has sentido durante las últimas dos semanas. Cada pregunta ofrece cuatro opciones de respuesta, desde «Nunca» hasta «Casi cada día». No hay respuestas correctas o incorrectas; solo describe lo que mejor se ajusta a tu experiencia. Al final puede aparecer una pregunta más, sobre cuánto te han dificultado estos problemas el trabajo, la casa o las relaciones, que no suma a la puntuación.

La puntuación total oscila entre 0 y 27 puntos. El resultado se interpreta según los rangos establecidos en la validación original del instrumento. La novena pregunta trata sobre pensamientos de muerte o de hacerse daño: si marcas cualquier opción distinta de «Nunca», en lugar de la puntuación verás directamente información de apoyo y teléfonos de ayuda.

Esta herramienta se usa típicamente en el marco de un proceso de evaluación o seguimiento. Si ya estás en consulta, tu profesional puede decirte si te conviene completarlo; si todavía no has consultado, el resultado puede servirte para llevar un registro orientativo a una primera cita.

1. Respondes 9 preguntas sobre cómo te has sentido las últimas 2 semanas.
2. Cada pregunta tiene 4 opciones: «Nunca», «Varios días», «Más de la mitad de los días» y «Casi cada día».
3. Marcas la que mejor describe tu experiencia. Puedes ir atrás si lo necesitas.
4. El sistema calcula automáticamente tu puntuación total (rango 0–27).
5. Ves tu puntuación y qué suele indicar ese rango.

---

## Validación científica

El PHQ-9 lo presentaron Kroenke, Spitzer y Williams en 2001 a partir de 6.000 pacientes de ocho consultas de atención primaria y siete de obstetricia y ginecología. En 580 de ellos se comparó el cuestionario con una entrevista de un profesional de salud mental: con un punto de corte de 10, detectó el 88% de los casos de depresión mayor y descartó correctamente al 88% de las personas sin ella. El mismo estudio propuso los puntos 5, 10, 15 y 20 como límites de depresión leve, moderada, moderadamente grave y grave [1].

La versión española del cuestionario completo (PHQ) la validaron Diez-Quevedo y colaboradores en 2001 con 1.003 pacientes hospitalizados en un hospital general. Frente a la entrevista clínica, identificó cualquiera de los trastornos que explora el PHQ con una sensibilidad del 87% y una especificidad del 88% [2]. En atención primaria española, Muñoz-Navarro y colaboradores (2017) estudiaron a 178 pacientes: con el corte de 10, el PHQ-9 detectó el 95% de los casos de depresión mayor, pero también dio positivo en una de cada tres personas sin ella. Con un corte de 12, el equilibrio fue mejor (84% y 78%), y los autores lo proponen para el cribado en ese contexto [3].

Las revisiones que reúnen muchos estudios confirman su utilidad con matices. Manea y colaboradores (2012) encontraron un rendimiento aceptable con puntos de corte entre 8 y 11 [4]. Un metaanálisis con datos individuales de más de 17.000 participantes (Levis y colaboradores, 2019) situó en 10 el corte que mejor equilibra detección y descarte, con independencia de la edad [5]. Costantini y colaboradores (2021) observaron una gran variabilidad entre estudios y recomiendan usarlo en dos pasos: un resultado positivo debe ir seguido de una evaluación clínica [6]. Por eso el PHQ-9 sirve para orientar, no para diagnosticar.

**Referencias:**

1. Kroenke K, Spitzer RL, Williams JBW (2001). The PHQ-9: validity of a brief depression severity measure. *J Gen Intern Med*, 16(9), 606–613. [doi:10.1046/j.1525-1497.2001.016009606.x](https://doi.org/10.1046/j.1525-1497.2001.016009606.x)
2. Diez-Quevedo C, Rangil T, Sanchez-Planell L, Kroenke K, Spitzer RL (2001). Validation and utility of the patient health questionnaire in diagnosing mental disorders in 1003 general hospital Spanish inpatients. *Psychosom Med*, 63(4), 679–686. [doi:10.1097/00006842-200107000-00021](https://doi.org/10.1097/00006842-200107000-00021)
3. Muñoz-Navarro R, Cano-Vindel A, Medrano LA, et al. (2017). Utility of the PHQ-9 to identify major depressive disorder in adult patients in Spanish primary care centres. *BMC Psychiatry*, 17(1), 291. [doi:10.1186/s12888-017-1450-8](https://doi.org/10.1186/s12888-017-1450-8)
4. Manea L, Gilbody S, McMillan D (2012). Optimal cut-off score for diagnosing depression with the Patient Health Questionnaire (PHQ-9): a meta-analysis. *CMAJ*, 184(3), E191–E196. [doi:10.1503/cmaj.110829](https://doi.org/10.1503/cmaj.110829)
5. Levis B, Benedetti A, Thombs BD; DEPRESSD Collaboration (2019). Accuracy of Patient Health Questionnaire-9 (PHQ-9) for screening to detect major depression: individual participant data meta-analysis. *BMJ*, 365, l1476. [doi:10.1136/bmj.l1476](https://doi.org/10.1136/bmj.l1476)
6. Costantini L, Pasquarella C, Odone A, et al. (2021). Screening for depression in primary care with Patient Health Questionnaire-9 (PHQ-9): a systematic review. *J Affect Disord*, 279, 473–483. [doi:10.1016/j.jad.2020.09.131](https://doi.org/10.1016/j.jad.2020.09.131)

---

## Qué hacer con tu resultado

Una puntuación en el rango Mínimo (0–4 puntos) indica que en las dos últimas semanas has tenido pocos síntomas depresivos, o ninguno. Aun así, una puntuación baja no descarta un problema: si sientes que algo no va bien, tiene sentido hablarlo con un profesional. Si ya tienes un profesional de referencia, puedes comentarle el resultado en tu próxima consulta.

Una puntuación en el rango Leve (5–9 puntos) puede reflejar síntomas presentes de forma intermitente, a veces ligados a una mala racha o a un periodo de estrés. Es razonable observar cómo evolucionan y cuidar el sueño, la actividad y el contacto con otras personas. Si los síntomas persisten varias semanas o te generan malestar, puede tener sentido hablarlo con un profesional. Si ya estás en seguimiento, es información útil para comentar en tu próxima sesión.

Una puntuación en el rango Moderado (10–14 puntos) es información útil para llevar a consulta. La literatura clínica señala este umbral como punto de referencia para recomendar valoración profesional. Si ya estás en seguimiento profesional, compártelo en tu próxima sesión. Si aún no tienes psicólogo/a de referencia y quieres comentar este resultado con alguien, en Psicoprotego podemos acompañarte a dar los primeros pasos.

Una puntuación en el rango Moderado-grave (15–19 puntos) sugiere síntomas intensos que probablemente están afectando a tu día a día. Es recomendable hablar pronto con un profesional sanitario —psicólogo/a, psiquiatra o médico/a de familia— para valorar tu situación con contexto.

Una puntuación en el rango Grave (20–27 puntos) sugiere malestar muy significativo. Es recomendable hablar cuanto antes con un profesional sanitario —psicólogo/a, psiquiatra o médico/a de familia— para valorar tu situación con contexto. Si en este momento el malestar es muy intenso, en España puedes llamar al **024** (línea de atención a la conducta suicida y crisis de salud mental, gratuita, 24h).

Con independencia de la puntuación, si has tenido pensamientos de que estarías mejor muerto/a o de hacerte daño, no esperes a tener un resultado: habla con alguien hoy. Puedes llamar al **024**, o al **112** si hay peligro inmediato.

Los rangos son orientativos. Una misma puntuación puede tener significados clínicos distintos según el contexto vital de cada persona. Solo un/una profesional de salud mental puede establecer un diagnóstico tras una evaluación completa.

---

## Preguntas frecuentes

**¿Es un diagnóstico?**
No. El PHQ-9 es un instrumento de cribado orientativo, no una herramienta diagnóstica. Una puntuación elevada puede señalar que merece la pena hablar con un profesional, pero el diagnóstico de depresión —o de cualquier otro cuadro— solo puede establecerlo un profesional de la salud mental tras una evaluación completa.

**¿Quedan guardadas mis respuestas?**
No. Tus respuestas se procesan únicamente en tu navegador y no se envían a ningún servidor. No guardamos ningún dato sobre ti. Solo tú decides qué hacer con el resultado.

**¿Puedo compartirlo con mi psicólogo/a?**
Sí. Puedes descargar el resultado en PDF y llevarlo a tu consulta. Es una forma práctica de aportar contexto inicial antes de una sesión, aunque el/la profesional hará su propia valoración independientemente.

**¿Qué hago si el resultado es alto?**
Un resultado elevado —a partir del rango Moderado— sugiere que podría valer la pena hablar con un profesional de salud mental, y cuanto más alto, antes. La decisión de consultar no la toma el test: la toma el malestar que sientes. Si ese malestar es muy intenso ahora mismo, en España puedes llamar al 024, línea gratuita de atención a la conducta suicida y crisis de salud mental, disponible las 24 horas.

**¿Por qué pregunta por pensamientos de muerte o de hacerse daño?**
Porque son uno de los síntomas con los que se define un episodio depresivo, y forman parte del cuestionario original. Si marcas cualquier opción distinta de «Nunca» en esa pregunta, el test no te muestra la puntuación, sino información de apoyo y teléfonos de ayuda. Si tienes esos pensamientos ahora, puedes llamar al 024, o al 112 si hay peligro inmediato.

**¿Cuándo debería ver a un psicólogo, un psiquiatra o mi médico de cabecera?**
Como orientación general: el médico de cabecera es habitualmente el primer punto de contacto y puede derivar si lo considera necesario. El psicólogo/a es el profesional indicado para intervención psicológica (terapia, acompañamiento, estrategias de manejo). El psiquiatra entra en escena cuando puede ser necesaria una evaluación farmacológica o cuando hay comorbilidad compleja. Si tienes dudas sobre por dónde empezar, tu médico de familia puede orientarte. Lo que no debería decidir es el resultado de este test.

**¿Este test puede decirme si necesito ayuda profesional?**
En parte. Una puntuación de 10 o más indica que conviene una valoración profesional, y para eso se usa como cribado. Lo contrario no funciona igual: una puntuación baja no significa que no debas pedir ayuda. Si lo que sientes te pesa en el día a día, ese ya es motivo suficiente para consultar, salga lo que salga.

**¿Con qué frecuencia puedo repetirlo?**
El PHQ-9 evalúa los síntomas de las últimas dos semanas. Repetirlo cada 2–4 semanas puede ser útil para observar si los síntomas cambian con el tiempo, especialmente si estás en proceso terapéutico. Si lo usas para seguimiento, comentar la evolución con tu profesional de referencia le dará más sentido al registro.

---

## Privacidad

Tus respuestas no salen de tu dispositivo. No se envían a ningún servidor de Psicoprotego ni de terceros. Decides tú qué compartir y con quién: puedes descargar un PDF del resultado para llevarlo a tu terapeuta, o cerrar la pestaña sin que quede ningún registro.

---

## Auditoría de la fase 3 (listas de la skill)

| Bloque | Resultado |
|---|---|
| A. Lenguaje diagnóstico | ✅ Sin «tienes/padeces»; rangos como orientativos; el test no decide si consultar. |
| B. Alarmismo | ✅ Hero descriptivo, sin apelación emocional. |
| C. Crisis | ✅ 024 en Grave, sin CTA comercial; 024/112 en pregunta 9; «no es diagnóstico» en limitaciones. Moderado-grave sin 024 (decidido). |
| D. Referencias | ✅ Seis fuentes con DOI verificado en PubMed. Sin cifra de prevalencia ni de consistencia interna (no verificables). |
| E. Limitaciones | ✅ 7 limitaciones; validación española y población adulta mencionadas. |
| F. Privacidad | ✅ Redacción base, sin excepciones. |
| G. CTA calibrado | ✅ Mínimo/Leve sin CTA; Moderado con texto de proceso (igual que el GAD-7 aprobado por Emmanuel); Moderado-grave y Grave sin CTA comercial. |
| H. Firma | ✅ Autora Cristina, revisor Emmanuel; ambos con especialidad «Adultos». |
| J. Encuadre clínico | ✅ Hero, indicaciones, «Cómo funciona» e interpretación en flujo clínico; FAQ de psicólogo/psiquiatra/médico incluida. |

---

## Firma clínica pendiente

Para aprobar, editar `es.content.json` con:
- status: "clinically-approved"
- clinicallyApprovedBy: "cristina" | "emmanuel"
- clinicallyApprovedAt: "<ISO-8601>"
- lastEditedBy: "cristina" | "emmanuel"

Y resolver antes las acciones pendientes de arriba.
