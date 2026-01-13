/**
 * The Moderator - Backend Entrypoint
 * 
 * This agent periodically checks for toxic comments via MCP.
 */

// Global RPC object is injected by the host shell
const { rpc } = global;

/**
 * Lifecycle hook: called when the plugin is started
 */
async function main() {
  console.log('Moderator plugin starting...');

  try {
    // Register a periodic check (every minute for the demo)
    await rpc.scheduler.register('*/1 * * * *', 'check-toxicity');
    console.log('Registered toxicity check scheduler');
  } catch (error) {
    console.error('Failed to register scheduler:', error.message);
  }
}

/**
 * Event handler: called by the shell when a registered cron fires
 * @param {string} handlerId The ID provided during registration
 */
global.onSchedulerEvent = async (handlerId) => {
  console.log(`[Moderator] Received scheduler event: ${handlerId}`);
  
  if (handlerId === 'check-toxicity') {
    console.log('[Moderator] Polling MCP for new comments...');
    
    try {
      // 1. Fetch comments from WordPress MCP
      const comments = await rpc.mcp.call('wordpress', 'get_comments');
      console.log(`[Moderator] Received ${comments.length} comments`);

      // 2. Iterate and check for toxicity (Dummy logic for MVP based on mock data)
      for (const comment of comments) {
        if (comment.toxic) {
          console.warn(`[Moderator] TOXIC comment detected from ${comment.author}: "${comment.content}"`);
          
          // 3. Send notification to Shell
          await rpc.notify.send('warn', `Toxic comment found from ${comment.author}!`);
        } else {
          console.log(`[Moderator] Safe comment from ${comment.author}`);
        }
      }
    } catch (error) {
       console.error('[Moderator] Polling failed:', error.message);
    }
  }
};

// Start the plugin
main().catch(err => console.error('Main error:', err));
