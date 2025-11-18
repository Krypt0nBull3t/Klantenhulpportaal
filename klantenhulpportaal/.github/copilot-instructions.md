# Copilot Instructions for Klantenhulpportaal

## 🎯 Project Overview
**Customer Support Portal**: Laravel backend + Vue 3 TypeScript SPA
- **Goal**: Robust ticket management system with secure authentication
- **Stack**: Laravel 12, Vue 3, TypeScript, Tailwind CSS, Laravel Sanctum
- **Development**: TDD approach with Vitest, phase-based task completion

## 🏗️ Architecture
### Tech Stack
- **Backend**: Laravel 12 + Eloquent + Sanctum authentication
- **Frontend**: Vue 3 SPA + TypeScript + Vue Router + Axios + Tailwind CSS
- **Database**: MySQL with migrations, seeders, and factories
- **Testing**: Vitest + Vue Test Utils + Laravel tests

### Key Directories
```
app/Models/               # Eloquent models
app/Http/Controllers/     # API controllers
resources/js/domains/     # Vue components by domain
resources/js/services/    # API calls, error handling, state
routes/api.php           # Backend API routes  
resources/js/router/     # Frontend routing
database/migrations/     # Database schema
tests/                   # Frontend/backend tests
```

## 📋 Database Schema
- **users**: id, name, email, password, is_admin, email_verified_at
- **categories**: id, name
- **tickets**: id, title, content, status, user_id, assigned_to, category_id
- **replies**: id, ticket_id, user_id, content
- **notes**: id, ticket_id, admin_id, content (admin-only)

## 🔧 Development Rules

### 📋 Project Management
- **KEY RULE**: Before implementing any code or making changes to the workspace, always provide the code and explanation for user review and approval
- **KEY RULE**: Always update tasks.md immediately after completing and implementing an approved task to keep project progress visible and accurate
- **KEY RULE**: Use JSDoc-style comments for all generated code, including PHP, to ensure consistent and clear documentation for classes, methods, parameters, and return values
- **KEY RULE**: Phase-Based Development - Follow the logical dependency order in tasks.md:
  - Complete ALL foundation tasks (database, infrastructure, authentication) before building dependent features
  - Never start a phase that depends on incomplete previous phases
  - Verify infrastructure (Sanctum, error handling, routing) is working before building features that depend on it
  - Backend endpoints should be implemented and tested before connecting frontend components to them

### 🧪 Testing Strategy (TDD)
- **KEY RULE**: When writing tests:
  - Add `data-test` attributes to all relevant elements in components and reference them in tests to ensure robust and maintainable test targeting
  - Exclusively use the Vitest library for all frontend tests in this project. Use PHPUnit for backend tests only.
  - **CRITICAL**: Use `mount` instead of `shallowMount` when testing components that depend on child components with reactive state (e.g., ErrorMessage, FormError components that use composables). Use `shallowMount` only for pure component logic testing without child dependencies
  - Set global state (error messages, user state) BEFORE mounting components in tests to ensure predictable behavior
  - Always use `flushPromises()` after state changes in async tests to ensure Vue reactivity updates are processed
  - Use the AAA (Arrange, Act, Assert) pattern for clarity and maintainability
  - Prefer Vitest globals (`describe`, `it`, `expect`) and remove unnecessary imports when enabled
  - Structure tests to be concise, readable, and focused on user-facing behavior
  - Keep test files clean and idiomatic for maintainability
  - Remove redundant or obsolete tests promptly
- **TDD Cycle**: Write failing test → implement minimal code → refactor (ensure tests pass)
- **Coverage**: Write at least one test per feature, cover edge cases and error conditions
- **Independence**: Keep tests isolated, avoid dependencies between tests
- **Maintenance**: Run full test suite after changes, remove/update obsolete tests

### 🧪 Advanced Testing Rules (CategoryCreateForm Learnings)
- **Error Handling in Tests**: 
  - Never use local component state for validation errors in components
  - Always use centralized error service: `setErrorBag({ fieldName: ['Error message'] })` for validation
  - Use `<FormError name="fieldName" />` without conditions - component handles error checking internally
  - Clean up errors in test `beforeEach()` with `destroyMessage()` and `destroyErrors()`
- **Store Mocking Pattern**:
  - Use getter-based mocks: `get actions() { return mockActions }` instead of static objects
  - Initialize mock functions in `beforeEach()`: `mockActions = { actionName: vi.fn() }`
  - Type mock actions: `let mockActions: { actionName: ReturnType<typeof vi.fn> }`
- **Form Testing Requirements**:
  - Trigger form submission on `<form>` element: `await wrapper.find('form').trigger('submit')`
  - Never rely on button clicks alone for `@submit.prevent` handlers
  - Test component props with `.props()`, DOM attributes with `.attributes()`
- **Research Pattern**: Always check existing test files for project-specific patterns before implementing new tests

### 🎨 Frontend Standards  
- **KEY RULE**: Always use modular route arrays for each domain (e.g., landingRoutes, ticketsRoutes) in Vue Router. Import and spread these arrays in the main router to keep routing organized, maintainable, and consistent with project conventions
- **KEY RULE**: Prefer including only direct fields in API resources and let the frontend fetch related data as needed, unless related data is always required for the view
- **TypeScript**: All Vue components and services (prefer `const`/`let`, arrow functions)
- **Imports**: Use `use` statements, remove unnecessary imports (e.g., `defineEmits`)
- **Architecture**: Separate API calls (`services/`), types (`/types`), components (`/components`)
- **Error Handling**: Central error bag + Axios interceptors, never use `try/catch` or `.then/.catch`, always `async/await`
- **Routing**: Use Vue Router guards for protected routes
- **Accessibility**: `aria-label` on all interactive elements
- **Styling**: Use Tailwind CSS, custom CSS only if necessary

### 🔐 Laravel Sanctum SPA
- **Environment**: Configure `SANCTUM_STATEFUL_DOMAINS` in `.env`
- **Middleware**: Add `EnsureFrontendRequestsAreStateful` to API routes  
- **Model**: Use `HasApiTokens` trait on User model
- **Verification**: Ensure `/sanctum/csrf-cookie` endpoint works

### 🏛️ Backend Standards
- **Models**: Eloquent models in `app/Models/`, with factories in `database/factories/`
- **Controllers**: HTTP controllers in `app/Http/Controllers/`
- **Validation**: Use Laravel Form Requests for all API validation
- **Resources**: Create API Resources for structured responses
- **Authentication**: Laravel Sanctum for API auth
- **Routes**: Backend routes in `routes/api.php` and `routes/web.php`

### 🎯 Business Rules
- Authentication required for all portal access
- Users modify own tickets; admins modify all tickets
- Notes are admin-only; replies notify users
- Email confirmation for registration

## References
- [Laravel Docs](https://laravel.com/docs)
- [Vue 3 Docs](https://vuejs.org/)
- [Vite Docs](https://vitejs.dev/)
- [Tailwind Docs](https://tailwindcss.com/)

---
Update this file if project conventions or workflows change. For questions, check the README or ask the maintainers.
