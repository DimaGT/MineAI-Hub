# GeoSim

AI-powered platform for scientific experiment simulation & knowledge discovery.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS** + **Shadcn UI**
- **Supabase** (Authentication & Database)
- **OpenAI API** (GPT-4)
- **Recharts** (Data Visualization)
- **jsPDF** + **html2canvas** (PDF Generation)

## Features

### 🔐 Authentication

- Email/password sign up and sign in
- Google OAuth authentication
- Protected routes for dashboard, results, and knowledge hub

### 📊 Dashboard

- Interactive form for simulation parameters:
  - Research Goal
  - Material Type
  - Composition
  - Experimental Conditions
- One-click simulation execution

### 🤖 AI Simulation API

- GPT-4 powered simulation generation
- Automatic report generation with:
  - Process summary
  - Recommended methods
  - Predicted temperature/efficiency data
  - Confidence scores

### 📈 Results Page

- Detailed AI-generated reports
- Interactive charts (Extraction Efficiency vs Temperature)
- PDF download functionality

### 📚 Knowledge Hub

- Browse public simulations
- Search and filter functionality
- Material type filtering

### 🎨 Landing Page

- Modern hero section
- Feature highlights
- Call-to-action buttons

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory (you can copy from `env.local.example`):

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the following SQL in your Supabase SQL Editor:

```sql
-- Create simulations table
CREATE TABLE simulations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  input_data JSONB NOT NULL,
  ai_result JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  is_public BOOLEAN DEFAULT FALSE,
  title TEXT,
  tags TEXT[]
);

-- Enable Row Level Security
ALTER TABLE simulations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own simulations
CREATE POLICY "Users can read own simulations"
  ON simulations FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own simulations
CREATE POLICY "Users can insert own simulations"
  ON simulations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own simulations
CREATE POLICY "Users can update own simulations"
  ON simulations FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own simulations
CREATE POLICY "Users can delete own simulations"
  ON simulations FOR DELETE
  USING (auth.uid() = user_id);

-- Policy: Public simulations are viewable by all authenticated users
CREATE POLICY "Public simulations are viewable"
  ON simulations FOR SELECT
  USING (is_public = TRUE AND auth.role() = 'authenticated');

-- Create index for better query performance
CREATE INDEX idx_simulations_user_id ON simulations(user_id);
CREATE INDEX idx_simulations_is_public ON simulations(is_public);
CREATE INDEX idx_simulations_created_at ON simulations(created_at DESC);
```

3. Configure Google OAuth in Supabase:
   - Go to Authentication → Providers → Google
   - Enable Google provider
   - Add your OAuth credentials

### 4. OpenAI Setup

1. Get your API key from [OpenAI Platform](https://platform.openai.com)
2. Add it to your `.env.local` file

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── api/
│   │   └── simulate/        # Simulation API endpoint
│   ├── auth/
│   │   ├── signin/          # Sign in page
│   │   ├── signup/          # Sign up page
│   │   └── callback/        # OAuth callback handler
│   ├── dashboard/           # Dashboard page
│   ├── results/
│   │   └── [id]/            # Results page
│   ├── knowledge/           # Knowledge hub page
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   └── globals.css          # Global styles
├── components/
│   ├── ui/                  # Shadcn UI components
│   ├── auth/                # Authentication components
│   ├── dashboard/           # Dashboard components
│   ├── results/             # Results components
│   └── knowledge/           # Knowledge hub components
├── lib/
│   ├── supabase/            # Supabase client utilities
│   └── utils.ts             # Utility functions
├── types/
│   └── database.types.ts    # TypeScript types for database
└── middleware.ts             # Next.js middleware for auth
```

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

The project is optimized for Vercel deployment with:

- Automatic API route handling
- Serverless function support
- Edge middleware support

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
