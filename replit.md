# Robert Dickinson SWMM Portfolio Web App

## Overview
Professional portfolio web application for Robert Dickinson, showcasing expertise in Storm Water Management Modeling (SWMM) and environmental engineering. Features an AI-powered chat assistant using DeepSeek for visitor interactions.

**Current State:** Enhanced with database persistence, project gallery management, and upcoming blog/resume/analytics features
**Last Updated:** November 13, 2025

## Recent Changes
- **November 13, 2025**: Phase 2 - Database & Project Management
  - Created PostgreSQL database with Drizzle ORM
  - Implemented full schema for projects, articles, chat history, resume, and analytics
  - Built complete Projects CRUD API with Express routes
  - Migrated hardcoded projects to database-driven system
  - Created admin interface for managing projects at /admin/projects
  - Projects section now dynamically fetches from database with featured filtering
  - Seeded database with sample SWMM projects
- **November 11, 2025**: Complete MVP implementation
  - Designed and implemented SWMM-themed water/engineering color scheme
  - Built responsive Hero section with generated SWMM infrastructure background
  - Created About section with AI integrations credentials image
  - Implemented 3-column Expertise section showcasing SWMM capabilities
  - Built Social Links section with Twitter, LinkedIn, GitHub, and semm5.org
  - Created Projects section highlighting water management work
  - Implemented AI chat interface powered by DeepSeek via OpenRouter
  - Added dark mode support with ThemeProvider
  - Configured responsive navigation with mobile menu
  - Built professional footer with contact information

## Project Architecture

### Frontend Stack
- **Framework:** React with TypeScript
- **Routing:** Wouter
- **Styling:** Tailwind CSS with custom SWMM water theme
- **UI Components:** Shadcn UI (Card, Button, Badge, Input, etc.)
- **State Management:** TanStack Query v5
- **Theme:** Custom ThemeProvider with localStorage persistence
- **Fonts:** Inter (headings/body), JetBrains Mono (code/technical)

### Backend Stack
- **Runtime:** Node.js with Express
- **Database:** PostgreSQL via Neon (Replit managed)
- **ORM:** Drizzle ORM with Neon HTTP driver
- **AI Integration:** DeepSeek via OpenRouter (Replit AI Integrations)
- **Error Handling:** p-retry with exponential backoff for rate limiting
- **Validation:** Zod schemas with drizzle-zod

### Design System
**Color Theme:** SWMM water/engineering blue palette
- Primary: `200 85% 45%` (bright water blue)
- Background: `210 20% 98%` (light blue-gray)
- Card: `210 20% 97%` (subtle elevation)
- Accent: `195 70% 92%` (light cyan)

**Spacing:** Consistent 4, 8, 12, 16 unit system
**Typography:** 
- Hero: text-6xl md:text-7xl
- Sections: text-4xl md:text-5xl
- Body: text-base md:text-lg

## Key Features

### 1. Hero Section (90vh)
- Full-bleed SWMM infrastructure background with dark gradient overlay
- Prominent name and title display
- Two CTAs: "View Projects" and "Chat with AI Assistant"
- Smooth scroll animations

### 2. About Section
- Professional bio highlighting SWMM expertise
- Display of AI integrations credentials (IMG_3074)
- Responsive card layout with hover effects

### 3. Expertise Section
- 3-column grid showcasing core competencies:
  - Storm Water Modeling
  - Data Analysis & Simulation
  - Infrastructure Engineering
- Icon-driven cards with descriptions

### 4. Social Links Section
- 4-column grid (responsive to 2x2 on mobile)
- Direct links to Twitter, LinkedIn, GitHub, semm5.org
- Platform-specific icons and descriptions

### 5. Projects Section
- **Database-driven** project gallery with dynamic content
- 2-column grid displaying featured projects only
- Each with title, description, technology badges, external links
- **Admin Interface** at /admin/projects for full CRUD operations:
  - Create, edit, delete projects
  - Set featured status and display order
  - Add images, technologies, descriptions
  - Real-time updates with TanStack Query cache invalidation

### 6. AI Chat Assistant
- Fixed bottom-right floating toggle button
- Expandable chat interface (400x600px)
- DeepSeek-powered responses about SWMM and water management
- Custom system prompt for professional, knowledgeable responses
- Real-time message history with user/assistant bubbles
- Loading states with spinner
- Error handling with graceful fallbacks

### 7. Navigation
- Fixed top bar with backdrop blur
- Smooth scroll to sections
- Mobile hamburger menu
- Theme toggle (light/dark mode)
- Quick access to chat

### 8. Footer
- Two-column layout with contact information
- Repeated social links for easy access
- Email contact
- Copyright and "Powered by DeepSeek AI" attribution

## User Preferences
- Professional, clean design inspired by Linear and Notion
- Water/engineering theme with blue color palette
- Focus on SWMM and environmental engineering expertise
- Mobile-first responsive approach
- Minimal, tasteful animations
- Accessible with proper ARIA labels and keyboard navigation

## Technical Decisions

### Why DeepSeek via OpenRouter?
- User requested DeepSeek specifically
- Replit AI Integrations provides seamless setup without API key management
- p-retry ensures resilient handling of rate limits
- Cost-effective for portfolio chat feature

### Why In-Memory Storage?
- Chat sessions are ephemeral (no persistence needed)
- Simplified MVP without database overhead
- Frontend state management sufficient for current scope

### Why Shadcn UI?
- Pre-built accessible components
- Consistent with design system requirements
- Easy customization via Tailwind
- Built-in hover/active states (hover-elevate, active-elevate-2)

### Component Organization
- Modular components outside App.tsx for reusability
- Clear separation of concerns (UI, logic, API)
- Parallel imports for faster rendering
- Single Home page with all sections

## Testing Coverage
All interactive elements instrumented with data-testid attributes:
- Navigation: link-home, link-about, link-expertise, link-projects, link-contact
- Hero CTAs: button-view-projects, button-chat-hero
- Theme: button-theme-toggle
- Chat: button-chat-toggle, button-close-chat, input-chat-message, button-send-message
- Social links: link-social-twitter, link-social-linkedin, link-social-github, link-social-semm5.org
- Footer: link-email, link-footer-twitter, link-footer-linkedin, link-footer-github, link-footer-website

## Environment Variables
- `AI_INTEGRATIONS_OPENROUTER_BASE_URL`: Set automatically by Replit AI Integrations
- `AI_INTEGRATIONS_OPENROUTER_API_KEY`: Set automatically by Replit AI Integrations
- `SESSION_SECRET`: Available for future auth needs

## Known Limitations
- Chat history not persisted (resets on page reload)
- Profile photo placeholder (no actual headshot provided)
- Project thumbnails use text descriptions only
- Social media links point to generic platform URLs (not user-specific)

## Future Enhancements
1. Add project portfolio gallery with actual SWMM work samples
2. Implement blog or articles section for technical content
3. Add downloadable resume/CV
4. Persist chat history with database
5. Add newsletter signup functionality
6. Integrate actual social media profile URLs
7. Add professional headshot image
8. Implement contact form with email integration
9. Add analytics for visitor tracking
10. Create case studies section with detailed project breakdowns

## Development Commands
- `npm run dev`: Start development server (frontend + backend on port 5000)
- Workflow: "Start application" is pre-configured and runs automatically

## File Structure
```
client/
  src/
    components/
      - navigation.tsx (top nav with mobile menu)
      - hero-section.tsx (90vh hero with SWMM background)
      - about-section.tsx (bio + credentials)
      - expertise-section.tsx (3-column skills grid)
      - social-links-section.tsx (4-column social cards)
      - projects-section.tsx (2-column project grid)
      - chat-interface.tsx (AI assistant UI)
      - footer.tsx (2-column footer)
      - theme-provider.tsx (dark mode support)
      - theme-toggle.tsx (light/dark switcher)
    pages/
      - home.tsx (main landing page)
      - not-found.tsx (404 page)
    App.tsx (router + providers)
    index.css (design tokens + utilities)
  index.html (SEO meta tags)
  
server/
  - routes.ts (chat API endpoint)
  - openrouter.ts (DeepSeek client with retries)
  
shared/
  - schema.ts (chat message types)

attached_assets/
  - IMG_3074_1762826968810.jpeg (credentials)
  - generated_images/SWMM_infrastructure_hero_background_de0bd9d3.png

design_guidelines.md (visual design spec)
replit.md (this file)
```
