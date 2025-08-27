// Reports Module JavaScript

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    animateTemplateCards();
    initializeSearch();
});

// Animate template cards on load
function animateTemplateCards() {
    const cards = document.querySelectorAll('.template-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Generate Report Function
function generateReport(type) {
    // Show loading state
    const loadingModal = createLoadingModal(type);
    document.body.appendChild(loadingModal);
    
    // Simulate report generation
    const reportGenerators = {
        'executive-summary': generateExecutiveSummary,
        'risk-register': generateRiskRegister,
        'kri-performance': generateKRIPerformance,
        'monthly-profile': generateMonthlyProfile,
        'compliance': generateComplianceReport
    };
    
    setTimeout(() => {
        // Remove loading modal
        loadingModal.remove();
        
        // Show success notification
        showNotification(`${getReportName(type)} generated successfully!`, 'success');
        
        // Add to recent reports
        addToRecentReports(type);
        
        // Trigger download
        if (reportGenerators[type]) {
            reportGenerators[type]();
        }
    }, 2000 + Math.random() * 2000); // Random time between 2-4 seconds
}

// Create loading modal
function createLoadingModal(reportType) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    `;
    
    modal.innerHTML = `
        <div class="loading-card" style="min-width: 400px;">
            <div class="loading-spinner"></div>
            <h3 style="margin: 1rem 0 0.5rem 0; color: #1f2937;">Generating Report</h3>
            <p style="margin: 0;">Preparing your ${getReportName(reportType)}...</p>
            <div style="margin-top: 2rem; display: flex; flex-direction: column; gap: 0.5rem; text-align: left;">
                <div class="progress-step" id="step1">
                    <i class="fas fa-circle-notch fa-spin" style="margin-right: 0.5rem;"></i>
                    Collecting data...
                </div>
                <div class="progress-step" id="step2" style="color: #9ca3af;">
                    <i class="fas fa-circle" style="margin-right: 0.5rem;"></i>
                    Processing analytics...
                </div>
                <div class="progress-step" id="step3" style="color: #9ca3af;">
                    <i class="fas fa-circle" style="margin-right: 0.5rem;"></i>
                    Generating visualizations...
                </div>
                <div class="progress-step" id="step4" style="color: #9ca3af;">
                    <i class="fas fa-circle" style="margin-right: 0.5rem;"></i>
                    Finalizing document...
                </div>
            </div>
        </div>
    `;
    
    // Animate progress steps
    setTimeout(() => completeStep('step1', 'step2'), 500);
    setTimeout(() => completeStep('step2', 'step3'), 1000);
    setTimeout(() => completeStep('step3', 'step4'), 1500);
    
    return modal;
}

// Complete progress step
function completeStep(currentId, nextId) {
    const current = document.getElementById(currentId);
    const next = document.getElementById(nextId);
    
    if (current) {
        current.innerHTML = '<i class="fas fa-check-circle" style="margin-right: 0.5rem; color: #10b981;"></i>' + 
                          current.textContent;
        current.style.color = '#10b981';
    }
    
    if (next) {
        next.innerHTML = '<i class="fas fa-circle-notch fa-spin" style="margin-right: 0.5rem;"></i>' + 
                        next.textContent;
        next.style.color = '#1f2937';
    }
}

// Get report name
function getReportName(type) {
    const names = {
        'executive-summary': 'Executive Summary',
        'risk-register': 'Risk Register Export',
        'kri-performance': 'KRI Performance Report',
        'monthly-profile': 'Monthly Risk Profile',
        'compliance': 'Compliance Report'
    };
    return names[type] || 'Report';
}

// Report generators (simulated)
function generateExecutiveSummary() {
    const data = {
        title: 'Executive Risk Summary - Q1 2025',
        totalRisks: 156,
        criticalRisks: 23,
        mitigationRate: '89%',
        topRisks: [
            'Credit concentration in manufacturing sector',
            'Customer satisfaction declining trend',
            'Cybersecurity vulnerabilities'
        ]
    };
    
    console.log('Executive Summary Data:', data);
    downloadFile('Executive_Summary_Q1_2025.pdf', 'application/pdf');
}

function generateRiskRegister() {
    console.log('Generating Risk Register Excel...');
    downloadFile('Risk_Register_Export_' + formatDate(new Date()) + '.xlsx', 
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
}

function generateKRIPerformance() {
    console.log('Generating KRI Performance Report...');
    downloadFile('KRI_Performance_Report_' + formatDate(new Date()) + '.pdf', 'application/pdf');
}

function generateMonthlyProfile() {
    console.log('Generating Monthly Profile Presentation...');
    downloadFile('Monthly_Risk_Profile_' + formatMonth(new Date()) + '.pptx', 
                'application/vnd.openxmlformats-officedocument.presentationml.presentation');
}

function generateComplianceReport() {
    console.log('Generating Compliance Report...');
    downloadFile('Compliance_Report_' + formatDate(new Date()) + '.docx', 
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
}

// Simulate file download
function downloadFile(filename, mimeType) {
    // Create a dummy blob
    const content = 'This is a sample report content';
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}

// Add to recent reports
function addToRecentReports(type) {
    const tbody = document.querySelector('.reports-table tbody');
    const newRow = document.createElement('tr');
    
    const reportIcons = {
        'executive-summary': 'fa-file-pdf',
        'risk-register': 'fa-file-excel',
        'kri-performance': 'fa-file-pdf',
        'monthly-profile': 'fa-file-powerpoint',
        'compliance': 'fa-file-word'
    };
    
    const reportColors = {
        'executive-summary': '#dc2626',
        'risk-register': '#059669',
        'kri-performance': '#dc2626',
        'monthly-profile': '#d97706',
        'compliance': '#1e40af'
    };
    
    newRow.innerHTML = `
        <td>
            <div class="report-name">
                <i class="fas ${reportIcons[type]}" style="color: ${reportColors[type]};"></i>
                ${getReportName(type)} - ${formatDate(new Date())}
            </div>
        </td>
        <td><span class="report-type ${getReportTypeClass(type)}">${getReportTypeLabel(type)}</span></td>
        <td>Current User</td>
        <td>${formatDateTime(new Date())}</td>
        <td>${Math.floor(Math.random() * 5 + 1)}.${Math.floor(Math.random() * 9)} MB</td>
        <td>
            <div class="action-buttons">
                <button class="btn-icon" title="Download" onclick="downloadReport(this)">
                    <i class="fas fa-download"></i>
                </button>
                <button class="btn-icon" title="View" onclick="viewReport(this)">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-icon" title="Share" onclick="shareReport(this)">
                    <i class="fas fa-share"></i>
                </button>
                <button class="btn-icon" title="Delete" onclick="deleteReport(this)">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;
    
    // Add animation
    newRow.style.opacity = '0';
    newRow.style.transform = 'translateX(-20px)';
    tbody.insertBefore(newRow, tbody.firstChild);
    
    setTimeout(() => {
        newRow.style.transition = 'all 0.5s ease';
        newRow.style.opacity = '1';
        newRow.style.transform = 'translateX(0)';
    }, 100);
}

// Helper functions
function getReportTypeClass(type) {
    const classes = {
        'executive-summary': 'executive',
        'risk-register': 'detailed',
        'kri-performance': 'kri',
        'monthly-profile': 'executive',
        'compliance': 'compliance'
    };
    return classes[type] || 'detailed';
}

function getReportTypeLabel(type) {
    const labels = {
        'executive-summary': 'Executive',
        'risk-register': 'Detailed',
        'kri-performance': 'KRI Report',
        'monthly-profile': 'Executive',
        'compliance': 'Compliance'
    };
    return labels[type] || 'Report';
}

function formatDate(date) {
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    }).replace(/\s/g, '_');
}

function formatMonth(date) {
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
    }).replace(/\s/g, '_');
}

function formatDateTime(date) {
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    const icon = type === 'success' ? 'check-circle' : 'info-circle';
    notification.innerHTML = `<i class="fas fa-${icon}"></i> ${message}`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Report actions
function downloadReport(button) {
    const row = button.closest('tr');
    const reportName = row.querySelector('.report-name').textContent.trim();
    showNotification(`Downloading ${reportName}...`);
}

function viewReport(button) {
    const row = button.closest('tr');
    const reportName = row.querySelector('.report-name').textContent.trim();
    showNotification(`Opening ${reportName}...`);
}

function shareReport(button) {
    const row = button.closest('tr');
    const reportName = row.querySelector('.report-name').textContent.trim();
    
    // Show share dialog
    alert(`Share Report: ${reportName}\n\nShare options:\n- Email to colleagues\n- Generate shareable link\n- Export to cloud storage`);
}

function deleteReport(button) {
    const row = button.closest('tr');
    const reportName = row.querySelector('.report-name').textContent.trim();
    
    if (confirm(`Are you sure you want to delete "${reportName}"?`)) {
        row.style.transition = 'all 0.3s ease';
        row.style.opacity = '0';
        row.style.transform = 'translateX(20px)';
        setTimeout(() => row.remove(), 300);
        showNotification('Report deleted successfully', 'success');
    }
}

// Create custom report
function createCustomReport() {
    alert(`Custom Report Builder\n\nThis would open a wizard to:\n1. Select data sources (Risk Register, KRIs, Treatment Plans)\n2. Choose visualizations (Charts, Tables, Heat Maps)\n3. Apply filters and date ranges\n4. Select output format (PDF, Excel, PowerPoint)\n5. Schedule or generate immediately`);
}

// Quick generate report
function quickGenerateReport() {
    const quickOptions = [
        'Executive Summary (Last 7 days)',
        'Critical Risks Report',
        'KRI Threshold Breaches',
        'Overdue Treatment Plans'
    ];
    
    const choice = prompt(`Quick Generate Report\n\nSelect report type:\n${quickOptions.map((opt, i) => `${i + 1}. ${opt}`).join('\n')}`);
    
    if (choice && choice >= 1 && choice <= quickOptions.length) {
        showNotification(`Generating ${quickOptions[choice - 1]}...`);
        setTimeout(() => {
            showNotification(`${quickOptions[choice - 1]} generated successfully!`, 'success');
        }, 2000);
    }
}

// Toggle schedule
function toggleSchedule(toggleSwitch) {
    toggleSwitch.classList.toggle('active');
    const isActive = toggleSwitch.classList.contains('active');
    const card = toggleSwitch.closest('.scheduled-card');
    const title = card.querySelector('.scheduled-title').textContent;
    
    showNotification(`${title} ${isActive ? 'enabled' : 'disabled'}`, 'success');
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchReports');
    const typeFilter = document.getElementById('reportTypeFilter');
    const dateFilter = document.getElementById('dateFilter');
    
    searchInput.addEventListener('input', filterReports);
    typeFilter.addEventListener('change', filterReports);
    dateFilter.addEventListener('change', filterReports);
}

// Filter reports
function filterReports() {
    const searchTerm = document.getElementById('searchReports').value.toLowerCase();
    const typeFilter = document.getElementById('reportTypeFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;
    
    const rows = document.querySelectorAll('.reports-table tbody tr');
    
    rows.forEach(row => {
        const reportName = row.querySelector('.report-name').textContent.toLowerCase();
        const reportType = row.querySelector('.report-type').textContent.toLowerCase();
        let show = true;
        
        if (searchTerm && !reportName.includes(searchTerm)) {
            show = false;
        }
        
        if (typeFilter && !reportType.includes(typeFilter)) {
            show = false;
        }
        
        // Date filter would need actual date parsing in production
        
        row.style.display = show ? '' : 'none';
    });
}

// Initialize search with animation
function initializeSearch() {
    const searchInput = document.getElementById('searchReports');
    searchInput.addEventListener('focus', function() {
        this.style.borderColor = '#3b82f6';
        this.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
    });
    
    searchInput.addEventListener('blur', function() {
        this.style.borderColor = '#e5e7eb';
        this.style.boxShadow = 'none';
    });
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Export functions
window.generateReport = generateReport;
window.createCustomReport = createCustomReport;
window.quickGenerateReport = quickGenerateReport;
window.toggleSchedule = toggleSchedule;
window.downloadReport = downloadReport;
window.viewReport = viewReport;
window.shareReport = shareReport;
window.deleteReport = deleteReport;