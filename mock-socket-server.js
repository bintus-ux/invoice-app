import { Server } from 'socket.io'
import { createServer } from 'http'

// Create HTTP server
const server = createServer()
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Your Vue app URL
    methods: ['GET', 'POST'],
    credentials: true,
  },
})

// Store connected clients
const connectedClients = new Set()

io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id)
  connectedClients.add(socket.id)

  // Send welcome message
  socket.emit('notification', {
    type: 'info',
    message: 'Connected to real-time server',
  })

  // Simulate invoice events
  const intervals = {
    invoiceUpdate: setInterval(() => {
      const statuses = ['PAID', 'VIEWED', 'OVERDUE', 'SENT', 'DRAFT']
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
      const randomId = Math.floor(Math.random() * 5) + 1 // Match your dummy invoice IDs

      const updateData = {
        id: randomId,
        status: randomStatus,
        updatedAt: new Date().toISOString(),
        message: `Invoice #${randomId} status changed to ${randomStatus}`,
      }

      socket.emit('invoice-updated', updateData)
      console.log('📤 Sent invoice update:', updateData)
    }, 15000), // Every 15 seconds

    invoiceCreate: setInterval(() => {
      // Simulate new invoice creation occasionally
      if (Math.random() > 0.7) {
        // 30% chance
        const newInvoice = {
          id: Date.now(),
          number: `INV-${Math.floor(Math.random() * 10000)}`,
          status: 'DRAFT',
          amount: Math.random() * 10000,
          clientName: 'New Client',
          createdAt: new Date().toISOString(),
        }

        socket.emit('invoice-created', newInvoice)
        console.log('📤 Sent new invoice:', newInvoice)
      }
    }, 20000), // Every 20 seconds
  }

  // Handle invoice creation from client
  socket.on('create-invoice', (data) => {
    console.log('📨 Received new invoice from client:', data)

    // Broadcast to all other clients
    socket.broadcast.emit('invoice-created', data)

    // Optionally, also send back to sender to confirm
    socket.emit('invoice-created', data)

    // Also send a notification
    socket.emit('notification', {
      type: 'success',
      message: `Invoice #${data.number} created successfully`,
    })
  })

  // Handle client messages
  socket.on('update-invoice', (data) => {
    console.log('📨 Received invoice update from client:', data)
    // Broadcast to all other clients
    socket.broadcast.emit('invoice-updated', data)
  })

  // Simulate activity events
  const activityInterval = setInterval(() => {
    if (Math.random() > 0.5) {
      const activity = {
        id: Date.now(),
        actor: 'System',
        action: `Performed action #${Math.floor(Math.random() * 100)}`,
        time: new Date().toISOString(),
      }
      socket.emit('create-activity', activity)
      console.log('📤 Sent activity:', activity)
    }
  }, 10000)

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id)
    connectedClients.delete(socket.id)

    // Clean up intervals
    clearInterval(intervals.invoiceUpdate)
    clearInterval(intervals.invoiceCreate)
    clearInterval(activityInterval) // <-- add this
  })

  socket.on('error', (error) => {
    console.error('Socket error:', error)
  })
})

const PORT = 3001
server.listen(PORT, () => {
  const address = server.address()
  console.log(`🚀 Mock Socket.io server running on port ${address.port}`)
  console.log(`📡 Clients can connect from: http://localhost:3000`)
})

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...')
  io.close(() => {
    console.log('✅ Socket server closed')
    process.exit(0)
  })
})
