# English → Urdu Translator

Type or speak English and get Urdu back, powered by **[Qalb](https://ollama.com/enstazao/qalb)**, the
open-source Urdu large language model built by Taimoor Hassan (Auburn University) with Jawad Ahmed and
Muhammad Awais. Qalb is Llama-3.1-8B continued-pretrained on ~1.97B Urdu tokens.

The model runs locally on your computer through [Ollama](https://ollama.com), so nothing leaves your machine.

## Setup

1. **Install Ollama:** https://ollama.com/download (Mac, Windows, Linux).
2. **Download Qalb** (≈4.9 GB, 4-bit quantized — runs on a laptop with 8 GB+ RAM):
   ```sh
   ollama pull hf.co/mradermacher/Qalb-1.0-8B-Instruct-GGUF:Q4_K_M
   ```
3. **Install Node.js 18+:** https://nodejs.org (no `npm install` needed — the app has no dependencies).
4. **Run the app** from this folder:
   ```sh
   npm start
   ```
   Open http://localhost:3000.

## Features

- English text → Urdu (Nastaliq script), streamed word by word as the model writes it.
- 🎤 **Speak** — English voice input via the browser's speech recognition (Chrome/Edge).
- 🔊 **Listen** — reads the Urdu aloud using an Urdu system voice (Edge on Windows and Android
  usually have one; macOS/Chrome may not).
- Copy button, Ctrl/⌘+Enter to translate.

## Configuration

| Env var | Default | |
|---|---|---|
| `PORT` | `3000` | Web server port |
| `OLLAMA_URL` | `http://127.0.0.1:11434` | Where Ollama is running |
| `QALB_MODEL` | `hf.co/mradermacher/Qalb-1.0-8B-Instruct-GGUF:Q4_K_M` | Any Ollama model tag, e.g. the official full-precision `enstazao/qalb:8b-instruct-fp16` (16 GB) |
