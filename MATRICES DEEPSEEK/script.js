// State variables
let currentMatrix = [];
let currentMatrixB = [];
let vectorB = [];
let currentSize = 3;
let currentSizeB = 3;
const EPSILON = 1e-10; // Small number for float comparisons

// --- UI & Initialization ---

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('matrixSize').value = currentSize;
    document.getElementById('matrixSizeB').value = currentSizeB;
    generateMatrix();
    generateMatrixB();
    generateSystemVector();
});

function showTab(tabName, event) {
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');

    if (tabName === 'operations') {
        updateMatrixADisplay();
    }
    if (tabName === 'systems') {
        updateSystemMatrixDisplay();
    }
}

function generateMatrix() {
    currentSize = parseInt(document.getElementById('matrixSize').value);
    const container = document.getElementById('matrixContainer');
    container.innerHTML = createMatrixInputHTML('cell', currentSize, currentSize);
    updateMatrix();
}

function generateMatrixB() {
    currentSizeB = parseInt(document.getElementById('matrixSizeB').value);
    const container = document.getElementById('matrixBContainer');
    container.innerHTML = createMatrixInputHTML('cellB', currentSizeB, currentSizeB);
    updateMatrixB();
}

function generateSystemVector() {
    const container = document.getElementById('vectorBContainer');
    vectorB = new Array(currentSize).fill(0);
    let html = '<table>';
    for (let i = 0; i < currentSize; i++) {
        html += `<tr><td><input type="number" class="matrix-input" id="vectorB-${i}" step="any" value="0" onchange="updateVectorB()"></td></tr>`;
    }
    html += '</table>';
    container.innerHTML = html;
    updateVectorB();
}

// --- Data Update Functions ---

function updateMatrix() {
    currentMatrix = readMatrixFromDOM('cell', currentSize, currentSize);
}

function updateMatrixB() {
    currentMatrixB = readMatrixFromDOM('cellB', currentSizeB, currentSizeB);
}

function updateVectorB() {
    vectorB = [];
    for (let i = 0; i < currentSize; i++) {
        const element = document.getElementById(`vectorB-${i}`);
        vectorB.push(element ? parseFloat(element.value) || 0 : 0);
    }
}

// --- Filling Functions ---

function fillRandom() {
    for (let i = 0; i < currentSize; i++) {
        for (let j = 0; j < currentSize; j++) {
            document.getElementById(`cell-${i}-${j}`).value = Math.floor(Math.random() * 20) - 10;
        }
    }
    updateMatrix();
}

function fillRandomVector() {
    for (let i = 0; i < currentSize; i++) {
        const element = document.getElementById(`vectorB-${i}`);
        if (element) element.value = Math.floor(Math.random() * 20) - 10;
    }
    updateVectorB();
}

function fillIdentity() {
    for (let i = 0; i < currentSize; i++) {
        for (let j = 0; j < currentSize; j++) {
            document.getElementById(`cell-${i}-${j}`).value = (i === j) ? 1 : 0;
        }
    }
    updateMatrix();
}

function fillZeros() {
    for (let i = 0; i < currentSize; i++) {
        for (let j = 0; j < currentSize; j++) {
            document.getElementById(`cell-${i}-${j}`).value = 0;
        }
    }
    updateMatrix();
}

// --- Display & Helper Functions ---

function updateMatrixADisplay() {
    document.getElementById('matrixADisplay').innerHTML = matrixToHTML(currentMatrix);
}

function updateSystemMatrixDisplay() {
    document.getElementById('systemMatrixDisplay').innerHTML = matrixToHTML(currentMatrix);
}

function showResult(html) {
    document.getElementById('result').innerHTML = `<div class="result">${html}</div>`;
    document.getElementById('steps').innerHTML = ''; // Clear steps
}

function showError(message) {
    document.getElementById('result').innerHTML = `<div class="error"><h4>Error</h4><p>${message}</p></div>`;
    document.getElementById('steps').innerHTML = '';
}

function showSteps(html) {
     document.getElementById('steps').innerHTML = `<h3>Pasos Detallados</h3>${html}`;
}

function matrixToHTML(matrix, precision = 4) {
    let html = '<table>';
    matrix.forEach(row => {
        html += '<tr>';
        row.forEach(cell => {
            html += `<td>${Number.isInteger(cell) ? cell : cell.toFixed(precision)}</td>`;
        });
        html += '</tr>';
    });
    html += '</table>';
    return html;
}

function vectorToHTML(vector, precision = 4) {
    let html = '<table><tr>';
    // FIX: The vector was being passed as [[v1, v2, ...]], so we iterate over the first element.
    if (vector && vector.length > 0 && Array.isArray(vector[0])) {
        vector[0].forEach(val => {
             html += `<td>${Number.isInteger(val) ? val : val.toFixed(precision)}</td>`;
        });
    } else if (vector && vector.length > 0) {
        vector.forEach(val => {
             html += `<td>${Number.isInteger(val) ? val : val.toFixed(precision)}</td>`;
        });
    }
    html += '</tr></table>';
    return html;
}

function createMatrixInputHTML(idPrefix, rows, cols) {
    let html = '<table>';
    for (let i = 0; i < rows; i++) {
        html += '<tr>';
        for (let j = 0; j < cols; j++) {
            html += `<td><input type="number" class="matrix-input" id="${idPrefix}-${i}-${j}" step="any" value="0" onchange="update${idPrefix.includes('B') ? 'MatrixB' : 'Matrix'}()"></td>`;
        }
        html += '</tr>';
    }
    html += '</table>';
    return html;
}

function readMatrixFromDOM(idPrefix, rows, cols) {
    const matrix = [];
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
            const value = parseFloat(document.getElementById(`${idPrefix}-${i}-${j}`).value) || 0;
            row.push(value);
        }
        matrix.push(row);
    }
    return matrix;
}

function cloneMatrix(matrix) {
    return matrix.map(row => [...row]);
}

// --- LaTeX Export Functions ---

function copyMatrixToLatex(matrix, matrixName = 'A') {
    if (!matrix || matrix.length === 0) {
        showError("No hay matriz para exportar");
        return;
    }
    
    let latexCode = `\\begin{bmatrix}\n`;
    
    for (let i = 0; i < matrix.length; i++) {
        let row = matrix[i].map(num => {
            // Formatear números para LaTeX
            if (Number.isInteger(num)) {
                return num.toString();
            } else {
                // Redondear a 4 decimales para números flotantes
                return Math.abs(num) < 1e-10 ? '0' : num.toFixed(4);
            }
        }).join(' & ');
        
        latexCode += '  ' + row;
        if (i < matrix.length - 1) {
            latexCode += ' \\\\\n';
        }
    }
    
    latexCode += '\n\\end{bmatrix}';
    
    // Crear un área de texto temporal para copiar
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = latexCode;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextArea);
    
    // Mostrar el código LaTeX en la interfaz
    document.getElementById('latexOutput').innerHTML = `
        <div class="result">
            <h3>📋 Código LaTeX para la matriz ${matrixName}</h3>
            <p>El código LaTeX se ha copiado al portapapeles. Puedes pegarlo directamente en un chatbot LLM.</p>
            <div class="latex-output">${latexCode.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;')}</div>
        </div>
    `;
    
    return latexCode;
}

function copyVectorToLatex(vector, vectorName = 'b') {
    if (!vector || vector.length === 0) {
        showError("No hay vector para exportar");
        return;
    }
    
    let latexCode = `\\begin{bmatrix}\n`;
    
    for (let i = 0; i < vector.length; i++) {
        let val = vector[i];
        let formattedVal = Number.isInteger(val) ? val.toString() : 
                             (Math.abs(val) < 1e-10 ? '0' : val.toFixed(4));
        
        latexCode += '  ' + formattedVal;
        if (i < vector.length - 1) {
            latexCode += ' \\\\\n';
        }
    }
    
    latexCode += '\n\\end{bmatrix}';
    
    // Crear un área de texto temporal para copiar
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = latexCode;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextArea);
    
    // Mostrar el código LaTeX en la interfaz
    document.getElementById('latexOutput').innerHTML = `
        <div class="result">
            <h3>📋 Código LaTeX para el vector ${vectorName}</h3>
            <p>El código LaTeX se ha copiado al portapapeles. Puedes pegarlo directamente en un chatbot LLM.</p>
            <div class="latex-output">${latexCode.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;')}</div>
        </div>
    `;
    
    return latexCode;
}

// --- Core Mathematical Functions ---

/**
 * Performs LU decomposition on a matrix.
 * @returns { {L: number[][], U: number[][], P: number[], detSign: number} | null }
 */
function luDecompositionCore(matrix) {
    const n = matrix.length;
    let A = cloneMatrix(matrix);
    const P = Array.from({ length: n }, (_, i) => i); // Permutation vector
    let detSign = 1;

    for (let i = 0; i < n; i++) {
        // Pivoting
        let maxRow = i;
        for (let k = i + 1; k < n; k++) {
            if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) {
                maxRow = k;
            }
        }
        if (i !== maxRow) {
            [A[i], A[maxRow]] = [A[maxRow], A[i]];
            [P[i], P[maxRow]] = [P[maxRow], P[i]];
            detSign *= -1;
        }

        if (Math.abs(A[i][i]) < EPSILON) {
            return null; // Singular matrix
        }

        for (let j = i + 1; j < n; j++) {
            const factor = A[j][i] / A[i][i];
            A[j][i] = factor; // Store L part
            for (let k = i + 1; k < n; k++) {
                A[j][k] -= factor * A[i][k];
            }
        }
    }

    const L = Array.from({ length: n }, () => Array(n).fill(0));
    const U = Array.from({ length: n }, () => Array(n).fill(0));

    for (let i = 0; i < n; i++) {
        L[i][i] = 1;
        for (let j = 0; j < n; j++) {
            if (j < i) {
                L[i][j] = A[i][j];
            } else {
                U[i][j] = A[i][j];
            }
        }
    }
    return { L, U, P, detSign };
}

// --- Button Click Handlers ---

// ## Basic Operations ##

function calculateDeterminantDisplay() {
    updateMatrix();
    const { det } = calculateDeterminant(currentMatrix);
    
    showResult(`
        <h3>📊 Determinante</h3>
        <p><strong>det(A) = ${det.toFixed(6)}</strong></p>
        <div class="method-explanation">
            Calculado usando descomposición LU, que es un método eficiente (O(n³)). El determinante es el producto de la diagonal de la matriz U, ajustado por los intercambios de filas.
        </div>
        <ul>
            <li>det ≈ 0 → Matriz singular (no invertible).</li>
            <li>det ≠ 0 → Matriz invertible.</li>
            <li>|det| representa el factor de escalamiento de volumen.</li>
        </ul>
    `);
}

function calculateDeterminant(matrix) {
    const n = matrix.length;
    const decomp = luDecompositionCore(matrix);
    if (!decomp) return { det: 0, steps: "La matriz es singular." };
    
    let det = decomp.detSign;
    for (let i = 0; i < n; i++) {
        det *= decomp.U[i][i];
    }
    return { det };
}

function calculateTrace() {
    updateMatrix();
    let trace = 0;
    for (let i = 0; i < currentSize; i++) {
        trace += currentMatrix[i][i];
    }
    showResult(`
        <h3>📈 Traza de la Matriz</h3>
        <p><strong>tr(A) = ${trace}</strong></p>
        <p>La traza es la suma de los elementos de la diagonal principal. Es igual a la suma de los valores propios.</p>
    `);
}

function calculateRank() {
    updateMatrix();
    const decomp = luDecompositionCore(currentMatrix);
    let rank = 0;
    if (decomp) {
         for (let i = 0; i < currentSize; i++) {
            if (Math.abs(decomp.U[i][i]) > EPSILON) {
                rank++;
            }
        }
    }
    showResult(`
        <h3>📏 Rango de la Matriz</h3>
        <p><strong>rank(A) = ${rank}</strong></p>
        <p>El rango es el número de pivotes no nulos en la forma escalonada (matriz U). Representa el número de filas/columnas linealmente independientes.</p>
    `);
}

function calculateInverse() {
    updateMatrix();
    try {
        const inverse = invertMatrix(currentMatrix);
        showResult(`
            <h3>🔄 Matriz Inversa A⁻¹</h3>
            ${matrixToHTML(inverse)}
            <div class="method-explanation">
                Calculada usando el método de eliminación de Gauss-Jordan. Se aumenta la matriz A con la identidad [A|I] y se aplican operaciones de fila hasta obtener [I|A⁻¹].
            </div>
        `);
    } catch (e) {
        showError(e.message);
    }
}

function invertMatrix(matrix) {
    const n = matrix.length;
    if (n !== matrix[0].length) throw new Error("La matriz debe ser cuadrada.");

    const augmented = matrix.map((row, i) => [...row, ...Array.from({length: n}, (_, j) => i === j ? 1 : 0)]);

    for (let i = 0; i < n; i++) {
        // Pivoting
        let maxRow = i;
        for (let k = i + 1; k < n; k++) {
            if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
                maxRow = k;
            }
        }
        [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];

        const pivot = augmented[i][i];
        if (Math.abs(pivot) < EPSILON) throw new Error("La matriz es singular y no puede ser invertida.");

        // Normalize row
        for (let j = i; j < 2 * n; j++) {
            augmented[i][j] /= pivot;
        }

        // Eliminate other rows
        for (let k = 0; k < n; k++) {
            if (k !== i) {
                const factor = augmented[k][i];
                for (let j = i; j < 2 * n; j++) {
                    augmented[k][j] -= factor * augmented[i][j];
                }
            }
        }
    }

    return augmented.map(row => row.slice(n));
}

function transposeMatrixDisplay() {
    updateMatrix();
    const transposed = transpose(currentMatrix);
    showResult(`
        <h3>↗️ Matriz Transpuesta Aᵀ</h3>
        ${matrixToHTML(transposed)}
        <p>La transpuesta intercambia filas por columnas: (Aᵀ)ᵢⱼ = Aⱼᵢ.</p>
    `);
}

function transpose(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const transposed = Array.from({ length: cols }, () => Array(rows));
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            transposed[j][i] = matrix[i][j];
        }
    }
    return transposed;
}

// ## Advanced Analysis ##

function calculateEigenvalues() {
    updateMatrix();
    try {
        if (!isSymmetric(currentMatrix)) {
             showError("El cálculo de valores propios está implementado solo para matrices simétricas en esta versión (usa el algoritmo de Jacobi).");
             return;
        }
        const { eigenvalues, eigenvectors } = jacobiEigenvalue(currentMatrix);
        let html = `<h3>λ Valores y Vectores Propios</h3>
                    <div class="method-explanation">Calculado con el método de Jacobi, un algoritmo iterativo para matrices simétricas.</div>`;
        
        eigenvalues.forEach((val, i) => {
            html += `<div class="eigenvalue-display">
                        <h4>Valor Propio λ_${i+1} = ${val.toFixed(6)}</h4>
                        <p>Vector Propio v_${i+1}:</p>
                        ${vectorToHTML([eigenvectors[i]])}
                     </div>`;
        });
        showResult(html);

    } catch (e) {
        showError(e.message);
    }
}

function jacobiEigenvalue(matrix, maxIterations = 100) {
    const n = matrix.length;
    let A = cloneMatrix(matrix);
    let V = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));

    for (let iter = 0; iter < maxIterations; iter++) {
        let p = 0, q = 1;
        let maxOffDiagonal = Math.abs(A[p][q]);
        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                if (Math.abs(A[i][j]) > maxOffDiagonal) {
                    maxOffDiagonal = Math.abs(A[i][j]);
                    p = i;
                    q = j;
                }
            }
        }

        if (maxOffDiagonal < EPSILON) break;

        const app = A[p][p];
        const aqq = A[q][q];
        const apq = A[p][q];

        const tau = (aqq - app) / (2 * apq);
        const t = Math.sign(tau) / (Math.abs(tau) + Math.sqrt(1 + tau * tau));
        const c = 1 / Math.sqrt(1 + t * t);
        const s = c * t;

        const R = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
        R[p][p] = c; R[p][q] = s;
        R[q][p] = -s; R[q][q] = c;

        A = multiply(transpose(R), multiply(A, R));
        V = multiply(V, R);
    }

    const eigenvalues = A.map((row, i) => A[i][i]);
    const eigenvectors = transpose(V);
    return { eigenvalues, eigenvectors };
}

function checkSymmetric() {
    updateMatrix();
    const symmetric = isSymmetric(currentMatrix);
    showResult(`
        <h3>⚖️ Simetría</h3>
        <p>¿La matriz es simétrica (A = Aᵀ)? <strong>${symmetric ? 'Sí' : 'No'}</strong></p>
    `);
}

function isSymmetric(matrix) {
    const n = matrix.length;
    if (n !== matrix[0].length) return false;
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            if (Math.abs(matrix[i][j] - matrix[j][i]) > EPSILON) return false;
        }
    }
    return true;
}

function checkOrthogonal() {
    updateMatrix();
    try {
        const A = currentMatrix;
        const AT = transpose(A);
        const A_AT = multiply(A, AT);
        const I = Array.from({ length: currentSize }, (_, i) => Array.from({ length: currentSize }, (_, j) => (i === j ? 1 : 0)));
        
        let isOrthogonal = true;
        for (let i = 0; i < currentSize; i++) {
            for (let j = 0; j < currentSize; j++) {
                if (Math.abs(A_AT[i][j] - I[i][j]) > EPSILON) {
                    isOrthogonal = false;
                    break;
                }
            }
            if (!isOrthogonal) break;
        }

        showResult(`
            <h3>⟂ Ortogonalidad</h3>
            <p>Una matriz A es ortogonal si A * Aᵀ = I.</p>
            <p>¿La matriz es ortogonal? <strong>${isOrthogonal ? 'Sí' : 'No'}</strong></p>
            <h4>A × Aᵀ = </h4>
            ${matrixToHTML(A_AT)}
        `);
    } catch (e) {
        showError(e.message);
    }
}

// ## Decompositions ##

function luDecomposition() {
    updateMatrix();
    const decomp = luDecompositionCore(currentMatrix);
    if (!decomp) {
        showError("La matriz es singular, no se puede realizar la descomposición LU única.");
        return;
    }
    const { L, U, P } = decomp;
    // Reorder L and U based on P for display
    const PMatrix = Array.from({ length: currentSize }, () => Array(currentSize).fill(0));
    P.forEach((val, i) => PMatrix[i][val] = 1);

    showResult(`
        <h3>LU Descomposición (con pivoteo)</h3>
        <p>Se descompone A en PA = LU, donde P es una matriz de permutación, L es triangular inferior y U es triangular superior.</p>
        <h4>Matriz de Permutación P</h4>
        ${matrixToHTML(transpose(PMatrix))}
        <h4>Matriz L (Triangular Inferior)</h4>
        ${matrixToHTML(L)}
        <h4>Matriz U (Triangular Superior)</h4>
        ${matrixToHTML(U)}
    `);
}

function qrDecomposition() {
    updateMatrix();
    try {
        const { Q, R } = gramSchmidt(currentMatrix);
        showResult(`
            <h3>QR Descomposición</h3>
            <p>Se descompone A en QR, donde Q es una matriz ortogonal y R es triangular superior.</p>
            <h4>Matriz Q (Ortogonal)</h4>
            ${matrixToHTML(Q)}
            <h4>Matriz R (Triangular Superior)</h4>
            ${matrixToHTML(R)}
        `);
    } catch (e) {
        showError(e.message);
    }
}

function gramSchmidt(matrix) {
    const n = matrix.length;
    const A = transpose(matrix); // Work with columns
    const Q = Array.from({ length: n }, () => Array(n).fill(0));
    const R = Array.from({ length: n }, () => Array(n).fill(0));

    for (let j = 0; j < n; j++) {
        let v = A[j];
        for (let i = 0; i < j; i++) {
            R[i][j] = dotProduct(Q[i], A[j]);
            v = v.map((val, k) => val - R[i][j] * Q[i][k]);
        }
        const norm = vectorNorm(v);
        if (norm < EPSILON) throw new Error("Las columnas de la matriz son linealmente dependientes.");
        R[j][j] = norm;
        Q[j] = v.map(val => val / norm);
    }
    return { Q: transpose(Q), R };
}

function choleskyDecomposition() {
    updateMatrix();
    if (!isSymmetric(currentMatrix)) {
        showError("La descomposición de Cholesky solo se aplica a matrices simétricas.");
        return;
    }
    try {
        const L = cholesky(currentMatrix);
        const LT = transpose(L);
        showResult(`
            <h3>Descomposición de Cholesky</h3>
            <p>Se descompone A en L * Lᵀ, donde L es triangular inferior. Requiere que A sea simétrica y definida positiva.</p>
            <h4>Matriz L (Triangular Inferior)</h4>
            ${matrixToHTML(L)}
            <h4>Matriz Lᵀ (Transpuesta)</h4>
            ${matrixToHTML(LT)}
        `);
    } catch (e) {
        showError(e.message);
    }
}

function cholesky(matrix) {
    const n = matrix.length;
    const L = Array.from({ length: n }, () => Array(n).fill(0));

    for (let i = 0; i < n; i++) {
        for (let j = 0; j <= i; j++) {
            let sum = 0;
            for (let k = 0; k < j; k++) {
                sum += L[i][k] * L[j][k];
            }
            if (i === j) {
                const val = matrix[i][i] - sum;
                if (val < 0) throw new Error("La matriz no es definida positiva.");
                L[i][j] = Math.sqrt(val);
            } else {
                if (Math.abs(L[j][j]) < EPSILON) throw new Error("División por cero, la matriz no es definida positiva.");
                L[i][j] = (matrix[i][j] - sum) / L[j][j];
            }
            }
        }
    return L;
}

// ## Dual Operations ##

function addMatrices() {
    updateMatrix();
    updateMatrixB();
    if (currentSize !== currentSizeB) {
        showError("Las matrices deben tener las mismas dimensiones para ser sumadas.");
        return;
    }
    const result = currentMatrix.map((row, i) => row.map((val, j) => val + currentMatrixB[i][j]));
    showResult(`<h3>Suma A + B</h3>${matrixToHTML(result)}`);
}

function subtractMatrices() {
    updateMatrix();
    updateMatrixB();
    if (currentSize !== currentSizeB) {
        showError("Las matrices deben tener las mismas dimensiones para ser restadas.");
        return;
    }
    const result = currentMatrix.map((row, i) => row.map((val, j) => val - currentMatrixB[i][j]));
    showResult(`<h3>Resta A - B</h3>${matrixToHTML(result)}`);
}

function multiplyMatrices() {
    updateMatrix();
    updateMatrixB();
    if (currentSize !== currentSizeB) {
        showError("Las matrices deben ser cuadradas y del mismo tamaño para multiplicarlas aquí.");
        return;
    }
    try {
        const result = multiply(currentMatrix, currentMatrixB);
        showResult(`<h3>Multiplicación A × B</h3>${matrixToHTML(result)}`);
    } catch(e) {
        showError(e.message);
    }
}

function multiply(A, B) {
    const rowsA = A.length;
    const colsA = A[0].length;
    const rowsB = B.length;
    const colsB = B[0].length;
    if (colsA !== rowsB) throw new Error("Dimensiones incompatibles para la multiplicación.");

    const result = Array.from({ length: rowsA }, () => Array(colsB).fill(0));

    for (let i = 0; i < rowsA; i++) {
        for (let j = 0; j < colsB; j++) {
            for (let k = 0; k < colsA; k++) {
                result[i][j] += A[i][k] * B[k][j];
            }
        }
    }
    return result;
}

function calculateCommutator() {
     updateMatrix();
     updateMatrixB();
     if (currentSize !== currentSizeB) {
        showError("Las matrices deben ser cuadradas y del mismo tamaño para el conmutador.");
        return;
    }
    try {
        const AB = multiply(currentMatrix, currentMatrixB);
        const BA = multiply(currentMatrixB, currentMatrix);
        const commutator = AB.map((row, i) => row.map((val, j) => val - BA[i][j]));
        showResult(`
            <h3>Conmutador [A,B] = AB - BA</h3>
            <h4>AB = </h4>${matrixToHTML(AB)}
            <h4>BA = </h4>${matrixToHTML(BA)}
            <h4>[A,B] = </h4>${matrixToHTML(commutator)}
        `);
    } catch(e) {
        showError(e.message);
    }
}

// ## Linear Systems ##

function solveSystem() {
    updateMatrix();
    updateVectorB();
    try {
        const x = solveUsingLU(currentMatrix, vectorB);
        showResult(`
            <h3>Solución del Sistema Ax = b (vía LU)</h3>
            <p>El vector solución <strong>x</strong> es:</p>
            ${vectorToHTML([x])}
        `);
    } catch (e) {
        showError(e.message);
    }
}

function solveUsingLU(A, b) {
    const decomp = luDecompositionCore(A);
    if (!decomp) throw new Error("La matriz es singular, el sistema no tiene solución única.");
    
    const { L, U, P } = decomp;
    const n = A.length;
    const pb = P.map(i => b[i]); // Apply permutation to b

    // Forward substitution: Ly = Pb
    const y = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
        let sum = 0;
        for (let j = 0; j < i; j++) {
            sum += L[i][j] * y[j];
        }
        y[i] = pb[i] - sum;
    }

    // Backward substitution: Ux = y
    const x = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
        let sum = 0;
        for (let j = i + 1; j < n; j++) {
            sum += U[i][j] * x[j];
        }
        if (Math.abs(U[i][i]) < EPSILON) throw new Error("Matriz singular encontrada durante la sustitución.");
        x[i] = (y[i] - sum) / U[i][i];
    }
    return x;
}

function solveSystemCramer() {
    updateMatrix();
    updateVectorB();
    const n = currentSize;
    const detA = calculateDeterminant(currentMatrix).det;

    if (Math.abs(detA) < EPSILON) {
        showError("El determinante es cero. La regla de Cramer no es aplicable, el sistema no tiene solución única.");
        return;
    }

    const x = [];
    let stepsHTML = '';
    for (let i = 0; i < n; i++) {
        const Ai = cloneMatrix(currentMatrix);
        for (let j = 0; j < n; j++) {
            Ai[j][i] = vectorB[j];
        }
        const detAi = calculateDeterminant(Ai).det;
        x.push(detAi / detA);
        stepsHTML += `<div class="step">
                        <h4>Cálculo de x<sub>${i+1}</sub></h4>
                        <p>Matriz A<sub>${i+1}</sub> (columna ${i+1} reemplazada por b):</p>
                        ${matrixToHTML(Ai, 2)}
                        <p>det(A<sub>${i+1}</sub>) = ${detAi.toFixed(4)}</p>
                        <p>x<sub>${i+1}</sub> = det(A<sub>${i+1}</sub>) / det(A) = ${detAi.toFixed(4)} / ${detA.toFixed(4)} = <strong>${x[i].toFixed(4)}</strong></p>
                     </div>`;
    }
    
    showResult(`
        <h3>Solución del Sistema por Regla de Cramer</h3>
        <p>El vector solución <strong>x</strong> es:</p>
        ${vectorToHTML([x])}
    `);
    showSteps(stepsHTML);
}

// --- Vector Helpers for QR ---
function dotProduct(v1, v2) {
    return v1.reduce((acc, val, i) => acc + val * v2[i], 0);
}

function vectorNorm(v) {
    return Math.sqrt(dotProduct(v, v));
}