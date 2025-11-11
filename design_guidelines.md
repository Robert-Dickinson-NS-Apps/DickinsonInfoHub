# Design Guidelines: Robert Dickinson SWMM Portfolio

## Design Approach
**Reference-Based:** Drawing inspiration from Linear's clean professionalism + Notion's approachable interface + engineering/technical portfolio best practices. Professional yet modern, emphasizing expertise and accessibility.

## Layout Architecture

**Spacing System:** Tailwind units of 4, 8, 12, and 16 for consistent rhythm (p-4, mb-8, py-12, gap-16, etc.)

**Viewport Strategy:**
- Hero section: 90vh with impactful SWMM-themed imagery
- Content sections: Natural height with py-16 to py-24 spacing
- Chat interface: Fixed bottom-right overlay

**Multi-Column Usage:**
- Social links grid: 2x2 grid on desktop (Twitter, LinkedIn, GitHub, semm5.org)
- Expertise/Skills section: 3-column feature grid
- Footer: 2-column (navigation + contact info)

## Typography Hierarchy

**Fonts:** Google Fonts via CDN
- Headings: 'Inter' (600-700 weight) - clean, technical feel
- Body: 'Inter' (400-500 weight)
- Code/Technical: 'JetBrains Mono' (for SWMM-related content)

**Scale:**
- Hero headline: text-6xl md:text-7xl
- Section headers: text-4xl md:text-5xl
- Subheadings: text-2xl md:text-3xl
- Body text: text-base md:text-lg
- Captions: text-sm

## Core Sections

**1. Hero Section (90vh)**
- Full-bleed background: SWMM engineering visual (water management, infrastructure, or environmental engineering imagery)
- Centered content with max-w-4xl
- Name + title in large typography
- Subtitle describing expertise in SWMM/water management
- Two CTAs: "View Projects" (primary) + "Chat with AI Assistant" (secondary with backdrop-blur-sm)

**2. About/Expertise Section**
- Single column max-w-3xl for bio
- 3-column feature grid showcasing SWMM expertise areas
- Each card: Icon (Heroicons), title, brief description
- Include attached image (IMG_3074) here as visual proof/credential

**3. Social Links Hub**
- Prominent 2x2 card grid (md:grid-cols-2 lg:grid-cols-4 on wider screens)
- Large, clickable cards for Twitter, LinkedIn, GitHub, semm5.org
- Each with platform icon, handle/username, brief descriptor
- Hover effect: subtle elevation increase

**4. Projects/Portfolio Section**
- Staggered 2-column grid showcasing SWMM-related work
- Project cards with thumbnail, title, description, tech tags
- Link to semm5.org or external references

**5. AI Chat Assistant**
- Fixed bottom-right: Floating chat bubble trigger
- Expanded state: 400px width, 600px height card overlay
- DeepSeek branding subtle in chat header
- Message bubbles: User (right-aligned), AI (left-aligned)
- Input field with send button at bottom

**6. Contact/Footer**
- 2-column: Left (quick bio + CTA to connect), Right (social links repeated + email)
- Newsletter signup optional
- Copyright + "Powered by DeepSeek AI" mention

## Component Library

**Icons:** Heroicons via CDN (outline style for clarity)

**Cards:**
- Rounded corners (rounded-xl)
- Subtle borders or shadows for depth
- Padding: p-6 to p-8
- Hover state: transform scale-[1.02] transition

**Buttons:**
- Primary: Solid fill, rounded-lg, px-8 py-3
- Secondary: Bordered, backdrop-blur-sm when on images
- No custom hover states (inherit defaults)

**Navigation:**
- Fixed top bar with backdrop-blur-md
- Logo/name left, nav links center, "Chat" CTA right
- Mobile: Hamburger menu

## Images Strategy

**Required Images:**
1. **Hero Background:** Large, high-quality SWMM/water management infrastructure photo (dam, water treatment, stormwater system, or environmental engineering scene) - full viewport width, subtle overlay for text readability
2. **Expertise Section:** Include attached IMG_3074 as credential/proof element
3. **Project Thumbnails:** Placeholder for SWMM project visuals
4. **Profile Photo:** Professional headshot in About section (circular, 200px diameter)

## Animations
**Minimal approach:**
- Fade-in on scroll for section reveals
- Smooth chat window expand/collapse
- Button hover states (built-in)
- NO distracting scroll animations or parallax effects

## Professional Polish
- Consistent 16:9 aspect ratios for project images
- Ample whitespace between sections (py-24)
- Professional color scheme handled separately
- Accessibility: ARIA labels on social links, chat interface keyboard navigable
- Mobile-first responsive breakpoints (sm, md, lg, xl)