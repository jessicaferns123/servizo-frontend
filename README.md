# Servizo — Home-Services Marketplace (Frontend, Work in Progress)

Servizo is a personal full-stack project for a home-services marketplace: customers find local
service professionals, and an admin back office manages providers, services and service areas.

> **Status: work in progress, not production-ready.**
>
> - This repository contains the **Next.js frontend only**. The Express/MongoDB backend is kept
>   private until its authentication and authorization are hardened.
> - Most screens load and save data through that private API, so they won't work on their own.
> - Several workflows were built against the API but haven't been runtime-verified in this
>   repository. The production build passes (see *Build verification*), but the app hasn't
>   been tested in a browser.
> - Image assets (logo, photos, illustrations) are **not included** while their licensing is
>   reviewed, so those images won't render.

## Tech stack

| Area | Technologies |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack dev server), React 19 |
| Language | TypeScript (`strict` mode) |
| Styling | Tailwind CSS v4 |
| UI components | shadcn/ui on Radix UI primitives, lucide-react and react-icons |
| Forms and inputs | react-select (multi-select), custom drag-and-drop file picker |
| Maps | Leaflet / react-leaflet with OpenStreetMap tiles |
| Feedback | react-hot-toast notifications |
| State | React Context (authentication, cart) |
| API (private) | REST API built with Node.js, Express 5, MongoDB/Mongoose and JWT |

## Implemented features

- **Four-step provider registration wizard:** personal information, address and location,
  documents, then review. Each step is validated, and steps with errors are flagged.
- **Map-based location selection:** click the map to set latitude and longitude (Leaflet).
- **Reusable UI components:**
  - a drag-and-drop file picker with preview;
  - a multi-select field;
  - the map selector;
  - user dropdowns;
  - a set of shadcn/ui primitives (dialog, tabs, select, card, checkbox and more).
- **JWT sign-in flow:** after sign-in, the app loads the provider's profile and permission
  claims.
- **Permission-filtered navigation:** the sidebar shows only the modules and links that the
  signed-in user's claims allow.
- **Admin master-data screens:** create, list and edit service categories, services,
  countries, cities and areas.
- **User and rights management:** tabbed user details and rights views, where permission
  claims are assigned to and removed from each user.
- **Provider approval workflow:** review pending provider registrations and approve or reject
  them with remarks.
- Responsive layouts, loading states and toast notifications.

## Architecture

```
servizo-client/
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # root layout with auth and cart providers
│   ├── home/                         # public landing page
│   └── (provider)/                   # route groups organise code without changing URLs
│       ├── provider-login/           # sign-in
│       ├── provider-register/        # four-step registration wizard
│       ├── provider-profile/         # profile view and edit
│       ├── (approvals)/              # pending-provider list and approval form
│       ├── (masters)/(service)/      # categories, services, countries, cities, areas
│       └── (setup)/                  # users, user rights, claims, service setup
├── components/
│   ├── ui/                           # shadcn/ui primitives
│   ├── shared/                       # FileUpload, MapSelector, MapSelectorClient,
│   │                                 # MultiSelectField, …
│   ├── manage-user/                  # user details form and user-rights panel
│   ├── header/                       # header variants and claim-filtered sidebar
│   └── footer/
├── context/                          # AuthContext, CartContext
└── lib/                              # menu configuration, shared types, utilities
```

- **Talking to the API:** pages call the REST API with `fetch`. Signing in returns a JWT,
  which the app sends as a Bearer token on later requests.
- **Permissions:** the claims returned at sign-in are matched against `lib/menu.ts` to decide
  which navigation entries to show.
- **Browser-only map:** Leaflet needs `window`, so `MapSelectorClient.tsx` loads `MapSelector`
  with `next/dynamic` and `ssr: false`. Pages that use the map can still be prerendered.
- **Query-string pages:** routes that read query parameters with `useSearchParams()` (the
  approval form and the user tabs) render their client component inside a `<Suspense>`
  boundary.

## Development status

| Area | Status |
|---|---|
| Provider registration, sign-in, profile | Implemented (needs the private API) |
| Admin master data (categories, services, locations) | Implemented: create, list, edit |
| User and rights management, provider approvals | Implemented (needs the private API) |
| Public landing page | Layout done. Browsing services by category is in progress |
| Provider service setup form | In progress: the UI exists, but saving isn't wired up yet |
| Document and profile-image upload | UI only. Files aren't sent to the server yet |
| Cart | Context and header badge only. Adding items isn't built yet |
| Bookings, payments, reviews, customer accounts | Planned |

## Known limitations

- **Backend not included:** it stays private until server-side password hashing and
  role/claim authorization are in place.
- **Navigation-level access control only:** the frontend hides menu items by permission but
  doesn't guard routes yet (`middleware.ts` is a placeholder).
- **Hardcoded API URL:** requests go to `http://localhost:3000` directly instead of a
  configurable API client.
- **Token storage:** the auth token and profile data are kept in `localStorage`.
- **Missing images:** image assets are excluded pending licensing review, so the logo, landing
  page graphics, login background and profile placeholder won't render.
- **Unfinished routes:** some links point to endpoints or pages that don't exist yet, such as
  per-service pages linked from the landing page.
- **Lint not enforced in builds:** the codebase still has ESLint errors, mostly unused imports
  and variables and explicit `any` types. `npm run lint` runs the full ESLint configuration
  and **does not currently pass**. Until those errors are fixed, `next.config.ts` sets
  `eslint.ignoreDuringBuilds` so `npm run build` can finish. TypeScript type checking still
  runs during the build, and the ESLint rules haven't been changed.
- **Not yet built:** deleting records such as categories, services, locations or users;
  automated tests; CI; deployment.

## Planned improvements

- Fix the remaining ESLint errors, replace `any` with proper types, and remove
  `eslint.ignoreDuringBuilds` so linting is enforced in builds again.
- Harden and publish the backend: bcrypt password hashing, authorization middleware, input
  validation, rate limiting.
- Add a typed API client using `NEXT_PUBLIC_API_URL`, route protection, and sessions in
  HTTP-only cookies.
- Finish customer service browsing, the provider service setup form and the booking flow.
- Make document and profile-image uploads persistent.
- Add unit and component tests (Jest, React Testing Library) and a CI workflow.
- Replace images with openly licensed assets and add screenshots.
- Deploy a demo with seeded sample data.

## Build verification

Checked with **Node.js 22.14.0** and **npm 10.9.2**:

- `npm ci` installs cleanly from the committed lockfile.
- `npx tsc --noEmit` passes with no TypeScript errors.
- `npm run build` succeeds: it compiles, passes type checking, and **generates all 24 static
  pages**.
- ESLint is **skipped** during the build (`eslint.ignoreDuringBuilds`), and `npm run lint` still
  reports errors (see *Known limitations*).
- A passing build doesn't mean the features work. The app hasn't been tested in a browser, and
  most screens need the private API.

## Running locally

Requirements:
- Node.js 18.18 or later (needed by Next.js 15);
- the private Servizo API running at `http://localhost:3000`.

Without the API, only static layouts render.

```bash
cd servizo-client
npm install
npm run dev     # development server
npm run build   # production build (type-checked, ESLint skipped; see Known limitations)
npm run lint    # full ESLint check, which currently reports errors
```

Next.js uses port 3000 by default. If the API is already running there, Next.js picks the next
free port automatically.
