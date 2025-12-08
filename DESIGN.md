# Project Design

Hello, so as we mentioned previously, we used an array of languages to code Harvard Huddle. These include Vite, TypeScript (a more expansive version of Javascript), React, shadcn-ui, and Tailwind CSS for our frontend and Node.js, Express, and SQL for our backend.

Most of the app code can be found in the source folder (/src). Specificallyl referring to react components, pages, styles, tailwind css, etc. Here we find main.tsx and this is where the React portion that was linked in the index.html file can be found. 

In the public file, we can find mostly static files that are served without any dynamic components. 
Project Bootstrapping, Configuration, and Global Architecture
This project is built using a modern Vite + React + TypeScript + Tailwind + shadcn-ui stack. The following files define how the application is bootstrapped, styled, typed, built, and structured at a global level.

index.html — Static Application Shell
This file is the single HTML document used by the entire React application.
Primary responsibilities:
Provides the root <div id="root"></div> where React mounts.
Loads the application via:
<script type="module" src="/src/main.tsx"></script>

Defines SEO and social metadata, including:
Page title and description; Open Graph preview image and text; Twitter card metadata; Canonical production URL

Design significance:
This file ensures the project behaves like a real production website with:
Search engine optimization; Social media preview support; Proper browser rendering setup
All application logic is intentionally excluded from this file and delegated entirely to React.

main.tsx — React Entry Point
This file is responsible for bootstrapping React into the DOM.
What it does:
Imports createRoot from React 18; Imports the root <App /> component; Imports index.css to activate Tailwind and theme variables.
Mounts the entire React app into the DOM using:
createRoot(document.getElementById("root")!).render(<App />);

Design significance:
Clean separation between:
DOM initialization (here); Application logic (App.tsx)
Uses React’s modern concurrent renderer, enabling better performance and future upgrades.

App.tsx — Global Application Controller
This is the central architectural file of the entire frontend. It controls:
1. Global Providers
The application is wrapped in:
QueryClientProvider → Activates React Query (future backend support).
TooltipProvider → Enables tooltips globally.
Toaster and Sonner → Enables global notifications.
BrowserRouter → Enables client-side routing.
2. Authentication State
const [isAuthenticated, setIsAuthenticated] = useState(true);

Simulates logged-in state for demo purposes.
Controls:
Page access; Navbar behavior; Whether the user sees the Landing page or Activities page

3. Route-Based Layout Control
const isAuthPage = location.pathname === "/auth";

Hides Navbar and Footer on the authentication page; Keeps the rest of the app visually consistent.

4. Logout Handler
const handleLogout = () => {
  setIsAuthenticated(false);
};

Updates authentication state.
Immediately triggers a full UI update through React’s reactivity.

5. Routing System
The app defines the following routes:
Route; Component
/
Conditional Landing or Activities
/activities
Activities list
/activities/:id
Activity detail
/create
Create activity
/profile
User profile
/auth
Login & signup


Design significance:
This file acts as the global state + navigation + layout controller.
It enforces:
Authentication-based routing; Page-level access control; Global UI consistency
It is fully backend-ready via React Query even though data is currently mocked.

index.css — Global Design System & Theme Engine
This file defines the entire visual identity and animation system of the project.
1. Tailwind Activation
@tailwind base;
@tailwind components;
@tailwind utilities;

2. Font System
Inter → UI & body text
Playfair Display → Headings & hero typography
3. Harvard Color System
Defines CSS variables for:
Backgrounds & surfaces
Primary Crimson brand color
Secondary cream & gold accent colors
Success, warning, and destructive states
Border and ring colors
Light mode and dark mode are fully theme-driven using CSS variables.
4. Global Shadows & Visual Depth
Defines:
Card shadows
Crimson glow effects
Elevation layers for UI realism
5. Animation System
Defines reusable animations:
Floating elements
Slide-in transitions
Fade-in transitions
Scale-in transitions
6. Scrollbar Customization
Adds:
Custom width
Rounded thumb
Subtle hover transitions
Design significance:
This file serves as the single source of truth for the entire design system, ensuring:
Visual consistency; Easy theming; Dark mode support; Brand identity enforcement

App.css — App-Level Styling Placeholder
This file currently contains only a comment:
/* App-specific styles - most styling is done through the design system in index.css */

Design significance:
Indicates intentional reliance on:
Tailwind; shadcn-ui; Global design tokens
Prevents scattered ad-hoc CSS and encourages systemized styling.

components.json — shadcn-ui Generator Configuration
This file configures how UI components are generated and themed.
Key settings:
Uses TypeScript (tsx: true); Uses CSS variables (cssVariables: true); Uses Slate as base color
Links to:
tailwind.config.ts; src/index.css
Import Aliases:
"@/components"
"@/lib"
"@/hooks"
"@/ui"

Design significance:
Enables clean imports; Enforces consistent UI generation; Guarantees type-safe UI components

package.json — Project Definition & Scripts
Runtime Stack:
React 18 + React DOM; React Router; React Query; Tailwind + Animate; shadcn-ui + Radix; Sonner toasts
Validation; Lucide icons; Visualization
Development Stack:
Vite (build system); TypeScript; ESLint; PostCSS; Autoprefixer
Scripts:
Command; Purpose; npm run dev; Start local server; npm run build
Production build; npm run preview; Preview production; npm run lint; Code quality checks

Design significance:
This defines the project as a full production-grade frontend application, not a simple prototype.

tsconfig.json, tsconfig.app.json, tsconfig.node.json — TypeScript Control System
tsconfig.json
Controls frontend TypeScript behavior.
Uses relaxed strictness for faster development.
Defines alias:
"@/*": ["./src/*"]


tsconfig.app.json
Shared configuration for application references.
Allows JS inside TS project; Skips heavy type checking for faster builds; tsconfig.node.json;
Strict TypeScript mode for Vite build tooling; Prevents silent build failures.
Design significance:
This split ensures:
Fast frontend development; Strict, safe build pipeline; Clean path aliases across the project



