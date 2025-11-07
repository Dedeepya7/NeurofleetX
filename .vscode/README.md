This workspace contains a Vite-based frontend that serves on http://localhost:5174 by default.

Why "Go Live" opens 127.0.0.1:5501
- "Go Live" (Live Server) is a separate VS Code extension that serves static files (usually from the folder you opened in the editor) on port 5501 by default. It is not the Vite dev server.

How to run the correct dev server (Vite)
1. Open the Run and Debug view, choose "Launch Vite (neurofleetx-vite)", and press the green ▶︎. This will run the Vite dev server in the `frontend/neurofleetx-vite` folder and open Chrome at http://localhost:5174.
2. Or run the task: Run Task -> "Start Vite (neurofleetx-vite)" (this will start Vite but won't open the browser).

Notes
- If you prefer Live Server, you can keep using it for static previews, but for this Vite project use the provided Run/Task to get hot module replacement, correct routing, and environment handling.
- If your project uses `neurofleetx-frontend` (CRA) instead of `neurofleetx-vite`, update the task's cwd or run the corresponding npm script (usually `npm start`).
