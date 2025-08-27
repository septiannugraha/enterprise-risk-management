// Risk Analytics Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all charts
    initializeSourceChart();
    initializeTypeChart();
    initializeTrendChart();
    initializeImpactChart();
    
    // Add interactivity to risk matrix
    initializeRiskMatrix();
    
    // Handle filters
    initializeFilters();
});

// Risk Source Distribution (Donut Chart)
function initializeSourceChart() {
    const ctx = document.getElementById('sourceChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Internal', 'External'],
            datasets: [{
                data: [34, 10],
                backgroundColor: ['#f59e0b', '#3b82f6'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((context.raw / total) * 100);
                            return context.label + ': ' + context.raw + ' (' + percentage + '%)';
                        }
                    }
                }
            }
        }
    });
}

// Risk Type Distribution (Pie Chart)
function initializeTypeChart() {
    const ctx = document.getElementById('typeChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Corporate', 'Division', 'Project'],
            datasets: [{
                data: [26, 11, 7],
                backgroundColor: ['#3b82f6', '#8b5cf6', '#ec4899'],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 10,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((context.raw / total) * 100);
                            return context.label + ': ' + context.raw + ' (' + percentage + '%)';
                        }
                    }
                }
            }
        }
    });
}

// Risk Trend Analysis (Line Chart)
function initializeTrendChart() {
    const ctx = document.getElementById('trendChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Q4 2024', 'Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025'],
            datasets: [{
                label: 'Low Risk',
                data: [19, 22, 25, 28, 30],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4
            }, {
                label: 'Medium Risk',
                data: [28, 25, 23, 20, 18],
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                tension: 0.4
            }, {
                label: 'High Risk',
                data: [0, 0, 0, 0, 0],
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.4
            }, {
                label: 'Critical Risk',
                data: [0, 0, 0, 0, 0],
                borderColor: '#991b1b',
                backgroundColor: 'rgba(153, 27, 27, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                title: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Risks'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Quarter'
                    }
                }
            }
        }
    });
}

// Impact Area Analysis (Stacked Bar Chart)
function initializeImpactChart() {
    const ctx = document.getElementById('impactChart').getContext('2d');
    
    const perspectives = ['Financial', 'Customer', 'Internal Process', 'Learning & Growth'];
    const impactAreas = [
        'Operating Income',
        'Business Expenses',
        'Investment Value',
        'Market Share',
        'Customer Satisfaction',
        'Reputation',
        'GCG',
        'Sinergi Group SRO',
        'Compliance',
        'Operational Activities',
        'Project Management',
        'Information Technology',
        'Human Capital'
    ];
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: impactAreas,
            datasets: [{
                label: 'Q4 2024',
                data: [4, 0, 0, 1, 1, 3, 0, 0, 5, 12, 13, 4, 1],
                backgroundColor: '#dbeafe',
                borderColor: '#3b82f6',
                borderWidth: 1
            }, {
                label: 'Q1 2025',
                data: [4, 0, 0, 2, 1, 4, 0, 0, 7, 22, 14, 4, 1],
                backgroundColor: '#3b82f6',
                borderColor: '#1e40af',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: {
                    position: 'top'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                x: {
                    stacked: false,
                    title: {
                        display: true,
                        text: 'Number of Risks'
                    }
                },
                y: {
                    stacked: false,
                    title: {
                        display: true,
                        text: 'Impact Area'
                    }
                }
            }
        }
    });
}

// Initialize Risk Matrix Interactivity
function initializeRiskMatrix() {
    const matrixCells = document.querySelectorAll('.matrix-cell');
    
    matrixCells.forEach((cell, index) => {
        cell.addEventListener('click', function() {
            const value = parseInt(this.textContent);
            if (value > 0) {
                // Calculate likelihood and impact from cell position
                const row = Math.floor(index / 5);
                const col = index % 5;
                const likelihood = 5 - row;
                const impact = col + 1;
                
                showRiskDetails(likelihood, impact, value);
            }
        });
        
        // Add tooltip on hover
        cell.addEventListener('mouseenter', function() {
            const riskLevel = this.classList.contains('critical') ? 'Critical' :
                            this.classList.contains('high') ? 'High' :
                            this.classList.contains('medium') ? 'Medium' : 'Low';
            this.title = `${this.textContent} risks at ${riskLevel} level (Click to view details)`;
        });
    });
}

// Initialize Filters
function initializeFilters() {
    const periodFilter = document.getElementById('periodFilter');
    const deptFilter = document.getElementById('deptFilter');
    const typeFilter = document.getElementById('typeFilter');
    
    // Add event listeners
    [periodFilter, deptFilter, typeFilter].forEach(filter => {
        filter.addEventListener('change', function() {
            // In a real implementation, this would trigger data refresh
            console.log('Filter changed:', this.id, this.value);
            updateAnalytics();
        });
    });
}

// Update analytics based on filters
function updateAnalytics() {
    // This would typically fetch new data from the backend
    // For now, we'll just show a loading state
    const cards = document.querySelectorAll('.analytics-card');
    cards.forEach(card => {
        card.style.opacity = '0.5';
        setTimeout(() => {
            card.style.opacity = '1';
        }, 500);
    });
}

// Add animation to stat values
function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            element.textContent = end;
            clearInterval(timer);
        } else {
            element.textContent = Math.round(current);
        }
    }, 16);
}

// Animate stats on page load
window.addEventListener('load', function() {
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach(stat => {
        const value = parseInt(stat.textContent);
        stat.textContent = '0';
        setTimeout(() => {
            animateValue(stat, 0, value, 1000);
        }, 500);
    });
});

// Export functionality
function exportAnalytics(format) {
    // Close export menu
    document.getElementById('exportMenu').style.display = 'none';
    
    // Show loading message
    showExportLoading();
    
    switch(format) {
        case 'pdf':
            exportToPDF();
            break;
        case 'excel':
            exportToExcel();
            break;
        case 'ppt':
            exportToPowerPoint();
            break;
        case 'image':
            exportToImage();
            break;
    }
}

// Export to PDF
function exportToPDF() {
    html2canvas(document.querySelector('.analytics-grid')).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jspdf.jsPDF('l', 'mm', 'a4');
        const imgWidth = 280;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
        pdf.save('risk-analytics-' + new Date().toISOString().split('T')[0] + '.pdf');
        hideExportLoading();
    });
}

// Export to Excel (simulated - in real implementation would use server-side)
function exportToExcel() {
    const data = gatherAnalyticsData();
    const csvContent = convertToCSV(data);
    downloadFile(csvContent, 'risk-analytics.csv', 'text/csv');
    hideExportLoading();
}

// Export to PowerPoint (simulated)
function exportToPowerPoint() {
    alert('PowerPoint export will be available with backend implementation');
    hideExportLoading();
}

// Export to Image
function exportToImage() {
    html2canvas(document.querySelector('.analytics-grid')).then(canvas => {
        canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'risk-analytics-' + new Date().toISOString().split('T')[0] + '.png';
            a.click();
            URL.revokeObjectURL(url);
            hideExportLoading();
        });
    });
}

// Show risk details modal
function showRiskDetails(likelihood, impact, count) {
    const modal = document.getElementById('riskDetailModal');
    const content = document.getElementById('modalContent');
    const title = document.getElementById('modalTitle');
    
    const likelihoodLabels = ['Rare', 'Unlikely', 'Possible', 'Likely', 'Almost Certain'];
    const impactLabels = ['Very Low', 'Low', 'Medium', 'High', 'Very High'];
    
    title.textContent = `Risks: ${impactLabels[impact-1]} Impact, ${likelihoodLabels[likelihood-1]} Likelihood`;
    
    // Simulate risk data - in real implementation, fetch from backend
    const risks = generateSampleRisks(likelihood, impact, count);
    
    content.innerHTML = `
        <div style="margin-bottom: 1rem;">
            <span style="background: #eff6ff; color: #1e40af; padding: 0.5rem 1rem; border-radius: 20px; font-weight: 600;">
                ${count} Risks Found
            </span>
        </div>
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr style="background: #f9fafb;">
                    <th style="padding: 0.75rem; text-align: left; border-bottom: 1px solid #e5e7eb;">Risk Code</th>
                    <th style="padding: 0.75rem; text-align: left; border-bottom: 1px solid #e5e7eb;">Risk Event</th>
                    <th style="padding: 0.75rem; text-align: left; border-bottom: 1px solid #e5e7eb;">Department</th>
                    <th style="padding: 0.75rem; text-align: left; border-bottom: 1px solid #e5e7eb;">Owner</th>
                    <th style="padding: 0.75rem; text-align: left; border-bottom: 1px solid #e5e7eb;">Actions</th>
                </tr>
            </thead>
            <tbody>
                ${risks.map(risk => `
                    <tr>
                        <td style="padding: 0.75rem; border-bottom: 1px solid #f3f4f6;">${risk.code}</td>
                        <td style="padding: 0.75rem; border-bottom: 1px solid #f3f4f6;">${risk.event}</td>
                        <td style="padding: 0.75rem; border-bottom: 1px solid #f3f4f6;">${risk.department}</td>
                        <td style="padding: 0.75rem; border-bottom: 1px solid #f3f4f6;">${risk.owner}</td>
                        <td style="padding: 0.75rem; border-bottom: 1px solid #f3f4f6;">
                            <button onclick="viewRiskInRegister('${risk.code}')" style="padding: 0.25rem 0.75rem; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.875rem;">
                                <i class="fas fa-eye"></i> View
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    modal.style.display = 'block';
}

// Generate sample risks for demo
function generateSampleRisks(likelihood, impact, count) {
    const departments = ['BOD', 'ERC', 'RATING', 'LCO', 'MBD', 'HRG', 'ITE', 'IAD', 'QCO'];
    const riskEvents = [
        'Revenue target not achieved due to market downturn',
        'Customer complaints increase due to service delays',
        'System downtime affecting business operations',
        'Key talent retention challenges',
        'Regulatory compliance violations',
        'Data security breach',
        'Project delays impacting delivery',
        'Quality control failures'
    ];
    
    const risks = [];
    for (let i = 0; i < count; i++) {
        risks.push({
            code: `RR-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}-${String(i + 1).padStart(3, '0')}`,
            event: riskEvents[Math.floor(Math.random() * riskEvents.length)],
            department: departments[Math.floor(Math.random() * departments.length)],
            owner: ['CFO', 'CTO', 'CMO', 'CHRO', 'CRO'][Math.floor(Math.random() * 5)]
        });
    }
    return risks;
}

// View risk in register
function viewRiskInRegister(code) {
    window.location.href = `risk-register.html?risk=${code}`;
}

// Close risk modal
function closeRiskModal() {
    document.getElementById('riskDetailModal').style.display = 'none';
}

// Open comparison modal
function openCompareModal() {
    document.getElementById('compareModal').style.display = 'block';
    updateComparison();
}

// Close comparison modal
function closeCompareModal() {
    document.getElementById('compareModal').style.display = 'none';
}

// Update comparison view
function updateComparison() {
    const period1 = document.getElementById('period1Select').value;
    const period2 = document.getElementById('period2Select').value;
    const content = document.getElementById('comparisonContent');
    
    content.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
            <div>
                <h3 style="text-align: center; margin-bottom: 1rem;">${period1.toUpperCase()}</h3>
                <div style="background: #f9fafb; padding: 1.5rem; border-radius: 8px;">
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; text-align: center;">
                        <div>
                            <div style="font-size: 2rem; font-weight: 700; color: #3b82f6;">44</div>
                            <div style="font-size: 0.875rem; color: #6b7280;">Total Risks</div>
                        </div>
                        <div>
                            <div style="font-size: 2rem; font-weight: 700; color: #10b981;">19</div>
                            <div style="font-size: 0.875rem; color: #6b7280;">Low Risk</div>
                        </div>
                        <div>
                            <div style="font-size: 2rem; font-weight: 700; color: #f59e0b;">25</div>
                            <div style="font-size: 0.875rem; color: #6b7280;">Medium Risk</div>
                        </div>
                        <div>
                            <div style="font-size: 2rem; font-weight: 700; color: #ef4444;">0</div>
                            <div style="font-size: 0.875rem; color: #6b7280;">High Risk</div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <h3 style="text-align: center; margin-bottom: 1rem;">${period2.toUpperCase()}</h3>
                <div style="background: #f9fafb; padding: 1.5rem; border-radius: 8px;">
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; text-align: center;">
                        <div>
                            <div style="font-size: 2rem; font-weight: 700; color: #3b82f6;">47</div>
                            <div style="font-size: 0.875rem; color: #6b7280;">Total Risks</div>
                        </div>
                        <div>
                            <div style="font-size: 2rem; font-weight: 700; color: #10b981;">22</div>
                            <div style="font-size: 0.875rem; color: #6b7280;">Low Risk</div>
                        </div>
                        <div>
                            <div style="font-size: 2rem; font-weight: 700; color: #f59e0b;">25</div>
                            <div style="font-size: 0.875rem; color: #6b7280;">Medium Risk</div>
                        </div>
                        <div>
                            <div style="font-size: 2rem; font-weight: 700; color: #ef4444;">0</div>
                            <div style="font-size: 0.875rem; color: #6b7280;">High Risk</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div style="margin-top: 2rem;">
            <h3>Key Changes</h3>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 1rem;">
                <div style="background: #dcfce7; padding: 1rem; border-radius: 8px; border: 1px solid #86efac;">
                    <div style="font-weight: 600; color: #166534;">+3 New Risks Added</div>
                    <div style="font-size: 0.875rem; color: #15803d; margin-top: 0.25rem;">Total increased from 44 to 47</div>
                </div>
                <div style="background: #dbeafe; padding: 1rem; border-radius: 8px; border: 1px solid #93c5fd;">
                    <div style="font-weight: 600; color: #1e40af;">+3 Risks Mitigated</div>
                    <div style="font-size: 0.875rem; color: #1d4ed8; margin-top: 0.25rem;">Moved from Medium to Low</div>
                </div>
                <div style="background: #fef3c7; padding: 1rem; border-radius: 8px; border: 1px solid #fde68a;">
                    <div style="font-weight: 600; color: #92400e;">0 Critical Risks</div>
                    <div style="font-size: 0.875rem; color: #b45309; margin-top: 0.25rem;">Maintained zero high risks</div>
                </div>
            </div>
        </div>
        
        <div style="margin-top: 2rem;">
            <canvas id="comparisonChart" style="max-height: 300px;"></canvas>
        </div>
    `;
    
    // Create comparison chart
    const ctx = document.getElementById('comparisonChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Total Risks', 'Low', 'Medium', 'High', 'Critical'],
            datasets: [{
                label: period1.toUpperCase(),
                data: [44, 19, 25, 0, 0],
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                borderColor: '#3b82f6',
                borderWidth: 1
            }, {
                label: period2.toUpperCase(),
                data: [47, 22, 25, 0, 0],
                backgroundColor: 'rgba(139, 92, 246, 0.5)',
                borderColor: '#8b5cf6',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Dashboard builder
function openDashboardBuilder() {
    alert('Custom Dashboard Builder - Coming Soon!\n\nThis feature will allow you to:\n• Drag and drop widgets\n• Choose visualization types\n• Save custom layouts\n• Create role-specific dashboards');
}

// Toggle export menu
function toggleExportMenu() {
    const menu = document.getElementById('exportMenu');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

// Helper functions
function showExportLoading() {
    // Show loading indicator
}

function hideExportLoading() {
    // Hide loading indicator
}

function gatherAnalyticsData() {
    // Gather data from charts and tables
    return {
        totalRisks: 47,
        lowRisks: 22,
        mediumRisks: 25,
        highRisks: 0,
        criticalRisks: 0
    };
}

function convertToCSV(data) {
    // Convert data to CSV format
    return 'Metric,Value\n' +
           `Total Risks,${data.totalRisks}\n` +
           `Low Risks,${data.lowRisks}\n` +
           `Medium Risks,${data.mediumRisks}\n` +
           `High Risks,${data.highRisks}\n` +
           `Critical Risks,${data.criticalRisks}`;
}

function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// Make functions available globally
window.exportAnalytics = exportAnalytics;
window.toggleExportMenu = toggleExportMenu;
window.closeRiskModal = closeRiskModal;
window.viewRiskInRegister = viewRiskInRegister;
window.openCompareModal = openCompareModal;
window.closeCompareModal = closeCompareModal;
window.updateComparison = updateComparison;
window.openDashboardBuilder = openDashboardBuilder;

// Close export menu when clicking outside
document.addEventListener('click', function(event) {
    const exportMenu = document.getElementById('exportMenu');
    const exportButton = event.target.closest('button');
    
    if (exportMenu && exportMenu.style.display === 'block' && 
        !exportMenu.contains(event.target) && 
        (!exportButton || !exportButton.textContent.includes('Export'))) {
        exportMenu.style.display = 'none';
    }
});