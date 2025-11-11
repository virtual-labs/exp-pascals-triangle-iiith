class PascalTriangleChallenge {
    constructor() {
        this.canvas = document.getElementById('pascalCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Current question
        this.currentN = 0;
        this.currentK = 0;
        this.correctAnswer = 0;
        
        // Statistics
        this.currentStreak = 0;
        
        // Hint management
        this.hintVisible = true;
        this.hintTimer = null;
        
        this.setupCanvas();
        this.generateNewQuestion();
        this.drawPascalTriangle();
        this.startHintTimer();
        
        // Setup enter key for answer input
        document.getElementById('answerInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.checkAnswer();
            }
        });
    }
    
    setupCanvas() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        const container = this.canvas.parentElement;
        // Make canvas bigger for the new layout - takes 2/3 of the screen width
        const maxRows = Math.max(this.currentN, 8);
        const containerWidth = Math.min(800, container.clientWidth - 20); // Bigger width
        const containerHeight = Math.max(containerWidth * 0.75, 180 + maxRows * 45 + 100); // More space
        this.canvas.style.width = containerWidth + 'px';
        this.canvas.style.height = containerHeight + 'px';
        const scale = window.devicePixelRatio || 1;
        this.canvas.width = containerWidth * scale;
        this.canvas.height = containerHeight * scale;
        this.ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform before scaling
        this.ctx.scale(scale, scale);
        this.drawPascalTriangle();
    }
    
    // Calculate binomial coefficient C(n,k)
    binomial(n, k) {
        if (k < 0 || k > n) return 0;
        if (k === 0 || k === n) return 1;
        
        let result = 1;
        for (let i = 0; i < Math.min(k, n - k); i++) {
            result *= (n - i);
            result /= (i + 1);
        }
        return Math.round(result);
    }
    
    generateNewQuestion() {
        // Generate harder questions with increased difficulty
        let maxN = Math.min(12, 4 + Math.floor(this.currentStreak / 2));
        
        do {
            this.currentN = Math.floor(Math.random() * maxN) + 3;
            this.currentK = Math.floor(Math.random() * (this.currentN + 1));
        } while (this.currentK === 0 || this.currentK === this.currentN);
        
        this.correctAnswer = this.binomial(this.currentN, this.currentK);
        
        // Update question display
        document.getElementById('questionText').textContent = `C(${this.currentN},${this.currentK})`;
        
        // Clear previous answer and feedback
        document.getElementById('answerInput').value = '';
        document.getElementById('feedback').classList.add('hidden');
        
        // Focus on input
        document.getElementById('answerInput').focus();
        
        // Restart hint timer
        this.startHintTimer();
        
        this.drawPascalTriangle();
    }
    
    drawPascalTriangle() {
        const canvasWidth = this.canvas.width / (window.devicePixelRatio || 1);
        const canvasHeight = this.canvas.height / (window.devicePixelRatio || 1);
        this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        const maxRows = Math.max(this.currentN, 8);
        const leftPadding = 90;
        const rightPadding = 90;
        const topPadding = 90;
        const bottomPadding = 80;
        
        const availableWidth = canvasWidth - leftPadding - rightPadding;
        const cellSize = Math.min(65, availableWidth / (maxRows * 1.1)); // Bigger cells
        const startY = topPadding;

        // Draw Pascal's Triangle
        for (let n = 0; n <= maxRows; n++) {
            const rowWidth = (n + 1) * cellSize * 0.95;
            const startX = leftPadding + (availableWidth - rowWidth) / 2;
            const y = startY + n * cellSize * 0.85;
            for (let k = 0; k <= n; k++) {
                const x = startX + k * cellSize * 0.95;
                const value = this.binomial(n, k);
                const isTarget = (n === this.currentN && k === this.currentK);
                let bgColor = '#f8f9fa';
                let borderColor = '#dee2e6';
                let textColor = '#495057';
                if (n === this.currentN) {
                    bgColor = '#e3f2fd';
                    borderColor = '#2196f3';
                }
                if (isTarget) {
                    bgColor = '#ffeb3b';
                    borderColor = '#ff9800';
                    textColor = '#e65100';
                }
                this.ctx.fillStyle = bgColor;
                this.ctx.strokeStyle = borderColor;
                this.ctx.lineWidth = isTarget ? 3 : 1;
                this.ctx.beginPath();
                this.ctx.roundRect(x, y, cellSize * 0.85, cellSize * 0.65, 10);
                this.ctx.fill();
                this.ctx.stroke();
                if (!isTarget) {
                    this.ctx.fillStyle = textColor;
                    this.ctx.font = `bold ${Math.min(18, cellSize * 0.28)}px Poppins`;
                    this.ctx.textAlign = 'center';
                    this.ctx.textBaseline = 'middle';
                    this.ctx.fillText(value.toString(), x + cellSize * 0.425, y + cellSize * 0.325);
                } else {
                    this.ctx.fillStyle = '#e65100';
                    this.ctx.font = `bold ${Math.min(24, cellSize * 0.35)}px Poppins`;
                    this.ctx.textAlign = 'center';
                    this.ctx.textBaseline = 'middle';
                    this.ctx.fillText('?', x + cellSize * 0.425, y + cellSize * 0.325);
                }
            }
        }

        // Draw n-axis (vertical) with arrow pointing down
        this.ctx.strokeStyle = '#495057';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(45, startY);
        this.ctx.lineTo(45, startY + maxRows * cellSize * 0.85);
        this.ctx.stroke();
        
        // Arrow head for n-axis (pointing down)
        this.ctx.beginPath();
        this.ctx.moveTo(45, startY + maxRows * cellSize * 0.85);
        this.ctx.lineTo(40, startY + maxRows * cellSize * 0.85 - 12);
        this.ctx.lineTo(50, startY + maxRows * cellSize * 0.85 - 12);
        this.ctx.closePath();
        this.ctx.fillStyle = '#495057';
        this.ctx.fill();
        
        // N-axis label (vertical)
        this.ctx.save();
        this.ctx.translate(18, startY + (maxRows * cellSize * 0.85) / 2);
        this.ctx.rotate(-Math.PI / 2);
        this.ctx.fillStyle = '#495057';
        this.ctx.font = 'bold 16px Poppins';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('N (ROWS)', 0, 0);
        this.ctx.restore();

        // Draw k-axis (horizontal) with arrow pointing right
        const bottomRowWidth = (maxRows + 1) * cellSize * 0.95;
        const bottomRowStartX = leftPadding + (availableWidth - bottomRowWidth) / 2;
        // Move kAxisY further down for more padding
        const kAxisY = startY + maxRows * cellSize * 0.85 + 65;
        
        this.ctx.strokeStyle = '#495057';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(bottomRowStartX, kAxisY);
        this.ctx.lineTo(bottomRowStartX + bottomRowWidth, kAxisY);
        this.ctx.stroke();
        
        // Arrow head for k-axis (pointing right)
        this.ctx.beginPath();
        this.ctx.moveTo(bottomRowStartX + bottomRowWidth, kAxisY);
        this.ctx.lineTo(bottomRowStartX + bottomRowWidth - 12, kAxisY - 5);
        this.ctx.lineTo(bottomRowStartX + bottomRowWidth - 12, kAxisY + 5);
        this.ctx.closePath();
        this.ctx.fillStyle = '#495057';
        this.ctx.fill();
        
        // K-axis label (horizontal)
        this.ctx.fillStyle = '#495057';
        this.ctx.font = 'bold 16px Poppins';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('K (POSITION)', bottomRowStartX + bottomRowWidth / 2, kAxisY + 30);

        // Add row numbers (N values) on the left, styled like K
        for (let n = 0; n <= maxRows; n++) {
            const y = startY + n * cellSize * 0.85;
            this.ctx.fillStyle = '#6c757d';
            this.ctx.font = '14px Poppins';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            // Move N numbers a bit left and down for symmetry
            this.ctx.fillText(n.toString(), 38, y + cellSize * 0.425);
        }

        // Add position numbers (K values) at the bottom for the last row
        for (let k = 0; k <= maxRows; k++) {
            const rowWidth = (maxRows + 1) * cellSize * 0.95;
            const startX = leftPadding + (availableWidth - rowWidth) / 2;
            const x = startX + k * cellSize * 0.95;
            this.ctx.fillStyle = '#6c757d';
            this.ctx.font = '14px Poppins';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(k.toString(), x + cellSize * 0.425, kAxisY + 18);
        }
    }
    
    checkAnswer() {
        const userAnswer = parseInt(document.getElementById('answerInput').value);
        
        if (isNaN(userAnswer)) {
            this.showFeedback('Please enter a valid number', 'error');
            return;
        }
        
        if (userAnswer === this.correctAnswer) {
            this.currentStreak++;
            
            this.showFeedback(`🎉 Correct! C(${this.currentN},${this.currentK}) = ${this.correctAnswer}`, 'success');
            
            setTimeout(() => {
                this.generateNewQuestion();
            }, 2000);
            
        } else {
            this.currentStreak = 0;
            
            // Calculate factorials for explanation
            const nFactorial = this.factorial(this.currentN);
            const kFactorial = this.factorial(this.currentK);
            const nMinusKFactorial = this.factorial(this.currentN - this.currentK);
            
            // Calculate Pascal's Triangle values for alternate solution
            let pascalExplanation = '';
            if (this.currentN > 0 && this.currentK > 0 && this.currentK < this.currentN) {
                const leftParent = this.binomial(this.currentN - 1, this.currentK - 1);
                const rightParent = this.binomial(this.currentN - 1, this.currentK);
                pascalExplanation = `\nAlternate Solution (Pascal's Triangle Property):\n` +
                                  `C(n,k) = C(n-1,k-1) + C(n-1,k)\n` +
                                  `C(${this.currentN},${this.currentK}) = C(${this.currentN-1},${this.currentK-1}) + C(${this.currentN-1},${this.currentK})\n` +
                                  `= ${leftParent} + ${rightParent} = ${this.correctAnswer}`;
            }
            
            const explanation = `❌ Incorrect. Your answer: ${userAnswer}\n\n` +
                              `The correct answer is C(${this.currentN},${this.currentK}) = ${this.correctAnswer}\n\n` +
                              `Method 1 - Using the formula: C(n,k) = n! / (k! × (n-k)!)\n` +
                              `C(${this.currentN},${this.currentK}) = ${this.currentN}! / (${this.currentK}! × ${this.currentN - this.currentK}!)\n` +
                              `= ${nFactorial} / (${kFactorial} × ${nMinusKFactorial})\n` +
                              `= ${nFactorial} / ${kFactorial * nMinusKFactorial} = ${this.correctAnswer}` +
                              pascalExplanation;
            
            this.showFeedback(explanation, 'error');
            
            this.drawPascalTriangleWithAnswer();
            
            setTimeout(() => {
                this.generateNewQuestion();
            }, 6000);
        }
        
        this.updateStats();
    }
    
    drawPascalTriangleWithAnswer() {
        const canvasWidth = this.canvas.width / (window.devicePixelRatio || 1);
        const canvasHeight = this.canvas.height / (window.devicePixelRatio || 1);
        
        this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        
        const maxRows = Math.max(this.currentN, 8);
        const leftPadding = 90;
        const rightPadding = 90;
        const topPadding = 90;
        const bottomPadding = 80;
        
        const availableWidth = canvasWidth - leftPadding - rightPadding;
        const cellSize = Math.min(65, availableWidth / (maxRows * 1.1));
        const startY = topPadding;
        
        for (let n = 0; n <= maxRows; n++) {
            const rowWidth = (n + 1) * cellSize * 0.95;
            const startX = leftPadding + (availableWidth - rowWidth) / 2;
            const y = startY + n * cellSize * 0.85;
            
            for (let k = 0; k <= n; k++) {
                const x = startX + k * cellSize * 0.95;
                const value = this.binomial(n, k);
                
                const isTarget = (n === this.currentN && k === this.currentK);
                const isLeftParent = (n === this.currentN - 1 && k === this.currentK - 1);
                const isRightParent = (n === this.currentN - 1 && k === this.currentK);
                
                let bgColor = '#f8f9fa';
                let borderColor = '#dee2e6';
                let textColor = '#495057';
                
                if (n === this.currentN) {
                    bgColor = '#e3f2fd';
                    borderColor = '#2196f3';
                }
                
                if (isTarget) {
                    bgColor = '#ffcdd2';
                    borderColor = '#f44336';
                    textColor = '#d32f2f';
                } else if (isLeftParent || isRightParent) {
                    bgColor = '#fff3e0';
                    borderColor = '#ff9800';
                    textColor = '#e65100';
                }
                
                this.ctx.fillStyle = bgColor;
                this.ctx.strokeStyle = borderColor;
                this.ctx.lineWidth = (isTarget || isLeftParent || isRightParent) ? 3 : 1;
                
                this.ctx.beginPath();
                this.ctx.roundRect(x, y, cellSize * 0.85, cellSize * 0.65, 10);
                this.ctx.fill();
                this.ctx.stroke();
                
                this.ctx.fillStyle = textColor;
                this.ctx.font = `bold ${Math.min(18, cellSize * 0.28)}px Poppins`;
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(value.toString(), x + cellSize * 0.425, y + cellSize * 0.325);
                
                this.ctx.font = `${Math.min(12, cellSize * 0.18)}px Poppins`;
                this.ctx.fillStyle = '#6c757d';
                this.ctx.fillText(`${n},${k}`, x + cellSize * 0.425, y + cellSize * 0.65 + 18);
            }
        }
        
        // Draw arrows from parent values to target if applicable
        if (this.currentN > 0 && this.currentK > 0 && this.currentK < this.currentN) {
            this.drawParentArrows(cellSize, startY, canvasWidth, leftPadding, availableWidth);
        }
        
        // Draw n-axis (vertical) with arrow pointing down
        this.ctx.strokeStyle = '#495057';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(45, startY);
        this.ctx.lineTo(45, startY + maxRows * cellSize * 0.85);
        this.ctx.stroke();
        
        // Arrow head for n-axis (pointing down)
        this.ctx.beginPath();
        this.ctx.moveTo(45, startY + maxRows * cellSize * 0.85);
        this.ctx.lineTo(40, startY + maxRows * cellSize * 0.85 - 12);
        this.ctx.lineTo(50, startY + maxRows * cellSize * 0.85 - 12);
        this.ctx.closePath();
        this.ctx.fillStyle = '#495057';
        this.ctx.fill();
        
        // n-axis label
        this.ctx.save();
        this.ctx.translate(28, startY + (maxRows * cellSize * 0.85) / 2);
        this.ctx.rotate(-Math.PI / 2);
        this.ctx.fillStyle = '#495057';
        this.ctx.font = 'bold 16px Poppins';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('n (rows)', 0, 0);
        this.ctx.restore();

        // Draw k-axis (horizontal) with arrow pointing right
        const bottomRowWidth = (maxRows + 1) * cellSize * 0.95;
        const bottomRowStartX = leftPadding + (availableWidth - bottomRowWidth) / 2;
        // Move kAxisY further down for more padding
        const kAxisY = startY + maxRows * cellSize * 0.85 + 65;
        
        this.ctx.strokeStyle = '#495057';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(bottomRowStartX, kAxisY);
        this.ctx.lineTo(bottomRowStartX + bottomRowWidth, kAxisY);
        this.ctx.stroke();
        
        // Arrow head for k-axis (pointing right)
        this.ctx.beginPath();
        this.ctx.moveTo(bottomRowStartX + bottomRowWidth, kAxisY);
        this.ctx.lineTo(bottomRowStartX + bottomRowWidth - 12, kAxisY - 5);
        this.ctx.lineTo(bottomRowStartX + bottomRowWidth - 12, kAxisY + 5);
        this.ctx.closePath();
        this.ctx.fillStyle = '#495057';
        this.ctx.fill();
        
        // k-axis label
        this.ctx.fillStyle = '#495057';
        this.ctx.font = 'bold 16px Poppins';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('k (position)', bottomRowStartX + bottomRowWidth / 2, kAxisY + 30);

        // Add row numbers (n values) on the left
        for (let n = 0; n <= maxRows; n++) {
            const y = startY + n * cellSize * 0.85;
            this.ctx.fillStyle = '#6c757d';
            this.ctx.font = '14px Poppins';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            // Move n numbers a bit left and down for symmetry
            this.ctx.fillText(n.toString(), 38, y + cellSize * 0.425);
        }

        // Add position numbers (k values) at the bottom for the last row
        for (let k = 0; k <= maxRows; k++) {
            const rowWidth = (maxRows + 1) * cellSize * 0.95;
            const startX = leftPadding + (availableWidth - rowWidth) / 2;
            const x = startX + k * cellSize * 0.95;
            this.ctx.fillStyle = '#6c757d';
            this.ctx.font = '14px Poppins';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(k.toString(), x + cellSize * 0.425, kAxisY + 18);
        }
    }
    
    checkAnswer() {
        const userAnswer = parseInt(document.getElementById('answerInput').value);
        
        if (isNaN(userAnswer)) {
            this.showFeedback('Please enter a valid number', 'error');
            return;
        }
        
        if (userAnswer === this.correctAnswer) {
            this.currentStreak++;
            
            this.showFeedback(`🎉 Correct! C(${this.currentN},${this.currentK}) = ${this.correctAnswer}`, 'success');
            
            setTimeout(() => {
                this.generateNewQuestion();
            }, 2000);
            
        } else {
            this.currentStreak = 0;
            
            // Calculate factorials for explanation
            const nFactorial = this.factorial(this.currentN);
            const kFactorial = this.factorial(this.currentK);
            const nMinusKFactorial = this.factorial(this.currentN - this.currentK);
            
            // Calculate Pascal's Triangle values for alternate solution
            let pascalExplanation = '';
            if (this.currentN > 0 && this.currentK > 0 && this.currentK < this.currentN) {
                const leftParent = this.binomial(this.currentN - 1, this.currentK - 1);
                const rightParent = this.binomial(this.currentN - 1, this.currentK);
                pascalExplanation = `\nAlternate Solution (Pascal's Triangle Property):\n` +
                                  `C(n,k) = C(n-1,k-1) + C(n-1,k)\n` +
                                  `C(${this.currentN},${this.currentK}) = C(${this.currentN-1},${this.currentK-1}) + C(${this.currentN-1},${this.currentK})\n` +
                                  `= ${leftParent} + ${rightParent} = ${this.correctAnswer}`;
            }
            
            const explanation = `❌ Incorrect. Your answer: ${userAnswer}\n\n` +
                              `The correct answer is C(${this.currentN},${this.currentK}) = ${this.correctAnswer}\n\n` +
                              `Method 1 - Using the formula: C(n,k) = n! / (k! × (n-k)!)\n` +
                              `C(${this.currentN},${this.currentK}) = ${this.currentN}! / (${this.currentK}! × ${this.currentN - this.currentK}!)\n` +
                              `= ${nFactorial} / (${kFactorial} × ${nMinusKFactorial})\n` +
                              `= ${nFactorial} / ${kFactorial * nMinusKFactorial} = ${this.correctAnswer}` +
                              pascalExplanation;
            
            this.showFeedback(explanation, 'error');
            
            this.drawPascalTriangleWithAnswer();
            
            setTimeout(() => {
                this.generateNewQuestion();
            }, 6000);
        }
        
        this.updateStats();
    }
    
    drawPascalTriangleWithAnswer() {
        const canvasWidth = this.canvas.width / (window.devicePixelRatio || 1);
        const canvasHeight = this.canvas.height / (window.devicePixelRatio || 1);
        
        this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        
        const maxRows = Math.max(this.currentN, 8);
        const leftPadding = 90;
        const rightPadding = 90;
        const topPadding = 90;
        const bottomPadding = 80;
        
        const availableWidth = canvasWidth - leftPadding - rightPadding;
        const cellSize = Math.min(65, availableWidth / (maxRows * 1.1));
        const startY = topPadding;
        
        for (let n = 0; n <= maxRows; n++) {
            const rowWidth = (n + 1) * cellSize * 0.95;
            const startX = leftPadding + (availableWidth - rowWidth) / 2;
            const y = startY + n * cellSize * 0.85;
            
            for (let k = 0; k <= n; k++) {
                const x = startX + k * cellSize * 0.95;
                const value = this.binomial(n, k);
                
                const isTarget = (n === this.currentN && k === this.currentK);
                const isLeftParent = (n === this.currentN - 1 && k === this.currentK - 1);
                const isRightParent = (n === this.currentN - 1 && k === this.currentK);
                
                let bgColor = '#f8f9fa';
                let borderColor = '#dee2e6';
                let textColor = '#495057';
                
                if (n === this.currentN) {
                    bgColor = '#e3f2fd';
                    borderColor = '#2196f3';
                }
                
                if (isTarget) {
                    bgColor = '#ffcdd2';
                    borderColor = '#f44336';
                    textColor = '#d32f2f';
                } else if (isLeftParent || isRightParent) {
                    bgColor = '#fff3e0';
                    borderColor = '#ff9800';
                    textColor = '#e65100';
                }
                
                this.ctx.fillStyle = bgColor;
                this.ctx.strokeStyle = borderColor;
                this.ctx.lineWidth = (isTarget || isLeftParent || isRightParent) ? 3 : 1;
                
                this.ctx.beginPath();
                this.ctx.roundRect(x, y, cellSize * 0.85, cellSize * 0.65, 10);
                this.ctx.fill();
                this.ctx.stroke();
                
                this.ctx.fillStyle = textColor;
                this.ctx.font = `bold ${Math.min(18, cellSize * 0.28)}px Poppins`;
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(value.toString(), x + cellSize * 0.425, y + cellSize * 0.325);
                
                this.ctx.font = `${Math.min(12, cellSize * 0.18)}px Poppins`;
                this.ctx.fillStyle = '#6c757d';
                this.ctx.fillText(`${n},${k}`, x + cellSize * 0.425, y + cellSize * 0.65 + 18);
            }
        }
        
        // Draw arrows from parent values to target if applicable
        if (this.currentN > 0 && this.currentK > 0 && this.currentK < this.currentN) {
            this.drawParentArrows(cellSize, startY, canvasWidth, leftPadding, availableWidth);
        }
        
        // Draw n-axis (vertical) with arrow pointing down
        this.ctx.strokeStyle = '#495057';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(45, startY);
        this.ctx.lineTo(45, startY + maxRows * cellSize * 0.85);
        this.ctx.stroke();
        
        // Arrow head for n-axis (pointing down)
        this.ctx.beginPath();
        this.ctx.moveTo(45, startY + maxRows * cellSize * 0.85);
        this.ctx.lineTo(40, startY + maxRows * cellSize * 0.85 - 12);
        this.ctx.lineTo(50, startY + maxRows * cellSize * 0.85 - 12);
        this.ctx.closePath();
        this.ctx.fillStyle = '#495057';
        this.ctx.fill();
        
        // n-axis label
        this.ctx.save();
        this.ctx.translate(28, startY + (maxRows * cellSize * 0.85) / 2);
        this.ctx.rotate(-Math.PI / 2);
        this.ctx.fillStyle = '#495057';
        this.ctx.font = 'bold 16px Poppins';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('n (rows)', 0, 0);
        this.ctx.restore();

        // Draw k-axis (horizontal) with arrow pointing right
        const bottomRowWidth = (maxRows + 1) * cellSize * 0.95;
        const bottomRowStartX = leftPadding + (availableWidth - bottomRowWidth) / 2;
        // Move kAxisY further down for more padding
        const kAxisY = startY + maxRows * cellSize * 0.85 + 65;
        
        this.ctx.strokeStyle = '#495057';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(bottomRowStartX, kAxisY);
        this.ctx.lineTo(bottomRowStartX + bottomRowWidth, kAxisY);
        this.ctx.stroke();
        
        // Arrow head for k-axis (pointing right)
        this.ctx.beginPath();
        this.ctx.moveTo(bottomRowStartX + bottomRowWidth, kAxisY);
        this.ctx.lineTo(bottomRowStartX + bottomRowWidth - 12, kAxisY - 5);
        this.ctx.lineTo(bottomRowStartX + bottomRowWidth - 12, kAxisY + 5);
        this.ctx.closePath();
        this.ctx.fillStyle = '#495057';
        this.ctx.fill();
        
        // k-axis label
        this.ctx.fillStyle = '#495057';
        this.ctx.font = 'bold 16px Poppins';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('k (position)', bottomRowStartX + bottomRowWidth / 2, kAxisY + 30);

        // Add row numbers (n values) on the left
        for (let n = 0; n <= maxRows; n++) {
            const y = startY + n * cellSize * 0.85;
            this.ctx.fillStyle = '#6c757d';
            this.ctx.font = '14px Poppins';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            // Move n numbers a bit left and down for symmetry
            this.ctx.fillText(n.toString(), 38, y + cellSize * 0.425);
        }

        // Add position numbers (k values) at the bottom for the last row
        for (let k = 0; k <= maxRows; k++) {
            const rowWidth = (maxRows + 1) * cellSize * 0.95;
            const startX = leftPadding + (availableWidth - rowWidth) / 2;
            const x = startX + k * cellSize * 0.95;
            this.ctx.fillStyle = '#6c757d';
            this.ctx.font = '14px Poppins';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(k.toString(), x + cellSize * 0.425, kAxisY + 18);
        }
    }
    
    checkAnswer() {
        const userAnswer = parseInt(document.getElementById('answerInput').value);
        
        if (isNaN(userAnswer)) {
            this.showFeedback('Please enter a valid number', 'error');
            return;
        }
        
        if (userAnswer === this.correctAnswer) {
            this.currentStreak++;
            
            this.showFeedback(`🎉 Correct! C(${this.currentN},${this.currentK}) = ${this.correctAnswer}`, 'success');
            
            setTimeout(() => {
                this.generateNewQuestion();
            }, 2000);
            
        } else {
            this.currentStreak = 0;
            
            // Calculate factorials for explanation
            const nFactorial = this.factorial(this.currentN);
            const kFactorial = this.factorial(this.currentK);
            const nMinusKFactorial = this.factorial(this.currentN - this.currentK);
            
            // Calculate Pascal's Triangle values for alternate solution
            let pascalExplanation = '';
            if (this.currentN > 0 && this.currentK > 0 && this.currentK < this.currentN) {
                const leftParent = this.binomial(this.currentN - 1, this.currentK - 1);
                const rightParent = this.binomial(this.currentN - 1, this.currentK);
                pascalExplanation = `\nAlternate Solution (Pascal's Triangle Property):\n` +
                                  `C(n,k) = C(n-1,k-1) + C(n-1,k)\n` +
                                  `C(${this.currentN},${this.currentK}) = C(${this.currentN-1},${this.currentK-1}) + C(${this.currentN-1},${this.currentK})\n` +
                                  `= ${leftParent} + ${rightParent} = ${this.correctAnswer}`;
            }
            
            const explanation = `❌ Incorrect. Your answer: ${userAnswer}\n\n` +
                              `The correct answer is C(${this.currentN},${this.currentK}) = ${this.correctAnswer}\n\n` +
                              `Method 1 - Using the formula: C(n,k) = n! / (k! × (n-k)!)\n` +
                              `C(${this.currentN},${this.currentK}) = ${this.currentN}! / (${this.currentK}! × ${this.currentN - this.currentK}!)\n` +
                              `= ${nFactorial} / (${kFactorial} × ${nMinusKFactorial})\n` +
                              `= ${nFactorial} / ${kFactorial * nMinusKFactorial} = ${this.correctAnswer}` +
                              pascalExplanation;
            
            this.showFeedback(explanation, 'error');
            
            this.drawPascalTriangleWithAnswer();
            
            setTimeout(() => {
                this.generateNewQuestion();
            }, 6000);
        }
        
        this.updateStats();
    }
    
    drawPascalTriangleWithAnswer() {
        const canvasWidth = this.canvas.width / (window.devicePixelRatio || 1);
        const canvasHeight = this.canvas.height / (window.devicePixelRatio || 1);
        
        this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        
        const maxRows = Math.max(this.currentN, 8);
        const leftPadding = 90;
        const rightPadding = 90;
        const topPadding = 90;
        const bottomPadding = 80;
        
        const availableWidth = canvasWidth - leftPadding - rightPadding;
        const cellSize = Math.min(65, availableWidth / (maxRows * 1.1));
        const startY = topPadding;
        
        for (let n = 0; n <= maxRows; n++) {
            const rowWidth = (n + 1) * cellSize * 0.95;
            const startX = leftPadding + (availableWidth - rowWidth) / 2;
            const y = startY + n * cellSize * 0.85;
            
            for (let k = 0; k <= n; k++) {
                const x = startX + k * cellSize * 0.95;
                const value = this.binomial(n, k);
                
                const isTarget = (n === this.currentN && k === this.currentK);
                const isLeftParent = (n === this.currentN - 1 && k === this.currentK - 1);
                const isRightParent = (n === this.currentN - 1 && k === this.currentK);
                
                let bgColor = '#f8f9fa';
                let borderColor = '#dee2e6';
                let textColor = '#495057';
                
                if (n === this.currentN) {
                    bgColor = '#e3f2fd';
                    borderColor = '#2196f3';
                }
                
                if (isTarget) {
                    bgColor = '#ffcdd2';
                    borderColor = '#f44336';
                    textColor = '#d32f2f';
                } else if (isLeftParent || isRightParent) {
                    bgColor = '#fff3e0';
                    borderColor = '#ff9800';
                    textColor = '#e65100';
                }
                
                this.ctx.fillStyle = bgColor;
                this.ctx.strokeStyle = borderColor;
                this.ctx.lineWidth = (isTarget || isLeftParent || isRightParent) ? 3 : 1;
                
                this.ctx.beginPath();
                this.ctx.roundRect(x, y, cellSize * 0.85, cellSize * 0.65, 10);
                this.ctx.fill();
                this.ctx.stroke();
                
                this.ctx.fillStyle = textColor;
                this.ctx.font = `bold ${Math.min(18, cellSize * 0.28)}px Poppins`;
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(value.toString(), x + cellSize * 0.425, y + cellSize * 0.325);
                
                this.ctx.font = `${Math.min(12, cellSize * 0.18)}px Poppins`;
                this.ctx.fillStyle = '#6c757d';
                this.ctx.fillText(`${n},${k}`, x + cellSize * 0.425, y + cellSize * 0.65 + 18);
            }
        }
        
        // Draw arrows from parent values to target if applicable
        if (this.currentN > 0 && this.currentK > 0 && this.currentK < this.currentN) {
            this.drawParentArrows(cellSize, startY, canvasWidth, leftPadding, availableWidth);
        }
        
        // Draw n-axis (vertical) with arrow pointing down
        this.ctx.strokeStyle = '#495057';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(45, startY);
        this.ctx.lineTo(45, startY + maxRows * cellSize * 0.85);
        this.ctx.stroke();
        
        // Arrow head for n-axis (pointing down)
        this.ctx.beginPath();
        this.ctx.moveTo(45, startY + maxRows * cellSize * 0.85);
        this.ctx.lineTo(40, startY + maxRows * cellSize * 0.85 - 12);
        this.ctx.lineTo(50, startY + maxRows * cellSize * 0.85 - 12);
        this.ctx.closePath();
        this.ctx.fillStyle = '#495057';
        this.ctx.fill();
        
        // n-axis label
        this.ctx.save();
        this.ctx.translate(28, startY + (maxRows * cellSize * 0.85) / 2);
        this.ctx.rotate(-Math.PI / 2);
        this.ctx.fillStyle = '#495057';
        this.ctx.font = 'bold 16px Poppins';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('n (rows)', 0, 0);
        this.ctx.restore();

        // Draw k-axis (horizontal) with arrow pointing right
        const bottomRowWidth = (maxRows + 1) * cellSize * 0.95;
        const bottomRowStartX = leftPadding + (availableWidth - bottomRowWidth) / 2;
        // Move kAxisY further down for more padding
        const kAxisY = startY + maxRows * cellSize * 0.85 + 65;
        
        this.ctx.strokeStyle = '#495057';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(bottomRowStartX, kAxisY);
        this.ctx.lineTo(bottomRowStartX + bottomRowWidth, kAxisY);
        this.ctx.stroke();
        
        // Arrow head for k-axis (pointing right)
        this.ctx.beginPath();
        this.ctx.moveTo(bottomRowStartX + bottomRowWidth, kAxisY);
        this.ctx.lineTo(bottomRowStartX + bottomRowWidth - 12, kAxisY - 5);
        this.ctx.lineTo(bottomRowStartX + bottomRowWidth - 12, kAxisY + 5);
        this.ctx.closePath();
        this.ctx.fillStyle = '#495057';
        this.ctx.fill();
        
        // k-axis label
        this.ctx.fillStyle = '#495057';
        this.ctx.font = 'bold 16px Poppins';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('k (position)', bottomRowStartX + bottomRowWidth / 2, kAxisY + 30);

        // Add row numbers (n values) on the left
        for (let n = 0; n <= maxRows; n++) {
            const y = startY + n * cellSize * 0.85;
            this.ctx.fillStyle = '#6c757d';
            this.ctx.font = '14px Poppins';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            // Move n numbers a bit left and down for symmetry
            this.ctx.fillText(n.toString(), 38, y + cellSize * 0.425);
        }

        // Add position numbers (k values) at the bottom for the last row
        for (let k = 0; k <= maxRows; k++) {
            const rowWidth = (maxRows + 1) * cellSize * 0.95;
            const startX = leftPadding + (availableWidth - rowWidth) / 2;
            const x = startX + k * cellSize * 0.95;
            this.ctx.fillStyle = '#6c757d';
            this.ctx.font = '14px Poppins';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(k.toString(), x + cellSize * 0.425, kAxisY + 18);
        }
    }
    
    drawParentArrows(cellSize, startY, canvasWidth, leftPadding, availableWidth) {
        const maxRows = Math.max(this.currentN, 8);
        
        // Calculate positions
        const targetRowWidth = (this.currentN + 1) * cellSize * 0.95;
        const targetStartX = leftPadding + (availableWidth - targetRowWidth) / 2;
        const targetY = startY + this.currentN * cellSize * 0.85;
        const targetX = targetStartX + this.currentK * cellSize * 0.95;
        
        const parentRowWidth = this.currentN * cellSize * 0.95;
        const parentStartX = leftPadding + (availableWidth - parentRowWidth) / 2;
        const parentY = startY + (this.currentN - 1) * cellSize * 0.85;
        
        const leftParentX = parentStartX + (this.currentK - 1) * cellSize * 0.95;
        const rightParentX = parentStartX + this.currentK * cellSize * 0.95;
        
        // Draw arrows
        this.ctx.strokeStyle = '#ff9800';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        
        // Left parent arrow
        this.ctx.beginPath();
        this.ctx.moveTo(leftParentX + cellSize * 0.425, parentY + cellSize * 0.65);
        this.ctx.lineTo(targetX + cellSize * 0.2, targetY);
        this.ctx.stroke();
        
        // Right parent arrow
        this.ctx.beginPath();
        this.ctx.moveTo(rightParentX + cellSize * 0.425, parentY + cellSize * 0.65);
        this.ctx.lineTo(targetX + cellSize * 0.65, targetY);
        this.ctx.stroke();
        
        this.ctx.setLineDash([]);
    }
    
    showFeedback(message, type) {
        const feedbackElement = document.getElementById('feedback');
        feedbackElement.classList.remove('hidden', 'bg-green-100', 'bg-red-100', 'text-green-800', 'text-red-800');
        
        if (type === 'success') {
            feedbackElement.classList.add('bg-green-100', 'text-green-800');
        } else {
            feedbackElement.classList.add('bg-red-100', 'text-red-800');
        }
        
        // Handle multi-line messages for explanations
        if (message.includes('\n')) {
            feedbackElement.innerHTML = message.replace(/\n/g, '<br>');
        } else {
            feedbackElement.textContent = message;
        }
    }
    
    // Helper function to calculate factorial
    factorial(n) {
        if (n <= 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }
    
    // Hint management functions
    startHintTimer() {
        // Clear existing timer
        if (this.hintTimer) {
            clearTimeout(this.hintTimer);
        }
        
        // Show hint if hidden
        if (!this.hintVisible) {
            this.showHint();
        }
        
        // Set timer to hide hint after 15 seconds
        this.hintTimer = setTimeout(() => {
            this.hideHint();
        }, 15000);
    }
    
    hideHint() {
        const helpSection = document.getElementById('helpSection');
        if (helpSection && this.hintVisible) {
            helpSection.style.opacity = '0';
            setTimeout(() => {
                helpSection.style.display = 'none';
            }, 500);
            this.hintVisible = false;
            
            // Update button text if it exists
            const toggleBtn = helpSection.querySelector('button');
            if (toggleBtn) {
                toggleBtn.textContent = 'Show Hint';
            }
        }
    }
    
    showHint() {
        const helpSection = document.getElementById('helpSection');
        if (helpSection && !this.hintVisible) {
            helpSection.style.display = 'block';
            setTimeout(() => {
                helpSection.style.opacity = '1';
            }, 10);
            this.hintVisible = true;
            
            // Update button text if it exists
            const toggleBtn = helpSection.querySelector('button');
            if (toggleBtn) {
                toggleBtn.textContent = 'Hide Hint';
            }
        }
    }
    
    toggleHint() {
        if (this.hintVisible) {
            this.hideHint();
            // Clear the auto-hide timer
            if (this.hintTimer) {
                clearTimeout(this.hintTimer);
            }
        } else {
            this.showHint();
            // Restart the auto-hide timer
            this.startHintTimer();
        }
    }
    
    updateStats() {
        document.getElementById('streakCount').textContent = this.currentStreak;
    }
    
    newQuestion() {
        this.generateNewQuestion();
    }
}

// Global instance
let pascalApp;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    pascalApp = new PascalTriangleChallenge();
});

// Control functions
function checkAnswer() {
    if (pascalApp) pascalApp.checkAnswer();
}

function newQuestion() {
    if (pascalApp) pascalApp.newQuestion();
}

function toggleHint() {
    if (pascalApp) pascalApp.toggleHint();
}