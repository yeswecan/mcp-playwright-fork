import http from 'http';
import { EventEmitter } from 'events';

export class SseServer extends EventEmitter {
  private clients: Set<http.ServerResponse> = new Set();

  attachToServer(server: http.Server) {
    server.on('request', (req, res) => {
      if (req.url === '/events' && req.method === 'GET') {
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'Access-Control-Allow-Origin': '*',
        });
        try {
          res.write('\n');
          this.clients.add(res);
        } catch (err) {
          console.error('Failed to add SSE client or write initial response:', err);
        }
        req.on('close', () => {
          this.clients.delete(res);
        });
      }
    });
  }

  broadcast(event: string, data: any) {
    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    for (const client of this.clients) {
      try {
        client.write(payload);
      } catch (err) {
        // Remove client if write fails (e.g., client disconnected)
        this.clients.delete(client);
        console.error('Failed to write SSE event to client, removing client:', err);
      }
    }
  }
} 