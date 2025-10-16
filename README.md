# MtG Decks Builder

A comprehensive web application for Magic: The Gathering players to create, manage, and analyze their card decks. Built with modern web technologies to provide an intuitive deck building experience.

## Project Description 

MtG Decks Builder is a web application that enables Magic: The Gathering players to create, manage, and analyze their card decks. The application offers an intuitive interface for card searching, deck building according to game rules, and deck statistics analysis.

### Key Features

- **Deck Management**: Create, edit, and delete decks with metadata (name, description, format, creation date)
- **Card Search & Filtering**: Advanced search with filters by colors, mana cost, card types, sets, and rarity
- **Deck Building**: Add/remove cards with automatic limit validation (4 copies per card, unlimited lands)
- **Statistics Analysis**: Visual charts showing mana curve, color distribution, and card type breakdown
- **User Authentication**: Secure user registration and login system

### Target Audience

- Magic: The Gathering players (beginner to advanced)
- Players planning deck strategies
- Players needing collection organization tools

## Tech Stack

### Frontend

- **Astro 5** - Main framework for fast, efficient pages with minimal JavaScript
- **React 19** - Interactive components (search, filters, deck editor)
- **TypeScript 5** - Static typing for better IDE support and code safety
- **Tailwind CSS 4** - Utility-first CSS framework
- **Shadcn/ui** - Accessible React component library
- **Vite** - Build tool and development server

### Testing

- **Jest/Vitest** - Unit and integration testing
- **Playwright** - End-to-end testing
- **MSW (Mock Service Worker)** - API mocking for tests

### Backend

- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Built-in authentication system
  - JWT tokens and session management

### Hosting, CI/CD & APIs

- **DigitalOcean** - Application hosting with automatic deployments
- **GitHub Actions** - Automated testing, linting, and deployment
- **Scryfall API** - External API for Magic: The Gathering card data

## Getting Started Locally

### Prerequisites

- Node.js 22.14.0 (see `.nvmrc`)
- npm or yarn package manager

### Installation

1. Clone the repository:

```bash
git clone https://github.com/lukaszstefanski/mtg-decks-builder.git
cd mtg-decks-builder
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
# Create .env file with your Supabase credentials
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:4321`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier

## Project Scope

### MVP Features (Included)

- Basic CRUD operations for decks
- Card search and filtering
- Deck card management with limits
- Basic deck statistics
- User authentication
- Responsive design

### Supported MtG Formats

- Standard
- Modern
- Legacy
- Vintage
- Commander
- Pauper
- Other MtG-compliant formats

### Excluded from MVP

- Social features (deck sharing)
- Deck export to other formats
- Advanced metagame analysis
- Card notes
- Deck rating system
- External platform integrations
- Mobile app (web only)

## License

This project is licensed under the MIT License.

**Note**: This project is currently in active development. Some features may not be fully implemented or may change during the MVP phase.
