# Hidden Treasures Network - Server

Backend API for the Hidden Treasures Network.

## Directory Structure

```
server/
├── src/
│   ├── controllers/  # Request handlers
│   ├── models/       # Database models
│   ├── routes/       # API routes
│   ├── services/     # Business logic
│   ├── middleware/   # Custom middleware
│   └── utils/        # Utility functions
├── tests/            # Test files
└── package.json
```

## Getting Started

1. Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

## Available Scripts

- `npm start` - Run production server
- `npm run dev` - Run development server with auto-reload
- `npm test` - Run tests

## API Endpoints

- `GET /` - API information
- `GET /health` - Health check
