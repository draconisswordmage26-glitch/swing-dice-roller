# Deployment Options

## Option 1: Vercel / Netlify (Cloud Deployment)

This is the easiest way to share your application with the world. Both Vercel and Netlify are free for personal projects and offer excellent integration with GitHub.

### **Prerequisites**
1.  A [GitHub](https://github.com/) account.
2.  A [Vercel](https://vercel.com/) or [Netlify](https://netlify.com/) account.
3.  Your project code pushed to a GitHub repository.

### **Step-by-Step Guide (Vercel)**

1.  **Push to GitHub**:
    *   Initialize git in your project folder if you haven't already:
        ```bash
        git init
        git add .
        git commit -m "Initial commit"
        ```
    *   Create a new repository on GitHub.
    *   Link your local folder to the GitHub repo and push:
        ```bash
        git remote add origin https://github.com/draconisswordmage26-glitch/swing-dice-roller.git
        git branch -M main
        git push -u origin main
        ```
        > [!TIP]
        > If you get `error: remote origin already exists`, update it instead:
        > ```bash
        > git remote set-url origin https://github.com/draconisswordmage26-glitch/swing-dice-roller.git
        > ```

2.  **Import Project in Vercel**:
    *   Log in to your Vercel dashboard.
    *   Click **"Add New..."** -> **"Project"**.
    *   Select **"Continue with GitHub"**.
    *   Find your `swing-dice-roller` repository in the list and click **"Import"**.

3.  **Configure Build Settings**:
    *   **Framework Preset**: Vercel should automatically detect **Vite**.
    *   **Root Directory**: Leave as `./`.
    *   **Build Command**: `npm run build` (default).
    *   **Output Directory**: `dist` (default).
    *   **Install Command**: `npm install` (default).
    *   *Note: You usually don't need to change anything here.*

4.  **Deploy**:
    *   Click **"Deploy"**.
    *   Wait for the build to complete (usually < 1 minute).
    *   Once finished, you will get a live URL (e.g., `https://swing-dice-roller.vercel.app`).

### **Step-by-Step Guide (Netlify)**

1.  **Push to GitHub**: (Same as above).

2.  **Import Project in Netlify**:
    *   Log in to Netlify.
    *   Click **"Add new site"** -> **"Import from an existing project"**.
    *   Select **GitHub**.
    *   Authorize Netlify to access your repositories.
    *   Select your `swing-dice-roller` repository.

3.  **Configure Build Settings**:
    *   **Base directory**: Leave empty.
    *   **Build command**: `npm run build`.
    *   **Publish directory**: `dist`.
    *   *Netlify usually detects these automatically.*

4.  **Deploy**:
    *   Click **"Deploy Site"**.
    *   Netlify will build your site and give you a URL (e.g., `https://fluffy-unicorn-123456.netlify.app`).

---

## Option 2: Local Execution

*(This section is assumed to be the "crystal-clear" reference provided previously. If you need this section populated, please let me know!)*
