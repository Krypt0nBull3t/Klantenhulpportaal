# Tasks for Klantenhulpportaal

---

## Database Setup (Start Here)
### Users Entity
- ✅ Create migration for users table
- ✅ Create seeder for users
- ✅ Create factory for users
- ✅ Create Eloquent model for users
- ✅ Create StoreUserRequest for user registration
- ✅ Create UpdateUserRequest for user profile update
- ✅ Create API Resource for users
- ✅ Create controller for users

### Tickets Entity
- ✅ Create migration for tickets table
- ✅ Create seeder for tickets
- ✅ Create factory for tickets
- ✅ Create Eloquent model for tickets
- ✅ Create StoreTicketRequest for ticket creation
- ✅ Create UpdateTicketRequest for ticket update
- ✅ Create API Resource for tickets
- ✅ Create controller for tickets

### Replies Entity
- ✅ Create migration for replies table
- ✅ Create seeder for replies
- ✅ Create factory for replies
- ✅ Create Eloquent model for replies
- ✅ Create StoreReplyRequest for reply creation
- ✅ Create UpdateReplyRequest for reply update
- ✅ Create API Resource for replies
- ✅ Create controller for replies

### Notes Entity
- ✅ Create migration for notes table
- ✅ Create seeder for notes
- ✅ Create factory for notes
- ✅ Create Eloquent model for notes
- ✅ Create StoreNoteRequest for note creation
- ✅ Create UpdateNoteRequest for note update
- ✅ Create API Resource for notes
- ✅ Create controller for notes

### Categories Entity
- ✅ Create migration for categories table
- ✅ Create seeder for categories
- ✅ Create factory for categories
- ✅ Create Eloquent model for categories
- ✅ Create StoreCategoryRequest for category creation
- ✅ Create UpdateCategoryRequest for category update
- ✅ Create API Resource for categories
- ✅ Create controller for categories

---

## User Authentication & Registration


### Frontend
- Create registration page UI
- Connect registration form to backend
- Create login page UI
- Connect login form to backend
- Implement logout functionality
- Create password recovery page UI
- Connect password recovery form to backend
- Show confirmation messages and errors in UI



### Backend
- Implement user registration endpoint
- Implement backend validation for registration using Laravel Form Request
- Implement email confirmation for registration
- Implement login endpoint
- Implement backend validation for login using Laravel Form Request
- Implement logout endpoint
- Implement password recovery endpoint
- Implement backend validation for password recovery using Laravel Form Request
- Set up Laravel Sanctum for authentication
- Write tests for registration endpoint
- Write tests for email confirmation
- Write tests for login endpoint
- Write tests for logout endpoint
- Write tests for password recovery endpoint

### Styling
- Style registration, login, and password recovery forms using Tailwind
- Ensure responsive design for authentication pages

---

## Ticket Management


### Frontend
- Create ticket overview page UI (list tickets)
- Connect ticket overview page to backend
- Create ticket detail page UI (show all ticket info, replies, notes)
- Connect ticket detail page to backend
- Create ticket creation form UI
- Connect ticket creation form to backend
- Create ticket edit form UI
- Connect ticket edit form to backend
- Implement ticket assignment UI
- Implement ticket status change UI
- Show errors and success messages in UI



### Backend
- Implement ticket create endpoint
- Implement backend validation for ticket creation using Laravel Form Request
- Implement ticket read endpoint
- Implement ticket update endpoint
- Implement backend validation for ticket update using Laravel Form Request
- Implement ticket delete endpoint
- Implement ticket assignment endpoint
- Implement ticket status change endpoint
- Write authorization policies for ticket access
- Write tests for ticket create endpoint
- Write tests for ticket read endpoint
- Write tests for ticket update endpoint
- Write tests for ticket delete endpoint
- Write tests for ticket assignment endpoint
- Write tests for ticket status change endpoint

### Styling
- Style ticket overview and detail pages with Tailwind
- Style ticket forms and status/assignment controls

---

## Category Management


### Frontend
- Create category overview page UI
- Connect category overview page to backend
- Create category creation form UI
- Connect category creation form to backend
- Create category edit form UI
- Connect category edit form to backend
- Implement category removal UI
- Show errors and success messages in UI



### Backend
- Implement category create endpoint
- Implement backend validation for category creation using Laravel Form Request
- Implement category read endpoint
- Implement category update endpoint
- Implement backend validation for category update using Laravel Form Request
- Implement category delete endpoint
- Write tests for category create endpoint
- Write tests for category read endpoint
- Write tests for category update endpoint
- Write tests for category delete endpoint

### Styling
- Style category management pages and forms

---

## Ticket Replies & Notes


### Frontend
- Display replies on ticket detail page UI
- Connect replies display to backend
- Create reply creation form UI
- Connect reply creation form to backend
- Create reply edit form UI
- Connect reply edit form to backend
- Create note creation UI (admin-only)
- Connect note creation form to backend (admin-only)
- Create note removal UI (admin-only)
- Connect note removal UI to backend (admin-only)
- Integrate notification display for user replies
- Show errors and success messages in UI



### Backend
- Implement ticket reply create endpoint
- Implement backend validation for ticket reply creation using Laravel Form Request
- Implement ticket reply edit endpoint
- Implement backend validation for ticket reply edit using Laravel Form Request
- Implement ticket note add endpoint (admin-only)
- Implement backend validation for ticket note add using Laravel Form Request
- Implement ticket note remove endpoint (admin-only)
- Ensure admin-only visibility for notes
- Set up notification system for ticket replies
- Write tests for ticket reply create endpoint
- Write tests for ticket reply edit endpoint
- Write tests for ticket note add endpoint
- Write tests for ticket note remove endpoint

### Styling
- Style reply and note sections on ticket detail page
- Style reply/note forms and notification messages

---

## User Management (Admin)


### Frontend
- Create user overview page UI (admin-only)
- Connect user overview page to backend
- Create user edit form UI (admin-only)
- Connect user edit form to backend (admin-only)
- Create user removal UI (admin-only)
- Connect user removal UI to backend (admin-only)
- Show errors and success messages in UI



### Backend
- Implement user list endpoint (admin-only)
- Implement user edit endpoint (admin-only)
- Implement backend validation for user edit using Laravel Form Request
- Implement user remove endpoint (admin-only)
- Write tests for user list endpoint
- Write tests for user edit endpoint
- Write tests for user remove endpoint

### Styling
- Style user management pages and forms

---
## Administrator User Management
- Create initial administrator user via seeder or migration
- Create protected endpoint for admin promotion
- Create MakeAdminRequest for admin promotion validation
- Implement controller logic for admin promotion (admin-only)
- Write tests for admin promotion endpoint and logic

---
## Routing & Guards
### Frontend
- Implement Vue Router guards for protected routes
- Test route protection for authenticated and admin-only pages

---
## Error Handling
### Frontend
- Implement Axios interceptors for error handling
- Set up central error bag/message in `services/error` and `services/http`
- Display validation and server errors in the UI

---
## General
- Document new endpoints, models, or business logic in copilot-instructions.md
- Mark each completed task in tasks.md
- For each new feature, first write a failing Vitest test in `/klantenhulpportaal/tests`, then write the minimal code needed to make the test pass (TDD).
- Keep tests isolated and independent; avoid dependencies between tests.
- Refactor code only after tests pass, and ensure all tests remain green after refactoring.
- Write clear, descriptive test names and assertions that reflect feature requirements.
- Cover edge cases and error conditions in your tests, not just the happy path.
- Run the full test suite after every change to catch regressions early.
- Remove or update obsolete tests when features change or are removed.
- For each database entity, create migrations, seeders, factories, models, controllers, requests, and resources as needed for full CRUD and API interaction.
