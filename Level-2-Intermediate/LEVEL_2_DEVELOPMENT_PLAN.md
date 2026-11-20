# Codveda Full-Stack Development Internship
## Level 2: Intermediate Development Plan

**Project:** Menged (መንገድ)  
**Project Type:** Opportunity Discovery and Career Management Platform  
**Internship Level:** Level 2 (Intermediate)  
**Development Approach:** Iterative and Incremental Development  
**Backend:** Node.js, Express.js  
**Database:** PostgreSQL  
**Frontend:** React  
**Authentication:** JWT and bcrypt  

---

# 1. Level 2 Overview

Level 2 builds upon the functional foundation established during Level 1. Rather than creating a new application, this milestone will progressively evolve Menged into a more structured, interactive, and personalized web application.

During Level 1, Menged was developed using HTML, CSS, Vanilla JavaScript, Node.js, Express.js, and PostgreSQL. The application currently supports public opportunity discovery, opportunity filtering, API-based data retrieval, and community opportunity submission.

Level 2 introduces a frontend framework, user authentication, authorization, and more structured database integration.

The development process will follow an iterative and incremental approach. Existing functionality will be preserved whenever possible, while new features will be introduced in clearly defined stages.

## Level 2 Objectives

- Transition the frontend from Vanilla JavaScript to React.
- Develop reusable React components.
- Implement user registration and login.
- Hash passwords using bcrypt.
- Implement JWT-based authentication.
- Protect API routes.
- Introduce role-based authorization.
- Expand the PostgreSQL database structure.
- Implement relationships between database tables.
- Introduce database validation and optimization.
- Maintain a working version of Menged throughout development.

---

# 2. Existing Foundation: Level 1

Level 2 begins with the following existing components.

## Backend

- Node.js runtime.
- Express.js framework.
- PostgreSQL database.
- Database connection pool using `pg`.
- REST API architecture.
- Opportunity CRUD operations.
- Input validation.
- Centralized error handling.
- API health monitoring.
- SQL parameterization.
- Opportunity filtering and keyword search.

## Frontend

- Semantic HTML5.
- CSS3.
- Vanilla JavaScript.
- Fetch API integration.
- Dynamic opportunity rendering.
- Opportunity details modal.
- Search and filtering.
- Responsive design.
- Community opportunity submission form.
- Loading, error, and offline states.

## Database

Existing `opportunities` table.

The current database structure and API will be evaluated before introducing changes.

The existing application will remain the starting point for Level 2.

---

# 3. Level 2 Official Tasks

## Task 1: Frontend with a JavaScript Framework

### Official Requirements

- Set up a project with React, Vue, or Angular.
- Use functional components and state management.
- Implement API calls and handle loading states.
- Create reusable UI components.

### Menged Implementation

React will be used to transition the existing Vanilla JavaScript frontend into a component-based application.

### Planned Features

- React project setup.
- Component-based architecture.
- Reusable opportunity cards.
- Reusable navigation components.
- Reusable buttons and form controls.
- Opportunity details component.
- Search and filter components.
- API service layer.
- State management for opportunities.
- Loading states.
- Error states.
- Empty states.
- Responsive layout.
- React integration with the existing Express API.

### Scope Boundary

This task focuses on the frontend framework and component architecture.

Authentication is treated as a separate task, although the React architecture will be designed to accommodate it.

---

## Task 2: Authentication and Authorization

### Official Requirements

- Implement user authentication using bcrypt and JWT.
- Store tokens securely.
- Protect routes.
- Restrict access based on user roles.
- Hash passwords before saving them in the database.

### Menged Implementation

Users will be able to create accounts and access their own personalized workspace.

Authentication will be introduced without removing public opportunity discovery.

### Planned Features

#### Registration

- User registration form.
- Full name.
- Email.
- Password.
- Password confirmation.
- Input validation.
- Duplicate email prevention.
- Password hashing using bcrypt.
- User record creation.

#### Login

- Email and password login.
- Password verification using bcrypt.
- JWT issuance.
- Authentication state.
- Logout functionality.
- Authentication error handling.

#### Authentication

- JWT-based authentication.
- Authentication middleware.
- Token validation.
- Secure authentication handling.
- Protected API endpoints.

#### Authorization

Initial user roles:

- Student/Graduate.
- Administrator.

Users will be assigned appropriate roles.

Authorization middleware will restrict protected operations based on user permissions.

#### Protected Routes

Examples:

- User profile.
- Personalized workspace.
- Saved opportunities.
- Application tracking.
- User-specific data.

Administrative routes will be restricted to authorized administrators.

### Scope Boundary

Level 2 will implement authentication and authorization foundations.

Advanced authentication features such as multi-factor authentication, social login, password recovery workflows, and advanced security monitoring may be considered in later development stages.

---

## Task 3: Database Integration

### Official Requirements

- Integrate a database.
- Perform CRUD operations on stored data.
- Use an ORM.
- Create models and relationships.
- Implement database indexing and optimization.
- Perform data validation.

### Menged Implementation

PostgreSQL will remain the primary database.

The existing PostgreSQL database and `pg` integration will be evaluated before deciding whether to introduce an ORM.

The database will gradually expand to support authenticated users and their personalized workspace.

### Planned Database Expansion

#### Users

Stores account information.

Potential fields:

- id.
- full_name.
- email.
- password_hash.
- role.
- created_at.
- updated_at.

#### Opportunities

The existing opportunity table will be preserved and improved where necessary.

#### Future Personal Workspace Data

The database architecture will be prepared to support:

- Saved opportunities.
- Application tracking.
- User profiles.
- Personal documents.

These additional tables will be introduced incrementally according to development priorities.

### Planned Database Improvements

- Database models.
- Relationships.
- Foreign keys.
- Constraints.
- Indexes.
- Data validation.
- Query optimization.
- Database integrity.

### Scope Boundary

The database will support the features introduced during Level 2.

The full personal career-management system will not be implemented all at once.

---

# 4. Iterative Development Plan

## Iteration 1: React Foundation

### Goal

Transition the existing frontend into React while maintaining the current opportunity discovery experience.

### Planned Work

- Set up React.
- Configure the project structure.
- Establish reusable components.
- Create the opportunity card component.
- Create the navigation component.
- Create the opportunity details component.
- Implement API integration.
- Fetch opportunities from the existing API.
- Implement loading states.
- Implement error handling.
- Implement empty states.
- Reimplement search and filtering.
- Preserve responsive design.

### Expected Result

A working React version of Menged's public opportunity discovery experience connected to the existing backend.

---

## Iteration 2: Authentication Foundation

### Goal

Allow users to register, log in, and access protected resources.

### Planned Work

- Create the user database structure.
- Implement registration.
- Implement bcrypt password hashing.
- Implement login.
- Implement JWT generation.
- Implement authentication middleware.
- Implement protected API routes.
- Implement logout.
- Implement authentication error handling.

### Expected Result

Users can create accounts, authenticate, and access protected API resources.

---

## Iteration 3: Authorization and User Workspace Foundation

### Goal

Introduce role-based access control and the foundation of personalized user spaces.

### Planned Work

- Define user roles.
- Implement role-based middleware.
- Protect administrative endpoints.
- Protect user-specific endpoints.
- Create the user profile API foundation.
- Introduce user-specific data access restrictions.
- Establish the React authentication state.

### Expected Result

Authenticated users can access their protected workspace, while administrative functionality remains restricted.

---

## Iteration 4: Database Expansion

### Goal

Improve database structure to support authenticated users and related data.

### Planned Work

- Introduce appropriate database models.
- Create relationships.
- Add foreign keys.
- Add constraints.
- Implement validation.
- Add appropriate indexes.
- Improve database query organization.
- Review existing opportunity queries.

### Expected Result

A structured database foundation capable of supporting Menged's growing functionality.

---

# 5. Level 2 Acceptance Checklist

## Task 1: React Frontend

- [ ] React project configured.
- [ ] React functional components implemented.
- [ ] Reusable UI components created.
- [ ] API integration implemented.
- [ ] Loading states implemented.
- [ ] Error states implemented.
- [ ] Empty states implemented.
- [ ] Opportunity discovery functionality preserved.
- [ ] Responsive design verified.

## Task 2: Authentication and Authorization

- [ ] Registration endpoint implemented.
- [ ] Password hashing implemented using bcrypt.
- [ ] Login endpoint implemented.
- [ ] Password verification implemented.
- [ ] JWT generation implemented.
- [ ] JWT validation implemented.
- [ ] Authentication middleware implemented.
- [ ] Protected API routes implemented.
- [ ] Role-based authorization implemented.
- [ ] Logout functionality implemented.
- [ ] Protected frontend routes implemented.
- [ ] Authentication errors handled appropriately.

## Task 3: Database Integration

- [ ] Database models established.
- [ ] CRUD operations implemented.
- [ ] Relationships established.
- [ ] Foreign keys implemented.
- [ ] Constraints implemented.
- [ ] Data validation implemented.
- [ ] Indexes reviewed and implemented where appropriate.
- [ ] Query optimization reviewed.
- [ ] Existing opportunity data preserved.

---

# 6. Development Rules

Throughout Level 2:

1. Existing Level 1 functionality must not be unnecessarily discarded.
2. Each iteration must result in a working increment.
3. Changes must be committed to Git regularly.
4. Each task must be documented.
5. Testing must accompany feature development.
6. Security must be considered when implementing authentication and authorization.
7. Database changes must be documented.
8. API changes must be documented.
9. Development must remain within the official Level 2 task scope while preparing a foundation for future levels.
10. Features must be introduced in a controlled and incremental manner.

---

# 7. Future Development Beyond Level 2

The following features are part of Menged's long-term vision but are not prerequisites for completing the official Level 2 tasks.

- Personal document management.
- CV management.
- Essay management.
- Certificate storage.
- Project portfolio management.
- Application tracking.
- Saved opportunities.
- Personalized recommendations.
- Advanced profile management.
- Opportunity collection from external sources.
- Opportunity verification.
- Administrative moderation dashboard.
- Automated opportunity collection.
- Advanced analytics.
- Notifications.
- Email notifications.
- Deployment and production infrastructure.

These features may be introduced in later milestones when their dependencies are established.

---

# 8. Level 2 Completion Goal

At the end of Level 2, Menged should have:

- A React-based frontend.
- A working Express backend.
- PostgreSQL integration.
- User registration.
- User login.
- Password hashing.
- JWT-based authentication.
- Protected API routes.
- Role-based authorization.
- Structured database models.
- Database relationships.
- Validation.
- Database optimization.
- Working public opportunity discovery.
- A foundation for future personalized career-management features.

Level 2 is not intended to complete the entire Menged platform.

It is intended to establish a stronger technical foundation that allows the platform to evolve without unnecessarily rebuilding existing functionality.
