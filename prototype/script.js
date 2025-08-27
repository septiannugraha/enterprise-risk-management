// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Module navigation
    const navItems = document.querySelectorAll('.nav-item');
    const moduleContents = document.querySelectorAll('.module-content');

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const moduleId = this.getAttribute('data-module');
            
            // Redirect to risk register page for identification module
            if (moduleId === 'identification') {
                window.location.href = 'risk-register.html';
                return;
            }
            
            // Update active nav
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Update active content
            moduleContents.forEach(content => content.classList.remove('active'));
            document.getElementById(moduleId).classList.add('active');
            
            // Update charts if dashboard
            if (moduleId === 'dashboard') {
                setTimeout(() => {
                    updateCharts();
                }, 100);
            }
        });
    });

    // Initialize charts
    let riskTrendChart = null;
    let riskCategoryChart = null;

    function updateCharts() {
        // Risk Trend Chart
        const trendCtx = document.getElementById('riskTrendChart');
        if (trendCtx) {
            if (riskTrendChart) {
                riskTrendChart.destroy();
            }
            
            riskTrendChart = new Chart(trendCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'High Risk',
                        data: [18, 22, 19, 24, 23, 24],
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        tension: 0.4
                    }, {
                        label: 'Medium Risk',
                        data: [35, 38, 42, 40, 43, 45],
                        borderColor: '#f59e0b',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        tension: 0.4
                    }, {
                        label: 'Low Risk',
                        data: [12, 15, 13, 11, 10, 12],
                        borderColor: '#22c55e',
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        tension: 0.4
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
                    },
                    layout: {
                        padding: 10
                    }
                }
            });
        }

        // Risk Category Chart
        const categoryCtx = document.getElementById('riskCategoryChart');
        if (categoryCtx) {
            if (riskCategoryChart) {
                riskCategoryChart.destroy();
            }
            
            riskCategoryChart = new Chart(categoryCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Credit Risk', 'Operational Risk', 'Market Risk', 'Liquidity Risk', 'Compliance Risk'],
                    datasets: [{
                        data: [35, 25, 20, 10, 10],
                        backgroundColor: [
                            '#3b82f6',
                            '#f59e0b',
                            '#8b5cf6',
                            '#10b981',
                            '#ef4444'
                        ]
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
                    layout: {
                        padding: 10
                    }
                }
            });
        }
    }

    // Initialize charts on load
    updateCharts();

    // Modal functionality
    const modal = document.getElementById('riskModal');
    const addRiskBtns = document.querySelectorAll('.btn-primary');
    const modalClose = document.querySelector('.modal-close');

    addRiskBtns.forEach(btn => {
        if (btn.textContent.includes('Add Risk')) {
            btn.addEventListener('click', () => {
                modal.style.display = 'block';
            });
        }
    });

    modalClose.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Form submission
    const riskForm = document.getElementById('riskForm');
    if (riskForm) {
        riskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Here you would normally send the data to a server
            alert('Risk added successfully! (This is a prototype - no data is actually saved)');
            modal.style.display = 'none';
            riskForm.reset();
        });
    }

    // Generate report functionality
    const generateBtns = document.querySelectorAll('.template-card button');
    generateBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const reportType = this.parentElement.querySelector('h4').textContent;
            alert(`Generating ${reportType}... (This is a prototype - no actual report is generated)`);
        });
    });

    // Risk matrix cell click
    const matrixCells = document.querySelectorAll('.matrix-cell');
    matrixCells.forEach(cell => {
        cell.addEventListener('click', function() {
            const impact = this.getAttribute('data-impact');
            const likelihood = this.getAttribute('data-likelihood');
            const count = this.querySelector('.risk-count').textContent;
            
            if (count !== '0') {
                alert(`Showing ${count} risks with Impact: ${impact}, Likelihood: ${likelihood}`);
            }
        });
    });

    // Filter button
    const filterBtn = document.querySelector('.btn-secondary i.fa-filter');
    if (filterBtn) {
        filterBtn.parentElement.addEventListener('click', () => {
            alert('Filter functionality would open here (not implemented in prototype)');
        });
    }

    // Download/View buttons
    document.querySelectorAll('.btn-icon').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-download')) {
                alert('Download functionality (prototype mode)');
            } else if (icon.classList.contains('fa-eye')) {
                alert('View functionality (prototype mode)');
            } else if (icon.classList.contains('fa-edit')) {
                alert('Edit functionality (prototype mode)');
            }
        });
    });

    // Notification bell
    const notificationBtn = document.querySelector('.btn-secondary i.fa-bell');
    if (notificationBtn) {
        notificationBtn.parentElement.addEventListener('click', () => {
            alert('You have 3 new risk alerts:\n\n1. Credit concentration exceeded threshold\n2. New operational risk identified\n3. Monthly risk report is ready');
        });
    }

    // Treatment progress animation
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = width;
        }, 500);
    });

    // Add sample real-time updates
    setInterval(() => {
        // Update a random stat
        const stats = document.querySelectorAll('.stat-info h3');
        if (stats.length > 0) {
            const randomStat = stats[Math.floor(Math.random() * stats.length)];
            const currentValue = parseInt(randomStat.textContent);
            const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
            
            if (!isNaN(currentValue)) {
                randomStat.textContent = Math.max(0, currentValue + change);
            }
        }
    }, 10000); // Update every 10 seconds

    // Export report button
    const exportBtn = document.querySelector('.module-header .btn-primary i.fa-download');
    if (exportBtn) {
        exportBtn.parentElement.addEventListener('click', () => {
            alert('Exporting comprehensive risk report...\n\nReport would include:\n- Executive Summary\n- Risk Statistics\n- Trend Analysis\n- Risk Matrix\n- Mitigation Status\n\n(This is a prototype - no actual export)');
        });
    }

    // Refresh data button
    const refreshBtn = document.querySelector('.btn-primary i.fa-sync');
    if (refreshBtn) {
        refreshBtn.parentElement.addEventListener('click', function() {
            this.querySelector('i').style.animation = 'spin 1s linear';
            setTimeout(() => {
                this.querySelector('i').style.animation = '';
                alert('Data refreshed successfully!');
            }, 1000);
        });
    }
});

// Add CSS animation for refresh button
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Utility function to close modal
function closeModal() {
    document.getElementById('riskModal').style.display = 'none';
}