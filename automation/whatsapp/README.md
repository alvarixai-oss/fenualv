# Agente WhatsApp FENUALV

Implementación del receptor Meta y respuestas basadas en 21 páginas de la web versionada. No está activado hasta configurar Meta, almacenamiento de deduplicación y validar una conversación real.

## Ejecutar y desplegar

- Desde la raíz del repositorio: `python3 automation/whatsapp/scripts/ingest.py`. Regenerar tras cada cambio del sitio. Excluye blog/editorial y ejemplos como fuentes comerciales; la base no rastrea cambios externos automáticamente.
- Pruebas: `cd automation/whatsapp && npm test`. Son simuladas, no una prueba real de WhatsApp ni de la calidad del modelo.
- Desplegar esta carpeta como servicio separado (Root Directory `automation/whatsapp`, framework Other, sin Build Command; `lib/pages.json` ya generado), para mantener la web existente.
- Callback: `/api/whatsapp`. Debe ser público para Meta; la firma HMAC autentica cada evento. No exponer `lib`, conocimiento privado o credenciales como archivos estáticos.

## Configuración privada necesaria

En las variables cifradas del proyecto, nunca en Git/chat:

- `META_APP_SECRET`: secreto de la app Meta.
- `WHATSAPP_VERIFY_TOKEN`: secreto aleatorio compartido con la configuración del webhook.
- `WHATSAPP_ACCESS_TOKEN`: token autorizado de la cuenta WhatsApp.
- `WHATSAPP_PHONE_NUMBER_ID`: ID del número real, no el teléfono escrito.
- `META_GRAPH_VERSION`: versión habilitada en la app Meta, con formato `vXX.X`.
- `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN`: almacenamiento para deduplicar eventos entre instancias.
- `AI_GATEWAY_MODEL`: `openai/gpt-4.1-mini`, verificado en catálogo 2026-10-30. Autenticación con OIDC de Vercel o `AI_GATEWAY_API_KEY` fuera de Vercel; requiere acceso/crédito al modelo.

Registrar callback y verify token en Meta; suscribir `messages` y la app a la cuenta WhatsApp. Comprobar que el número de la web (+34 679 176 667) es el número conectado; no migrarlo ni borrarlo sin revisar el alta.

## Conducta y límites

Solo contesta texto; adjuntos reciben solicitud de resumen escrito. Citas y consultas sin respuesta se derivan a gestion@fenualv.com, indicando que el cliente ya habló con el chatbot. No envía correo ni reserva. No mantiene historial de conversación en esta versión. Cada respuesta exige rutas de fuentes existentes; esta comprobación no demuestra por sí sola que cada afirmación esté respaldada, por lo que hace falta evaluación real del modelo antes de activar.

HMAC sobre cuerpo original, filtro de número, límite de cuerpo y ventana de 24 h. Redis retiene hashes de IDs y estado durante 7 días, sin texto ni teléfono. Un envío con resultado de red ambiguo se marca `uncertain` y requiere revisión, para evitar duplicados. No se garantiza entrega exactamente una vez. Revisar alertas de 503 y casos `uncertain`; no activar sin monitorización. No hay límite de gasto por remitente: configurar presupuesto del modelo antes de producción.

## Prueba real pendiente

Comprobar verificación Meta, pregunta de energía, pregunta IA, pregunta desconocida, cita, adjunto, firma falsa, evento repetido y caída del modelo. Confirmar recepción y respuesta en el móvil, no solo éxito del despliegue.
