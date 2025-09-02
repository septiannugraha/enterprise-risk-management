/**
 * WebSocket Client for Real-time Dashboard Updates
 * Handles live risk updates, notifications, and multi-user synchronization
 */

class RiskWebSocketClient {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.userId = null;
    this.role = null;
    this.subscriptions = new Set();
    this.eventHandlers = new Map();
    this.notificationQueue = [];
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
  }

  /**
   * Connect to WebSocket server
   */
  connect(serverUrl = 'http://localhost:3001', token = null) {
    return new Promise((resolve, reject) => {
      // Load Socket.io client
      if (typeof io === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.socket.io/4.6.0/socket.io.min.js';
        script.onload = () => this.initializeConnection(serverUrl, token, resolve, reject);
        script.onerror = () => reject(new Error('Failed to load Socket.io'));
        document.head.appendChild(script);
      } else {
        this.initializeConnection(serverUrl, token, resolve, reject);
      }
    });
  }

  initializeConnection(serverUrl, token, resolve, reject) {
    try {
      this.socket = io(serverUrl, {
        auth: { token },
        reconnection: true,
        reconnectionDelay: this.reconnectDelay,
        reconnectionAttempts: this.maxReconnectAttempts
      });

      this.setupEventListeners();
      
      this.socket.on('connected', (data) => {
        this.connected = true;
        this.userId = data.userId;
        this.role = data.role;
        this.reconnectAttempts = 0;
        
        console.log('✅ WebSocket connected:', data);
        this.showNotification('Connected to real-time updates', 'success');
        
        // Re-subscribe to previous rooms on reconnect
        this.subscriptions.forEach(room => {
          this.socket.emit('subscribe', room);
        });
        
        resolve(data);
      });

      this.socket.on('connect_error', (error) => {
        this.reconnectAttempts++;
        console.error('❌ WebSocket connection error:', error);
        
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          reject(new Error('Max reconnection attempts reached'));
        }
      });

    } catch (error) {
      reject(error);
    }
  }

  /**
   * Setup all WebSocket event listeners
   */
  setupEventListeners() {
    // Connection events
    this.socket.on('disconnect', () => {
      this.connected = false;
      console.log('🔌 WebSocket disconnected');
      this.showNotification('Connection lost. Attempting to reconnect...', 'warning');
    });

    this.socket.on('reconnect', () => {
      console.log('🔄 WebSocket reconnected');
      this.showNotification('Reconnected to server', 'success');
    });

    // Room events
    this.socket.on('room:joined', (data) => {
      console.log(`📍 Joined room: ${data.room} (${data.participants} users)`);
      this.updateParticipantCount(data.room, data.participants);
    });

    this.socket.on('user:joined', (data) => {
      console.log(`👤 User joined ${data.room}: ${data.userId}`);
      this.updateParticipantCount(data.room, data.participants);
    });

    this.socket.on('user:left', (data) => {
      console.log(`👤 User left ${data.room}: ${data.userId}`);
      this.updateParticipantCount(data.room, data.participants);
    });

    // Risk events
    this.socket.on('risk:changed', (data) => {
      console.log('📊 Risk changed:', data);
      this.handleRiskChange(data);
    });

    this.socket.on('risk:created', (data) => {
      console.log('➕ New risk created:', data);
      this.handleNewRisk(data);
    });

    // Dashboard events
    this.socket.on('dashboard:update', (data) => {
      console.log('📈 Dashboard update:', data);
      this.updateDashboard(data);
    });

    // KRI events
    this.socket.on('kri:alert', (data) => {
      console.log('🚨 KRI Alert:', data);
      this.handleKRIAlert(data);
    });

    // Matrix events
    this.socket.on('matrix:changed', (data) => {
      console.log('🎯 Risk matrix changed:', data);
      this.updateRiskMatrix(data);
    });

    this.socket.on('matrix:refresh', (data) => {
      console.log('🔄 Risk matrix refresh:', data);
      this.refreshRiskMatrix(data);
    });

    // Metric events
    this.socket.on('metric:changed', (data) => {
      console.log('📊 Metric changed:', data);
      this.updateMetric(data);
    });

    // Notification events
    this.socket.on('notification', (data) => {
      console.log('🔔 Notification:', data);
      this.handleNotification(data);
    });

    // Heatmap events
    this.socket.on('heatmap:update', (data) => {
      console.log('🗺️ Heatmap update:', data);
      this.updateHeatmap(data);
    });
  }

  /**
   * Subscribe to a room for real-time updates
   */
  subscribe(room) {
    if (!this.connected) {
      console.warn('Not connected. Call connect() first.');
      return;
    }

    if (!this.subscriptions.has(room)) {
      this.socket.emit('subscribe', room);
      this.subscriptions.add(room);
      console.log(`✅ Subscribed to ${room}`);
    }
  }

  /**
   * Unsubscribe from a room
   */
  unsubscribe(room) {
    if (this.subscriptions.has(room)) {
      this.socket.emit('unsubscribe', room);
      this.subscriptions.delete(room);
      console.log(`❌ Unsubscribed from ${room}`);
    }
  }

  /**
   * Emit a risk update event
   */
  updateRisk(riskData) {
    if (!this.connected) return;
    this.socket.emit('risk:update', riskData);
  }

  /**
   * Emit a KRI breach event
   */
  reportKRIBreach(kriData) {
    if (!this.connected) return;
    this.socket.emit('kri:breach', kriData);
  }

  /**
   * Handle risk changes
   */
  handleRiskChange(data) {
    const { action, risk, updatedBy, timestamp } = data;
    
    // Update risk table if visible
    const riskRow = document.querySelector(`tr[data-risk-id="${risk.id}"]`);
    if (riskRow) {
      this.animateUpdate(riskRow);
      // Update row content
      this.updateRiskRow(riskRow, risk);
    }

    // Show notification
    this.showNotification(
      `Risk ${risk.id} ${action}d by ${updatedBy}`,
      'info',
      { risk, action }
    );
  }

  /**
   * Handle new risk creation
   */
  handleNewRisk(risk) {
    // Add to risk table if visible
    const tbody = document.querySelector('#risk-table tbody');
    if (tbody) {
      const newRow = this.createRiskRow(risk);
      tbody.insertBefore(newRow, tbody.firstChild);
      this.animateNewRow(newRow);
    }

    // Update dashboard counters
    this.incrementCounter('total-risks');
  }

  /**
   * Update dashboard metrics
   */
  updateDashboard(data) {
    if (data.type === 'risk_added') {
      this.incrementCounter('total-risks');
      this.updateRiskDistribution();
    } else if (data.type === 'risk') {
      this.updateRiskSummary();
    }

    // Animate dashboard cards
    this.animateDashboardCards();
  }

  /**
   * Handle KRI alerts
   */
  handleKRIAlert(alert) {
    const { kriId, name, threshold, currentValue, severity } = alert;
    
    // Flash KRI indicator
    const kriElement = document.querySelector(`[data-kri-id="${kriId}"]`);
    if (kriElement) {
      kriElement.classList.add('alert', `alert-${severity}`);
      this.animateAlert(kriElement);
    }

    // Show alert notification
    this.showNotification(
      `⚠️ KRI Alert: ${name} exceeded threshold (${currentValue} > ${threshold})`,
      severity
    );

    // Update KRI dashboard
    this.updateKRIDashboard(alert);
  }

  /**
   * Update risk matrix
   */
  updateRiskMatrix(data) {
    const { riskId, oldPosition, newPosition } = data;
    
    // Move risk dot on matrix
    const riskDot = document.querySelector(`[data-matrix-risk="${riskId}"]`);
    if (riskDot) {
      this.moveRiskOnMatrix(riskDot, oldPosition, newPosition);
    }

    // Update cell counts
    this.updateMatrixCellCounts();
  }

  /**
   * Refresh entire risk matrix
   */
  refreshRiskMatrix(data) {
    const { cells, totalRisks } = data;
    
    // Redraw matrix
    if (window.renderRiskMatrix) {
      window.renderRiskMatrix(cells);
    }

    // Update total count
    const totalElement = document.querySelector('#matrix-total-risks');
    if (totalElement) {
      totalElement.textContent = totalRisks;
    }
  }

  /**
   * Update specific metric
   */
  updateMetric(data) {
    const { metric, value, change, trend } = data;
    
    const metricElement = document.querySelector(`[data-metric="${metric}"]`);
    if (metricElement) {
      // Update value
      const valueElement = metricElement.querySelector('.metric-value');
      if (valueElement) {
        const oldValue = parseFloat(valueElement.textContent);
        this.animateNumber(valueElement, oldValue, value);
      }

      // Update trend arrow
      const trendElement = metricElement.querySelector('.metric-trend');
      if (trendElement) {
        trendElement.className = `metric-trend trend-${trend}`;
        trendElement.textContent = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';
      }

      // Highlight change
      this.animateUpdate(metricElement);
    }
  }

  /**
   * Update heatmap
   */
  updateHeatmap(data) {
    const { critical, high, medium, low } = data;
    
    // Update heatmap cells
    document.querySelectorAll('.heatmap-cell').forEach(cell => {
      const level = cell.dataset.level;
      let count = 0;
      
      switch(level) {
        case 'critical': count = critical; break;
        case 'high': count = high; break;
        case 'medium': count = medium; break;
        case 'low': count = low; break;
      }
      
      cell.querySelector('.cell-count').textContent = count;
      cell.style.opacity = Math.min(1, 0.3 + (count / 10));
    });
  }

  /**
   * Show notification
   */
  showNotification(message, type = 'info', data = null) {
    const notification = {
      id: Date.now(),
      message,
      type,
      data,
      timestamp: new Date()
    };

    this.notificationQueue.push(notification);
    
    // Create notification element
    const notifElement = document.createElement('div');
    notifElement.className = `notification notification-${type} animated fadeInRight`;
    notifElement.innerHTML = `
      <span class="notification-message">${message}</span>
      <span class="notification-time">${new Date().toLocaleTimeString()}</span>
    `;

    // Add to notification container
    let container = document.querySelector('#notification-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'notification-container';
      container.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 9999;';
      document.body.appendChild(container);
    }

    container.appendChild(notifElement);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      notifElement.classList.add('fadeOutRight');
      setTimeout(() => notifElement.remove(), 500);
    }, 5000);
  }

  /**
   * Animation helpers
   */
  animateUpdate(element) {
    element.classList.add('updated');
    setTimeout(() => element.classList.remove('updated'), 2000);
  }

  animateNewRow(element) {
    element.classList.add('new-row');
    setTimeout(() => element.classList.remove('new-row'), 3000);
  }

  animateAlert(element) {
    element.classList.add('pulsing');
    setTimeout(() => element.classList.remove('pulsing'), 3000);
  }

  animateNumber(element, from, to, duration = 1000) {
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const current = from + (to - from) * progress;
      
      element.textContent = Math.round(current);
      
      if (progress >= 1) {
        clearInterval(timer);
      }
    }, 50);
  }

  animateDashboardCards() {
    document.querySelectorAll('.dashboard-card').forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('pulse');
        setTimeout(() => card.classList.remove('pulse'), 500);
      }, index * 100);
    });
  }

  /**
   * Helper methods
   */
  updateParticipantCount(room, count) {
    const badge = document.querySelector(`[data-room-participants="${room}"]`);
    if (badge) {
      badge.textContent = `${count} users`;
      badge.classList.add('updated');
      setTimeout(() => badge.classList.remove('updated'), 1000);
    }
  }

  incrementCounter(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      const current = parseInt(element.textContent) || 0;
      this.animateNumber(element, current, current + 1);
    }
  }

  createRiskRow(risk) {
    const row = document.createElement('tr');
    row.dataset.riskId = risk.id;
    row.innerHTML = `
      <td>${risk.id}</td>
      <td>${risk.title}</td>
      <td><span class="badge badge-${risk.category.toLowerCase()}">${risk.category}</span></td>
      <td>${risk.department}</td>
      <td>${risk.owner}</td>
      <td>${risk.likelihood}</td>
      <td>${risk.impact}</td>
      <td><span class="risk-score">${risk.inherentRisk}</span></td>
      <td>${risk.controlEffectiveness}%</td>
      <td><span class="risk-score">${risk.residualRisk.toFixed(1)}</span></td>
      <td><span class="status-${risk.status.toLowerCase()}">${risk.status}</span></td>
    `;
    return row;
  }

  updateRiskRow(row, risk) {
    // Update specific cells that might have changed
    row.querySelector('td:nth-child(6)').textContent = risk.likelihood;
    row.querySelector('td:nth-child(7)').textContent = risk.impact;
    row.querySelector('td:nth-child(8) .risk-score').textContent = risk.inherentRisk;
    row.querySelector('td:nth-child(9)').textContent = risk.controlEffectiveness + '%';
    row.querySelector('td:nth-child(10) .risk-score').textContent = risk.residualRisk.toFixed(1);
    row.querySelector('td:nth-child(11) span').textContent = risk.status;
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.connected = false;
      this.subscriptions.clear();
      console.log('🔌 Disconnected from WebSocket server');
    }
  }
}

// Initialize and export
const riskWebSocket = new RiskWebSocketClient();

// Auto-connect if on a page that needs real-time updates
if (typeof window !== 'undefined') {
  window.riskWebSocket = riskWebSocket;
  
  // Auto-connect on dashboard or risk pages
  if (window.location.pathname.includes('dashboard') || 
      window.location.pathname.includes('risk')) {
    document.addEventListener('DOMContentLoaded', () => {
      riskWebSocket.connect()
        .then(() => {
          // Subscribe to relevant rooms based on current page
          if (window.location.pathname.includes('dashboard')) {
            riskWebSocket.subscribe('dashboard');
          }
          if (window.location.pathname.includes('risk-register')) {
            riskWebSocket.subscribe('riskRegister');
          }
          if (window.location.pathname.includes('risk-analytics')) {
            riskWebSocket.subscribe('riskMatrix');
          }
          if (window.location.pathname.includes('kri')) {
            riskWebSocket.subscribe('kri');
          }
        })
        .catch(error => {
          console.error('Failed to connect to WebSocket:', error);
        });
    });
  }
}