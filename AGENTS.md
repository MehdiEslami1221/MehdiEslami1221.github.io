# Maintaining Mehdi Eslami’s portfolio

This repository serves the English portfolio at https://mehdieslami.ir through GitHub Pages. Work from the current branch and read the [README](README.md) for local preview and hosting details. For a content update, preserve the current presentation and visitor flow. If the owner explicitly requests a redesign or a new flow, apply that request to the named area.

## Visual reference

The [portfolio revision with DearLater and Didgah](https://github.com/MehdiEslami1221/MehdiEslami1221.github.io/tree/f0c593996ada61234f175e85bf9e68e79492b414) records the design when this guide was written. Use the revision immediately before your edit for before-and-after comparisons, so later approved changes are preserved.

- Keep the English, left-to-right layout, dark charcoal background, lime accent, local typography, monochrome portrait and circuit animation. Reuse the spacing, heading hierarchy, focus indicators and responsive rules in `style.css`.
- Keep the homepage sequence: introduction and portrait, technology strip, selected work, about and skills, programming quotes, project inquiry, footer. The header and hero link to sections on this page. Preserve the public anchors `#work`, `#about` and `#contact`.
- Project cards are links. Each has a visual, category, project name, brief English description and tags. When adding a project, verify its repository URL and features, reuse an existing card in `index.html`, and keep the existing projects accessible. Maintain the numbering if the order changes. Keep concept illustrations labelled as such. The current grid pairs standard cards and ends with a wide card; check the final row on desktop and mobile when changing the card count.

## Visitor interactions

| Visitor action | Expected result |
| --- | --- |
| Explore work or select a project | The work shortcut reaches the cards. Selecting a card opens its project repository in a new tab. |
| Browse programming quotes | Next quote updates the quotation, author and source together. The pause control remains available. Rotation pauses during hover or keyboard focus, outside the viewport and in a hidden tab. |
| Pause the background | The footer control stops or resumes the circuit animation independently of quote rotation. Reduced-motion users start with both paused. |
| Make an inquiry | The visitor enters a name, contact details and project brief, then chooses Telegram or email. The site prepares the message and opens the chosen app. The visitor sends it there. The fallback link and copyable brief stay available. |

The interaction code in `app.js` looks up elements by ID and class. When touching markup for a control, check its selector, label, keyboard behavior and status message together. The site runs as static HTML, CSS and JavaScript. Keep project content in the HTML so links remain usable without JavaScript. Preserve the custom domain, canonical URL, structured data and crawler files during content edits.

## Checking a change

1. Run `python -m http.server 8000` in the repository root and open `http://localhost:8000`. For a visual change, compare the affected section before and after at the same viewport size. Check a narrow phone (360 px) and a desktop (1280 px), including horizontal overflow and keyboard focus.
2. For a new project, follow the work shortcut and open its card. Verify the destination, card order and layout of the neighboring cards. For a shared CSS edit, also inspect the portrait, quote controls and contact form on mobile.
3. For an interaction change, exercise the corresponding flow above. Test inquiries with dummy text and inspect the composed message without sending it. Check the browser console for errors.
4. In the handoff, name the files changed and the checks actually run. Update this guide when an intentional change alters a documented flow.

## متن آماده برای جلسهٔ بعد

> می‌خواهم سایت شخصی مهدی اسلامی را به‌روزرسانی کنم. تغییر موردنظر من «[درخواست]» است. ابتدا README.md و AGENTS.md را در نسخهٔ فعلی مخزن بخوان. ظاهر فعلی سایت و مسیر کاربر را مبنا بگیر و فقط بخش مرتبط با درخواست را تغییر بده. متن عمومی سایت انگلیسی بماند. اگر برای انجام درخواست لازم است رفتار دیگری هم عوض شود، اثرش را توضیح بده. در پایان بگو چه فایل‌هایی تغییر کردند و نمایش موبایل، دسکتاپ یا مسیر مرتبط را چطور بررسی کردی.
