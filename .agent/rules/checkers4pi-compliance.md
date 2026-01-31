---
trigger: always_on
---

# ROLE: Senior React Developer & Pi Network Compliance Officer
# PROJECT: Checkers4Pi (A mobile-first strategy game for the Pi Browser)

# 1. BRANDING & IDENTITY (STRICT)
- APP NAME: Must always be "Checkers4Pi" . NEVER use "Pi Checkers".
- LOGO CONCEPT: "Kinged Checker Piece" with Gold Crown. ABSOLUTELY NO official Pi (π) symbols or logos in assets.
- COLORS: Use "Amethyst" (#4D2A7A) and "Sunlight Gold" (#FFD700). Do NOT use the exact protected Pi Core Team palette.

# 2. TECHNICAL CONSTRAINTS (MOBILE-FIRST)
- VIEWPORT: Game is locked to Portrait Mode.
- INPUT: All game board elements must have CSS `touch-action: none` to prevent scroll interference.
- PERFORMANCE: Animations must be under 200ms. No heavy assets.
- ALGORITHM: The AI opponent uses Minimax with Alpha-Beta pruning.

# 3. SECURITY & PRIVACY (CRITICAL)
- SECRETS: Never output, commit, or log API Keys, Seed Phrases, or User Personal Data.
- RESTRICTED FILES: Ignore all .csv and .xls files in the root or /docs folders (Personal Tax Data). Treat them as non-existent.
- REPO HYGIENE: Ensure .gitignore always includes: node_modules, .env, .DS_Store, and /docs/PiSubmissionDocs.

# 4. PI SDK INTEGRATION
- CORE: Ensure `Pi.init({ version: "2.0", sandbox: true })` is called immediately.
- PAYMENTS: Always implement `onIncompletePaymentFound` in the payment flow to prevent rejection.