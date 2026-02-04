## Plan Mode

- Make the plan extremely concise. Sacrifice grammar for the sake of concision.
- At the end of each plan, give me a list of unresolved questions to answer, if any.

## Project Standards

### Technical Stack
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js (v5.x)
- **Templating**: EJS (v4.x)
- **Styling**: Tailwind CSS (CDN Integration)

### Preferred Libraries
- **Standard**: Minimalist dependency footprint.
- **Frontend**: Tailwind CSS for high-fidelity UI.
- **Backend**: Express for RESTful API and SSR.

### Coding Style
- **Visual Pattern**: Modern Minimalist / High-Contrast.
- **Colors**: Monochrome palette (White, Black, Grayscale) with absolute black focus.
- **Typography**: Heavily italicized, black-weight headers with tight tracking (`tracking-tighter`).
- **Layout**: Bento-grid discovery and hero-centric detail views.
- **Padding**: Standardized responsive containers (`px-6 lg:px-12`).
- **Transitions**: High-duration cubic-bezier animations (`1s+`) and filter-based reveals (grayscale to color).

### Architecture Rules
- **Structure**: Views partitioned into `views/` and `views/partials/`.
- **Logic**: SSR-first with EJS; API handlers for data transmission in `server.js`.
- **Navigation**: Persistent backdrop-blur navbars with progress indicators.
- **Data Handling**: Support both array and newline-separated string inputs for list data (ingredients/instructions) to ensure resilience.
- **File Referencing**: Use absolute paths for tool-based editing and relative links in documentation/UI.