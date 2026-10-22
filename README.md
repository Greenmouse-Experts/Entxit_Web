# EntXit Web

EntXit Web is the modern estate, community, and access management web portal built for administrators, security personnel, facility managers, and residents. It provides real-time monitoring of visitor logs, resident directories, security guard activities, announcements, emergency alerts, subscription plans, and billing.

---

## Tech Stack

- **Runtime & Package Manager**: [Bun](https://bun.sh/)
- **Frontend Framework**: [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- **Routing**: [TanStack Router](https://tanstack.com/router) (file-based routing in `src/routes/`)
- **Data Fetching & Server State**: [TanStack Query v5](https://tanstack.com/query)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [DaisyUI v5](https://daisyui.com/)
- **Interactive Primitives**: [@headlessui/react v2](https://headlessui.com/)
- **Client State**: [Jotai](https://jotai.org/) & [Zustand](https://zustand.docs.pmnd.rs/)
- **Form Handling & Formatting**: [React Hook Form](https://react-hook-form.com/), `react-phone-number-input`, `react-number-format`
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)
- **Code Quality**: [Biome](https://biomejs.dev/) & TypeScript Native Preview (`tsgo`)
- **Testing**: [Vitest](https://vitest.dev/)

---

## Getting Started

> **Note**: This project strictly uses **Bun** as its package manager and script runner.

### Prerequisites

- [Bun](https://bun.sh/) (v1.1+ recommended)

### Installation

```bash
bun install
```

### Running Locally

Start the Vite development server on port 3000:

```bash
bun run dev
```

The application will be accessible at [http://localhost:3000](http://localhost:3000).

---

## Building & Production

To compile and produce an optimized production bundle:

```bash
bun run build
```

To preview the production build locally:

```bash
bun run preview
```

---

## Quality & Verification Commands

Always run Biome check and TypeScript verification before pushing code:

```bash
# Check code style, formatting, and lint rules
bun run check

# Auto-format codebase using Biome
bun run format

# Run Biome linter
bun run lint

# Run strict TypeScript type check without emitting output
bun run typecheck

# Execute unit and component tests
bun run test
```

---

## Component Architecture (`src/components/`)

The application features a component system integrating **DaisyUI** and **Headless UI** for accessible, responsive UI:

```
src/components/
├── ui/                   # Reusable base UI elements
│   ├── Button.tsx        # Styled buttons with variant and size support
│   ├── Card.tsx          # Card containers and headers
│   ├── Badge.tsx         # Status badges
│   ├── Modal.tsx         # Dialog / modal window
│   ├── DialogModal.tsx   # Headless UI Dialog wrapper
│   ├── BottomSheet.tsx   # Mobile-friendly bottom drawer
│   ├── Input.tsx         # Styled input elements
│   ├── Select.tsx        # Styled native select wrapper
│   ├── Checkbox.tsx      # Custom checkbox controls
│   ├── Table.tsx         # Accessible data tables
│   ├── Tabs.tsx          # Tabbed navigation
│   ├── StatCard.tsx      # Dashboard metrics KPI cards
│   ├── Loader.tsx        # Spinner and PageLoader placeholders
│   └── Alert.tsx         # System status alerts
├── layout/               # Application-level layouts & state containers
│   ├── DashboardLayout.tsx  # Dashboard shell with sidebar, drawer, and header
│   ├── PageLoader.tsx       # Page-level loader, access control, and empty state
│   └── QueryCompLayout.tsx  # Component-level TanStack Query status wrapper
├── tables/               # Advanced data grid utilities
│   ├── CustomTable.tsx      # Data table with sorting and styling
│   ├── CursorPagination.tsx # Cursor-based and offset pagination bar
│   ├── usePagination.tsx    # Pagination state hook
│   └── pop-up.tsx           # Contextual row popover actions
├── inputs/               # Specialized form inputs
│   ├── PhoneNumberInput.tsx # International phone number input
│   ├── FormattedPriceInput.tsx # Currency and price formatter input
│   ├── SimpleInput.tsx      # Floating-label text input
│   ├── SimpleTextArea.tsx   # Textarea component
│   ├── MarkdownTextArea.tsx # Markdown-supported editor
│   └── LocalSelect.tsx      # Searchable select component
├── organisations/        # Community & organisation modules
│   ├── OrganisationShell.tsx # Organisation view container
│   ├── ManagedTypePanel.tsx  # Managed entity switcher
│   └── ListFeedback.tsx      # Empty and error state display
└── images/               # Media uploaders
    ├── SelectImage.tsx       # Single/multiple image selector
    ├── UpdateImages.tsx      # Image gallery and replace tool
    └── useImages.ts          # Upload state hook
```

---

## Styling & Design System

- **DaisyUI v5**: Provides pre-built utility classes (`btn`, `card`, `badge`, `alert`, `table`, `loading`, etc.) with semantic color themes (`primary`, `secondary`, `neutral`, `base-100`, `error`, `success`, `warning`).
- **Tailwind CSS v4**: Utility-first CSS classes for spacing, flexbox/grid layout, and transitions.
- **Headless UI v2**: Unstyled, accessible UI components for dialogs, transitions, menus, and dropdowns.

---

## Routing

Routing is managed by [TanStack Router](https://tanstack.com/router) via file-based routing inside `src/routes/`:

- `src/routes/__root.tsx`: The root route container rendering global providers, outlets, and devtools.
- `src/routes/dashboard/`: Protected dashboard views (organisations, users, logs, reports, subscriptions, alerts).
- `src/routes/login.tsx`: Authentication screen.

### Navigation

Always use the typed `Link` component from `@tanstack/react-router` for single-page transitions:

```tsx
import { Link } from "@tanstack/react-router";

<Link to="/dashboard/organisations" className="btn btn-primary">
  View Organisations
</Link>;
```

---

## API Services & Data Fetching

### Backend Response Format

All backend endpoints wrap responses in a standard `ApiResponse<T>` envelope:

```typescript
export interface ApiResponse<T = any> {
  status: string; // e.g. "success"
  statusCode: number; // e.g. 200, 201
  message: string; // Descriptive API response message
  payload: T; // Response data payload
}
```

Paginated endpoints provide a `PaginatedPayload<T>`:

```typescript
export interface PaginatedPayload<T> {
  data: T[];
  pagination?: {
    page: number;
    limit: number;
    total?: number;
    pages?: number;
    nextPage?: number | null;
  };
}
```

### Typed Services (`src/services/`)

The application features strongly-typed service modules configured to communicate with the EntXit API:

- `authService`: Login, OTP verification, password resets, token refreshing.
- `adminService`: Communities, sub-admins, security guards, resident accounts, platform fees.
- `subscriptionService`: Subscription plans, packages, entitlements, and features.
- `subAdminService`: Community-specific management and delegations.
- `securityService`: Guard rosters, patrol logs, incident reports, security panic alerts.
- `guestsService`: Visitor passes, check-in / check-out logs, pre-approvals.
- `announcementsService`: Community broadcasts and noticeboard items.
- `alertsService`: Emergency alerts and incident resolutions.
- `paymentsService`: Transaction history, invoices, and billing records.
- `usersService`: Resident profiles, vehicle registrations, and member directories.
- `notificationsService`: In-app notification center and mark-as-read operations.

### Data Fetching with `PageLoader` & `QueryCompLayout`

Use `PageLoader` for page-level queries and `QueryCompLayout` for component-level queries:

```tsx
import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services";
import PageLoader from "@/components/layout/PageLoader";

export function CommunitiesPage() {
  const query = useQuery({
    queryKey: ["communities"],
    queryFn: () => adminService.getCommunities(),
  });

  return (
    <PageLoader
      query={query}
      loadingText="Loading communities..."
      emptyState={{
        title: "No Communities Found",
        description: "Get started by adding your first community.",
        actionText: "Add Community",
        onAction: () => {},
      }}
    >
      {(response) => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {response.payload.data.map((community) => (
            <div key={community.id} className="card bg-base-100 shadow p-4">
              <h3 className="font-bold">{community.name}</h3>
              <p className="text-sm text-base-content/70">
                {community.address}
              </p>
            </div>
          ))}
        </div>
      )}
    </PageLoader>
  );
}
```

### Error Handling

Error messages from failed requests or network drops are automatically extracted and formatted using `extract_message()` (`src/lib/api-error.ts`):

```typescript
import { extract_message } from "@/lib/api-error";

// Extracts message from AxiosError, ApiResponse, Error, or string:
const message = extract_message(error);
```

---

## State Management

- **Authentication State**: `src/store/authStore.ts` using `jotai` with storage persistence. Provides `useAuth()`, `useToken()`, and `useProfile()`.
- **Onboarding State**: `src/store/onboarding-store.ts` using `zustand`.
- **Server Cache**: Managed by TanStack Query with automatic caching and cache invalidation.
