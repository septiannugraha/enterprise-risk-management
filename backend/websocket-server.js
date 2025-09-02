/**
 * WebSocket Server for Real-time Risk Management
 * Handles live updates, notifications, and multi-user synchronization
 */

const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

class WebSocketServer {
  constructor(httpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: ["http://localhost:8123", "http://localhost:3000"],
        methods: ["GET", "POST"],
        credentials: true
      }
    });

    // Track connected users and their subscriptions
    this.connections = new Map();
    this.rooms = {
      dashboard: new Set(),
      riskRegister: new Set(),
      riskMatrix: new Set(),
      kri: new Set(),
      kpi: new Set()
    };

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  setupMiddleware() {
    // Authentication middleware (optional for demo)
    this.io.use((socket, next) => {
      const token = socket.handshake.auth.token;
      
      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'demo-secret');
          socket.userId = decoded.userId;
          socket.userRole = decoded.role;
        } catch (err) {
          // For demo, allow anonymous connections
          socket.userId = `anonymous-${socket.id}`;
          socket.userRole = 'viewer';
        }
      } else {
        // Anonymous user for demo
        socket.userId = `anonymous-${socket.id}`;
        socket.userRole = 'viewer';
      }
      
      next();
    });
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`User connected: ${socket.userId} (${socket.id})`);
      
      // Store connection info
      this.connections.set(socket.id, {
        userId: socket.userId,
        role: socket.userRole,
        subscribedRooms: new Set(),
        connectedAt: new Date()
      });

      // Send initial connection success
      socket.emit('connected', {
        userId: socket.userId,
        role: socket.userRole,
        serverTime: new Date()
      });

      // Handle room subscriptions
      socket.on('subscribe', (room) => {
        if (this.rooms[room]) {
          socket.join(room);
          this.rooms[room].add(socket.id);
          this.connections.get(socket.id).subscribedRooms.add(room);
          
          // Send current room participants count
          socket.emit('room:joined', {
            room,
            participants: this.rooms[room].size
          });

          // Notify others in room
          socket.to(room).emit('user:joined', {
            userId: socket.userId,
            room,
            participants: this.rooms[room].size
          });

          console.log(`${socket.userId} joined ${room} (${this.rooms[room].size} users)`);
        }
      });

      // Handle room unsubscribe
      socket.on('unsubscribe', (room) => {
        this.leaveRoom(socket, room);
      });

      // Risk-specific events
      socket.on('risk:create', (data) => {
        this.broadcastRiskUpdate('create', data, socket);
      });

      socket.on('risk:update', (data) => {
        this.broadcastRiskUpdate('update', data, socket);
      });

      socket.on('risk:delete', (data) => {
        this.broadcastRiskUpdate('delete', data, socket);
      });

      // KRI threshold breach simulation
      socket.on('kri:breach', (data) => {
        this.broadcastKRIBreach(data, socket);
      });

      // Risk matrix cell update
      socket.on('matrix:update', (data) => {
        this.broadcastMatrixUpdate(data, socket);
      });

      // Dashboard metric changes
      socket.on('metric:update', (data) => {
        this.broadcastMetricUpdate(data, socket);
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        const connection = this.connections.get(socket.id);
        
        if (connection) {
          // Leave all rooms
          connection.subscribedRooms.forEach(room => {
            this.leaveRoom(socket, room);
          });
          
          this.connections.delete(socket.id);
        }
        
        console.log(`User disconnected: ${socket.userId}`);
      });
    });
  }

  leaveRoom(socket, room) {
    if (this.rooms[room] && this.rooms[room].has(socket.id)) {
      socket.leave(room);
      this.rooms[room].delete(socket.id);
      
      const connection = this.connections.get(socket.id);
      if (connection) {
        connection.subscribedRooms.delete(room);
      }

      // Notify others in room
      socket.to(room).emit('user:left', {
        userId: socket.userId,
        room,
        participants: this.rooms[room].size
      });

      console.log(`${socket.userId} left ${room} (${this.rooms[room].size} users)`);
    }
  }

  // Broadcast risk updates to relevant rooms
  broadcastRiskUpdate(action, data, socket) {
    const update = {
      action,
      risk: data,
      updatedBy: socket.userId,
      timestamp: new Date()
    };

    // Send to risk register subscribers
    socket.to('riskRegister').emit('risk:changed', update);
    
    // Also update dashboard
    socket.to('dashboard').emit('dashboard:update', {
      type: 'risk',
      action,
      data: this.calculateDashboardMetrics()
    });

    // Update risk matrix if likelihood/impact changed
    if (action === 'update' && (data.likelihood || data.impact)) {
      socket.to('riskMatrix').emit('matrix:changed', {
        riskId: data.id,
        oldPosition: data.oldPosition,
        newPosition: {
          likelihood: data.likelihood,
          impact: data.impact
        }
      });
    }

    // Log for audit
    console.log(`Risk ${action}: ${data.id} by ${socket.userId}`);
  }

  // Broadcast KRI breach notifications
  broadcastKRIBreach(data, socket) {
    const alert = {
      kriId: data.kriId,
      name: data.name,
      threshold: data.threshold,
      currentValue: data.currentValue,
      severity: this.calculateSeverity(data),
      timestamp: new Date(),
      triggeredBy: socket.userId
    };

    // Send to all KRI subscribers
    this.io.to('kri').emit('kri:alert', alert);
    
    // Also send to dashboard for notification
    this.io.to('dashboard').emit('notification', {
      type: 'kri_breach',
      severity: alert.severity,
      message: `KRI Alert: ${data.name} exceeded threshold`,
      data: alert
    });

    console.log(`KRI Breach: ${data.name} - Value: ${data.currentValue} (Threshold: ${data.threshold})`);
  }

  // Broadcast risk matrix updates
  broadcastMatrixUpdate(data, socket) {
    const matrixUpdate = {
      cells: data.cells,
      totalRisks: data.totalRisks,
      updatedBy: socket.userId,
      timestamp: new Date()
    };

    socket.to('riskMatrix').emit('matrix:refresh', matrixUpdate);
    
    // Send heatmap data
    socket.to('dashboard').emit('heatmap:update', {
      critical: data.cells.filter(c => c.score >= 20).length,
      high: data.cells.filter(c => c.score >= 15 && c.score < 20).length,
      medium: data.cells.filter(c => c.score >= 10 && c.score < 15).length,
      low: data.cells.filter(c => c.score < 10).length
    });
  }

  // Broadcast dashboard metric updates
  broadcastMetricUpdate(data, socket) {
    const metricUpdate = {
      metric: data.metric,
      value: data.value,
      change: data.change,
      trend: data.trend,
      updatedBy: socket.userId,
      timestamp: new Date()
    };

    socket.to('dashboard').emit('metric:changed', metricUpdate);
  }

  // Calculate severity for KRI breaches
  calculateSeverity(kri) {
    const percentageOver = ((kri.currentValue - kri.threshold) / kri.threshold) * 100;
    
    if (percentageOver > 50) return 'critical';
    if (percentageOver > 25) return 'high';
    if (percentageOver > 10) return 'medium';
    return 'low';
  }

  // Calculate dashboard metrics (mock for demo)
  calculateDashboardMetrics() {
    return {
      totalRisks: Math.floor(Math.random() * 100) + 50,
      highRisks: Math.floor(Math.random() * 20) + 5,
      mediumRisks: Math.floor(Math.random() * 30) + 10,
      lowRisks: Math.floor(Math.random() * 50) + 20,
      activeKRIs: Math.floor(Math.random() * 10) + 5,
      breachedKRIs: Math.floor(Math.random() * 3)
    };
  }

  // Public methods for server-side events
  
  // Emit event to specific room
  emitToRoom(room, event, data) {
    this.io.to(room).emit(event, {
      ...data,
      serverTime: new Date()
    });
  }

  // Emit event to all connected clients
  broadcast(event, data) {
    this.io.emit(event, {
      ...data,
      serverTime: new Date()
    });
  }

  // Get connection statistics
  getStats() {
    const stats = {
      totalConnections: this.connections.size,
      rooms: {}
    };

    Object.keys(this.rooms).forEach(room => {
      stats.rooms[room] = this.rooms[room].size;
    });

    return stats;
  }
}

module.exports = WebSocketServer;