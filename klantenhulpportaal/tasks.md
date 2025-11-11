# Tasks for Klantenhulpportaal

---

## Phase 1: Foundation & Database Setup (Start Here)

### Core Database Entities
#### Users Entity
- ✅ Create migration for users table
- ✅ Create seeder for users
- ✅ Create factory for users
- ✅ Create Eloquent model for users
- ✅ Create StoreUserRequest for user registration
- ✅ Create UpdateUserRequest for user profile update
- ✅ Create API Resource for users
- ✅ Create controller for users

#### Categories Entity
- ✅ Create migration for categories table
- ✅ Create seeder for categories
- ✅ Create factory for categories
- ✅ Create Eloquent model for categories
- ✅ Create StoreCategoryRequest for category creation
- ✅ Create UpdateCategoryRequest for category update
- ✅ Create API Resource for categories
- ✅ Create controller for categories

#### Tickets Entity
- ✅ Create migration for tickets table
- ✅ Create seeder for tickets
- ✅ Create factory for tickets
- ✅ Create Eloquent model for tickets
- ✅ Create StoreTicketRequest for ticket creation
- ✅ Create UpdateTicketRequest for ticket update
- ✅ Create API Resource for tickets
- ✅ Create controller for tickets

#### Replies Entity
- ✅ Create migration for replies table
- ✅ Create seeder for replies
- ✅ Create factory for replies
- ✅ Create Eloquent model for replies
- ✅ Create StoreReplyRequest for reply creation
- ✅ Create UpdateReplyRequest for reply update
- ✅ Create API Resource for replies
- ✅ Create controller for replies

#### Notes Entity
- ✅ Create migration for notes table
- ✅ Create seeder for notes
- ✅ Create factory for notes
- ✅ Create Eloquent model for notes
- ✅ Create StoreNoteRequest for note creation
- ✅ Create UpdateNoteRequest for note update
- ✅ Create API Resource for notes
- ✅ Create controller for notes

### Core Infrastructure Setup
- ✅ Set up error handling with Axios interceptors
- ✅ Set up central error bag/message in `services/error` and `services/http`
- ✅ Create initial administrator user via seeder or migration
- ✅ Set up Laravel Sanctum for authentication

---

## Phase 2: Authentication System (Complete Before Moving Forward)

### Backend Authentication
- ✅ Implement login endpoint
- ✅ Implement backend validation for login using Laravel Form Request
- ✅ Implement logout endpoint
- ✅ Implement password recovery endpoint
- ✅ Implement backend validation for password recovery using Laravel Form Request
- Implement user registration endpoint
- Implement backend validation for registration using Laravel Form Request
- Implement email confirmation for registration
- Write tests for registration endpoint
- Write tests for email confirmation
- ✅ Write tests for login endpoint
- Write tests for logout endpoint
- Write tests for password recovery endpoint

### Frontend Authentication
- ✅ Create a landing page
- ✅ Create login page UI
- ✅ Connect login form to backend
- Create registration page UI
- Connect registration form to backend
- Create password recovery page UI
- Connect password recovery form to backend
- Implement logout functionality
- Show confirmation messages and errors in UI
- Implement Vue Router guards for protected routes
- Test route protection for authenticated and admin-only pages

### Authentication Styling
- Style registration, login, and password recovery forms using Tailwind
- Ensure responsive design for authentication pages

---

## Phase 3: Category Management (Simple Feature First)

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

### Frontend
- Create category overview page UI
- Connect category overview page to backend
- Create category creation form UI
- Connect category creation form to backend
- Create category edit form UI
- Connect category edit form to backend
- Implement category removal UI
- Show errors and success messages in UI

### Styling
- Style category management pages and forms

---

## Phase 4: Core Ticket Management

### Backend
- Implement ticket create endpoint
- Implement backend validation for ticket creation using Laravel Form Request
- Implement ticket read endpoint
- Implement ticket update endpoint
- Implement backend validation for ticket update using Laravel Form Request
- Implement ticket delete endpoint
- Write authorization policies for ticket access
- Write tests for ticket create endpoint
- Write tests for ticket read endpoint
- Write tests for ticket update endpoint
- Write tests for ticket delete endpoint

### Frontend
- Create ticket overview page UI (list tickets)
- Connect ticket overview page to backend
- Create ticket detail page UI (show basic ticket info)
- Connect ticket detail page to backend
- Create ticket creation form UI
- Connect ticket creation form to backend
- Create ticket edit form UI
- Connect ticket edit form to backend
- Show errors and success messages in UI

### Styling
- Style ticket overview and detail pages with Tailwind
- Style ticket forms

---

## Phase 5: Ticket Replies & Notes

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

### Frontend
- Update ticket detail page UI to show replies and notes
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

### Styling
- Style reply and note sections on ticket detail page
- Style reply/note forms and notification messages

---

## Phase 6: Advanced Ticket Features

### Backend
- Implement ticket assignment endpoint
- Implement ticket status change endpoint
- Write tests for ticket assignment endpoint
- Write tests for ticket status change endpoint

### Frontend
- Implement ticket assignment UI
- Implement ticket status change UI

### Styling
- Style assignment and status controls

---

## Phase 7: Admin User Management

### Backend
- Create protected endpoint for admin promotion
- Create MakeAdminRequest for admin promotion validation
- Implement controller logic for admin promotion (admin-only)
- Implement user list endpoint (admin-only)
- Implement user edit endpoint (admin-only)
- Implement backend validation for user edit using Laravel Form Request
- Implement user remove endpoint (admin-only)
- Write tests for admin promotion endpoint and logic
- Write tests for user list endpoint
- Write tests for user edit endpoint
- Write tests for user remove endpoint

### Frontend
- Create user overview page UI (admin-only)
- Connect user overview page to backend
- Create user edit form UI (admin-only)
- Connect user edit form to backend (admin-only)
- Create user removal UI (admin-only)
- Connect user removal UI to backend (admin-only)
- Show errors and success messages in UI

### Styling
- Style user management pages and forms

---

## Phase 8: Final Polish & Testing

### Comprehensive Testing
- Run full test suite and fix any regressions
- Add integration tests for critical user flows
- Test edge cases and error conditions
- Ensure all features work together seamlessly

### Documentation & Maintenance
- Document new endpoints, models, or business logic in copilot-instructions.md
- Update README with setup and usage instructions
- Create deployment documentation

---

## Development Guidelines (Apply Throughout All Phases)

### Test-Driven Development
- For each new feature, first write a failing Vitest test in `/klantenhulpportaal/tests`
- Write the minimal code needed to make the test pass (TDD)
- Keep tests isolated and independent; avoid dependencies between tests
- Refactor code only after tests pass, and ensure all tests remain green after refactoring
- Write clear, descriptive test names and assertions that reflect feature requirements
- Cover edge cases and error conditions in your tests, not just the happy path
- Run the full test suite after every change to catch regressions early
- Remove or update obsolete tests when features change or are removed

### Task Management
- Mark each completed task in tasks.md immediately upon completion
- Complete entire phases before moving to the next phase
- Ensure dependencies are met before starting dependent features

### Code Quality
- Use TypeScript for all frontend code
- Follow project conventions outlined in copilot-instructions.md
- Implement proper error handling throughout the application
- Ensure responsive design for all UI components
