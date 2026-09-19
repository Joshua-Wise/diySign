# diySign - Email Signature Generator

A containerized web application that allows users to generate professional email signatures with organization-specific branding and information.

## Features

- Create professional email signatures with customizable fields
- Campus/location selection with specific organization details
- Live preview of the signature as you type
- Copy signature HTML to clipboard for easy pasting into email clients
- Responsive design for mobile and desktop
- Admin interface for managing campuses/locations
- Logo upload and selection per campus/location
- Password-protected admin settings
- Favicon support for all pages

## Development

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js
- File Upload: Multer
- Containerization: Docker

## Deployment

Production runs a prebuilt image, `ghcr.io/joshua-wise/diysign`, and nothing
is built on the host.

1. Every push to `main` runs `.github/workflows/build.yml`. It builds the
   image, pushes it to GHCR tagged with the short commit SHA and `latest`,
   then commits a `deploy: diysign:<sha> [skip ci]` change that pins the
   `image:` line in `docker-compose.yml` to that SHA.
2. Arcane syncs this repository. When it sees the new `docker-compose.yml`,
   it pulls the pinned image and redeploys the stack. That bump commit is
   the deploy.
3. To roll back, set the `image:` tag in `docker-compose.yml` back to an
   older SHA and commit the change.

Configuration is read at runtime from the project's `.env`. See
[`.env.example`](.env.example) for the full list. `ADMIN_PASSWORD` is
required, and the stack won't start without it. Changing `.env` only needs
a redeploy, not a rebuild.

State lives in two named volumes:

| Volume | Mounted at | Contents |
|--------|------------|----------|
| `diysign-data` | `/app/app/public/data` | `campuses.json` (edited through the admin UI) |
| `diysign-logos` | `/app/app/public/images/logos` | uploaded logos |

The container is published on host port `${HOST_PORT:-3010}`, and
nginx-proxy-manager proxies to that port. The health endpoint is
`GET /api/health`.

To run the published image locally:

```
cp .env.example .env   # then set ADMIN_PASSWORD
docker compose up -d
# http://localhost:3010
```

### Running without Docker

1. Clone this repository:
   ```
   git clone https://github.com/Joshua-Wise/diySign
   cd diySign
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the application:
   ```
   npm start
   ```

4. Access the application in your browser:
   ```
   http://localhost:3000
   ```

## How to Use

### Generating a Signature

1. Fill in your information in the form fields (name, job title, email)
2. Select your campus/location from the dropdown menu
3. Click "Generate Signature" to create your signature
4. Preview your signature in the right panel
5. Use the "Copy to Clipboard" button to copy the signature for pasting into your email client
6. Alternatively, use the "Gmail Settings" link to go directly to Gmail settings where you can paste your signature

### Admin Interface

1. Access the admin interface by clicking the "settings" link in the footer
2. Log in with the admin password (default: `admin123`)
3. Manage campuses/locations:
   - View all existing campuses with their details and logos
   - Add new campuses with the "+" button
   - Edit or delete existing campuses using the buttons on each campus card
4. Logo Management:
   - Upload new logos through the campus edit form
   - Select from previously uploaded logos
   - Assign specific logos to each campus/location

## Development

To run the application in development mode with automatic reloading:

```
npm run dev
```

## Notice

This repo has not been sanitized and contains reference & color design matching that of my employer.