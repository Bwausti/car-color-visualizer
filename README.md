# 🚗 Car Color Visualizer

AI-powered car paint color visualizer. Upload a car photo, pick a color, and see your vehicle repainted instantly using Google's Imagen AI.

## Features

- **AI Recoloring** — Uses Google Gemini (gemini-2.0-flash-exp) to recolor only the car's paint
- **12 Preset Colors** — Midnight Black, Pearl White, Racing Red, and more
- **Custom Color Picker** — Pick any color you want
- **Before/After Slider** — Drag to compare original vs recolored
- **Shareable Results** — Every result gets a unique URL
- **Download** — Save the recolored image
- **Embed Mode** — Use `/embed` route for iframe embedding with custom branding

## Getting Started

```bash
npm install
cp .env.example .env.local
# Add your Google AI API key to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

```env
GOOGLE_AI_API_KEY=your_google_ai_api_key_here
```

Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

## Embed Mode

Embed the visualizer in any website:

```html
<iframe 
  src="https://your-domain.com/embed?primaryColor=3b82f6&logo=https://your-logo.png"
  width="600"
  height="800"
  frameborder="0"
></iframe>
```

Query params:
- `primaryColor` — Brand color hex (without #)
- `logo` — URL to your logo image

## Deployment (Vercel)

```bash
vercel --prod
```

Set `GOOGLE_AI_API_KEY` in Vercel environment variables.

## Tech Stack

- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Google Gemini API** (gemini-2.0-flash-exp with image generation)

## API

### POST /api/visualize

```json
{
  "image": "base64_encoded_image",
  "targetColor": "Midnight Black"
}
```

Returns:
```json
{
  "success": true,
  "resultImage": "base64_encoded_result",
  "resultId": "uuid"
}
```
