# Microfrontend Deployment

Server configuration for deploying SPAs with client-side routing.

## SPA Fallback Rules

Single Page Applications require the server to return `index.html` for all routes that don't match static files. This allows the client-side router to handle navigation.

---

## Separate Hosts

When each app is deployed on its own domain or subdomain, configure fallback rules independently:

```nginx
# Shell (app.example.com)
server {
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Remote (accounts.example.com)
server {
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## Same Host with Subpaths

When all apps are served from the same domain, use the `/_mfe/` prefix to separate microfrontend assets from shell routes:

```nginx
# All apps on app.example.com
server {
    # Shell at root
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Microfrontends under /_mfe/ prefix
    location /_mfe/accounts/ {
        alias /var/www/mfe/accounts/;
        try_files $uri $uri/ /_mfe/accounts/index.html;
    }

    location /_mfe/transfers/ {
        alias /var/www/mfe/transfers/;
        try_files $uri $uri/ /_mfe/transfers/index.html;
    }
}
```

> **Convention:** The `/_mfe/` prefix clearly separates microfrontend static assets from the shell's client-side routes (e.g., `/accounts` route vs `/_mfe/accounts/` assets).

---

## CDN / Static Hosting

For platforms like Vercel, Netlify, or AWS CloudFront, add rewrite rules in their config files.

### Vercel

```json
// vercel.json (per app)
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Netlify

```toml
# netlify.toml (per app)
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### AWS CloudFront

Configure a custom error response to return `index.html` with status 200 for 404 errors.

---

## CORS Configuration

When shell and remotes are on different origins, ensure remotes allow cross-origin requests:

```nginx
# Remote server
location /assets/ {
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods "GET, OPTIONS";
}
```

---

## Checklist

- [ ] Each app has SPA fallback rules configured
- [ ] Remotes have CORS headers for cross-origin loading
- [ ] Base paths match between build config and server aliases
- [ ] Static assets are served with appropriate cache headers

---

## See Also

- [Microfrontend Environment Variables](./mfe-env-vars.md) - Build-time configuration for remotes
