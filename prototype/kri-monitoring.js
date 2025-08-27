// KRI Monitoring Dashboard JavaScript
// Data structure for KRIs with realistic data for Enterprise

const kriData = [
    // Financial Perspective KRIs
    {
        id: 'R.F1.1',
        code: 'R.F1.1',
        name: 'Revenue Growth Rate',
        perspective: 'financial',
        department: 'finance',
        strategic_objective: 'Increase Shareholders Value',
        description: 'Percentage growth in revenue compared to previous period',
        frequency: 'Monthly',
        unit: '%',
        current_value: 8.5,
        target_value: 10,
        threshold_green: 10,
        threshold_yellow: 7,
        threshold_red: 5,
        trend: [12, 11, 10, 9, 8.5, 8.5],
        trend_labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        owner: 'CFO',
        last_updated: '2025-07-15'
    },
    {
        id: 'R.F3.1',
        code: 'R.F3.1',
        name: 'Cost-to-Income Ratio',
        perspective: 'financial',
        department: 'finance',
        strategic_objective: 'Optimize Operating Expenses',
        description: 'Total operating costs as percentage of income',
        frequency: 'Quarterly',
        unit: '%',
        current_value: 72,
        target_value: 85,
        threshold_green: 85,
        threshold_yellow: 90,
        threshold_red: 95,
        trend: [78, 76, 74, 73, 72, 72],
        owner: 'CFO'
    },
    {
        id: 'R.F2.3',
        code: 'R.F2.3',
        name: 'Bad Debt Ratio',
        perspective: 'financial',
        department: 'finance',
        strategic_objective: 'Manage Credit Risk',
        description: 'Non-performing loans as percentage of total loans',
        frequency: 'Monthly',
        unit: '%',
        current_value: 5.8,
        target_value: 3,
        threshold_green: 3,
        threshold_yellow: 4.5,
        threshold_red: 5,
        trend: [4.2, 4.5, 4.8, 5.2, 5.5, 5.8],
        owner: 'Chief Risk Officer'
    },
    
    // Customer Perspective KRIs
    {
        id: 'R.C1.1',
        code: 'R.C1.1',
        name: 'Customer Satisfaction Score',
        perspective: 'customer',
        department: 'operations',
        strategic_objective: 'Enhance Customer Experience',
        description: 'Average satisfaction score from customer surveys',
        frequency: 'Monthly',
        unit: '/5',
        current_value: 3.2,
        target_value: 4.5,
        threshold_green: 4.5,
        threshold_yellow: 4.0,
        threshold_red: 3.5,
        trend: [4.1, 3.9, 3.7, 3.5, 3.3, 3.2],
        owner: 'CMO'
    },
    {
        id: 'R.C2.1',
        code: 'R.C2.1',
        name: 'Client Retention Rate',
        perspective: 'customer',
        department: 'operations',
        strategic_objective: 'Build Long-term Relationships',
        description: 'Percentage of clients retained year-over-year',
        frequency: 'Quarterly',
        unit: '%',
        current_value: 92,
        target_value: 95,
        threshold_green: 95,
        threshold_yellow: 90,
        threshold_red: 85,
        trend: [94, 93, 93, 92, 92, 92],
        owner: 'Head of Client Services'
    },
    
    // Internal Business Process KRIs
    {
        id: 'R.IBP1.1',
        code: 'R.IBP1.1',
        name: 'System Downtime Hours',
        perspective: 'process',
        department: 'it',
        strategic_objective: 'Ensure Business Continuity',
        description: 'Total hours of unplanned system downtime',
        frequency: 'Weekly',
        unit: 'hours',
        current_value: 0.5,
        target_value: 2,
        threshold_green: 2,
        threshold_yellow: 4,
        threshold_red: 8,
        trend: [2.0, 1.5, 1.0, 0.8, 0.5, 0.5],
        owner: 'CTO'
    },
    {
        id: 'R.IBP2.1',
        code: 'R.IBP2.1',
        name: 'Report Delivery Time',
        perspective: 'process',
        department: 'operations',
        strategic_objective: 'Improve Operational Efficiency',
        description: 'Average time to deliver credit rating reports',
        frequency: 'Weekly',
        unit: 'days',
        current_value: 5.2,
        target_value: 3,
        threshold_green: 3,
        threshold_yellow: 5,
        threshold_red: 7,
        trend: [7, 6.5, 6, 5.5, 5.2, 5.2],
        owner: 'Head of Operations'
    },
    
    // Learning & Growth KRIs
    {
        id: 'R.LG1.2',
        code: 'R.LG1.2',
        name: 'Employee Turnover Rate',
        perspective: 'learning',
        department: 'hr',
        strategic_objective: 'Retain Top Talent',
        description: 'Annual employee turnover percentage',
        frequency: 'Quarterly',
        unit: '%',
        current_value: 15,
        target_value: 10,
        threshold_green: 10,
        threshold_yellow: 12,
        threshold_red: 15,
        trend: [12, 13, 13, 14, 14, 15],
        owner: 'CHRO'
    },
    {
        id: 'R.LG2.1',
        code: 'R.LG2.1',
        name: 'Training Hours per Employee',
        perspective: 'learning',
        department: 'hr',
        strategic_objective: 'Develop Employee Capabilities',
        description: 'Average training hours completed per employee',
        frequency: 'Monthly',
        unit: 'hours',
        current_value: 3.5,
        target_value: 8,
        threshold_green: 8,
        threshold_yellow: 6,
        threshold_red: 4,
        trend: [2, 2.5, 3, 3.2, 3.5, 3.5],
        owner: 'Head of L&D'
    }
];

// State management
let filteredKRIs = [...kriData];
let selectedKRI = kriData[0];
let selectedPeriod = '3M';

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    renderKRICards();
    updateSummaryCards();
    setupEventListeners();
    updateTrendChart(selectedKRI, selectedPeriod);
});

// Render KRI cards
function renderKRICards() {
    const kriGrid = document.querySelector('.kri-grid');
    kriGrid.innerHTML = '';
    
    filteredKRIs.forEach(kri => {
        const card = createKRICard(kri);
        kriGrid.appendChild(card);
    });
}

// Create individual KRI card
function createKRICard(kri) {
    const status = getKRIStatus(kri);
    const card = document.createElement('div');
    card.className = 'kri-card';
    card.dataset.kriId = kri.id;
    
    card.innerHTML = `
        <div class="kri-header">
            <h3>${kri.name}</h3>
            <div class="kri-meta">
                <span class="kri-code">${kri.code}</span>
                <span class="perspective-badge ${kri.perspective}">${kri.perspective.toUpperCase()}</span>
                <span>${kri.frequency}</span>
            </div>
        </div>
        <div class="kri-status">
            <div class="traffic-light">
                <div class="light green ${status === 'green' ? 'active' : ''}"></div>
                <div class="light yellow ${status === 'yellow' ? 'active' : ''}"></div>
                <div class="light red ${status === 'red' ? 'active' : ''}"></div>
            </div>
            <div class="status-label ${status}">${getStatusLabel(status)}</div>
        </div>
        <div class="kri-values">
            <div class="value-item">
                <div class="value-label">Current</div>
                <div class="value-number">${kri.current_value}${kri.unit}</div>
            </div>
            <div class="value-item">
                <div class="value-label">Target</div>
                <div class="value-number">${getTargetOperator(kri)}${kri.target_value}${kri.unit}</div>
            </div>
        </div>
        <div class="kri-actions">
            <button class="btn-sm btn-primary" onclick="viewTrend('${kri.id}')">
                <i class="fas fa-chart-line"></i> View Trend
            </button>
            <button class="btn-sm btn-secondary" onclick="viewDetails('${kri.id}')">
                <i class="fas fa-info-circle"></i> Details
            </button>
        </div>
    `;
    
    return card;
}

// Get KRI status based on thresholds
function getKRIStatus(kri) {
    const value = kri.current_value;
    
    // For metrics where higher is better (e.g., Revenue Growth, Customer Satisfaction)
    if (kri.threshold_green >= kri.threshold_red) {
        if (value >= kri.threshold_green) return 'green';
        if (value >= kri.threshold_yellow) return 'yellow';
        return 'red';
    }
    // For metrics where lower is better (e.g., Cost Ratio, Downtime)
    else {
        if (value <= kri.threshold_green) return 'green';
        if (value <= kri.threshold_yellow) return 'yellow';
        return 'red';
    }
}

// Get status label
function getStatusLabel(status) {
    switch(status) {
        case 'green': return 'LOW RISK';
        case 'yellow': return 'MEDIUM RISK';
        case 'red': return 'HIGH RISK';
        default: return 'UNKNOWN';
    }
}

// Get target operator
function getTargetOperator(kri) {
    return kri.threshold_green >= kri.threshold_red ? '≥' : '≤';
}

// Update summary cards
function updateSummaryCards() {
    const counts = {
        total: filteredKRIs.length,
        high: 0,
        medium: 0,
        low: 0
    };
    
    filteredKRIs.forEach(kri => {
        const status = getKRIStatus(kri);
        switch(status) {
            case 'red': counts.high++; break;
            case 'yellow': counts.medium++; break;
            case 'green': counts.low++; break;
        }
    });
    
    document.querySelector('.summary-card.total h3').textContent = counts.total;
    document.querySelector('.summary-card.high h3').textContent = counts.high;
    document.querySelector('.summary-card.medium h3').textContent = counts.medium;
    document.querySelector('.summary-card.low h3').textContent = counts.low;
}

// Setup event listeners
function setupEventListeners() {
    // Filter listeners
    document.getElementById('perspectiveFilter').addEventListener('change', filterKRIs);
    document.getElementById('riskLevelFilter').addEventListener('change', filterKRIs);
    document.getElementById('departmentFilter').addEventListener('change', filterKRIs);
    document.querySelector('input[placeholder="Search KRI..."]').addEventListener('input', filterKRIs);
    
    // Trend chart KRI selector
    const kriSelector = document.querySelector('.trend-filters select');
    kriData.forEach(kri => {
        const option = document.createElement('option');
        option.value = kri.id;
        option.textContent = kri.name;
        kriSelector.appendChild(option);
    });
    kriSelector.addEventListener('change', function() {
        selectedKRI = kriData.find(k => k.id === this.value) || kriData[0];
        updateTrendChart(selectedKRI, selectedPeriod);
    });
    
    // Period buttons
    document.querySelectorAll('.btn-group button').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.btn-group button').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            selectedPeriod = this.textContent;
            updateTrendChart(selectedKRI, selectedPeriod);
        });
    });
}

// Filter KRIs
function filterKRIs() {
    const perspectiveFilter = document.getElementById('perspectiveFilter').value;
    const riskLevelFilter = document.getElementById('riskLevelFilter').value;
    const departmentFilter = document.getElementById('departmentFilter').value;
    const searchTerm = document.querySelector('input[placeholder="Search KRI..."]').value.toLowerCase();
    
    filteredKRIs = kriData.filter(kri => {
        // Perspective filter
        if (perspectiveFilter && kri.perspective !== perspectiveFilter) return false;
        
        // Risk level filter
        if (riskLevelFilter) {
            const status = getKRIStatus(kri);
            if (riskLevelFilter === 'high' && status !== 'red') return false;
            if (riskLevelFilter === 'medium' && status !== 'yellow') return false;
            if (riskLevelFilter === 'low' && status !== 'green') return false;
        }
        
        // Department filter
        if (departmentFilter && kri.department !== departmentFilter) return false;
        
        // Search filter
        if (searchTerm) {
            const searchableText = `${kri.name} ${kri.code} ${kri.description}`.toLowerCase();
            if (!searchableText.includes(searchTerm)) return false;
        }
        
        return true;
    });
    
    renderKRICards();
    updateSummaryCards();
}

// View trend function
function viewTrend(kriId) {
    const kri = kriData.find(k => k.id === kriId);
    if (kri) {
        selectedKRI = kri;
        document.querySelector('.trend-filters select').value = kriId;
        updateTrendChart(kri, selectedPeriod);
        document.querySelector('.trend-section').scrollIntoView({ behavior: 'smooth' });
    }
}

// View details function
function viewDetails(kriId) {
    const kri = kriData.find(k => k.id === kriId);
    if (kri) {
        alert(`KRI Details:\n\nName: ${kri.name}\nCode: ${kri.code}\nOwner: ${kri.owner}\nObjective: ${kri.strategic_objective}\nDescription: ${kri.description}\n\nCurrent: ${kri.current_value}${kri.unit}\nTarget: ${getTargetOperator(kri)}${kri.target_value}${kri.unit}\n\nLast Updated: ${kri.last_updated || 'N/A'}`);
    }
}

// Update trend chart
function updateTrendChart(kri, period) {
    if (!window.kriTrendChart) return;
    
    // Generate data based on period
    let labels, data;
    switch(period) {
        case '1M':
            labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
            data = kri.trend.slice(-4);
            break;
        case '3M':
            labels = kri.trend_labels || ['Month 1', 'Month 2', 'Month 3'];
            data = kri.trend.slice(-3);
            break;
        case '6M':
            labels = kri.trend_labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
            data = kri.trend;
            break;
        case '1Y':
            labels = ['Q1', 'Q2', 'Q3', 'Q4'];
            data = [kri.trend[0], kri.trend[2], kri.trend[4], kri.trend[5]];
            break;
        default:
            labels = kri.trend_labels;
            data = kri.trend;
    }
    
    // Update chart
    window.kriTrendChart.data.labels = labels;
    window.kriTrendChart.data.datasets[0].data = data;
    window.kriTrendChart.data.datasets[0].label = kri.name;
    
    // Update target and threshold lines
    const targetData = new Array(labels.length).fill(kri.target_value);
    const thresholdData = new Array(labels.length).fill(kri.threshold_yellow);
    
    window.kriTrendChart.data.datasets[1].data = targetData;
    window.kriTrendChart.data.datasets[2].data = thresholdData;
    
    // Update y-axis label
    window.kriTrendChart.options.scales.y.title.text = `Value (${kri.unit})`;
    
    window.kriTrendChart.update();
}

// Export functions for global use
window.viewTrend = viewTrend;
window.viewDetails = viewDetails;
window.updateChartPeriod = function(period) {
    updateTrendChart(selectedKRI, period);
};