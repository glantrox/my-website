The industry standard for Svelte and SvelteKit architecture centers around **Svelte 5's Runes** (`$state`, `$derived`, `$effect`).

The community has largely moved away from complex, external state management libraries (like Redux or Zustand) and legacy Svelte 4 stores. Instead, the modern standard balances Svelte's **Universal Reactivity** (using classes + runes) with server-first framework mechanisms provided by **SvelteKit**.

When building enterprise-ready, maintainable Svelte applications, clean architecture relies on specific core layers.

---

## 1. State Management Matrix

In Svelte, state should live as close to where it is needed as possible. Global state is generally treated as an architectural anti-pattern unless it is genuinely application-wide (like authentication status or user themes).

| State Pattern | Reactivity Mechanism | Typical Scope | Best Used For |
| --- | --- | --- | --- |
| **Local Runes** | `$state`, `$derived` | Single Component | Ephemeral UI behaviors (e.g., dropdown toggles, modal states, form input feedback). |
| **Class-Based Context** | Classes inside `.svelte.ts` files | Component Subtree | Feature-wide domain data flow (e.g., a multi-step checkout wizard, interactive dashboards). |
| **SvelteKit Page Data** | Server `load` functions | Route-level | Fetching database records, loading initial API data, and ensuring proper SEO/SSR handling. |
| **URL Parameters** | Native browser query strings | App-wide & Linkable | Sharable view filters, pagination, and search queries. |

---

## 2. The Standard Clean Architecture Layout

For application scaling, teams lean heavily on either **Domain-Driven Design (DDD)** or **Feature-Sliced Design (FSD)** patterns. The core objective is isolating presentation (the UI framework) from the core domain (the business logic).

A standard enterprise repository structure separates routes from business logic using the `$lib` directory:

```text
src/
├── lib/                  # Shared core architecture layer ($lib)
│   ├── components/       # Presentation Layer: Stateless, reusable UI primitives (Buttons, Modals)
│   ├── entities/         # Domain Layer: Core business logic, validation schemas, and state classes
│   │   └── cart/
│   │       ├── cart.svelte.ts  # Universal reactive class for managing business logic
│   │       └── types.ts
│   ├── services/         # Infrastructure Layer: API clients, SDK integrations, local storage wrappers
│   └── shared/           # Cross-cutting utilities, helper functions, and constants
└── routes/               # Routing Layer: SvelteKit file-based pages & server endpoints
    ├── +layout.svelte
    ├── +page.svelte
    └── checkout/
        ├── +page.server.ts # Controller: Fast data load functions & form submission actions
        └── +page.svelte    # View: Composition of components bound to data

```

---

## 3. The "Class + Context" Pattern for Shared State

When complex state needs to be shared across deeply nested components, the absolute best practice is wrapping a **Rune-powered Class** inside **Svelte’s Context API**. This provides a clean interface, keeps business logic outside `.svelte` files, and safely avoids shared state pollution on the server during SSR.

### Step A: Define your State Machine (Domain Layer)

Create a strongly-typed TypeScript class using runes to manage internal updates.

```typescript
// src/lib/entities/cart/cart.svelte.ts
export class CartState {
  // Deeply reactive state via proxy tracking
  items = $state<{ id: string; price: number; qty: number }[]>([]);

  // Automatically computed derived values (replaces legacy derived stores)
  totalPrice = $derived(
    this.items.reduce((sum, item) => sum + item.price * item.qty, 0)
  );

  // Intentional mutation methods
  addItem(newItem: { id: string; price: number; qty: number }) {
    const existing = this.items.find(i => i.id === newItem.id);
    if (existing) {
      existing.qty += 1; // Mutating directly works perfectly in Svelte 5
    } else {
      this.items.push(newItem);
    }
  }
}

```

### Step B: Create the Safe Context Wrapper

To bypass string-based context collisions and maintain strict Type Safety, encapsulate your getter and setter logic.

```typescript
// src/lib/entities/cart/context.ts
import { setContext, getContext } from 'svelte';
import { CartState } from './cart.svelte';

const CART_KEY = Symbol('CART_STATE');

export function initCartState() {
  const state = new CartState();
  return setContext(CART_KEY, state);
}

export function useCartState() {
  const state = getContext<CartState>(CART_KEY);
  if (!state) {
    throw new Error('useCartState must be consumed within a cart-initialized tree');
  }
  return state;
}

```

### Step C: Provide and Inject in the Presentation Layer

Initialize the domain class high up in your route layout, allowing child components down the tree to easily extract the logic.

```html
<!-- src/routes/checkout/+layout.svelte -->
<script lang="ts">
  import { initCartState } from '$lib/entities/cart/context';
  
  // Instantiates the state locally to this layout branch
  initCartState();
</script>

<slot />

```

```html
<!-- src/routes/checkout/summary/+page.svelte -->
<script lang="ts">
  import { useCartState } from '$lib/entities/cart/context';
  
  const cart = useCartState();
</script>

<div>
  <p>Total Items Cost: ${cart.totalPrice}</p>
  <button onclick={() => cart.addItem({ id: 'abc', price: 20, qty: 1 })}>
    Add Item
  </button>
</div>

```

---

## 4. Unidirectional Data Flow via SvelteKit

A major rule of thumb in clean Svelte architecture: **Let the network handle your server data flow.**

Avoid writing code that fetches data inside client-side component lifecycles (like `onMount`) and populates a client state store. Instead, utilize SvelteKit’s native server components philosophy:

1. **Load Data on the Server:** Fetch database models inside `+page.server.ts` `load` functions. SvelteKit handles passing this seamlessly down as the immutable `data` prop.
2. **Mutate Data via Actions:** Execute data changes using native HTML forms mapping to `actions` inside `+page.server.ts`.
3. **Automatic Invalidation:** When a server action completes, SvelteKit automatically re-runs your layout and page `load` functions, invalidating out-of-date information and feeding fresh props back to the UI smoothly.

> **Architecture Takeaway:** Treat your UI components merely as a transformation function of your data state. Keep them purely representational, and let your TypeScript classes and SvelteKit endpoints orchestrate the heavy lifting.

Are you planning an application that needs to handle complex offline-first functionality, or are you focusing on a standard server-driven app where API performance is the primary priority?