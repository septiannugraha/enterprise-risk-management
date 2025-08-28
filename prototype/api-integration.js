/**
 * API Integration Module
 * Demonstrates how the frontend can connect to the backend API
 */

const API_BASE_URL = 'http://localhost:3001/api';

// API Client
class ERMApiClient {
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Helper method for API calls
  async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request Failed:', error);
      throw error;
    }
  }

  // Dashboard methods
  async getDashboardSummary() {
    return this.request('/dashboard/summary');
  }

  // Risk management methods
  async getRisks(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/risks?${params}`);
  }

  async getRisk(id) {
    return this.request(`/risks/${id}`);
  }

  async createRisk(riskData) {
    return this.request('/risks', {
      method: 'POST',
      body: JSON.stringify(riskData),
    });
  }

  async updateRisk(id, riskData) {
    return this.request(`/risks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(riskData),
    });
  }

  async deleteRisk(id) {
    return this.request(`/risks/${id}`, {
      method: 'DELETE',
    });
  }

  // KPI methods
  async getKPIs() {
    return this.request('/kpis');
  }

  async updateKPI(id, kpiData) {
    return this.request(`/kpis/${id}`, {
      method: 'PUT',
      body: JSON.stringify(kpiData),
    });
  }

  // KRI methods
  async getKRIs() {
    return this.request('/kris');
  }

  async updateKRI(id, kriData) {
    return this.request(`/kris/${id}`, {
      method: 'PUT',
      body: JSON.stringify(kriData),
    });
  }

  // Analytics methods
  async getRiskMatrix() {
    return this.request('/analytics/risk-matrix');
  }

  async getDepartmentDistribution() {
    return this.request('/analytics/department-distribution');
  }

  // Reports
  async getExecutiveSummary() {
    return this.request('/reports/executive-summary');
  }
}

// Example usage in the application
const ermApi = new ERMApiClient();

// Dashboard integration example
async function loadDashboard() {
  try {
    const summary = await ermApi.getDashboardSummary();
    
    // Update UI with data
    document.getElementById('total-risks').textContent = summary.totalRisks;
    document.getElementById('high-risks').textContent = summary.highRisks;
    document.getElementById('medium-risks').textContent = summary.mediumRisks;
    document.getElementById('low-risks').textContent = summary.lowRisks;
    
    // Update KPI status
    updateKPIStatus(summary.kpiStatus);
    
    // Update KRI alerts
    updateKRIAlerts(summary.kriStatus);
    
  } catch (error) {
    console.error('Failed to load dashboard:', error);
    showNotification('Failed to load dashboard data', 'error');
  }
}

// Risk Register integration
async function loadRiskRegister(department = null) {
  try {
    const filters = department ? { department } : {};
    const risks = await ermApi.getRisks(filters);
    
    const tableBody = document.querySelector('#risk-table tbody');
    tableBody.innerHTML = '';
    
    risks.forEach(risk => {
      const row = createRiskRow(risk);
      tableBody.appendChild(row);
    });
    
  } catch (error) {
    console.error('Failed to load risks:', error);
    showNotification('Failed to load risk register', 'error');
  }
}

// Create new risk
async function submitNewRisk(formData) {
  try {
    const newRisk = await ermApi.createRisk({
      title: formData.get('title'),
      category: formData.get('category'),
      department: formData.get('department'),
      likelihood: parseInt(formData.get('likelihood')),
      impact: parseInt(formData.get('impact')),
      controlEffectiveness: parseInt(formData.get('controlEffectiveness')),
      status: formData.get('status'),
      owner: formData.get('owner'),
      description: formData.get('description'),
      mitigations: formData.get('mitigations').split(',').map(m => m.trim())
    });
    
    showNotification('Risk created successfully', 'success');
    await loadRiskRegister();
    return newRisk;
    
  } catch (error) {
    console.error('Failed to create risk:', error);
    showNotification('Failed to create risk', 'error');
    throw error;
  }
}

// Update existing risk
async function updateRiskStatus(riskId, newStatus) {
  try {
    const updatedRisk = await ermApi.updateRisk(riskId, { status: newStatus });
    showNotification('Risk status updated', 'success');
    return updatedRisk;
    
  } catch (error) {
    console.error('Failed to update risk:', error);
    showNotification('Failed to update risk status', 'error');
    throw error;
  }
}

// Load and render risk matrix
async function loadRiskMatrix() {
  try {
    const matrixData = await ermApi.getRiskMatrix();
    renderRiskMatrix(matrixData);
    
  } catch (error) {
    console.error('Failed to load risk matrix:', error);
    showNotification('Failed to load risk matrix', 'error');
  }
}

// Helper functions
function createRiskRow(risk) {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${risk.id}</td>
    <td>${risk.title}</td>
    <td><span class="badge ${getCategoryClass(risk.category)}">${risk.category}</span></td>
    <td>${risk.department}</td>
    <td>${risk.owner}</td>
    <td>${risk.likelihood}</td>
    <td>${risk.impact}</td>
    <td><span class="risk-score ${getRiskLevelClass(risk.inherentRisk)}">${risk.inherentRisk}</span></td>
    <td>${risk.controlEffectiveness}%</td>
    <td><span class="risk-score ${getRiskLevelClass(risk.residualRisk)}">${risk.residualRisk.toFixed(1)}</span></td>
    <td><span class="status-badge ${getStatusClass(risk.status)}">${risk.status}</span></td>
    <td>
      <button onclick="viewRisk('${risk.id}')" class="btn-action">View</button>
      <button onclick="editRisk('${risk.id}')" class="btn-action">Edit</button>
    </td>
  `;
  return row;
}

function getCategoryClass(category) {
  const classes = {
    'Operational': 'badge-operational',
    'Financial': 'badge-financial',
    'Compliance': 'badge-compliance',
    'Strategic': 'badge-strategic'
  };
  return classes[category] || 'badge-default';
}

function getRiskLevelClass(score) {
  if (score >= 15) return 'risk-high';
  if (score >= 7) return 'risk-medium';
  return 'risk-low';
}

function getStatusClass(status) {
  const classes = {
    'Active': 'status-active',
    'Monitored': 'status-monitored',
    'Controlled': 'status-controlled',
    'Closed': 'status-closed'
  };
  return classes[status] || 'status-default';
}

function showNotification(message, type = 'info') {
  // Implement notification display
  console.log(`[${type.toUpperCase()}] ${message}`);
}

// Initialize API integration when document loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAPI);
} else {
  initializeAPI();
}

function initializeAPI() {
  // Check if backend is available
  ermApi.request('/health')
    .then(() => {
      console.log('Backend API connected successfully');
      // Load initial data if on dashboard
      if (window.location.pathname === '/' || window.location.pathname.includes('index.html')) {
        loadDashboard();
      }
    })
    .catch(() => {
      console.log('Backend API not available - running in static mode');
    });
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ERMApiClient, ermApi };
}