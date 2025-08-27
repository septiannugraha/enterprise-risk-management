// Dashboard JavaScript - ERM Enterprise

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    updateCurrentDate();
    initializeCharts();
    setupEventListeners();
    animateSummaryCards();
});

// Update current date
function updateCurrentDate() {
    const dateElement = document.getElementById('currentDate');
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    dateElement.textContent = now.toLocaleDateString('en-US', options);
}

// Animate summary cards on load
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

// Initialize Charts
function initializeCharts() {
    // Risk Trend Chart
    const trendCtx = document.getElementById('riskTrendChart').getContext('2d');
    const riskTrendChart = new Chart(trendCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'High Risk',
                data: [28, 32, 30, 27, 25, 23],
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.4,
                borderWidth: 2
            }, {
                label: 'Medium Risk',
                data: [45, 48, 52, 49, 47, 45],
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                tension: 0.4,
                borderWidth: 2
            }, {
                label: 'Low Risk',
                data: [72, 68, 65, 70, 74, 88],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    cornerRadius: 8,
                    titleFont: {
                        size: 14
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y + ' risks';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });

    // Risk Distribution Chart (Doughnut)
    const distCtx = document.getElementById('riskDistributionChart').getContext('2d');
    const riskDistributionChart = new Chart(distCtx, {
        type: 'doughnut',
        data: {
            labels: ['Financial', 'Customer', 'Internal Process', 'Learning & Growth'],
            datasets: [{
                data: [42, 38, 51, 25],
                backgroundColor: [
                    '#3b82f6',
                    '#8b5cf6',
                    '#10b981',
                    '#f59e0b'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return label + ': ' + value + ' risks (' + percentage + '%)';
                        }
                    }
                }
            }
        }
    });

    // Add center text to doughnut chart
    const centerText = {
        id: 'centerText',
        beforeDraw: function(chart) {
            const {ctx, chartArea: {left, right, top, bottom}} = chart;
            ctx.save();
            
            const centerX = (left + right) / 2;
            const centerY = (top + bottom) / 2;
            
            ctx.font = 'bold 36px Inter';
            ctx.fillStyle = '#1f2937';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('156', centerX, centerY - 10);
            
            ctx.font = '14px Inter';
            ctx.fillStyle = '#6b7280';
            ctx.fillText('Total Risks', centerX, centerY + 15);
            
            ctx.restore();
        }
    };
    
    riskDistributionChart.plugins.push(centerText);
}

// Setup event listeners
function setupEventListeners() {
    // Refresh button
    document.querySelector('.btn-secondary').addEventListener('click', function() {
        const icon = this.querySelector('i');
        icon.style.animation = 'spin 1s';
        setTimeout(() => {
            icon.style.animation = '';
            updateCurrentDate();
            showNotification('Dashboard refreshed successfully');
        }, 1000);
    });

    // Export button
    document.querySelector('.btn-primary').addEventListener('click', function() {
        showNotification('Preparing dashboard export...');
        setTimeout(() => {
            showNotification('Dashboard exported successfully', 'success');
        }, 2000);
    });

    // Heat map cells
    document.querySelectorAll('.matrix-cell').forEach(cell => {
        cell.addEventListener('click', function() {
            const impact = 6 - parseInt(this.parentElement.children[0].parentElement.rowIndex);
            const likelihood = (Array.from(this.parentElement.children).indexOf(this) % 5) + 1;
            const count = this.textContent;
            
            showRiskDetails(impact, likelihood, count);
        });
    });

    // Perspective filter
    document.querySelector('select').addEventListener('change', function() {
        // In a real app, this would filter the chart data
        showNotification(`Filtering by ${this.value || 'All Perspectives'}`);
    });
}

// Show risk details modal
function showRiskDetails(impact, likelihood, count) {
    let riskLevel = 'Low';
    let color = '#10b981';
    
    const score = impact * likelihood;
    if (score >= 15) {
        riskLevel = 'High';
        color = '#ef4444';
    } else if (score >= 8) {
        riskLevel = 'Medium';
        color = '#f59e0b';
    }
    
    alert(`Risk Details:\n\nImpact: ${impact}\nLikelihood: ${likelihood}\nRisk Level: ${riskLevel}\nNumber of Risks: ${count}\n\nClick OK to view detailed risk list.`);
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
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
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    const icon = type === 'success' ? 'check-circle' : 'info-circle';
    notification.innerHTML = `<i class="fas fa-${icon}"></i> ${message}`;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

// Auto-refresh every 5 minutes (optional)
setInterval(() => {
    updateCurrentDate();
}, 300000);

// Animate numbers on scroll
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
};

const numberObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target;
            const endValue = parseInt(target.textContent);
            animateNumber(target, 0, endValue, 1500);
            numberObserver.unobserve(target);
        }
    });
}, observerOptions);

// Observe all number elements
document.querySelectorAll('.summary-card h3').forEach(el => {
    if (!el.textContent.includes('%') && !el.textContent.includes('/')) {
        numberObserver.observe(el);
    }
});

// Animate number function
function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    const originalText = element.textContent;
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + (end - start) * easeOutQuart);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = originalText;
        }
    }
    
    requestAnimationFrame(update);
}