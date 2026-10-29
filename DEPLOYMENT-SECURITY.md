# FENUALV - Entrega segura y agnostica de hosting

Esta web esta preparada como sitio estatico y no depende de Hostinger ni de un proveedor concreto.

## Antes de publicar

1. Subir unicamente el contenido de `public_html/` al document root del dominio.
2. No subir `.git/`, workflows, scripts de generacion, copias ZIP, logs, claves, ficheros `.env` ni respaldos.
3. Activar HTTPS con un certificado valido antes de redirigir todo el trafico HTTP.
4. Aplicar las cabeceras de seguridad del ejemplo correspondiente al servidor:
   - Apache/LiteSpeed: `deploy/apache-litespeed-security.conf`
   - Nginx: `deploy/nginx-security.conf`
5. Desactivar el listado de directorios.
6. Bloquear el acceso web a ficheros ocultos y archivos de configuracion, copia o secretos.
7. Mantener permisos de archivos y carpetas con el minimo necesario para lectura del servidor web.
8. Probar home, menu, formulario, blog, subpaginas, recursos y version movil tras activar las cabeceras.
9. No introducir claves de APIs, tokens o contraseñas en HTML o JavaScript del navegador.
10. Si en el futuro el formulario deja de usar `mailto:` y pasa a un backend, validar y limitar peticiones en servidor, usar proteccion anti-spam y no exponer credenciales en frontend.

## Cabeceras recomendadas

La politica propuesta mantiene el diseño actual y permite los estilos dinamicos que usa la interfaz:

- Content-Security-Policy
- Strict-Transport-Security
- X-Content-Type-Options
- X-Frame-Options
- Referrer-Policy
- Permissions-Policy

La CSP propuesta permite `style-src 'unsafe-inline'` porque la web actual usa estilos dinamicos para animaciones y posicionamiento. Los scripts siguen restringidos al propio dominio.

## Entrega

El paquete de produccion debe contener solo los archivos necesarios para servir la web. Los ejemplos de configuracion del servidor permanecen fuera de `public_html/` para evitar que se publiquen accidentalmente.

Despues de conocer el hosting final, se aplica solo la configuracion compatible con su servidor. No es necesario modificar HTML, CSS ni estetica para cambiar de proveedor.
