/**
 * Demo Data Generator
 * Generates realistic risk management data for demonstrations
 */

const departments = ['IT', 'Finance', 'Operations', 'Legal', 'HR', 'Sales', 'Marketing', 'Supply Chain'];
const categories = ['Operational', 'Financial', 'Compliance', 'Strategic', 'Reputational', 'Technology'];
const statuses = ['Active', 'Monitored', 'Controlled', 'Closed'];
const owners = [
  'John Smith', 'Jane Doe', 'Mike Johnson', 'Sarah Wilson', 
  'Robert Brown', 'Emma Davis', 'William Taylor', 'Olivia Martinez'
];

const riskTitles = {
  Operational: [
    'Supply Chain Disruption', 'System Downtime', 'Process Failure', 
    'Quality Control Issues', 'Service Level Breach'
  ],
  Financial: [
    'Market Volatility', 'Credit Risk', 'Currency Fluctuation', 
    'Budget Overrun', 'Revenue Shortfall'
  ],
  Compliance: [
    'Regulatory Non-Compliance', 'Data Privacy Violation', 'License Expiry',
    'Audit Findings', 'Policy Breach'
  ],
  Strategic: [
    'Market Share Loss', 'Competitor Advantage', 'Product Obsolescence',
    'Partnership Risk', 'Innovation Gap'
  ],
  Reputational: [
    'Brand Damage', 'Social Media Crisis', 'Customer Dissatisfaction',
    'Public Relations Issue', 'Stakeholder Trust'
  ],
  Technology: [
    'Cyber Security Breach', 'Data Loss', 'System Integration Failure',
    'Legacy System Risk', 'Technology Debt'
  ]
};

const mitigationStrategies = [
  'Implement automated monitoring',
  'Conduct regular audits',
  'Enhance training programs',
  'Update policies and procedures',
  'Implement backup systems',
  'Increase security measures',
  'Develop contingency plans',
  'Strengthen vendor management',
  'Improve documentation',
  'Regular stakeholder communication'
];

// Generate random number between min and max
function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Pick random item from array
function randomPick(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Pick multiple random items from array
function randomPickMultiple(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Generate a single risk
function generateRisk(id) {
  const category = randomPick(categories);
  const likelihood = randomBetween(1, 5);
  const impact = randomBetween(1, 5);
  const controlEffectiveness = randomBetween(20, 95);
  const inherentRisk = likelihood * impact;
  const residualRisk = inherentRisk * (1 - controlEffectiveness / 100);
  
  return {
    id: `R${String(id).padStart(3, '0')}`,
    title: randomPick(riskTitles[category]),
    category: category,
    department: randomPick(departments),
    likelihood: likelihood,
    impact: impact,
    inherentRisk: inherentRisk,
    controlEffectiveness: controlEffectiveness,
    residualRisk: parseFloat(residualRisk.toFixed(2)),
    status: randomPick(statuses),
    owner: randomPick(owners),
    description: `Risk assessment for ${category.toLowerCase()} category affecting ${randomPick(departments)} department operations.`,
    mitigations: randomPickMultiple(mitigationStrategies, randomBetween(2, 5)),
    lastAssessed: new Date(Date.now() - randomBetween(0, 90) * 24 * 60 * 60 * 1000).toISOString()
  };
}

// Generate multiple risks
function generateRisks(count = 50) {
  const risks = [];
  for (let i = 1; i <= count; i++) {
    risks.push(generateRisk(i));
  }
  return risks;
}

// Generate KPIs
function generateKPIs() {
  return [
    {
      id: 'KPI001',
      name: 'Revenue Growth',
      category: 'Financial',
      current: parseFloat((randomBetween(5, 20) + Math.random()).toFixed(1)),
      target: 15,
      unit: '%',
      trend: randomPick(['up', 'down', 'stable']),
      status: randomPick(['on-track', 'attention', 'critical'])
    },
    {
      id: 'KPI002',
      name: 'Customer Satisfaction',
      category: 'Customer',
      current: parseFloat((randomBetween(35, 50) / 10).toFixed(1)),
      target: 4.5,
      unit: 'score',
      trend: randomPick(['up', 'down', 'stable']),
      status: randomPick(['on-track', 'attention', 'critical'])
    },
    {
      id: 'KPI003',
      name: 'Operational Efficiency',
      category: 'Process',
      current: randomBetween(75, 95),
      target: 90,
      unit: '%',
      trend: randomPick(['up', 'down', 'stable']),
      status: randomPick(['on-track', 'attention', 'critical'])
    },
    {
      id: 'KPI004',
      name: 'Employee Retention',
      category: 'Learning & Growth',
      current: randomBetween(80, 98),
      target: 95,
      unit: '%',
      trend: randomPick(['up', 'down', 'stable']),
      status: randomPick(['on-track', 'attention', 'critical'])
    },
    {
      id: 'KPI005',
      name: 'Market Share',
      category: 'Strategic',
      current: parseFloat((randomBetween(15, 35) + Math.random()).toFixed(1)),
      target: 30,
      unit: '%',
      trend: randomPick(['up', 'down', 'stable']),
      status: randomPick(['on-track', 'attention', 'critical'])
    }
  ];
}

// Generate KRIs
function generateKRIs() {
  const kris = [
    {
      id: 'KRI001',
      name: 'Security Incidents',
      threshold: 5,
      current: randomBetween(0, 8),
      unit: 'incidents',
      category: 'Technology'
    },
    {
      id: 'KRI002',
      name: 'Compliance Violations',
      threshold: 0,
      current: randomBetween(0, 2),
      unit: 'violations',
      category: 'Compliance'
    },
    {
      id: 'KRI003',
      name: 'System Downtime',
      threshold: 4,
      current: parseFloat((randomBetween(0, 80) / 10).toFixed(1)),
      unit: 'hours',
      category: 'Operational'
    },
    {
      id: 'KRI004',
      name: 'Customer Complaints',
      threshold: 20,
      current: randomBetween(5, 35),
      unit: 'complaints',
      category: 'Customer'
    },
    {
      id: 'KRI005',
      name: 'Budget Variance',
      threshold: 5,
      current: parseFloat((randomBetween(0, 100) / 10).toFixed(1)),
      unit: '%',
      category: 'Financial'
    }
  ];
  
  // Calculate status based on threshold
  return kris.map(kri => {
    let status;
    if (kri.current <= kri.threshold) {
      status = 'green';
    } else if (kri.current <= kri.threshold * 1.2) {
      status = 'amber';
    } else {
      status = 'red';
    }
    
    return {
      ...kri,
      status,
      trend: randomPick(['improving', 'stable', 'worsening'])
    };
  });
}

// Generate executive report
function generateExecutiveReport(risks, kpis, kris) {
  const highRisks = risks.filter(r => r.inherentRisk >= 15);
  const avgInherentRisk = risks.reduce((sum, r) => sum + r.inherentRisk, 0) / risks.length;
  const avgResidualRisk = risks.reduce((sum, r) => sum + r.residualRisk, 0) / risks.length;
  const avgControlEffectiveness = risks.reduce((sum, r) => sum + r.controlEffectiveness, 0) / risks.length;
  
  return {
    generatedAt: new Date().toISOString(),
    period: 'Q4 2024',
    summary: {
      totalRisks: risks.length,
      highRisks: highRisks.length,
      averageInherentRisk: parseFloat(avgInherentRisk.toFixed(2)),
      averageResidualRisk: parseFloat(avgResidualRisk.toFixed(2)),
      controlEffectivenessAverage: parseFloat(avgControlEffectiveness.toFixed(1))
    },
    departmentBreakdown: departments.map(dept => {
      const deptRisks = risks.filter(r => r.department === dept);
      return {
        department: dept,
        riskCount: deptRisks.length,
        highRisks: deptRisks.filter(r => r.inherentRisk >= 15).length,
        avgResidualRisk: deptRisks.length > 0 
          ? parseFloat((deptRisks.reduce((sum, r) => sum + r.residualRisk, 0) / deptRisks.length).toFixed(2))
          : 0
      };
    }),
    topRisks: highRisks.slice(0, 5),
    kpiPerformance: {
      onTrack: kpis.filter(k => k.status === 'on-track').length,
      needsAttention: kpis.filter(k => k.status === 'attention').length,
      critical: kpis.filter(k => k.status === 'critical').length
    },
    kriAlerts: kris.filter(k => k.status !== 'green'),
    recommendations: [
      'Increase focus on high-risk areas in ' + randomPick(departments) + ' department',
      'Review and update control measures for ' + randomPick(categories) + ' risks',
      'Enhance monitoring frequency for critical KRIs',
      'Implement additional training for risk owners',
      'Consider automation opportunities for risk monitoring'
    ]
  };
}

// Generate complete dataset
function generateCompleteDataset() {
  const risks = generateRisks(50);
  const kpis = generateKPIs();
  const kris = generateKRIs();
  const report = generateExecutiveReport(risks, kpis, kris);
  
  return {
    risks,
    kpis,
    kris,
    report,
    metadata: {
      generated: new Date().toISOString(),
      version: '1.0.0',
      totalRecords: risks.length + kpis.length + kris.length
    }
  };
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    generateRisk,
    generateRisks,
    generateKPIs,
    generateKRIs,
    generateExecutiveReport,
    generateCompleteDataset
  };
}

// CLI usage
if (require.main === module) {
  const fs = require('fs');
  const path = require('path');
  
  console.log('Generating demo data...');
  const data = generateCompleteDataset();
  
  // Save to file
  const outputPath = path.join(__dirname, 'demo-data.json');
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
  
  console.log(`✓ Generated ${data.risks.length} risks`);
  console.log(`✓ Generated ${data.kpis.length} KPIs`);
  console.log(`✓ Generated ${data.kris.length} KRIs`);
  console.log(`✓ Data saved to ${outputPath}`);
  
  // Summary statistics
  console.log('\nSummary:');
  console.log(`- High Risks: ${data.risks.filter(r => r.inherentRisk >= 15).length}`);
  console.log(`- Medium Risks: ${data.risks.filter(r => r.inherentRisk >= 7 && r.inherentRisk < 15).length}`);
  console.log(`- Low Risks: ${data.risks.filter(r => r.inherentRisk < 7).length}`);
  console.log(`- Average Control Effectiveness: ${data.report.summary.controlEffectivenessAverage}%`);
  console.log(`- Red KRIs: ${data.kris.filter(k => k.status === 'red').length}`);
}