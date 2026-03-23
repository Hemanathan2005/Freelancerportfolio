# HM CUTS - Video Editor Portfolio

A high-energy, brutalist portfolio for a freelance video editor featuring kinetic typography and aggressive motion.

## Features

- **Kinetic Typography:** Bold, oversized headings with parallax effects.
- **Custom Cursor:** Interactive cursor that reacts to links and buttons.
- **Project Showcase:** Parallax-driven project cards with direct links to work.
- **Interactive Stats:** Animated counters for experience and project metrics.
- **Contact Form:** Integrated with FormSubmit for direct email requests.
- **Responsive Design:** Mobile-first approach using Tailwind CSS.

## Tech Stack

- **React 19**
- **Vite**
- **Motion (Framer Motion)**
- **Tailwind CSS 4**
- **Lucide React Icons**

## Deployment on Vercel

This project is optimized for deployment on Vercel.

1. **Push to GitHub/GitLab/Bitbucket:** Ensure your code is in a remote repository.
2. **Import to Vercel:** Go to [Vercel](https://vercel.com) and import your repository.
3. **Build Settings:** Vercel will automatically detect the Vite project.
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. **Environment Variables:** If you use any API keys (like `GEMINI_API_KEY`), add them in the Vercel project settings.
5. **Deploy:** Click "Deploy" and your site will be live!

## Routing

The project includes a `vercel.json` file to handle SPA routing, ensuring that all paths are directed to `index.html`.
