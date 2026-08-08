import { io, Socket } from 'socket.io-client';

type EventCallback = (...args: any[]) => void;

class SocketManager {
  public socket: Socket | null = null;
  private isConnecting = false;

  public connect(): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    if (!this.socket && !this.isConnecting) {
      this.isConnecting = true;
      
      this.socket = io({
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
      });

      this.socket.on('connect', () => {
        console.log('[SocketManager] Connected:', this.socket?.id);
        this.isConnecting = false;
      });

      this.socket.on('disconnect', (reason) => {
        console.log('[SocketManager] Disconnected:', reason);
      });

      this.socket.on('connect_error', (err) => {
        console.error('[SocketManager] Connection Error:', err.message);
        this.isConnecting = false;
      });
    }

    return this.socket!;
  }

  public registerListener(eventName: string, callback: EventCallback) {
    if (this.socket) {
      this.socket.on(eventName, callback);
    }
  }

  public removeListener(eventName: string, callback: EventCallback) {
    if (this.socket) {
      this.socket.off(eventName, callback);
    }
  }

  public emit(eventName: string, ...args: any[]) {
    if (!this.socket?.connected) {
      console.warn(`[SocketManager] Emitting ${eventName} while offline`);
    }
    if (this.socket) {
        this.socket.emit(eventName, ...args);
    } else {
        const skt = this.connect();
        skt.emit(eventName, ...args);
    }
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnecting = false;
  }
}

export const socketManager = new SocketManager();
