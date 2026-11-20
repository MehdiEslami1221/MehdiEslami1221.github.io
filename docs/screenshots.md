# Screenshot provenance

`assets/dearlater.webp` and `assets/didgah.webp` are browser captures of the owner's applications running from fresh public Git checkouts in an isolated local preview. Captured 2026-11-19 and converted from JPEG to WebP for delivery. No real contacts, personal messages, participant records or Telegram sessions were loaded.

- DearLater: writing desk in local demo mode; synthetic recipient `demo_friend` and envelope name “For your future self”. No Telegram account was connected and no message was sent.
- Didgah: participant landing page. No real respondent information appears in the capture.
- Warehouse: recaptured 2026-11-20 from the real local app with four synthetic items, one low-stock item, one sample employee and five real local inventory documents. No municipal data was loaded.
- Yadban: captured 2026-11-20 from the original `Dashboard` component through a local-only `/portfolio-preview` entry, backed by read-only fixture GET routes with five synthetic reminders. No production authentication was changed; no account, Worker scheduler or notification was used. This verifies the interface, not the deployed reminder service.
- VideoFetch: captured 2026-11-20 from the real Next.js frontend, showing its workspace and honest disconnected-backend status. No placeholder result or successful download was fabricated; the backend/download workflow was not verified in this capture session.

All five displayed images are now actual interface captures. Source pixels are retained in WebP; a CSS monochrome/green treatment, including inversion for the light interfaces, keeps presentation consistent with the portfolio. The treatment does not claim that each app has its own dark theme. Cards and project dialogs use the same images.

The small browser demonstrations in project dialogs do not run the projects' backends. DearLater uses a five-second visual opening timer, Didgah displays the visitor's selected score, and Warehouse demonstrates checked stock arithmetic. All reset when their project dialog is rebuilt or reopened.

Source revisions used for local execution:

- `dearlater`: `2c96903396ec04cd4e4e3ced473f335fc75f65fe`
- `didgah`: `11689dc07e5d27845c8c36c922430882c80bf7ba`
- `gorgan-warehouse`: `630099ddca1d0c9f373b271e53d9df1f805896f5`

- `yadban`: `46344a33c7f4090f13d471191cb039ae911b0546`

- `videofetch`: `54b67f9d1762c202f45f62e49e5eb14999505d89`
