# ChatZone - AI Chat Web Application

ChatZone is a full-stack web application that allows users to chat with an AI assistant. Built with React, TypeScript, and Supabase, it provides a clean and intuitive interface for having conversations with AI.

## Features

- 🔐 User authentication (signup/login)
- 💬 Chat interface with AI responses
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

### Backend
- Supabase for authentication
- Supabase Realtime Database for storing chats and messages

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn
- A Supabase account

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

4. Update the Supabase configuration in `src/lib/supabase.ts`:
```typescript
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
```

5. Set up your Supabase database with the following tables:

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

6. Start the development server:
```bash
npm run dev
```

7. Open your browser and navigate to `http://localhost:5173/`

## Folder Structure

```
chatzone/
├── public/
├── src/
│   ├── components/
│   │   ├── auth/         # Authentication components
│   │   ├── chat/         # Chat interface components
│   │   ├── dashboard/    # Dashboard components
│   │   ├── layout/       # Layout components
│   │   └── ui/           # Reusable UI components
│   ├── contexts/         # React context providers
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities and libraries
│   ├── pages/            # Page components
│   ├── App.tsx           # Main App component
│   └── main.tsx          # Entry point
└── ...                   # Config files
```

## License

MIT

---

Happy chatting! 💬
