/* eslint-disable */
const { log } = require("firebase-functions/logger");

// Expresión regular para capturar todas las secuencias a reemplazar
const regex = /\\\\n|\\\\\\n|\\\\\\\\n|\\\\\\\\\\n/g;

exports.clearText = (text) => {
  let content = text;
  if (content.startsWith("\"") && content.endsWith("\"")) {
    try {
      content = JSON.parse(content);
    } catch (e) {
      log('No se pudo parsear content como JSON:', e);
    }
  }

  log(`Texto parseado o escapado: ${content}`);

  // Reemplazar todas las secuencias con "\\n"
  const newString = content.replace(regex, '\n');

  log(`newString sin escapes: ${newString}`);

  // Limpieza de asteriscos Markdown
  let textoLimpio = newString.replace(/\*{2,}/g, '*');

  log(`textoLimpio sin comillas externas: ${textoLimpio}`);

  // 2. Reemplazar todas las variaciones de saltos de línea escapados por un solo '\n'
  //    Esto incluye \\n, \\\n, \\\\n, \\\\\n, etc.
  textoLimpio = textoLimpio.replace(/\\n+/g, '\n');
  // Elimina todas las comillas dobles
  textoLimpio = textoLimpio.replace(/"/g, '');

  log(`textoLimpio con saltos de línea normalizados: ${textoLimpio}`);

  return textoLimpio;
}
/* eslint-enable */
