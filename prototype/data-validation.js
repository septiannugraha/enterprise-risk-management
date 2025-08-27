// Data Validation Module - Based on Template Excel Structure
// This module provides dropdown data and validation rules

const DataValidation = {
    // Perspectives (BSC)
    perspectives: [
        { code: 'F', name: 'Financial' },
        { code: 'C', name: 'Customer' },
        { code: 'IBP', name: 'Internal Business Process' },
        { code: 'L&G', name: 'Learning & Growth' }
    ],

    // Strategic Objectives mapped to perspectives
    strategicObjectives: {
        'F': [
            { code: 'F.1', name: 'Increase Shareholders Value' },
            { code: 'F.2', name: 'Increase Sales Revenue' },
            { code: 'F.3', name: 'Maintain Cost Efficiency' },
            { code: 'F.4', name: 'Effective Cashflow Management' }
        ],
        'C': [
            { code: 'C.1', name: 'Enhance Customer Satisfaction' },
            { code: 'C.2', name: 'Expand Market Share' },
            { code: 'C.3', name: 'Build Strong Brand Image' },
            { code: 'C.4', name: 'Improve Service Quality' }
        ],
        'IBP': [
            { code: 'IBP.1', name: 'Improve Operational Efficiency' },
            { code: 'IBP.2', name: 'Enhance IT Infrastructure' },
            { code: 'IBP.3', name: 'Strengthen Risk Management Process' },
            { code: 'IBP.4', name: 'Optimize Business Process' }
        ],
        'L&G': [
            { code: 'L&G.1', name: 'Enhance Employee Capabilities' },
            { code: 'L&G.2', name: 'Improve Corporate Culture' },
            { code: 'L&G.3', name: 'Develop Leadership Pipeline' },
            { code: 'L&G.4', name: 'Foster Innovation' }
        ]
    },

    // KPIs mapped to strategic objectives
    kpis: {
        'F.1': [
            { code: 'F.1.1', name: 'Return on Equity (ROE)', target: '9.5%' },
            { code: 'F.1.2', name: 'Return on Assets (ROA)', target: '2.5%' },
            { code: 'F.1.3', name: 'Net Profit Margin', target: '15%' }
        ],
        'F.2': [
            { code: 'F.2.1', name: 'Revenue Growth Rate', target: '10%' },
            { code: 'F.2.2', name: 'New Product Revenue', target: '20%' },
            { code: 'F.2.3', name: 'Market Share Growth', target: '5%' }
        ],
        'F.3': [
            { code: 'F.3.1', name: 'Operating Expense Ratio', target: '<85%' },
            { code: 'F.3.2', name: 'Cost per Transaction', target: '<Rp 50,000' }
        ],
        'F.4': [
            { code: 'F.4.1', name: 'Cash Conversion Cycle', target: '<30 days' },
            { code: 'F.4.2', name: 'Current Ratio', target: '>1.5' }
        ],
        'C.1': [
            { code: 'C.1.1', name: 'Customer Satisfaction Score', target: '>4.5' },
            { code: 'C.1.2', name: 'Net Promoter Score', target: '>50' }
        ],
        'C.2': [
            { code: 'C.2.1', name: 'Market Share Percentage', target: '25%' },
            { code: 'C.2.2', name: 'New Customer Acquisition', target: '100/month' }
        ],
        'IBP.1': [
            { code: 'IBP.1.1', name: 'Process Cycle Time', target: '<5 days' },
            { code: 'IBP.1.2', name: 'First Time Right Rate', target: '>95%' }
        ],
        'L&G.1': [
            { code: 'L&G.1.1', name: 'Training Hours per Employee', target: '40 hours' },
            { code: 'L&G.1.2', name: 'Employee Engagement Score', target: '>4.0' }
        ]
    },

    // Risk Types
    riskTypes: [
        { id: 'strategic', name: 'Strategic Risk' },
        { id: 'operational', name: 'Operational Risk' },
        { id: 'financial', name: 'Financial Risk' },
        { id: 'compliance', name: 'Compliance Risk' },
        { id: 'reputational', name: 'Reputational Risk' },
        { id: 'credit', name: 'Credit Risk' },
        { id: 'market', name: 'Market Risk' },
        { id: 'liquidity', name: 'Liquidity Risk' }
    ],

    // Risk Categories (sub-categories)
    riskCategories: {
        'strategic': ['Business Model', 'Competition', 'Customer Preferences', 'Industry Changes'],
        'operational': ['Process Failure', 'System Failure', 'Human Error', 'External Events'],
        'financial': ['Revenue Loss', 'Cost Overrun', 'Budget Variance', 'Investment Loss'],
        'compliance': ['Regulatory Change', 'Legal Issues', 'Policy Violation', 'License Issues'],
        'reputational': ['Negative Publicity', 'Customer Complaints', 'Social Media', 'Ethics Violations'],
        'credit': ['Default Risk', 'Concentration Risk', 'Counterparty Risk', 'Settlement Risk'],
        'market': ['Interest Rate', 'Foreign Exchange', 'Commodity Price', 'Equity Price'],
        'liquidity': ['Funding Risk', 'Market Liquidity', 'Asset Liquidity', 'Operational Liquidity']
    },

    // Directorates
    directorates: [
        { code: 'ERC', name: 'Enterprise Risk Committee' },
        { code: 'LCO', name: 'Legal & Compliance Office' },
        { code: 'RATING', name: 'Rating Division' },
        { code: 'BOD', name: 'Board of Directors' },
        { code: 'MBD', name: 'Marketing & Business Development' },
        { code: 'HRG', name: 'Human Resources & General Affairs' },
        { code: 'ITE', name: 'Information Technology' },
        { code: 'IAD', name: 'Internal Audit Division' },
        { code: 'FIN', name: 'Finance Division' }
    ],

    // Risk Owners by Directorate
    riskOwners: {
        'ERC': ['Chief Risk Officer', 'Risk Manager', 'Risk Analyst'],
        'LCO': ['Chief Legal Officer', 'Compliance Manager', 'Legal Counsel'],
        'RATING': ['Chief Rating Officer', 'Senior Analyst', 'Rating Analyst'],
        'BOD': ['CEO', 'President Director', 'Independent Director'],
        'MBD': ['Chief Marketing Officer', 'Business Development Manager', 'Marketing Manager'],
        'HRG': ['Chief HR Officer', 'HR Manager', 'GA Manager'],
        'ITE': ['Chief Technology Officer', 'IT Manager', 'System Administrator'],
        'IAD': ['Chief Audit Executive', 'Senior Auditor', 'Internal Auditor'],
        'FIN': ['Chief Financial Officer', 'Finance Manager', 'Treasury Manager']
    },

    // Impact and Likelihood Scales
    impactScale: [
        { value: 1, label: 'Very Low', description: 'Negligible impact on objectives' },
        { value: 2, label: 'Low', description: 'Minor impact on objectives' },
        { value: 3, label: 'Medium', description: 'Moderate impact on objectives' },
        { value: 4, label: 'High', description: 'Significant impact on objectives' },
        { value: 5, label: 'Very High', description: 'Severe impact on objectives' }
    ],

    likelihoodScale: [
        { value: 1, label: 'Very Low', description: 'Less than 10% chance' },
        { value: 2, label: 'Low', description: '10-30% chance' },
        { value: 3, label: 'Medium', description: '30-50% chance' },
        { value: 4, label: 'High', description: '50-80% chance' },
        { value: 5, label: 'Very High', description: 'More than 80% chance' }
    ],

    // Control Assessment Options
    controlAssessment: {
        implementation: [
            { value: 'fully', label: 'Fully Implemented' },
            { value: 'partial', label: 'Partially Implemented' },
            { value: 'not', label: 'Not Implemented' }
        ],
        adequacy: [
            { value: 'adequate', label: 'Adequate' },
            { value: 'partial', label: 'Partially Adequate' },
            { value: 'inadequate', label: 'Inadequate' }
        ],
        effectiveness: [
            { value: 'effective', label: 'Effective' },
            { value: 'partial', label: 'Partially Effective' },
            { value: 'ineffective', label: 'Ineffective' }
        ]
    },

    // Treatment Options
    treatmentOptions: [
        { value: 'accept', label: 'Accept', description: 'Accept the risk without further action' },
        { value: 'mitigate', label: 'Mitigate', description: 'Implement controls to reduce risk' },
        { value: 'transfer', label: 'Transfer', description: 'Transfer risk to third party (e.g., insurance)' },
        { value: 'avoid', label: 'Avoid', description: 'Eliminate the risk by avoiding the activity' }
    ],

    // SMKI/ISMS Aspects
    smkiAspects: [
        { value: 'C', label: 'Confidentiality', description: 'Protection of information from unauthorized access' },
        { value: 'I', label: 'Integrity', description: 'Accuracy and completeness of information' },
        { value: 'A', label: 'Availability', description: 'Accessibility of information when needed' }
    ],

    // Status Options
    statusOptions: [
        { value: 'draft', label: 'Draft' },
        { value: 'review', label: 'Under Review' },
        { value: 'approved', label: 'Approved' },
        { value: 'archived', label: 'Archived' }
    ],

    // Helper Functions
    getStrategicObjectives(perspectiveCode) {
        return this.strategicObjectives[perspectiveCode] || [];
    },

    getKPIs(objectiveCode) {
        return this.kpis[objectiveCode] || [];
    },

    getRiskCategories(riskType) {
        return this.riskCategories[riskType] || [];
    },

    getRiskOwners(directorate) {
        return this.riskOwners[directorate] || [];
    },

    // Validation Rules
    validateRiskScore(likelihood, impact) {
        const score = likelihood * impact;
        let level, color;

        if (score >= 20) {
            level = 'Very High';
            color = '#C0392B';
        } else if (score >= 15) {
            level = 'High';
            color = '#E74C3C';
        } else if (score >= 10) {
            level = 'Medium';
            color = '#F39C12';
        } else if (score >= 5) {
            level = 'Low';
            color = '#F1C40F';
        } else {
            level = 'Very Low';
            color = '#27AE60';
        }

        return { score, level, color };
    },

    // Generate Risk Code
    generateRiskCode(perspective, sequence) {
        const year = new Date().getFullYear();
        const paddedSequence = String(sequence).padStart(3, '0');
        return `RR-${perspective}-${year}-${paddedSequence}`;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataValidation;
}