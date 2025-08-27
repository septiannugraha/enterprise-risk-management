// Risk Treatment Plans JavaScript

// Sample treatment data
const treatmentData = [
    {
        id: 'RTP-2025-001',
        title: 'Credit Limit Review & Adjustment',
        riskRef: 'RR-F-001',
        riskLevel: 'high',
        type: 'mitigate',
        status: 'in-progress',
        progress: 75,
        owner: 'CFO',
        budget: 250000000,
        startDate: '2025-01-01',
        dueDate: '2025-02-15',
        description: 'Comprehensive review and adjustment of credit limits for high-risk sectors'
    },
    {
        id: 'RTP-2025-002',
        title: 'IT Security Infrastructure Upgrade',
        riskRef: 'RR-IBP-003',
        riskLevel: 'medium',
        type: 'mitigate',
        status: 'in-progress',
        progress: 40,
        owner: 'CTO',
        budget: 500000000,
        startDate: '2025-01-15',
        dueDate: '2025-03-01',
        description: 'Upgrade security infrastructure to prevent system downtime and breaches'
    },
    {
        id: 'RTP-2025-003',
        title: 'Customer Service Training Program',
        riskRef: 'RR-C-002',
        riskLevel: 'high',
        type: 'mitigate',
        status: 'completed',
        progress: 100,
        owner: 'CMO',
        budget: 150000000,
        startDate: '2024-11-01',
        dueDate: '2025-01-20',
        completedDate: '2025-01-20',
        description: 'Comprehensive training program to improve customer satisfaction scores'
    },
    {
        id: 'RTP-2025-004',
        title: 'Risk Insurance Policy Renewal',
        riskRef: 'RR-F-002',
        riskLevel: 'medium',
        type: 'transfer',
        status: 'in-progress',
        progress: 60,
        owner: 'Chief Risk Officer',
        budget: 1200000000,
        startDate: '2025-01-10',
        dueDate: '2025-02-28',
        description: 'Renewal and enhancement of risk insurance policies'
    },
    {
        id: 'RTP-2025-005',
        title: 'Employee Retention Program',
        riskRef: 'RR-LG-004',
        riskLevel: 'medium',
        type: 'mitigate',
        status: 'in-progress',
        progress: 85,
        owner: 'CHRO',
        budget: 300000000,
        startDate: '2024-12-01',
        dueDate: '2025-01-31',
        description: 'Comprehensive retention program to reduce employee turnover'
    },
    {
        id: 'RTP-2024-018',
        title: 'Regulatory Compliance Update',
        riskRef: 'RR-F-005',
        riskLevel: 'high',
        type: 'avoid',
        status: 'on-hold',
        progress: 30,
        owner: 'Compliance Officer',
        budget: 100000000,
        startDate: '2024-11-15',
        dueDate: '2025-01-15',
        description: 'Update policies and procedures for new regulatory requirements'
    }
];

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    setupFilters();
    renderTreatmentCards();
    createTimelineChart();
    animateSummaryCards();
});

// Setup filter event listeners
function setupFilters() {
    const filters = ['statusFilter', 'riskLevelFilter', 'treatmentTypeFilter', 'ownerFilter'];
    filters.forEach(filterId => {
        document.getElementById(filterId).addEventListener('change', filterTreatmentPlans);
    });
    
    document.getElementById('searchInput').addEventListener('input', filterTreatmentPlans);
}

// Filter treatment plans
function filterTreatmentPlans() {
    const status = document.getElementById('statusFilter').value;
    const riskLevel = document.getElementById('riskLevelFilter').value;
    const type = document.getElementById('treatmentTypeFilter').value;
    const owner = document.getElementById('ownerFilter').value;
    const search = document.getElementById('searchInput').value.toLowerCase();
    
    const filtered = treatmentData.filter(treatment => {
        if (status && treatment.status !== status) return false;
        if (riskLevel && treatment.riskLevel !== riskLevel) return false;
        if (type && treatment.type !== type) return false;
        if (owner && !treatment.owner.toLowerCase().includes(owner)) return false;
        if (search && !treatment.title.toLowerCase().includes(search) && 
            !treatment.id.toLowerCase().includes(search)) return false;
        return true;
    });
    
    renderFilteredCards(filtered);
}

// Render filtered treatment cards
function renderFilteredCards(filteredData) {
    const grid = document.getElementById('treatmentGrid');
    
    if (filteredData.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <i class="fas fa-search" style="font-size: 3rem; color: #e5e7eb; margin-bottom: 1rem; display: block;"></i>
                <p style="color: #6b7280;">No treatment plans found matching your criteria</p>
            </div>
        `;
        return;
    }
    
    // Animate cards
    const cards = grid.querySelectorAll('.treatment-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
        }, index * 50);
    });
    
    setTimeout(() => {
        grid.innerHTML = '';
        filteredData.forEach((treatment, index) => {
            const card = createTreatmentCard(treatment);
            grid.appendChild(card);
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            }, index * 100);
        });
    }, 300);
}

// Create treatment card element
function createTreatmentCard(treatment) {
    const card = document.createElement('div');
    card.className = 'treatment-card';
    card.style.opacity = '0';
    card.style.transform = 'scale(0.95)';
    card.style.transition = 'all 0.3s ease';
    
    const progressClass = getProgressClass(treatment);
    const typeIcon = getTypeIcon(treatment.type);
    const statusBadgeClass = getStatusBadgeClass(treatment.status);
    const formattedBudget = formatCurrency(treatment.budget);
    const dateInfo = getDateInfo(treatment);
    
    card.innerHTML = `
        <div class="treatment-header">
            <h3>${treatment.title}</h3>
            <div class="treatment-meta">
                <span class="treatment-code">${treatment.id}</span>
                <span class="risk-level ${treatment.riskLevel}">${treatment.riskLevel.toUpperCase()} Risk</span>
                <span class="status-badge ${statusBadgeClass}">${formatStatus(treatment.status)}</span>
            </div>
            <div class="treatment-type">
                <div class="type-icon ${treatment.type}">
                    <i class="fas fa-${typeIcon}"></i>
                </div>
                <span>${treatment.type.charAt(0).toUpperCase() + treatment.type.slice(1)}</span>
            </div>
        </div>
        <div class="treatment-status">
            <div class="status-info">
                <span class="status-label">Progress</span>
                <span class="status-value">${treatment.progress}%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill ${progressClass}" style="width: ${treatment.progress}%;"></div>
            </div>
            <div class="status-info">
                <span class="status-label" ${dateInfo.isOverdue ? 'style="color: #ef4444;"' : ''}>${dateInfo.label}</span>
                <span class="status-value" ${dateInfo.isOverdue ? 'style="color: #ef4444;"' : ''}>${dateInfo.date}</span>
            </div>
        </div>
        <div class="treatment-details">
            <div class="detail-item">
                <span class="detail-label">Risk Reference</span>
                <span class="detail-value">${treatment.riskRef}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Owner</span>
                <span class="detail-value">${treatment.owner}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Budget</span>
                <span class="detail-value">${formattedBudget}</span>
            </div>
        </div>
        <div class="treatment-actions">
            <div class="action-group">
                <button class="btn btn-sm btn-primary" onclick="viewTreatmentDetails('${treatment.id}')">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="btn btn-sm btn-secondary" onclick="editTreatment('${treatment.id}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
            </div>
            <button class="btn btn-sm btn-secondary" onclick="viewProgress('${treatment.id}')">
                <i class="fas fa-chart-line"></i> Progress
            </button>
        </div>
    `;
    
    return card;
}

// Helper functions
function getProgressClass(treatment) {
    if (treatment.status === 'overdue' || 
        (treatment.status === 'in-progress' && new Date(treatment.dueDate) < new Date())) {
        return 'overdue';
    }
    if (treatment.progress < 50 && treatment.status === 'in-progress') {
        return 'at-risk';
    }
    return 'on-track';
}

function getTypeIcon(type) {
    const icons = {
        'mitigate': 'shield-alt',
        'transfer': 'exchange-alt',
        'accept': 'check-circle',
        'avoid': 'ban'
    };
    return icons[type] || 'shield-alt';
}

function getStatusBadgeClass(status) {
    const classes = {
        'in-progress': 'in-progress',
        'completed': 'completed',
        'on-hold': 'on-hold',
        'cancelled': 'cancelled'
    };
    return classes[status] || 'in-progress';
}

function formatStatus(status) {
    return status.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function formatCurrency(amount) {
    if (amount >= 1000000000) {
        return `Rp ${(amount / 1000000000).toFixed(1)}B`;
    } else if (amount >= 1000000) {
        return `Rp ${(amount / 1000000).toFixed(0)}M`;
    }
    return `Rp ${amount.toLocaleString('id-ID')}`;
}

function getDateInfo(treatment) {
    const now = new Date();
    const dueDate = new Date(treatment.dueDate);
    
    if (treatment.status === 'completed') {
        return {
            label: 'Completed',
            date: formatDate(treatment.completedDate || treatment.dueDate),
            isOverdue: false
        };
    }
    
    if (dueDate < now) {
        return {
            label: 'Overdue',
            date: formatDate(treatment.dueDate),
            isOverdue: true
        };
    }
    
    return {
        label: 'Due Date',
        date: formatDate(treatment.dueDate),
        isOverdue: false
    };
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Render all treatment cards
function renderTreatmentCards() {
    renderFilteredCards(treatmentData);
}

// Create timeline chart
function createTimelineChart() {
    const ctx = document.getElementById('treatmentTimeline').getContext('2d');
    
    // Sort treatments by start date
    const sortedTreatments = [...treatmentData].sort((a, b) => 
        new Date(a.startDate) - new Date(b.startDate)
    );
    
    // Create floating bars for Gantt chart
    const chartData = sortedTreatments.map((treatment, index) => {
        const start = new Date(treatment.startDate);
        const end = new Date(treatment.dueDate);
        return {
            x: [start, end],
            y: index,
            treatment: treatment
        };
    });
    
    const timelineChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedTreatments.map(t => t.title.substring(0, 30) + (t.title.length > 30 ? '...' : '')),
            datasets: [{
                label: 'Treatment Timeline',
                data: chartData.map(d => d.x),
                backgroundColor: sortedTreatments.map(t => getTimelineColor(t) + '80'), // Add transparency
                borderColor: sortedTreatments.map(t => getTimelineColor(t)),
                borderWidth: 2,
                borderRadius: 4,
                barThickness: 25
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const treatment = sortedTreatments[context.dataIndex];
                            return [
                                `${treatment.title}`,
                                `Status: ${formatStatus(treatment.status)}`,
                                `Progress: ${treatment.progress}%`,
                                `Start: ${formatDate(treatment.startDate)}`,
                                `Due: ${formatDate(treatment.dueDate)}`,
                                `Owner: ${treatment.owner}`
                            ];
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'month',
                        displayFormats: {
                            month: 'MMM yyyy'
                        },
                        tooltipFormat: 'MMM dd, yyyy'
                    },
                    title: {
                        display: true,
                        text: 'Timeline (2024-2025)'
                    },
                    min: '2024-11-01',
                    max: '2025-06-30'
                },
                y: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 11
                        }
                    }
                }
            }
        }
    });
}

function getTimelineColor(treatment) {
    if (treatment.status === 'completed') return '#10b981';
    if (treatment.status === 'on-hold') return '#f59e0b';
    if (treatment.status === 'cancelled') return '#6b7280';
    
    const progress = treatment.progress;
    if (progress >= 75) return '#10b981';
    if (progress >= 50) return '#3b82f6';
    if (progress >= 25) return '#f59e0b';
    return '#ef4444';
}

// Animate summary cards
function animateSummaryCards() {
    const cards = document.querySelectorAll('.summary-card');
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

// Treatment action functions
function viewTreatmentDetails(id) {
    const treatment = treatmentData.find(t => t.id === id);
    if (treatment) {
        alert(`Treatment Details:\n\nID: ${treatment.id}\nTitle: ${treatment.title}\nDescription: ${treatment.description}\nRisk Reference: ${treatment.riskRef}\nOwner: ${treatment.owner}\nProgress: ${treatment.progress}%\n\nThis would open a detailed view in production.`);
    }
}

function editTreatment(id) {
    alert(`Edit treatment plan: ${id}\n\nThis would open an edit form in production.`);
}

function viewProgress(id) {
    const treatment = treatmentData.find(t => t.id === id);
    if (treatment) {
        alert(`Progress Report for ${treatment.title}:\n\nCurrent Progress: ${treatment.progress}%\nStart Date: ${formatDate(treatment.startDate)}\nDue Date: ${formatDate(treatment.dueDate)}\nDays Remaining: ${getDaysRemaining(treatment.dueDate)}\n\nThis would show detailed progress tracking in production.`);
    }
}

function getDaysRemaining(dueDate) {
    const now = new Date();
    const due = new Date(dueDate);
    const diff = due - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days} days` : `${Math.abs(days)} days overdue`;
}

function openNewTreatmentModal() {
    alert('New Treatment Plan Modal\n\nThis would open a form to create a new risk treatment plan with fields for:\n- Treatment Title\n- Risk Reference\n- Treatment Type\n- Owner\n- Budget\n- Start Date\n- Due Date\n- Action Items\n- Success Criteria');
}

// Export functions for global use
window.viewTreatmentDetails = viewTreatmentDetails;
window.editTreatment = editTreatment;
window.viewProgress = viewProgress;
window.openNewTreatmentModal = openNewTreatmentModal;