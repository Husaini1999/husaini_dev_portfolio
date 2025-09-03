# Husaini Dev Portfolio - AI Agents Reference

## Portfolio Overview

This is Husaini's professional portfolio website built with Next.js, TypeScript, and Tailwind CSS. The portfolio showcases a fullstack developer with 3+ years of experience specializing in modern web technologies.

## Project Structure

```
husaini_dev_portfolio/
├── app/                    # Next.js 13+ app directory
│   ├── layout.tsx         # Root layout with theme provider
│   ├── page.tsx           # Main portfolio page (1128 lines)
│   ├── globals.css        # Global styles
│   └── favicon.ico        # Site favicon
├── components/             # Reusable UI components
│   ├── theme-provider.tsx # Theme provider for dark/light mode
│   └── ui/                # Shadcn/ui components
│       ├── badge.tsx      # Badge component
│       ├── button.tsx     # Button component
│       ├── card.tsx       # Card component
│       ├── input.tsx      # Input component
│       └── textarea.tsx   # Textarea component
├── lib/                    # Utility functions
│   ├── utils.ts           # Common utility functions
│   └── use-theme.ts       # Custom theme hook for SSR safety
├── public/                 # Static assets
│   ├── projects.json      # Project data (5 projects)
│   └── [various SVGs]     # Icon assets
└── [config files]          # Next.js, TypeScript, ESLint configs
```

## Featured Projects

### 1. E-Commerce Platform

- **Tech Stack**: React, Node.js, MongoDB, Stripe, Tailwind CSS
- **Impact**: Increased online sales by 300%
- **Features**: Inventory management, order tracking, responsive design
- **Status**: Live demo available

### 2. Task Management Dashboard

- **Tech Stack**: React, TypeScript, Socket.io, Chart.js, Material-UI
- **Impact**: Improved productivity by 45%
- **Features**: Real-time updates, drag-and-drop, team collaboration
- **Status**: Live demo available

### 3. Healthcare Mobile App

- **Tech Stack**: React Native, Firebase, Redux, Healthcare APIs
- **Impact**: Reduced scheduling time by 60%
- **Features**: Secure authentication, appointment booking, medical records
- **Status**: Live demo available

### 4. SaaS Analytics Platform

- **Tech Stack**: Next.js, PostgreSQL, Chart.js, Stripe, Vercel
- **Features**: Real-time metrics, user tracking, revenue insights
- **Status**: Live demo available

### 5. Social Media Manager

- **Tech Stack**: Vue.js, Express.js, MongoDB, Social APIs, Tailwind CSS
- **Features**: Post scheduling, engagement analysis, multi-account management
- **Status**: Live demo available

## Technical Skills

### Frontend (95% React, 90% Next.js, 88% TypeScript)

- React, Next.js, TypeScript, Tailwind CSS, Vue.js, JavaScript
- Modern UI/UX design principles
- Responsive and accessible web development

### Backend (90% Node.js, 88% Express.js, 85% Python)

- Node.js, Python, Express.js, FastAPI, GraphQL, REST APIs
- Scalable backend architecture
- Cloud deployment and security

### Database (88% PostgreSQL, 85% MongoDB, 90% Supabase)

- PostgreSQL, MongoDB, Redis, Supabase, Prisma
- Database design and optimization
- ORM and query optimization

### DevOps & Tools (85% AWS, 90% Vercel, 95% Git)

- AWS, Docker, Git, Vercel, CI/CD
- Cloud infrastructure management
- Deployment automation

## Industry Experience

- **Fintech**: Payment systems, financial dashboards
- **E-commerce**: Online stores, inventory management
- **Healthcare**: Patient apps, HIPAA compliance
- **SaaS**: Analytics platforms, subscription management
- **EdTech**: Learning management systems
- **Real Estate**: Property management platforms

## Services Offered

1. **Web Development**: Custom websites and web applications
2. **API & Backend Development**: Scalable backend solutions
3. **UI/UX Friendly Frontend**: Beautiful, intuitive interfaces
4. **Consulting & Mentorship**: Technical guidance and training

## Portfolio Features

- **Dark/Light Theme**: Toggle between themes
- **Responsive Design**: Mobile-first approach
- **Interactive Components**: Smooth scrolling, animations
- **Project Showcase**: Horizontal scrolling project display
- **Contact Form**: Functional contact system
- **Testimonials**: Client feedback carousel
- **Skills Visualization**: Progress bars for skill levels

## Development Context

- **Framework**: Next.js 13+ with app directory
- **Styling**: Tailwind CSS with custom color scheme
- **Components**: Shadcn/ui component library + custom theme provider
- **State Management**: React hooks (useState, useEffect)
- **Theme**: next-themes for dark/light mode with ThemeProvider wrapper
- **Icons**: Lucide React icon library
- **Data**: Static JSON files for projects and testimonials

## Key Implementation Details

- **Horizontal Scrolling**: Projects section uses CSS animations for infinite scroll
- **Theme Persistence**: Theme preference saved in localStorage with SSR-safe implementation
- **Responsive Navigation**: Mobile hamburger menu with smooth transitions
- **Form Handling**: Controlled components with state management
- **Dynamic Content**: Projects loaded from JSON, testimonials with navigation
- **Performance**: Optimized images, lazy loading, smooth animations
- **Hydration Safety**: Custom useTheme hook prevents server/client rendering mismatches
- **Concise Content**: Streamlined About Me section with focused messaging

## AI Agent Guidelines

When working on this portfolio:

1. **Maintain Design Consistency**: Use the established color scheme and component patterns
2. **Preserve Functionality**: Keep all interactive features working
3. **Enhance UX**: Improve user experience without breaking existing features
4. **Code Quality**: Follow TypeScript best practices and component composition
5. **Performance**: Optimize for Core Web Vitals and user experience
6. **Accessibility**: Ensure WCAG compliance and keyboard navigation

## Common Development Tasks

- Adding new projects to `public/projects.json`
- Creating new UI components in `components/ui/`
- Updating skill levels and categories
- Adding new testimonials or services
- Implementing new interactive features
- Optimizing performance and SEO

## Contact Information

- **Email**: husaini@example.com
- **GitHub**: https://github.com/husaini
- **LinkedIn**: https://linkedin.com/in/husaini
- **Twitter**: https://twitter.com/husaini
- **Response Time**: Usually within 24 hours

---

_This document serves as a reference for AI agents working on Husaini's portfolio website. Update this file when making significant changes to maintain context for future development._
