# Copilot Instructions for Klantenhulpportaal

## Project Overview
This is a Customer Support Portal, built with Laravel (backend) and Vue 3 + TypeScript (frontend). The goal is to provide a robust, efficient, and user-friendly system for managing customer support tickets, with secure authentication and realistic seeded data for development.

## Architecture & Data Flow
- **Backend:** Laravel 12, Eloquent ORM, Sanctum for authentication.
- **Frontend:** Vue 3 SPA, TypeScript, Vue Router, Axios façade for API calls, Tailwind CSS for styling.
- **State Management:** Store factory pattern in `resources/js/services/store/`.
- **Routing:** Client-side via Vue Router (`resources/js/router/`), backend via Laravel routes (`routes/api.php`, `routes/web.php`).
- **Database:** MySQL (configure in `.env`), see ERD below for relationships. Migrations in `database/migrations/`, seeders/factories in `database/seeders/` and `database/factories/`.

## Database Structure (see ERD)
- **users:** id, name, email, password, is_admin (boolean), email_verified_at, created_at, updated_at
- **tickets:** id, title, content, status (int), user_id, assigned_to, category_id, created_at, updated_at
- **replies:** id, ticket_id, user_id, content, created_at, updated_at
- **notes:** id, ticket_id, admin_id, content, created_at, updated_at
- **categories:** id, name, created_at, updated_at

## Developer Workflows
- **Start development:** `composer run dev` (runs PHP server, queue, logs, Vite dev server)
- **Build frontend:** `npm run build`
- **Run backend tests:** `composer test` or `php artisan test`
- **Migrate database:** `php artisan migrate` (create migrations in `database/migrations/`)
- **Seed database:** `php artisan db:seed` (create seeders in `database/seeders/`)
- **Create factories:** Use `php artisan make:factory` for test data in `database/factories/`
- **Create models:** Use `php artisan make:model` for Eloquent models in `app/Models/`
- **Create controllers:** Use `php artisan make:controller` for logic in `app/Http/Controllers/`
- **Create requests:** Use `php artisan make:request` for validation in `app/Http/Requests/`
- **Create resources:** Use `php artisan make:resource` for API responses in `app/Http/Resources/`
- **Environment setup:** Copy `.env.example` to `.env` and configure as needed

## Conventions & Patterns
- **Models:** Eloquent models in `app/Models/`, factories in `database/factories/`
- **Controllers:** HTTP controllers in `app/Http/Controllers/`
- **Frontend domains:** Vue components/pages by domain in `resources/js/domains/`
- **API communication:** Use Axios façade in `resources/js/services/http/`
- **Authentication:** Laravel Sanctum for API auth
- **Routing:**
  - Backend: `routes/api.php` (API), `routes/web.php` (web)
  - Frontend: `resources/js/router/index.ts`
- **TypeScript:** All new frontend code should use TypeScript
- **Styling:** Use Tailwind CSS; custom CSS only if necessary

## Example: Adding a Ticket Feature
1. Backend: Add model (`app/Models/Ticket.php`), migration, controller
2. Frontend: Add page/component (`resources/js/domains/Tickets/pages/`), update routes (`resources/js/domains/Tickets/routes.ts`)
3. API: Define endpoint in `routes/api.php`

## Integration Points
- **API:** Frontend communicates with backend via REST endpoints
- **Auth:** Sanctum for secure user management
- **Queue:** Laravel queue for background jobs


## Features
- User authentication (login, logout, password recovery)
- User registration with confirmation email
- Ticket overview for users and administrators
- Ticket creation and modification
- Ticket assignment to administrators
- Ticket status management
- Category management (view, create, edit, remove)
- Ticket replies (by administrators, with user notification)
- Reply editing (by administrators)
- Ticket notes (add/remove, admin-only visibility)
- User management (view, edit, remove users)

## Key Rules
- All users must authenticate to access the portal
- Users can only modify their own tickets; administrators can modify all tickets
- All ticket information is shown on a single page
- Replies are shown on the ticket detail page
- Notes are only visible to administrators
- Users receive a confirmation email upon registration
- Users are notified of responses to their tickets

**Key Rule:** Before implementing any code or making changes to the workspace, always provide the code and explanation for user review and approval.
**Key Rule:** Always update tasks.md immediately after completing and implementing an approved task to keep project progress visible and accurate.
**Key Rule:** Use JSDoc-style comments for all generated code, including PHP, to ensure consistent and clear documentation for classes, methods, parameters, and return values.

# Coding Key Rules
**Key Rule:** Prefer including only direct fields in API resources and let the frontend fetch related data as needed, unless related data is always required for the view.
- Always use TypeScript for Vue components and services (prefer `const`/`let`, arrow functions)
- Separate logic: API calls in `services/`, types in `/types`, components in `/components`
- Implement error handling on all Axios requests. Use Axios interceptors and a central error bag/message (`services/error` and `services/http`) for frontend error handling. Catch validation and server errors in the error bag/message and show these in the UI.
- Never use `try/catch` or `.then/.catch`; always use `async/await`
- Use Vue Router guards for protected routes
- Always explain your choices and continue implementing only after confirmation
- Always mark the task in `tasks.md` as complete upon completion of the task
- Use `aria` labels for accessibility on all interactive frontend components (forms, buttons, links, etc.)
- Write at least one Vitest test per feature when working on a task. Create new tests in `/klantenhulpportaal/tests`.
- Use Test-Driven Development (TDD): For each new feature, first write a failing test, then write the minimal code needed to make the test pass.
- Keep tests isolated and independent; avoid dependencies between tests.
- Refactor code only after tests pass, and ensure all tests remain green after refactoring.
- Write clear, descriptive test names and assertions that reflect feature requirements.
- Cover edge cases and error conditions in your tests, not just the happy path.
- Run the full test suite after every change to catch regressions early.
- Remove or update obsolete tests when features change or are removed.

## References
- [Laravel Docs](https://laravel.com/docs)
- [Vue 3 Docs](https://vuejs.org/)
- [Vite Docs](https://vitejs.dev/)
- [Tailwind Docs](https://tailwindcss.com/)

---
Update this file if project conventions or workflows change. For questions, check the README or ask the maintainers.
