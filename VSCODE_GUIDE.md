# VS Code Development Guide

## Setting Up LoveSync AI in VS Code

### 1. Open Project in VS Code
```bash
code .
```

### 2. Recommended Extensions
Install these VS Code extensions for the best development experience:

- **ES7+ React/Redux/React-Native snippets** - React development shortcuts
- **Tailwind CSS IntelliSense** - Autocomplete for Tailwind classes
- **TypeScript Importer** - Auto-import suggestions
- **Prettier - Code formatter** - Code formatting
- **ESLint** - Code linting
- **Auto Rename Tag** - HTML/JSX tag renaming
- **Bracket Pair Colorizer** - Better bracket visualization

### 3. VS Code Settings
Create `.vscode/settings.json` in your project root:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

### 4. Debugging Configuration
Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

### 5. Tasks Configuration
Create `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "dev",
      "type": "npm",
      "script": "dev",
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      },
      "problemMatcher": []
    },
    {
      "label": "build",
      "type": "npm",
      "script": "build",
      "group": "build"
    }
  ]
}
```

### 6. Quick Development Workflow

1. **Start Development Server**
   - Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
   - Type "Tasks: Run Task"
   - Select "dev"
   - Or use terminal: `npm run dev`

2. **File Navigation**
   - `Ctrl+P` - Quick file search
   - `Ctrl+Shift+E` - Explorer panel
   - `Ctrl+`` - Toggle terminal

3. **Code Editing**
   - `Alt+Shift+F` - Format document
   - `F2` - Rename symbol
   - `Ctrl+D` - Select next occurrence

### 7. Environment Setup

1. Create `.env.local` file in root directory
2. Add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```
3. VS Code will automatically load environment variables

### 8. Git Integration

VS Code has built-in Git support:
- `Ctrl+Shift+G` - Source control panel
- Stage changes by clicking the "+" icon
- Commit with `Ctrl+Enter`
- Push/pull using the status bar

### 9. Deployment from VS Code

#### Vercel Extension
1. Install "Vercel" extension
2. Sign in to your Vercel account
3. Deploy directly from VS Code

#### Manual Deployment
1. Build the project: `npm run build`
2. Use VS Code terminal to deploy to your preferred platform

### 10. Troubleshooting in VS Code

- **TypeScript Errors**: Press `Ctrl+Shift+P` → "TypeScript: Restart TS Server"
- **Import Issues**: Use `Ctrl+Space` for auto-import suggestions
- **Formatting Issues**: Check Prettier extension is enabled
- **Terminal Issues**: Use `Ctrl+Shift+`` to open new terminal

### 11. Useful Shortcuts

- `Ctrl+Shift+P` - Command palette
- `Ctrl+P` - Quick file open
- `Ctrl+Shift+F` - Global search
- `Ctrl+Shift+H` - Global replace
- `F12` - Go to definition
- `Alt+F12` - Peek definition
- `Ctrl+/` - Toggle comment

This setup will give you a professional development environment for working with the Uthando project.

