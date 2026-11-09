# Student Management System (React)

A beginner-friendly React + Vite student administration dashboard.

## Features
- Register students using **controlled components** (`value` and `onChange`).
- Display records with a **dynamic list** using `map()`.
- Search by student name, email, ID, or course.
- View student details in a modal.
- Delete student records with confirmation.
- Validate required fields, email, phone, and duplicate email addresses.
- Keyboard shortcuts: `Ctrl/Cmd + K` focuses search; `Esc` closes the profile.
- Nested click handling: action buttons call `event.stopPropagation()` so row clicks do not also run.
- Prevent repeated registration: submit button is disabled while saving, with an `isSubmitting` guard.
- Persist records in browser `localStorage`.

## Requirements
- Node.js (recommended: Node 20 or newer)
- npm

## Run the project
1. Extract the ZIP file.
2. Open the extracted `student-management-system` folder in VS Code.
3. Open the VS Code terminal in that folder.
4. Install packages:

   ```bash
   npm install
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open the local URL printed by Vite, usually `http://localhost:5173/`.

## Create a production build

```bash
npm run build
```

## Main React concepts used
| Requirement | React / JavaScript concept |
|---|---|
| Register student | Controlled components, form event handling |
| Display students | Dynamic lists and `map()` |
| Search | `useState`, `filter()`, controlled input |
| Delete | Click event handling, `filter()` |
| View details | Conditional rendering, selected state |
| Validate form | Submit event and validation function |
| Keyboard shortcut | `useEffect`, `keydown` event listener |
| Nested click | `event.stopPropagation()` |
| Prevent repeated action | `isSubmitting` state and disabled button |
| Save data | `useEffect`, `localStorage` |

## Important note
This is a front-end learning project. Data is stored in the current browser only. It does not yet use a backend database or real administrator authentication. Clear browser site data and the saved records may be lost.
