# Dayflow — Official UI/UX Design Specification

## 1. Official Project Architecture

Dayflow is a fully offline Android personal management application.

| Component | Technology |
|---|---|
| Frontend | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Build Tool | Vite |
| Android Runtime | Capacitor |
| Database | SQLite |
| SQLite Integration | Capacitor SQLite |
| Backend | None |
| Authentication | None |
| Cloud Synchronization | None |

All application features must work without an internet connection.

## 2. Primary Design Reference

**File:** dayflow_finance_productivity_app.html

This is the primary visual reference for Dayflow. Use its existing design as the foundation. Do not invent a completely different visual direction.

### Preserved Design Characteristics
- Modern and minimalist mobile application.
- Purple and lavender visual identity.
- White rounded cards.
- Soft shadows.
- Subtle gradients.
- Clean typography.
- Consistent spacing.
- Solid and recognizable icons.
- Rounded buttons and inputs.
- Smooth transitions.
- Easy-to-use mobile interactions.
## 3. Official Color Palette

### Primary Colors

| Color | Hex |
|---|---|
| Primary Purple | #6D42EF |
| Primary Dark | #6338E8 |
| Deep Purple | #5028CE |
| Violet | #9170F2 |
| Light Lavender | #D5C9FA |
| Pale Lavender | #F4F1FE |
| App Background | #F8F7FC |
| Primary Text | #191627 |
| Secondary Text | #7B768F |
| Muted Text | #9E99B0 |
| White | #FFFFFF |

### Semantic Colors

| Purpose | Background | Foreground |
|---|---|---|
| High Priority | #FCE7EE | #E11D48 |
| Medium Priority | #FEF3C7 | #D97706 |
| Low Priority | #DCFCE7 | #16A34A |
| Expense Accent | #FCE7EE | #DB4377 |
| Savings Accent | #E3F7ED | #16A34A |

### Typography

- **Primary font:** Plus Jakarta Sans
- **Secondary font:** Inter (system fallback)

Fonts must be locally available or use appropriate system fallbacks. Do not depend on Google Fonts or external font downloads in production.
## 4. Global Mobile Application Layout

### Required Characteristics
- Full-screen mobile interface.
- Proper Android safe-area handling.
- Scrollable content.
- Fixed bottom navigation.
- Consistent page spacing.
- No horizontal overflow.
- Proper keyboard handling.
- Mobile-friendly modal positioning.

### Prohibited Elements
- Do not include the demonstration phone frame, browser controls, or screen-switcher controls from the HTML prototype in the actual application.
- No desktop sidebar or website-style navigation.
## 5. Bottom Navigation Design

### Exact Button Arrangement

| Position | Button |
|---|---|
| Far Left | Home |
| Left Center | My Wallet |
| Exact Center | Floating Plus (+) |
| Right Center | Schedule |
| Far Right | Profile / Settings |

### Visual Requirements
- White navigation background.
- Custom curved center cutout.
- Raised purple circular plus button.
- Four solid navigation icons.
- Active icon in primary purple (#6D42EF).
- Inactive icons in muted gray-purple (#7B768F).
- No navigation text labels.
- Fixed bottom positioning.
- Proper Android safe-area spacing.

### Important Notes
- Savings and Tasks remain accessible through their Dashboard shortcuts and relevant navigation actions.
- The center plus button must remain available on the main application screens.
- Do not add duplicate plus buttons.
## 6. Screen 1 — Home / Dashboard

### Header
- Dayflow logo.
- Dayflow wordmark.
- Local offline indicator.
- Settings gear icon.

### Greeting
- Time-appropriate greeting (e.g., \"Good morning!\", \"Good afternoon!\", \"Good evening!\").
- Current date.
- Short supporting message (e.g., \"Let's make today productive ✨\").

### Today's Overview
Create a prominent purple gradient card using:
- #7B4FF8 / #5B30E5

The card contains three horizontally arranged summaries:
1. **Spent** — Today's expenses.
2. **Saved** — Savings summary.
3. **Tasks** — Completed tasks / total tasks.

Each summary must include an icon, value, and label. Each summary must be clickable and navigate to its associated screen.

### Recent Activity
Create a white rounded activity card containing recent records from:
- My Wallet.
- Savings.
- Tasks.
- Schedule.

Each activity row should include:
- Category-specific icon.
- Activity title.
- Amount or description.
- Date or time.

Show the most recent actual records first. Clicking an activity should navigate to its corresponding module. Provide a suitable empty state when no activity exists.
## 7. Screen 2 — My Wallet

### Layout
1. Screen header.
2. Expense summary.
3. Spending Overview.
4. Category breakdown.
5. Transaction history.

### Spending Overview
Use a donut chart with a matching category legend.

Available period filters:
- This Week.
- This Month.
- All Time.

The graph must:
- Use actual expense records.
- Update when the selected period changes.
- Be hidden when there are no expense records.
- Show an appropriate empty state when there is no data.

### Transactions
Each transaction card contains:
- Category icon.
- Description or category.
- Amount.
- Date and time.
- Appropriate record actions.

### Approved Expense Categories
- Food & Drinks.
- Transport.
- Others.

### Module Focus
Keep the module focused on daily expense tracking. Do not introduce bank accounts or unapproved financial features.
## 8. Screen 3 — Savings

### Total Savings Banner
- Lavender gradient: #EFEAFC / #DDD2FA.
- Total savings amount.
- Piggy bank illustration on the right.
- Rounded corners.

### My Goals
Each goal card displays:
- Goal thumbnail or icon.
- Goal name.
- Current saved amount.
- Target amount.
- Progress percentage.
- Progress bar.
- More-actions button.

### Interactions
- Create savings goal.
- Edit goal.
- Add money to a goal.
- View savings progress.
- Delete goal.

### Database Design Note
Do not implement separate savings contribution history. The approved initial database design uses an aggregate current saved amount.
## 9. Screen 4 — Tasks

### Header
- Tasks title.
- Search icon.
- Sorting or filtering control.

### Filter Navigation
Create three rounded filter buttons:
- All.
- Pending.
- Completed.

Active filter:
- Purple background.
- White text.

Inactive filter:
- Pale lavender background.
- Dark text.

### Task Cards
Each card must display:
- Circular completion checkbox.
- Task title.
- Due date.
- Priority badge.

### Priority Colors

| Priority | Color |
|---|---|
| High | Red |
| Medium | Orange |
| Low | Green |

### Interactions
- Complete task.
- Reopen completed task.
- Filter tasks.
- Search tasks.
- Create task.
- Edit task.
- Delete task.

Provide a suitable empty state.

### Important
Do not add a second floating plus button to the page.
## 10. Screen 5 — Schedule

### Header
- Calendar icon.
- Schedule title.
- Month navigation control.

### Weekly Calendar
Display seven dates horizontally. Each date contains:
- Day abbreviation.
- Date number.

Selected date:
- Purple background.
- White text.
- Rounded corners.

### Daily Timeline
Use:
- Vertical lavender connecting line.
- Purple timeline indicators.
- Rounded lavender event cards.

Each card displays:
- Time.
- Event or class title.
- Location.
- Activity icon.

### Upcoming Events
Display:
- Event date.
- Event title.
- Start and end time.

### Recurrence Support
Support one-time scheduled activities only. Do not add recurring events or recurrence rules.
## 11. Screen 6 — Add New Modal

### IMPORTANT Positioning
The modal must be positioned in the **CENTER** of the screen. Never use bottom-sheet positioning.

### Modal Appearance
- White background.
- 28–30px rounded corners.
- Horizontally and vertically centered.
- Dark translucent backdrop.
- Subtle backdrop blur.
- Comfortable internal spacing.
- Smooth entrance animation.

### Four Creation Options
1. **Add Expense** — Track your spending.
   - Colored icon background: #FCE7EE with #DB4377 text.
2. **Create Savings Goal** — Save for your goals.
   - Colored icon background: #E3F7ED with #16A34A text.
3. **Create Task** — Organize your activities.
   - Colored icon background: #ECE7FD with #6D42EF text.
4. **Add Event** — Organize your schedule.
   - Colored icon background: #FEF0DC with #D97706 text.

Each option needs:
- Unique icon.
- Colored icon background.
- Bold title.
- Short description.

Include Cancel and close actions.

### Context-Sensitive Plus Button

| Active Screen | Plus Button Action |
|---|---|
| Dashboard | Show all four creation options |
| My Wallet | Directly open Add Expense |
| Savings | Directly open Create Savings Goal |
| Tasks | Directly open Create Task |
| Schedule | Directly open Add Event |

The creation forms must follow the same visual styling as the application.
## 12. Screen 7 — Profile

### Profile Presentation
- Profile/avatar presentation.
- Dayflow User label.
- Back navigation.

Do not hardcode personal account information or add login functionality.

### Profile Menu
Arrange these items as clean, full-width rows:
1. Backup Data.
2. Restore Data.
3. App Settings.
4. Theme.
5. About Dayflow.
6. Help & Support.

Each row contains:
- Appropriate icon.
- Title.
- Consistent spacing.
- Subtle interaction feedback.

### Prohibited
There must be no Logout button.

### Backup/Restore Note
Actual backup and restore functionality must follow the approved local-data architecture.
## 13. Additional Screen — Theme Customization

The Theme feature is accessed through Profile.

### Color Customization
- Display available theme presets.
- Show color swatches.
- Highlight the currently selected theme.
- Allow custom color selection where practical.

### Font Customization
- Display locally available font options.
- Show font previews.
- Highlight the selected font.
- Apply font changes consistently throughout Dayflow.

### Live Preview
Show sample:
- Cards.
- Buttons.
- Text.
- Icons.

Preview updates immediately when a selection changes.

### Actions
- Apply.
- Cancel.
- Reset to Default.

Use the approved SQLite preferences architecture for eventual local preference persistence.

### Font Implementation
- Use Plus Jakarta Sans as the primary font.
- Use Inter as the secondary font and fallback.
- Do not load fonts from Google Fonts or use external CDN resources in production.
## 14. Empty States and Feedback

Every data-driven screen must have a polished empty state.

### Example Empty States
- **Wallet:** No expenses recorded.
- **Savings:** No savings goals created.
- **Tasks:** No tasks available.
- **Schedule:** No activities scheduled.
- **Dashboard:** No recent activities.

### Design Requirements
- Use consistent icons.
- Short descriptions.
- Relevant actions (e.g., \"Add Expense\", \"Create First Goal\").
- Do not show fabricated financial records as actual user information.

### Feedback Notifications
- Use toast notifications for successful operations.
- Display clear validation messages when forms contain invalid input.
## 15. Android Responsiveness

Test the following viewport widths:

| Device | Width |
|---|---:|
| Small Phone | 320px |
| Standard Phone | 360px |
| Reference Phone | 390px |
| Large Phone | 430px |

### Requirements
- No horizontal scrolling.
- No clipped content.
- No overlapping buttons.
- Proper Android safe-area spacing.
- Fixed bottom navigation.
- Correct scrollable content.
- Forms remain accessible when the keyboard opens.
- Centered modal fits smaller devices.
- Consistent card alignment and spacing.

### Prohibited
Do not design a desktop sidebar or desktop website layout.
## 15. Android Responsiveness

Test the following viewport widths:

| Device | Width |
|---|---:|
| Small Phone | 320px |
| Standard Phone | 360px |
| Reference Phone | 390px |
| Large Phone | 430px |

### Requirements
- No horizontal scrolling.
- No clipped content.
- No overlapping buttons.
- Proper Android safe-area spacing.
- Fixed bottom navigation.
- Correct scrollable content.
- Forms remain accessible when the keyboard opens.
- Centered modal fits smaller devices.
- Consistent card alignment and spacing.

### Prohibited
Do not design a desktop sidebar or desktop website layout.
## 17. Existing Branding Assets

The repository already contains these Dayflow logo assets:
- src/app.logo.jpg
- src/Header-logo.png

### Instructions
- Inspect the actual repository filenames before referencing them.
- Reuse the existing official logo assets.
- Do not recreate, rename, replace, or delete them.
## 21. Git Restrictions

**ABSOLUTELY NO GIT COMMIT OR PUSH.**

Do not:
- Stage changes.
- Commit changes.
- Push to GitHub.
- Alter Git history.

Only the user can authorize Git operations.

## 18. Strict Technical and Project Restrictions

- Follow React 19 + TypeScript + Tailwind CSS 4 + Vite + Capacitor.
- Fully offline Android application.
- SQLite is the only application database.
- No backend.
- No authentication.
- No cloud synchronization.
- No Firebase or Supabase.
- No IndexedDB or Dexie.js.
- No external CDN dependencies (in production).
- No unapproved features.
- No unapproved database schema changes.
- No unnecessary dependency upgrades.
- No destructive PowerShell commands.
- Preserve existing project documentation and Git history.
## 20. Final Report

Provide:
- UI/UX specification documentation status.
- Design tokens recorded.
- Seven primary screens documented.
- Theme customization documented.
- Bottom navigation and floating plus button behavior documented.
- Centered modal behavior documented.
- Responsive requirements documented.
- Existing frontend discrepancies.
- Missing features or visual elements.
- Unresolved design decisions.
