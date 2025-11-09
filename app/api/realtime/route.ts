import { NextRequest } from "next/server"

// Store active connections
const clients = new Set<ReadableStreamDefaultController>()

// Broadcast function to notify all clients
export function broadcastUpdate(data: any) {
  const message = `data: ${JSON.stringify(data)}\n\n`
  clients.forEach((controller) => {
    try {
      controller.enqueue(new TextEncoder().encode(message))
    } catch (error) {
      // Client disconnected, remove from set
      clients.delete(controller)
    }
  })
}

// GET /api/realtime - Server-Sent Events endpoint
export async function GET(request: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      // Add this client to the set
      clients.add(controller)

      // Send initial connection message
      const welcomeMessage = `data: ${JSON.stringify({ type: "connected" })}\n\n`
      controller.enqueue(new TextEncoder().encode(welcomeMessage))

      // Keep connection alive with heartbeat
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(new TextEncoder().encode(": heartbeat\n\n"))
        } catch (error) {
          clearInterval(heartbeat)
          clients.delete(controller)
        }
      }, 30000) // Every 30 seconds

      // Cleanup on close
      request.signal.addEventListener("abort", () => {
        clearInterval(heartbeat)
        clients.delete(controller)
        try {
          controller.close()
        } catch (error) {
          // Already closed
        }
      })
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  })
}
