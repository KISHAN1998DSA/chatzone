# ChatZone - AI Chat Web Application

ChatZone is a full-stack web application that allows users to chat with an AI assistant. Built with React, TypeScript, and Supabase, it provides a clean and intuitive interface for having conversations with Google's Generative AI.

## Features

- 🔐 User authentication (signup/login)
- 💬 Chat interface with Google AI responses
- 📚 Chat history storage
- 🎨 Modern UI with shadcn/ui components
- 🚀 Responsive design with Tailwind CSS
- ✨ Smooth animations with Framer Motion

## Tech Stack

### Frontend
- React with TypeScript
- Vite as the build tool
- Tailwind CSS for styling
- shadcn/ui for UI components
- Framer Motion for animations
- React Router for navigation

### Backend & AI
- Supabase for authentication
- Supabase Realtime Database for storing chats and messages
- Google Generative AI API for generating AI responses

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn
- A Supabase account
- A Google AI API key

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/chatzone.git
cd chatzone
```

2. Install dependencies:
```bash
npm install
```

3. Create a Supabase project and get your API keys.

4. Get a Google AI API key from the Google AI Studio (https://ai.google.dev/).

5. Create a `.env` file in the root directory with the following variables:
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_GOOGLE_AI_API_KEY=your-google-ai-api-key
```

6. Set up your Supabase database with the following tables:

```sql
-- Create users table (handled by Supabase Auth)

-- Create chats table
CREATE TABLE chats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id UUID REFERENCES chats(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'ai')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up RLS policies
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create their own chats" ON chats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own chats" ON chats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create messages in their chats" ON messages
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM chats WHERE id = chat_id
    )
  );

CREATE POLICY "Users can view messages in their chats" ON messages
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM chats WHERE id = chat_id
    )
  );
```

7. Run the development server:
```bash
npm run dev
```

8. Open your browser and navigate to `http://localhost:5173`

## Environment Variables

| Variable | Description |
|----------|-------------|
| VITE_SUPABASE_URL | Your Supabase project URL |
| VITE_SUPABASE_ANON_KEY | Your Supabase anonymous key |
| VITE_GOOGLE_AI_API_KEY | Your Google AI API key |

## License

This project is licensed under the MIT License.

---

Happy chatting! 💬
