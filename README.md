## Environment Variables and Rebuilding

When changing environment variables in `.env.local`, you need to rebuild the application for the changes to take effect. You can use the provided script to automatically check for changes and rebuild:

\`\`\`bash
node scripts/rebuild-after-env-change.js
\`\`\`

This script will:
1. Check if environment variables have changed
2. Rebuild the application if changes are detected
3. Restart the PM2 process

You can also add this to your deployment process or run it manually after updating environment variables.
