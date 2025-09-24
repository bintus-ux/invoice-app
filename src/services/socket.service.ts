import { io, Socket } from 'socket.io-client'
import { ref } from 'vue'
import type { InvoiceStatus } from '@/types/invoice'

export interface InvoiceUpdateData {
  id: number
  status: InvoiceStatus
  updatedAt: string
  message?: string
}

export interface NewInvoiceData {
  id: number
  number: string
  status: InvoiceStatus
  amount: number
  clientName: string
  createdAt: string
}

export interface NotificationData {
  type: string
  message: string
}

class SocketService {
  private socket: Socket | null = null
  private isConnected = ref(false)

  connect(): Socket {
    this.socket = io('http://localhost:3001', {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    this.socket.on('connect', () => {
      console.log('✅ Connected to server')
      this.isConnected.value = true
    })

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnected from server')
      this.isConnected.value = false
    })

    this.socket.on('error', (error: Error) => {
      console.error('Socket error:', error)
    })

    return this.socket
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.isConnected.value = false
    }
  }

  // --- LISTENERS ---
  onInvoiceUpdated(callback: (data: InvoiceUpdateData) => void): void {
    this.socket?.on('invoice-updated', callback)
  }

  onInvoiceCreated(callback: (data: NewInvoiceData) => void): void {
    this.socket?.on('invoice-created', callback)
  }

  onNotification(callback: (data: NotificationData) => void): void {
    this.socket?.on('notification', callback)
  }

  onActivityCreated(callback: (data: unknown) => void) {
    this.socket?.on('create-activity', callback)
  }

  // --- EMITTERS ---
  emitInvoiceUpdate(invoiceData: InvoiceUpdateData): void {
    console.log("📡 [socket.service] Emitting 'update-invoice' with data:", invoiceData)
    this.socket?.emit('update-invoice', invoiceData, (ack?: unknown) => {
      console.log("✅ [socket.service] Server acknowledged 'update-invoice':", ack)
    })
  }

  createInvoice(invoiceData: Omit<NewInvoiceData, 'id' | 'createdAt'>): void {
    console.log("📡 [socket.service] Emitting 'create-invoice' with data:", invoiceData)
    this.socket?.emit('create-invoice', invoiceData, (ack?: unknown) => {
      console.log("✅ [socket.service] Server acknowledged 'create-invoice':", ack)
    })
  }

  // --- UTILITIES ---
  removeListeners(): void {
    this.socket?.removeAllListeners()
  }

  get connected(): boolean {
    return this.isConnected.value
  }
}

export const socketService = new SocketService()
