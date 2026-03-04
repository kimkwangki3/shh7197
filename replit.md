# Political Campaign Website

## Overview

This is a modern political campaign website built for a Korean candidate named 홍성훈. The application serves as a professional digital presence showcasing the candidate's background, career timeline, vision, and providing direct contact capabilities. The site emphasizes trust, authority, and accessibility through clean, dignified design inspired by professional political websites and government portals.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development practices
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management and caching
- **Styling**: Tailwind CSS with custom design system based on political website aesthetics
- **UI Components**: Radix UI primitives with shadcn/ui component library for accessibility and consistency
- **Animations**: Framer Motion for smooth transitions and loading states
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js for the web server
- **Language**: TypeScript for full-stack type safety
- **API Design**: RESTful endpoints for contact form submissions and message management
- **Database Integration**: Drizzle ORM for type-safe database operations
- **Session Management**: Express sessions with PostgreSQL storage
- **Error Handling**: Centralized error handling middleware with proper HTTP status codes

### Design System
- **Color Palette**: Deep navy primary (#220 85% 20%), clean white backgrounds, elegant gold accents
- **Typography**: Inter for body text with Korean support (Noto Sans KR), Playfair Display for headers
- **Layout**: Tailwind spacing primitives (4, 8, 12, 16, 24px units) for consistent spacing
- **Components**: Professional navigation, timeline cards, contact forms, loading animations

### Content Structure
The application follows a four-section layout:
1. **Hero Section**: Large candidate photography with introduction and call-to-action
2. **Career Timeline**: Visual representation of professional history with achievements
3. **Vision Statement**: Political platform and key policy areas with priority indicators
4. **Contact & Connect**: Direct engagement form with social media integration

### Data Layer
- **Schema**: Users table for authentication, messages table for contact form submissions
- **Validation**: Zod schemas for runtime type checking and form validation
- **Storage**: PostgreSQL database with connection pooling via Neon serverless

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL for scalable data storage
- **Drizzle ORM**: Type-safe database operations with schema migrations
- **Connect PG Simple**: PostgreSQL session store for Express sessions

### UI/UX Libraries
- **Radix UI**: Accessible component primitives for complex UI elements
- **Framer Motion**: Animation library for smooth transitions and loading states
- **Lucide React**: Consistent icon system for UI elements
- **Embla Carousel**: Touch-friendly carousel for image galleries

### Development Tools
- **Vite**: Modern build tool with hot module replacement
- **TypeScript**: Static type checking across the entire stack
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **ESBuild**: Fast bundling for production deployments

### External Services Integration
- **Font Loading**: Google Fonts for Inter, Playfair Display, and Noto Sans KR
- **Asset Management**: Local asset storage with Vite asset handling
- **Form Processing**: Server-side contact form processing with email validation

### Development Environment
- **Replit Integration**: Custom plugins for development environment optimization
- **Hot Reloading**: Vite development server with Express middleware integration
- **Error Tracking**: Runtime error overlay for development debugging