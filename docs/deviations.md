# TAGORE Desktop - Documented Deviations

This document lists intentional deviations from the legacy web app and plans to address them.

---

## 1. Image Handling

**Legacy:** Uses `next/image` with automatic optimization
**Tauri:** Uses standard `<img>` tags

**Reason:** Next.js Image component is not available outside Next.js context.

**Impact:** Minor - images will load without optimization. For a note-taking app with minimal images, this is acceptable.

**Resolution Plan:** Consider adding a lightweight image optimization library if needed in future.

---

## 2. Navigation

**Legacy:** Uses `next/navigation` with App Router patterns
**Tauri:** Uses `react-router-dom` v6

**Reason:** Next.js routing is server-side by design and incompatible with Tauri's static bundling.

**Impact:** None - navigation behavior is identical from user perspective.

**Resolution Plan:** N/A - this is an acceptable architectural difference.

---

## 3. Font Size / Line Height Custom Extensions

**Legacy:** Has custom TipTap extensions for `FontSize` and `LineHeight`
**Tauri:** Currently using basic TipTap without these extensions

**Reason:** Time constraint during initial migration. These are custom extensions that need to be ported.

**Impact:** Users cannot change font size or line height in editor toolbar.

**Resolution Plan:** Port the custom TipTap extensions from `/frontend/lib/tiptap-extensions/` in Phase 2.

---

## 4. AI Selection Bubble

**Legacy:** Shows AI action bubble when text is selected
**Tauri:** Not yet implemented

**Reason:** Requires careful positioning and integration with TipTap selection events.

**Impact:** Users must access AI features through other means until implemented.

**Resolution Plan:** Implement in Phase 2 using same approach as legacy.

---

## 5. Concept Map / Concept Highlight

**Legacy:** Has ConceptMap modal and ConceptHighlight extension
**Tauri:** Not yet implemented

**Reason:** These are advanced features that depend on AI and complex UI.

**Impact:** Concept mapping feature not available.

**Resolution Plan:** Implement after core features are stable.

---

## 6. Google Drive Sync

**Legacy:** Full OAuth integration with Google Drive
**Tauri:** Stub commands only

**Reason:** OAuth flow on desktop requires different approach than web.

**Impact:** Cloud backup not available.

**Resolution Plan:**

1. Implement using Tauri's HTTP plugin for OAuth
2. Store tokens securely using system keychain
3. Match legacy sync behavior exactly

---

## 7. PDF Export

**Legacy:** Uses backend PDF generation
**Tauri:** Not yet implemented

**Reason:** Requires Rust PDF library integration.

**Impact:** Cannot export notes as PDF.

**Resolution Plan:** Use `printpdf` or similar Rust crate to generate PDFs with matching formatting.

---

## 8. Fingerprint Unlock

**Legacy:** Placeholder implementation
**Tauri:** Same placeholder implementation

**Reason:** Legacy was also a placeholder.

**Impact:** None - parity maintained.

**Resolution Plan:** If biometric auth is needed, evaluate Linux-compatible options.

---

## 9. Animation System

**Legacy:** Uses Framer Motion for complex animations
**Tauri:** Basic CSS transitions only

**Reason:** Framer Motion is included but not all animations are ported yet.

**Impact:** Some transitions may feel less polished.

**Resolution Plan:** Port specific animations as needed to match legacy exactly.

---

## Deviation Policy

1. Any deviation must be documented here
2. Each deviation must have a resolution plan
3. Deviations should be minimized
4. When in doubt, match legacy behavior exactly
