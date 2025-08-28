/**
 * Enterprise Risk Management API Server
 * Demonstrates backend capabilities for portfolio
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../prototype')));

// In-memory data store (for demo purposes)
let risks = [];
let kpis = [];
let kris = [];

// Initialize with demo data
function initializeDemoData() {
  risks = [
    {
      id: 'R001',
      title: 'Data Breach Risk',
      category: 'Operational',
      department: 'IT',
      likelihood: 4,
      impact: 5,
      inherentRisk: 20,
      controlEffectiveness: 70,
      residualRisk: 6,
      status: 'Active',
      owner: 'John Smith',
      description: 'Risk of unauthorized access to sensitive customer data',
      mitigations: [
        'Implement multi-factor authentication',
        'Regular security audits',
        'Employee security training'
      ],
      lastAssessed: new Date().toISOString()
    },
    {
      id: 'R002',
      title: 'Market Volatility',
      category: 'Financial',
      department: 'Finance',
      likelihood: 3,
      impact: 4,
      inherentRisk: 12,
      controlEffectiveness: 60,
      residualRisk: 4.8,
      status: 'Monitored',
      owner: 'Jane Doe',
      description: 'Risk of losses due to market fluctuations',
      mitigations: [
        'Diversified investment portfolio',
        'Regular market analysis',
        'Hedging strategies'
      ],
      lastAssessed: new Date().toISOString()
    },
    {
      id: 'R003',
      title: 'Regulatory Compliance',
      category: 'Compliance',
      department: 'Legal',
      likelihood: 2,
      impact: 5,
      inherentRisk: 10,
      controlEffectiveness: 85,
      residualRisk: 1.5,
      status: 'Controlled',
      owner: 'Mike Johnson',
      description: 'Risk of non-compliance with industry regulations',
      mitigations: [
        'Regular compliance audits',
        'Automated compliance monitoring',
        'Staff training on regulations'
      ],
      lastAssessed: new Date().toISOString()
    }
  ];

  kpis = [
    {
      id: 'KPI001',
      name: 'Revenue Growth',
      category: 'Financial',
      current: 12.5,
      target: 15,
      unit: '%',
      trend: 'up',
      status: 'on-track'
    },
    {
      id: 'KPI002',
      name: 'Customer Satisfaction',
      category: 'Customer',
      current: 4.2,
      target: 4.5,
      unit: 'score',
      trend: 'stable',
      status: 'attention'
    },
    {
      id: 'KPI003',
      name: 'Operational Efficiency',
      category: 'Process',
      current: 87,
      target: 90,
      unit: '%',
      trend: 'up',
      status: 'on-track'
    }
  ];

  kris = [
    {
      id: 'KRI001',
      name: 'Security Incidents',
      threshold: 5,
      current: 3,
      status: 'green',
      trend: 'improving'
    },
    {
      id: 'KRI002',
      name: 'Compliance Violations',
      threshold: 0,
      current: 0,
      status: 'green',
      trend: 'stable'
    },
    {
      id: 'KRI003',
      name: 'System Downtime (hours)',
      threshold: 4,
      current: 5.2,
      status: 'red',
      trend: 'worsening'
    }
  ];
}

// Initialize data on server start
initializeDemoData();

// =====================
// API Routes
// =====================

// Dashboard summary
app.get('/api/dashboard/summary', (req, res) => {
  const summary = {
    totalRisks: risks.length,
    highRisks: risks.filter(r => r.inherentRisk >= 15).length,
    mediumRisks: risks.filter(r => r.inherentRisk >= 7 && r.inherentRisk < 15).length,
    lowRisks: risks.filter(r => r.inherentRisk < 7).length,
    kpiStatus: {
      onTrack: kpis.filter(k => k.status === 'on-track').length,
      attention: kpis.filter(k => k.status === 'attention').length,
      critical: kpis.filter(k => k.status === 'critical').length
    },
    kriStatus: {
      green: kris.filter(k => k.status === 'green').length,
      amber: kris.filter(k => k.status === 'amber').length,
      red: kris.filter(k => k.status === 'red').length
    },
    lastUpdated: new Date().toISOString()
  };
  
  res.json(summary);
});

// Risk Register endpoints
app.get('/api/risks', (req, res) => {
  const { department, category, status } = req.query;
  
  let filteredRisks = [...risks];
  
  if (department) {
    filteredRisks = filteredRisks.filter(r => r.department === department);
  }
  if (category) {
    filteredRisks = filteredRisks.filter(r => r.category === category);
  }
  if (status) {
    filteredRisks = filteredRisks.filter(r => r.status === status);
  }
  
  res.json(filteredRisks);
});

app.get('/api/risks/:id', (req, res) => {
  const risk = risks.find(r => r.id === req.params.id);
  if (!risk) {
    return res.status(404).json({ error: 'Risk not found' });
  }
  res.json(risk);
});

app.post('/api/risks', (req, res) => {
  const newRisk = {
    id: `R${String(risks.length + 1).padStart(3, '0')}`,
    ...req.body,
    inherentRisk: req.body.likelihood * req.body.impact,
    residualRisk: (req.body.likelihood * req.body.impact) * (1 - req.body.controlEffectiveness / 100),
    lastAssessed: new Date().toISOString()
  };
  
  risks.push(newRisk);
  res.status(201).json(newRisk);
});

app.put('/api/risks/:id', (req, res) => {
  const index = risks.findIndex(r => r.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Risk not found' });
  }
  
  risks[index] = {
    ...risks[index],
    ...req.body,
    inherentRisk: req.body.likelihood * req.body.impact,
    residualRisk: (req.body.likelihood * req.body.impact) * (1 - req.body.controlEffectiveness / 100),
    lastAssessed: new Date().toISOString()
  };
  
  res.json(risks[index]);
});

app.delete('/api/risks/:id', (req, res) => {
  const index = risks.findIndex(r => r.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Risk not found' });
  }
  
  risks.splice(index, 1);
  res.status(204).send();
});

// KPI endpoints
app.get('/api/kpis', (req, res) => {
  res.json(kpis);
});

app.get('/api/kpis/:id', (req, res) => {
  const kpi = kpis.find(k => k.id === req.params.id);
  if (!kpi) {
    return res.status(404).json({ error: 'KPI not found' });
  }
  res.json(kpi);
});

app.put('/api/kpis/:id', (req, res) => {
  const index = kpis.findIndex(k => k.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'KPI not found' });
  }
  
  kpis[index] = {
    ...kpis[index],
    ...req.body
  };
  
  res.json(kpis[index]);
});

// KRI endpoints
app.get('/api/kris', (req, res) => {
  res.json(kris);
});

app.get('/api/kris/:id', (req, res) => {
  const kri = kris.find(k => k.id === req.params.id);
  if (!kri) {
    return res.status(404).json({ error: 'KRI not found' });
  }
  res.json(kri);
});

app.put('/api/kris/:id', (req, res) => {
  const index = kris.findIndex(k => k.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'KRI not found' });
  }
  
  // Update status based on threshold
  const updatedKri = {
    ...kris[index],
    ...req.body
  };
  
  // Auto-calculate status
  if (updatedKri.current <= updatedKri.threshold) {
    updatedKri.status = 'green';
  } else if (updatedKri.current <= updatedKri.threshold * 1.2) {
    updatedKri.status = 'amber';
  } else {
    updatedKri.status = 'red';
  }
  
  kris[index] = updatedKri;
  res.json(kris[index]);
});

// Analytics endpoints
app.get('/api/analytics/risk-matrix', (req, res) => {
  const matrix = [];
  
  for (let likelihood = 1; likelihood <= 5; likelihood++) {
    for (let impact = 1; impact <= 5; impact++) {
      const count = risks.filter(r => 
        r.likelihood === likelihood && r.impact === impact
      ).length;
      
      if (count > 0) {
        matrix.push({
          likelihood,
          impact,
          count,
          riskLevel: likelihood * impact
        });
      }
    }
  }
  
  res.json(matrix);
});

app.get('/api/analytics/department-distribution', (req, res) => {
  const distribution = {};
  
  risks.forEach(risk => {
    if (!distribution[risk.department]) {
      distribution[risk.department] = {
        total: 0,
        high: 0,
        medium: 0,
        low: 0
      };
    }
    
    distribution[risk.department].total++;
    
    if (risk.inherentRisk >= 15) {
      distribution[risk.department].high++;
    } else if (risk.inherentRisk >= 7) {
      distribution[risk.department].medium++;
    } else {
      distribution[risk.department].low++;
    }
  });
  
  res.json(distribution);
});

// Reports endpoint
app.get('/api/reports/executive-summary', (req, res) => {
  const report = {
    generatedAt: new Date().toISOString(),
    period: 'Q4 2024',
    summary: {
      totalRisks: risks.length,
      averageInherentRisk: risks.reduce((sum, r) => sum + r.inherentRisk, 0) / risks.length,
      averageResidualRisk: risks.reduce((sum, r) => sum + r.residualRisk, 0) / risks.length,
      controlEffectivenessAverage: risks.reduce((sum, r) => sum + r.controlEffectiveness, 0) / risks.length
    },
    topRisks: risks
      .sort((a, b) => b.inherentRisk - a.inherentRisk)
      .slice(0, 5),
    kpiPerformance: kpis,
    kriAlerts: kris.filter(k => k.status !== 'green'),
    recommendations: [
      'Increase control measures for high-risk areas',
      'Review and update risk assessments quarterly',
      'Enhance monitoring of critical KRIs'
    ]
  };
  
  res.json(report);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║   Enterprise Risk Management API Server    ║
║                                            ║
║   Running on: http://localhost:${PORT}       ║
║   API Docs: http://localhost:${PORT}/api    ║
║                                            ║
║   Endpoints:                               ║
║   - GET  /api/dashboard/summary           ║
║   - GET  /api/risks                       ║
║   - POST /api/risks                       ║
║   - GET  /api/kpis                        ║
║   - GET  /api/kris                        ║
║   - GET  /api/analytics/risk-matrix       ║
║   - GET  /api/reports/executive-summary   ║
╚════════════════════════════════════════════╝
  `);
});