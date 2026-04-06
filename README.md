# Nepal Inscription CMS

<p align="left">
  <img src="public/images/logo3.png" alt="Nepal Inscription Logo" width="96" />
</p>

[![Laravel 12](https://img.shields.io/badge/Laravel-12.x-FF2D20?logo=laravel&logoColor=white)](https://laravel.com)
[![React 18](https://img.shields.io/badge/React-18-20232A?logo=react&logoColor=61DAFB)](https://react.dev)
[![Inertia.js](https://img.shields.io/badge/Inertia.js-2.x-9553E9)](https://inertiajs.com)
[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Nepal Inscription CMS is a full-stack Laravel and React application for managing historical inscription records. It provides an authenticated admin experience for creating and maintaining inscriptions, users, and activity logs, plus public inscription detail pages and API endpoints for frontend consumption.

## Features

- Authenticated admin dashboard
- Inscription CRUD with status updates
- Rich inscription content fields such as description, background, text, translation, references, and glossary
- Banner image, video banner image, and gallery image uploads
- Sortable inscription images
- User management
- Activity logging
- Google Analytics dashboard integration
- Public inscription detail pages by slug
- JSON API endpoints for inscriptions and analytics

## Tech Stack

- PHP 8.2+
- Laravel 12
- Inertia.js
- React 18
- Vite 7
- Tailwind CSS
- Laravel Sanctum
- Spatie Laravel Analytics
- Google API Client
- React Hook Form
- React Quill
- React Table
- Recharts
- Lucide React

## Project Structure

```text
app/
  Http/Controllers/   # Dashboard, inscription, user, and log controllers
  Models/             # Eloquent models
database/
  migrations/         # Users, inscriptions, images, logs, tokens
resources/
  js/
    Pages/AdminPages/ # Admin dashboard screens
    Pages/MainPages/  # Public inscription page
routes/
  web.php             # Web routes and JSON endpoints
  api.php             # Public API routes
config/
  analytics.php       # Google Analytics settings
```

## Requirements

- PHP `^8.2`
- Composer
- Node.js `18+`
- npm
- A supported database such as SQLite, MySQL, or PostgreSQL

## Installation

1. Install PHP dependencies:

   ```bash
   composer install
   ```

2. Install frontend dependencies:

   ```bash
   npm install
   ```

3. Copy the environment file and generate the application key:

   ```bash
   copy .env.example .env
   php artisan key:generate
   ```

4. Run the database migrations:

   ```bash
   php artisan migrate
   ```

5. Build the frontend assets:

   ```bash
   npm run build
   ```

## Development

Run the Laravel app and Vite dev server separately:

```bash
php artisan serve
npm run dev
```

Or use the project helper:

```bash
composer run dev
```

That script starts:

- Laravel server
- queue listener
- log viewer via `pail`
- Vite dev server

## Main Routes

### Authenticated Pages

- `GET /` - Admin dashboard
- `GET /inscriptions` - Inscriptions page
- `GET /user-management` - User management page
- `GET /activity-log` - Activity log page
- `GET /inscription-details` - Inscription detail page
- `GET /dashboard` - Analytics JSON for the dashboard

### Public Pages

- `GET /inscription-details/{slug}` - Public inscription detail view
- `GET /api/inscriptions` - Public inscription list
- `GET /api/{slug}/details` - Public inscription detail JSON

### Inscriptions

- `GET /ourinscription` - List inscriptions
- `POST /ourinscription` - Create inscription
- `PUT /ourinscription/{id}` - Update inscription
- `DELETE /ourinscription/{id}` - Delete inscription
- `DELETE /ourinscription/image/{id}` - Delete one inscription image
- `PATCH /inscriptions/{id}/status` - Update inscription status
- `GET /inscriptions/video-chunk` - Video upload chunk endpoint

### Users and Logs

- `GET /ouruser` - List users
- `POST /ouruser` - Create user
- `PUT /ouruser/{id}` - Update user
- `DELETE /ouruser/{id}` - Delete user
- `GET /ourlogs.index` - List activity logs

## Analytics Setup

The dashboard uses `spatie/laravel-analytics` and expects Google Analytics credentials to be configured in the environment.

Typical setup includes:

- a Google service account with access to the GA4 property
- the analytics credential JSON file stored in the configured location
- the GA4 property ID set in `.env`

If analytics is not configured, the dashboard endpoint will return an error payload.

## File Upload Notes

- Inscriptions support banner images, video banner images, and multiple gallery images
- The app validates image uploads up to `153600 KB`
- The `/test-upload-limits` route returns the current PHP upload-related settings

## Testing

Run the test suite with:

```bash
composer run test
```

Or:

```bash
php artisan test
```

## License

This project is licensed under the MIT License.
