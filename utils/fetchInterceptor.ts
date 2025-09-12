// Fetch interceptor to handle errors from browser extensions

declare global {
  interface Window {
    fetch: typeof fetch;
  }
}

if (typeof window !== 'undefined') {
  const originalFetch = window.fetch
  
  window.fetch = function(...args: Parameters<typeof fetch>): Promise<Response> {
    return originalFetch.apply(this, args).catch((error: Error) => {
      // Check if error is from a browser extension
      if (error.message && error.message.includes('Failed to fetch')) {
        console.warn('Fetch blocked, possibly by browser extension:', error)
        // Return a mock response to prevent app crashes
        return Promise.resolve(new Response(JSON.stringify({ 
          error: 'Request blocked by browser extension',
          data: null 
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }))
      }
      // Re-throw other errors
      throw error
    })
  }
}

export default {}