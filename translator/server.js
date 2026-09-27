// English → Urdu translator. Zero-dependency Node server that serves the web UI
// and forwards translation requests to a local Ollama running the Qalb Urdu LLM.
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const PORT = Number(process.env.PORT) || 3000;
const OLLAMA_URL = (process.env.OLLAMA_URL || "http://127.0.0.1:11434").replace(/\/$/, "");
const MODEL = process.env.QALB_MODEL || "hf.co/mradermacher/Qalb-1.0-8B-Instruct-GGUF:Q4_K_M";
const MAX_CHARS = 2000;

const SYSTEM_PROMPT =
  "You are a professional English to Urdu translator. Translate the user's English text " +
  "into natural, fluent Urdu written in Urdu (Nastaliq/Arabic) script. Preserve meaning, tone, " +
  "names and numbers. Reply with the Urdu translation only — no explanations, notes, " +
  "transliteration or English.";

const PUBLIC_DIR = path.join(__dirname, "public");
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css" };

function sendJson(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

function readBody(req, limit = 64 * 1024) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > limit) reject(new Error("Request too large"));
    });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

async function handleTranslate(req, res) {
  let text;
  try {
    text = String(JSON.parse(await readBody(req)).text || "").trim();
  } catch {
    return sendJson(res, 400, { error: "Invalid request body" });
  }
  if (!text) return sendJson(res, 400, { error: "Enter some English text to translate" });
  if (text.length > MAX_CHARS) return sendJson(res, 400, { error: `Text is limited to ${MAX_CHARS} characters` });

  let upstream;
  try {
    upstream = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        stream: true,
        options: { temperature: 0.2 },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: text },
        ],
      }),
    });
  } catch {
    return sendJson(res, 502, { error: `Can't reach Ollama at ${OLLAMA_URL}. Is it running? (ollama serve)` });
  }
  if (!upstream.ok) {
    const detail = await upstream.text().catch(() => "");
    const hint = upstream.status === 404 ? ` Model not found — run: ollama pull ${MODEL}` : "";
    return sendJson(res, 502, { error: `Ollama error ${upstream.status}.${hint}`, detail });
  }

  // Ollama streams newline-delimited JSON; forward just the text so the UI can render as it arrives.
  res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" });
  const decoder = new TextDecoder();
  let buffer = "";
  for await (const chunk of upstream.body) {
    buffer += decoder.decode(chunk, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop();
    for (const line of lines) {
      if (!line.trim()) continue;
      const msg = JSON.parse(line);
      if (msg.message?.content) res.write(msg.message.content);
    }
  }
  res.end();
}

function serveStatic(req, res) {
  const urlPath = req.url === "/" ? "/index.html" : req.url.split("?")[0];
  const file = path.join(PUBLIC_DIR, path.normalize(urlPath));
  if (!file.startsWith(PUBLIC_DIR)) return sendJson(res, 403, { error: "Forbidden" });
  fs.readFile(file, (err, data) => {
    if (err) return sendJson(res, 404, { error: "Not found" });
    res.writeHead(200, { "Content-Type": MIME[path.extname(file)] || "application/octet-stream" });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/api/translate") {
    handleTranslate(req, res).catch((err) => {
      if (!res.headersSent) sendJson(res, 500, { error: err.message });
      else res.end();
    });
  } else if (req.method === "GET" && req.url === "/api/config") {
    sendJson(res, 200, { model: MODEL, maxChars: MAX_CHARS });
  } else if (req.method === "GET") {
    serveStatic(req, res);
  } else {
    sendJson(res, 405, { error: "Method not allowed" });
  }
});

server.listen(PORT, () => {
  console.log(`English → Urdu translator running at http://localhost:${PORT}`);
  console.log(`Using model ${MODEL} via Ollama at ${OLLAMA_URL}`);
});
