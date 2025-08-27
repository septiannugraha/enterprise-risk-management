// Risk Register JavaScript Functionality

// Use DataValidation module for dropdown data
const dv = DataValidation;

// Modal and Tab Management
function showAddRiskModal() {
    document.getElementById('riskModal').style.display = 'block';
    document.getElementById('modalTitle').textContent = 'Add New Risk';
    document.getElementById('riskForm').reset();
    showTab('basic');
}

function closeModal() {
    document.getElementById('riskModal').style.display = 'none';
}

function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + 'Tab').classList.add('active');
    event.target.classList.add('active');
}

// Dynamic dropdown loading
function loadStrategicObjectives() {
    const perspectiveSelect = document.getElementById('perspective');
    const objectiveSelect = document.getElementById('strategicObjective');
    const selectedPerspective = perspectiveSelect.value;
    
    // Clear existing options
    objectiveSelect.innerHTML = '<option value="">Select Strategic Objective</option>';
    
    if (selectedPerspective) {
        const objectives = dv.getStrategicObjectives(selectedPerspective);
        objectives.forEach(obj => {
            const option = document.createElement('option');
            option.value = obj.code;
            option.textContent = `${obj.code} - ${obj.name}`;
            objectiveSelect.appendChild(option);
        });
    }
}

function loadKPIs() {
    const objectiveSelect = document.getElementById('strategicObjective');
    const kpiSelect = document.getElementById('kpi');
    const selectedObjective = objectiveSelect.value;
    
    // Clear existing options
    kpiSelect.innerHTML = '<option value="">Select KPI</option>';
    
    if (selectedObjective) {
        const kpis = dv.getKPIs(selectedObjective);
        kpis.forEach(kpi => {
            const option = document.createElement('option');
            option.value = kpi.code;
            option.textContent = `${kpi.code} - ${kpi.name} (Target: ${kpi.target})`;
            kpiSelect.appendChild(option);
        });
    }
}

function loadKRIs() {
    // In real implementation, this would load KRIs based on selected KPI
    const kriSelect = document.getElementById('kri');
    kriSelect.innerHTML = '<option value="">Select KRI</option>';
    
    // Sample KRIs
    const sampleKRIs = [
        'Revenue variance from target',
        'Cost overrun percentage',
        'Customer churn rate',
        'System downtime hours'
    ];
    
    sampleKRIs.forEach((kri, index) => {
        const option = document.createElement('option');
        option.value = `KRI-${index + 1}`;
        option.textContent = kri;
        kriSelect.appendChild(option);
    });
}

// Information Asset toggle
function toggleInfoAsset() {
    const isChecked = document.getElementById('isInfoAsset').checked;
    document.getElementById('infoAssetFields').style.display = isChecked ? 'grid' : 'none';
}

// Risk Score Calculations
function calculateInherentRisk() {
    const likelihood = parseInt(document.getElementById('inherentLikelihood').value) || 0;
    const impact = parseInt(document.getElementById('inherentImpact').value) || 0;
    const score = likelihood * impact;
    
    const scoreDisplay = document.getElementById('inherentRiskScore');
    scoreDisplay.textContent = score > 0 ? score : '-';
    
    // Update color based on score
    updateRiskScoreColor(scoreDisplay, score);
    
    // Update risk matrix
    updateRiskMatrix('inherent', likelihood, impact);
}

function calculateResidualRisk() {
    const likelihood = parseInt(document.getElementById('residualLikelihood').value) || 0;
    const impact = parseInt(document.getElementById('residualImpact').value) || 0;
    const score = likelihood * impact;
    
    const scoreDisplay = document.getElementById('residualRiskScore');
    scoreDisplay.textContent = score > 0 ? score : '-';
    
    // Update color based on score
    updateRiskScoreColor(scoreDisplay, score);
}

function updateRiskScoreColor(element, score) {
    element.className = 'risk-score-display';
    
    if (score >= 20) {
        element.style.backgroundColor = '#C0392B';
        element.style.color = 'white';
    } else if (score >= 15) {
        element.style.backgroundColor = '#E74C3C';
        element.style.color = 'white';
    } else if (score >= 10) {
        element.style.backgroundColor = '#F39C12';
        element.style.color = 'white';
    } else if (score >= 5) {
        element.style.backgroundColor = '#F1C40F';
        element.style.color = '#333';
    } else if (score > 0) {
        element.style.backgroundColor = '#27AE60';
        element.style.color = 'white';
    }
}

// Risk Matrix Visualization
function updateRiskMatrix(type, likelihood, impact) {
    const matrixContainer = document.getElementById('riskMatrix');
    matrixContainer.innerHTML = '';
    
    // Create matrix grid
    // Header row
    matrixContainer.innerHTML += '<div class="matrix-cell matrix-header">L\\I</div>';
    for (let i = 1; i <= 5; i++) {
        matrixContainer.innerHTML += `<div class="matrix-cell matrix-header">${i}</div>`;
    }
    
    // Matrix rows (from 5 to 1 for likelihood)
    for (let l = 5; l >= 1; l--) {
        matrixContainer.innerHTML += `<div class="matrix-cell matrix-label">${l}</div>`;
        for (let i = 1; i <= 5; i++) {
            const score = l * i;
            let cellClass = 'matrix-cell';
            let cellStyle = '';
            
            // Determine cell color
            if (score >= 20) {
                cellStyle = 'background: #C0392B; color: white;';
            } else if (score >= 15) {
                cellStyle = 'background: #E74C3C; color: white;';
            } else if (score >= 10) {
                cellStyle = 'background: #F39C12; color: white;';
            } else if (score >= 5) {
                cellStyle = 'background: #F1C40F; color: #333;';
            } else {
                cellStyle = 'background: #27AE60; color: white;';
            }
            
            // Highlight selected cell
            if (l === likelihood && i === impact) {
                cellStyle += ' border: 3px solid #2C3E50; font-weight: bold;';
            }
            
            matrixContainer.innerHTML += `<div class="${cellClass}" style="${cellStyle}">${score}</div>`;
        }
    }
}

// Treatment fields toggle
function toggleTreatmentFields() {
    const treatmentOption = document.getElementById('treatmentOption').value;
    const treatmentFields = document.getElementById('treatmentFields');
    
    // Show fields only for Mitigate, Transfer, or Avoid
    treatmentFields.style.display = ['mitigate', 'transfer', 'avoid'].includes(treatmentOption) ? 'block' : 'none';
}

// Save Risk Function
function saveRisk() {
    // Validate required fields
    const requiredFields = [
        'perspective', 'strategicObjective', 'riskOwner', 
        'directorate', 'riskEvent', 'riskCategory',
        'inherentLikelihood', 'inherentImpact', 'treatmentOption'
    ];
    
    let isValid = true;
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field.value) {
            field.style.borderColor = 'red';
            isValid = false;
        } else {
            field.style.borderColor = '#ddd';
        }
    });
    
    if (!isValid) {
        alert('Please fill in all required fields');
        return;
    }
    
    // In real implementation, this would save to database via API
    alert('Risk saved successfully!');
    closeModal();
    
    // Refresh the risk table
    loadRiskData();
}

// Filter Functions
function applyFilters() {
    const perspective = document.getElementById('perspectiveFilter').value;
    const riskLevel = document.getElementById('riskLevelFilter').value;
    const owner = document.getElementById('ownerFilter').value;
    const status = document.getElementById('statusFilter').value;
    const search = document.getElementById('searchFilter').value.toLowerCase();
    
    // In real implementation, this would filter the data from API
    console.log('Applying filters:', { perspective, riskLevel, owner, status, search });
    
    // For now, just show a message
    // filterRiskTable({ perspective, riskLevel, owner, status, search });
}

// Action Functions
function editRisk(riskCode) {
    // Load risk data and show modal
    document.getElementById('modalTitle').textContent = `Edit Risk - ${riskCode}`;
    showAddRiskModal();
    
    // In real implementation, load risk data from API
    // loadRiskData(riskCode);
}

function viewRiskDetails(riskCode) {
    // In real implementation, show detailed view modal
    alert(`Viewing details for risk: ${riskCode}`);
}

function createRTP(riskCode) {
    // Navigate to RTP creation or show RTP modal
    alert(`Creating Risk Treatment Plan for: ${riskCode}`);
}

function viewControls(riskCode) {
    // Show controls detail modal
    alert(`Viewing controls for risk: ${riskCode}`);
}

function exportToExcel() {
    // In real implementation, trigger Excel export
    alert('Exporting Risk Register to Excel...');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Load initial data
    initializeDropdowns();
    
    // Initialize risk matrix
    updateRiskMatrix('inherent', 0, 0);
});

// Initialize all dropdowns with data
function initializeDropdowns() {
    // Load perspectives
    const perspectiveSelect = document.getElementById('perspective');
    perspectiveSelect.innerHTML = '<option value="">Select Perspective</option>';
    dv.perspectives.forEach(p => {
        const option = document.createElement('option');
        option.value = p.code;
        option.textContent = p.name;
        perspectiveSelect.appendChild(option);
    });
    
    // Load risk categories
    const categorySelect = document.getElementById('riskCategory');
    categorySelect.innerHTML = '<option value="">Select Risk Category</option>';
    dv.riskTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type.id;
        option.textContent = type.name;
        categorySelect.appendChild(option);
    });
    
    // Load directorates
    const directorateSelect = document.getElementById('directorate');
    directorateSelect.innerHTML = '<option value="">Select Directorate</option>';
    dv.directorates.forEach(dir => {
        const option = document.createElement('option');
        option.value = dir.code;
        option.textContent = dir.name;
        directorateSelect.appendChild(option);
    });
    
    // Load treatment options
    const treatmentSelect = document.getElementById('treatmentOption');
    treatmentSelect.innerHTML = '<option value="">Select Treatment Option</option>';
    dv.treatmentOptions.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt.value;
        option.textContent = opt.label;
        option.title = opt.description;
        treatmentSelect.appendChild(option);
    });
    
    // Load impact and likelihood scales
    const impactSelects = ['inherentImpact', 'residualImpact'];
    const likelihoodSelects = ['inherentLikelihood', 'residualLikelihood'];
    
    impactSelects.forEach(selectId => {
        const select = document.getElementById(selectId);
        select.innerHTML = '<option value="">Select Impact</option>';
        dv.impactScale.forEach(scale => {
            const option = document.createElement('option');
            option.value = scale.value;
            option.textContent = `${scale.value} - ${scale.label}`;
            option.title = scale.description;
            select.appendChild(option);
        });
    });
    
    likelihoodSelects.forEach(selectId => {
        const select = document.getElementById(selectId);
        select.innerHTML = '<option value="">Select Likelihood</option>';
        dv.likelihoodScale.forEach(scale => {
            const option = document.createElement('option');
            option.value = scale.value;
            option.textContent = `${scale.value} - ${scale.label}`;
            option.title = scale.description;
            select.appendChild(option);
        });
    });
    
    // Load control assessment options
    const implementSelect = document.getElementById('controlImplementation');
    implementSelect.innerHTML = '<option value="">Select</option>';
    dv.controlAssessment.implementation.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt.value;
        option.textContent = opt.label;
        implementSelect.appendChild(option);
    });
    
    const adequacySelect = document.getElementById('controlAdequacy');
    adequacySelect.innerHTML = '<option value="">Select</option>';
    dv.controlAssessment.adequacy.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt.value;
        option.textContent = opt.label;
        adequacySelect.appendChild(option);
    });
    
    const effectSelect = document.getElementById('controlEffectiveness');
    effectSelect.innerHTML = '<option value="">Select</option>';
    dv.controlAssessment.effectiveness.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt.value;
        option.textContent = opt.label;
        effectSelect.appendChild(option);
    });
    
    // Load SMKI aspects
    const smkiSelect = document.getElementById('smkiAspect');
    smkiSelect.innerHTML = '<option value="">Select Aspect</option>';
    dv.smkiAspects.forEach(aspect => {
        const option = document.createElement('option');
        option.value = aspect.value;
        option.textContent = aspect.label;
        option.title = aspect.description;
        smkiSelect.appendChild(option);
    });
}

// Load risk owners based on selected directorate
function loadRiskOwners() {
    const directorateSelect = document.getElementById('directorate');
    const ownerSelect = document.getElementById('riskOwner');
    const selectedDirectorate = directorateSelect.value;
    
    // Clear existing options
    ownerSelect.innerHTML = '<option value="">Select Risk Owner</option>';
    
    if (selectedDirectorate) {
        const owners = dv.getRiskOwners(selectedDirectorate);
        owners.forEach(owner => {
            const option = document.createElement('option');
            option.value = owner;
            option.textContent = owner;
            ownerSelect.appendChild(option);
        });
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('riskModal');
    if (event.target == modal) {
        closeModal();
    }
}