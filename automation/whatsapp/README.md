# WhatsApp de FENUALV

## Web

El botón enlaza a `https://wa.me/34679176667` con este mensaje preparado:

> Hola FENUALV, vengo de vuestra web y tengo una consulta.

El visitante tiene que pulsar Enviar en WhatsApp. Abrir el enlace no envía el mensaje y no activa respuestas automáticas. El botón funciona sin JavaScript; su estilo y su icono están en `public_html/assets/whatsapp.css` y `public_html/assets/whatsapp.svg`.

## Preparado para el asistente

- `knowledge.json`: servicios de energía e IA extraídos de las páginas del repositorio, contacto y límites de la información disponible.
- `SYSTEM_PROMPT.md`: trato al cliente, uso de la base y derivación a una consulta humana.
- Horario solicitado: lunes a sábado de 08:00 a 20:00 en `Europe/Madrid`, con la cita terminada antes del cierre.

## Pendiente para activar el automatismo

1. Comprobar si el número está registrado en WhatsApp Business Platform o únicamente en la aplicación WhatsApp Business del móvil. El segundo caso requiere configurar una conexión compatible con la plataforma; no borrar ni migrar la cuenta sin revisar el procedimiento adecuado.
2. Configurar el receptor de mensajes y el envío mediante la API oficial de Meta o un proveedor autorizado. Verificar los eventos entrantes y evitar respuestas duplicadas por reintentos.
3. Conectar el proveedor del modelo y cargar la base y las instrucciones anteriores. Mantener todas las claves en las credenciales del servidor o del orquestador, nunca en HTML, JavaScript público ni Git.
4. Conectar el calendario de la persona que atiende y crear un tipo de consulta con lunes a sábado de 08:00 a 20:00, domingo cerrado y zona `Europe/Madrid`. Definir la duración y excluir eventos ocupados.
5. Guardar la URL real de ese tipo de consulta en la configuración de la integración. No basta con indicar el horario al modelo.
6. Probar con un remitente autorizado: pregunta sobre cada rama de servicios, pregunta sin respuesta en la base, petición de una persona, calendario ocupado, sábado, domingo y final de jornada. Activar el bot solo después de comprobar recepción, respuesta y reserva reales.

El número por sí solo no proporciona acceso a la cuenta de Meta, al proveedor del modelo ni a una agenda. La parte de automatización permanece pendiente de esas conexiones.

Referencias oficiales: [enlaces de WhatsApp](https://faq.whatsapp.com/5913398998672934), [WhatsApp Business Platform](https://developers.facebook.com/docs/whatsapp/cloud-api/), [horarios en Calendly](https://calendly.com/help/how-to-set-your-availability).
