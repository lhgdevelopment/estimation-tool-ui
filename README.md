# estimation-tool-ui

React codebase for Estimation tool

**Next.js Project Deployment with PM2**

1. **Node.js and NPM:**
   Ensure Node.js and NPM are installed on your server. Verify compatibility with Node version 20.10.0.

2. **Navigate to Project:**
   Open a terminal and navigate to the root directory of your Next.js project.

3. **Install PM2:**
   Install PM2 globally with the command: `npm install -g pm2`.

4. **Install Dependencies:**
   In the project directory, install dependencies with: `npm install`.

5. **Build Project:**
   If necessary, build your Next.js project using: `npm run build`.

6. **Start with PM2:**
   Start your app in production mode with PM2 using: `pm2 start pm2.config.json`.

7. **Monitoring:**
   Monitor your app's status, logs, etc. with PM2 commands, e.g., `pm2 status`.

Your Next.js app is now deployed and managed by PM2. Adjust configurations and environment variables as needed.
