# Splitty Super Admin Dashboard

## Project Context

**Company**: Splitty - Software startup that enables easy split payments for large groups at restaurants

**What we're building**: SUPER ADMIN Dashboard Panel for Splitty's internal team

## Purpose
This is Splitty's internal admin dashboard - NOT for restaurants, but for Splitty's own team to manage their business operations and customer onboarding.

## Users of this Dashboard
- **Co-founders** (like the user) - full access to everything
- **Future employees** - Account managers, support staff, etc.
- **Splitty team members** - Various roles and permissions

## Main Functions

### 1. Internal Team Management
- Add/manage Splitty employee accounts
- Role management (admin, account manager, support, etc.)
- Team member permissions and access control

### 2. Restaurant Onboarding & Management (Splitty's Customers)
- **Add new restaurants** as customers
- **Restaurant details**: Name, address, contact information
- **Contact person management**: Restaurant owner/manager details
- **Stripe integration setup** for payment processing
- **Technical configuration**: POS integrations, API settings

### 3. Restaurant User Account Creation
- Create accounts for **restaurant managers** 
- Create accounts for **restaurant staff** (waiters, etc.)
- These users will log into their own separate Splitty restaurant dashboard
- Role-based access (Restaurant Admin vs Restaurant Staff)

### 4. Business Operations
- Monitor all restaurants and their performance
- Handle customer support and account management
- Financial reporting and analytics
- System settings and configurations

## Architecture
- **This dashboard**: Splitty's internal super admin panel
- **Restaurant dashboards**: Separate dashboards for each restaurant customer
- **Customer-facing app**: The actual split payment app for restaurant guests

## Current Features Implemented
- Dashboard with analytics and KPIs
- Restaurant management (CRUD operations)
- User management with role-based access
- POS integration management
- Settings and configuration
- Dark theme with responsive design

## Technical Stack
- Next.js 14 with React 18
- Tailwind CSS with custom Splitty branding
- Heroicons for icons
- Chart.js for analytics
- Dark mode with persistent preferences
- LocalStorage-based database for demo purposes

## Database Implementation

**IMPORTANT**: This admin panel uses a localStorage-based database (`/utils/database.js`) for demonstration purposes. This allows the panel to:

- **Persist data** between page refreshes
- **Simulate a real database** with CRUD operations
- **Showcase working features** without backend dependencies
- **Enable user authentication** with real login/logout functionality
- **Synchronize data** across different components using Context API

### Database Features:
1. **User Management**: Create, authenticate, update, and delete users
2. **Restaurant Management**: Full CRUD operations for restaurants
3. **Dynamic Payouts**: Automatically generated based on active restaurants
4. **Authentication System**: Working login with password verification
5. **Data Persistence**: All changes are saved to localStorage

### Note for Production:
In a production environment, this localStorage database would be replaced with:
- A proper backend API (Node.js, Python, etc.)
- A real database (PostgreSQL, MongoDB, etc.)
- Secure authentication (JWT, OAuth, etc.)
- Server-side data validation and processing

---

**Remember**: This is the admin panel for Splitty's internal operations, not for the restaurants themselves. Restaurants will have their own separate dashboard interface. The localStorage database is purely for demonstration and prototyping purposes.