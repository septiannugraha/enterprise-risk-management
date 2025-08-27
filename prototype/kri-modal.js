// KRI Modal Component for detailed views

// Create modal HTML structure
function createKRIModal() {
    const modalHTML = `
        <div id="kriModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="modalTitle">KRI Details</h2>
                    <span class="close">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="modal-section">
                        <h3>Overview</h3>
                        <div class="detail-grid">
                            <div class="detail-item">
                                <label>Code:</label>
                                <span id="modalCode"></span>
                            </div>
                            <div class="detail-item">
                                <label>Perspective:</label>
                                <span id="modalPerspective"></span>
                            </div>
                            <div class="detail-item">
                                <label>Owner:</label>
                                <span id="modalOwner"></span>
                            </div>
                            <div class="detail-item">
                                <label>Frequency:</label>
                                <span id="modalFrequency"></span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-section">
                        <h3>Strategic Alignment</h3>
                        <p id="modalObjective"></p>
                        <p id="modalDescription"></p>
                    </div>
                    
                    <div class="modal-section">
                        <h3>Performance Metrics</h3>
                        <div class="metrics-grid">
                            <div class="metric-card">
                                <h4>Current Value</h4>
                                <div class="metric-value" id="modalCurrent"></div>
                            </div>
                            <div class="metric-card">
                                <h4>Target Value</h4>
                                <div class="metric-value" id="modalTarget"></div>
                            </div>
                            <div class="metric-card">
                                <h4>Risk Status</h4>
                                <div class="metric-value" id="modalStatus"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-section">
                        <h3>Thresholds</h3>
                        <div class="threshold-display">
                            <div class="threshold-item green">
                                <span class="threshold-label">Green (Low Risk):</span>
                                <span id="modalThresholdGreen"></span>
                            </div>
                            <div class="threshold-item yellow">
                                <span class="threshold-label">Yellow (Medium Risk):</span>
                                <span id="modalThresholdYellow"></span>
                            </div>
                            <div class="threshold-item red">
                                <span class="threshold-label">Red (High Risk):</span>
                                <span id="modalThresholdRed"></span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-section">
                        <h3>Historical Trend</h3>
                        <div class="chart-container-modal">
                            <canvas id="modalTrendChart"></canvas>
                        </div>
                    </div>
                    
                    <div class="modal-section">
                        <h3>Actions</h3>
                        <div class="action-buttons">
                            <button class="btn-primary" onclick="editThresholds()">
                                <i class="fas fa-edit"></i> Edit Thresholds
                            </button>
                            <button class="btn-primary" onclick="viewRelatedRisks()">
                                <i class="fas fa-link"></i> View Related Risks
                            </button>
                            <button class="btn-primary" onclick="exportKRIData()">
                                <i class="fas fa-download"></i> Export Data
                            </button>
                            <button class="btn-secondary" onclick="printKRIReport()">
                                <i class="fas fa-print"></i> Print Report
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles
    const modalStyles = `
        <style>
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0,0,0,0.5);
            animation: fadeIn 0.3s;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .modal-content {
            background-color: #fefefe;
            margin: 2% auto;
            padding: 0;
            border-radius: 12px;
            width: 90%;
            max-width: 800px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            animation: slideIn 0.3s;
        }
        
        @keyframes slideIn {
            from { transform: translateY(-50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        .modal-header {
            padding: 1.5rem;
            border-bottom: 1px solid #e5e7eb;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #f9fafb;
            border-radius: 12px 12px 0 0;
        }
        
        .modal-header h2 {
            margin: 0;
            color: #1f2937;
            font-size: 1.5rem;
        }
        
        .close {
            color: #6b7280;
            font-size: 2rem;
            font-weight: 300;
            cursor: pointer;
            line-height: 1;
            transition: color 0.2s;
        }
        
        .close:hover {
            color: #1f2937;
        }
        
        .modal-body {
            padding: 2rem;
            max-height: 80vh;
            overflow-y: auto;
        }
        
        .modal-section {
            margin-bottom: 2rem;
        }
        
        .modal-section:last-child {
            margin-bottom: 0;
        }
        
        .modal-section h3 {
            margin: 0 0 1rem 0;
            color: #1f2937;
            font-size: 1.125rem;
            font-weight: 600;
        }
        
        .detail-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
        }
        
        .detail-item {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
        }
        
        .detail-item label {
            font-size: 0.875rem;
            color: #6b7280;
            font-weight: 500;
        }
        
        .detail-item span {
            font-size: 1rem;
            color: #1f2937;
            font-weight: 600;
        }
        
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
        }
        
        .metric-card {
            background: #f3f4f6;
            padding: 1.5rem;
            border-radius: 8px;
            text-align: center;
        }
        
        .metric-card h4 {
            margin: 0 0 0.5rem 0;
            font-size: 0.875rem;
            color: #6b7280;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        
        .metric-value {
            font-size: 2rem;
            font-weight: 700;
            color: #1f2937;
        }
        
        .threshold-display {
            background: #f9fafb;
            padding: 1rem;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }
        
        .threshold-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            font-weight: 500;
        }
        
        .threshold-item.green {
            background: rgba(16, 185, 129, 0.1);
            color: #059669;
        }
        
        .threshold-item.yellow {
            background: rgba(245, 158, 11, 0.1);
            color: #d97706;
        }
        
        .threshold-item.red {
            background: rgba(239, 68, 68, 0.1);
            color: #dc2626;
        }
        
        .chart-container-modal {
            position: relative;
            height: 300px;
            margin-top: 1rem;
        }
        
        .action-buttons {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
        }
        
        .btn-primary, .btn-secondary {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 6px;
            font-size: 0.875rem;
            cursor: pointer;
            transition: all 0.2s;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 500;
        }
        
        .btn-primary {
            background: #3b82f6;
            color: white;
        }
        
        .btn-primary:hover {
            background: #2563eb;
            transform: translateY(-1px);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .btn-secondary {
            background: white;
            color: #6b7280;
            border: 1px solid #e5e7eb;
        }
        
        .btn-secondary:hover {
            background: #f9fafb;
            color: #1f2937;
        }
        </style>
    `;
    
    // Add to page
    document.body.insertAdjacentHTML('beforeend', modalStyles + modalHTML);
}

// Show modal with KRI data
function showKRIModal(kriData) {
    const modal = document.getElementById('kriModal');
    
    // Populate modal data
    document.getElementById('modalTitle').textContent = kriData.name;
    document.getElementById('modalCode').textContent = kriData.code;
    document.getElementById('modalPerspective').innerHTML = `<span class="perspective-badge ${kriData.perspective}">${kriData.perspective.toUpperCase()}</span>`;
    document.getElementById('modalOwner').textContent = kriData.owner;
    document.getElementById('modalFrequency').textContent = kriData.frequency;
    document.getElementById('modalObjective').innerHTML = `<strong>Strategic Objective:</strong> ${kriData.strategic_objective}`;
    document.getElementById('modalDescription').innerHTML = `<strong>Description:</strong> ${kriData.description}`;
    
    // Metrics
    document.getElementById('modalCurrent').textContent = `${kriData.current_value}${kriData.unit}`;
    document.getElementById('modalTarget').textContent = `${getTargetOperator(kriData)}${kriData.target_value}${kriData.unit}`;
    
    const status = getKRIStatus(kriData);
    const statusLabel = getStatusLabel(status);
    document.getElementById('modalStatus').innerHTML = `<span class="status-label ${status}">${statusLabel}</span>`;
    
    // Thresholds
    const operator = getTargetOperator(kriData);
    document.getElementById('modalThresholdGreen').textContent = `${operator}${kriData.threshold_green}${kriData.unit}`;
    document.getElementById('modalThresholdYellow').textContent = `${operator === '≥' ? '≥' : '≤'}${kriData.threshold_yellow}${kriData.unit}`;
    document.getElementById('modalThresholdRed').textContent = `${operator === '≥' ? '<' : '>'}${kriData.threshold_red}${kriData.unit}`;
    
    // Create trend chart
    createModalTrendChart(kriData);
    
    // Show modal
    modal.style.display = 'block';
    
    // Store current KRI for actions
    window.currentModalKRI = kriData;
}

// Create trend chart in modal
function createModalTrendChart(kriData) {
    const ctx = document.getElementById('modalTrendChart').getContext('2d');
    
    if (window.modalChart) {
        window.modalChart.destroy();
    }
    
    window.modalChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: kriData.trend_labels || ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'],
            datasets: [{
                label: kriData.name,
                data: kriData.trend,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }, {
                label: 'Target',
                data: new Array(kriData.trend.length).fill(kriData.target_value),
                borderColor: '#10b981',
                borderDash: [5, 5],
                borderWidth: 2,
                fill: false,
                pointRadius: 0
            }, {
                label: 'Risk Threshold',
                data: new Array(kriData.trend.length).fill(kriData.threshold_yellow),
                borderColor: '#f59e0b',
                borderDash: [5, 5],
                borderWidth: 2,
                fill: false,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: `Value (${kriData.unit})`
                    }
                }
            }
        }
    });
}

// Modal actions
function editThresholds() {
    alert('Threshold editing would open a form to adjust green/yellow/red thresholds for: ' + window.currentModalKRI.name);
}

function viewRelatedRisks() {
    alert('Would navigate to Risk Register filtered by KRI: ' + window.currentModalKRI.code);
}

function exportKRIData() {
    alert('Would export historical data for: ' + window.currentModalKRI.name);
}

function printKRIReport() {
    window.print();
}

// Initialize modal on page load
document.addEventListener('DOMContentLoaded', function() {
    createKRIModal();
    
    // Close modal handlers
    document.querySelector('.close').addEventListener('click', function() {
        document.getElementById('kriModal').style.display = 'none';
    });
    
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('kriModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Update viewDetails to use modal
window.viewDetails = function(kriId) {
    const kri = kriData.find(k => k.id === kriId);
    if (kri) {
        showKRIModal(kri);
    }
};