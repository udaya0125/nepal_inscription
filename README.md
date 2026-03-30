# Nepal Inscription CMS

<p align="left">
  <img src="public/images/logo3.png" alt="Nepal Inscription Logo" width="96" />
</p>

[![Laravel 12](https://img.shields.io/badge/Laravel-12.x-FF2D20?logo=laravel&logoColor=white)](https://laravel.com)
[![React 18](https://img.shields.io/badge/React-18-20232A?logo=react&logoColor=61DAFB)](https://react.dev)
[![Inertia.js](https://img.shields.io/badge/Inertia.js-2.x-9553E9)](https://inertiajs.com)
[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

Nepal Inscription CMS is a full-stack web application for managing, publishing, and exploring historical inscription records.  
It includes an authenticated admin panel for content operations and analytics, plus public-facing detail views for each inscription.

## Overview

This project provides:

- Inscription lifecycle management (create, edit, update status, delete)
- Rich content sections (description, background, text, translation, references, glossary)
- Media handling for banner images, gallery images, video URLs, and video thumbnails
- User management for admin access
- Activity logging for administrative actions
- GA4-powered dashboard insights (visitors, page views, top pages)
- Public detail pages by SEO-friendly slug

## Core Features

- Auth-protected admin routes for dashboard and content operations
- Slug generation from `inscription_number`
- Paginated inscription listing with status controls (`draft`, `published`)
- Rich text content editing via React Quill
- Multiple image upload and sort ordering per inscription
- JSON API for inscription list and inscription detail
- Activity log tracking for user and inscription actions
- Analytics integration using `spatie/laravel-analytics` and Google Analytics 4

## Tech Stack

### Backend

- PHP 8.2+
- Laravel 12
- Inertia Laravel 2
- Laravel Sanctum
- Spatie Laravel Analytics
- Google API Client

### Frontend

- React 18
- Inertia React 2
- Vite 7
- Tailwind CSS
- Recharts
- React Hook Form
- React Quill
- React Table
- Lucide React

## Application Modules

- **Dashboard**: GA4-based metrics and page-performance charts.
- **Inscriptions**: CRUD for inscription records and attached media.
- **User Management**: Admin user create, update, and delete.
- **Activity Logs**: Historical records of admin actions with IP information.
- **Public Details View**: Inscription detail page rendered by slug.

## Project Structure

```text
app/
  Http/Controllers/        # API + Inertia controllers
  Models/                  # Eloquent models (Inscription, User, ActivityLog, InscriptionImage)
database/
  migrations/              # Schema for users, inscriptions, images, activity logs
resources/
  js/
    Pages/AdminPages/      # Admin UI pages
    Pages/MainPages/       # Public inscription page
    AddFormComponents/     # Create forms
    EditFormComponents/    # Edit forms
routes/
  web.php                  # Web + admin + internal JSON routes
  api.php                  # Public inscription API routes
config/
  analytics.php            # GA4 analytics configuration
```

## Requirements

- PHP `^8.2`
- Composer
- Node.js `18+` (recommended `20+`) and npm
- SQLite / MySQL / compatible database

## Quick Start

### 1) Install dependencies and bootstrap

```bash
composer run setup
php artisan storage:link
```

`composer run setup` will:

- install PHP dependencies
- create `.env` (if missing)
- generate `APP_KEY`
- run migrations
- install npm dependencies
- build frontend assets

### 2) Configure environment

Copy `.env.example` to `.env` if needed and update values:

```bash
cp .env.example .env
```

Important variables:

| Variable | Description |
|---|---|
| `APP_URL` | Base app URL (for links and generated URLs) |
| `DB_CONNECTION`, `DB_*` | Database connection settings |
| `FILESYSTEM_DISK` | Use `public` for media URL resolution |
| `VITE_IMAGE_PATH` | Public base URL for image/video rendering |
| `ANALYTICS_PROPERTY_ID` | Google Analytics 4 property ID |

### 3) Run in development

```bash
composer run dev
```

This starts:

- Laravel local server
- queue listener
- log stream (`pail`)
- Vite dev server

### 4) (Optional) Seed a test user

```bash
php artisan db:seed
```

Default seeded account:

- Email: `test@example.com`
- Password: `password`

## Analytics Setup (GA4)

The dashboard endpoints depend on GA4 credentials.

1. Create a Google service account with GA4 read access.
2. Place the credential JSON file at:
   - `storage/app/analytics/nepalinscription.json`
3. Set `ANALYTICS_PROPERTY_ID` in `.env`.
4. Ensure the service account has access to the target GA4 property.

If analytics is not configured correctly, dashboard responses may return error payloads.

## Routes and API

### Admin / Web Pages

- `GET /` -> Admin dashboard page (auth required)
- `GET /inscriptions` -> Inscription management page (auth required)
- `GET /user-management` -> User management page (auth required)
- `GET /activity-log` -> Activity log page (auth required)
- `GET /inscription-details/{slug}` -> Public inscription detail page

### JSON Endpoints

- `GET /ourinscription` -> Paginated inscription list
- `POST /ourinscription` -> Create inscription
- `PUT /ourinscription/{id}` -> Update inscription
- `PATCH /inscriptions/{id}/status` -> Update inscription status
- `DELETE /ourinscription/{id}` -> Delete inscription
- `DELETE /ourinscription/image/{id}` -> Delete single gallery image
- `GET /ouruser` -> List users
- `POST /ouruser` -> Create user
- `PUT /ouruser/{id}` -> Update user
- `DELETE /ouruser/{id}` -> Delete user
- `GET /ourlogs.index` -> List activity logs
- `GET /dashboard` -> Dashboard analytics JSON

### Public API

- `GET /api/inscriptions` -> Public inscriptions list
- `GET /api/{slug}/details` -> Public inscription details by slug

## Media and Upload Notes

- Image validation allows up to `153600 KB` (`~150 MB`) per file.
- Inscriptions support:
  - `banner_image` (image upload)
  - `video` (string URL/path)
  - `video_banner` (image upload)
  - `images[]` (multiple gallery images)
- Ensure `php.ini` and web server limits support your intended upload sizes.
- Use `/test-upload-limits` to inspect runtime upload-related settings.

## Authentication Notes

- Standard auth routes are available (`/login`, password reset, email verification, logout).
- Public registration routes are currently disabled in `routes/auth.php`.
- New users are intended to be managed from the admin module or via seeding.

## Testing

Run automated tests:

```bash
composer run test
```

Or:

```bash
php artisan test
```

## Build for Production

```bash
npm run build
```

Recommended production steps:

- Set `APP_ENV=production` and `APP_DEBUG=false`
- Run `php artisan migrate --force`
- Cache configuration/routes/views as needed
- Run queue workers via process manager

## License

This project is licensed under the MIT License.
