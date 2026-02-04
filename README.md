# Safe Reader

Safe Reader is a lightweight companion that opens any shared URL inside an isolated iframe. By stripping scripts and confining external sites to a sandbox, it helps you preview unknown links before deciding to trust them on your primary browser tabs.

## Reader Mode (Server Fallback)

Access content even when iframes are blocked or pages are broken.

- **Trigger**: Click the "Switch to Reader Mode" button when an iframe fails to load.
- **Privacy**: The server scrapes the content for you. No third-party scripts run on your device.
- **Security**: Content is sanitized (no JS) and assets (images/CSS) are proxied through our server to prevent mixed-content warnings and tracking.
- **Speed**: Aggressive edge caching ensures popular articles load instantly.
