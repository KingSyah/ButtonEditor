// Button Editor Script
class ButtonEditor {
    constructor() {
        this.buttons = [];
        this.editingIndex = -1;
        this.init();
    }

    init() {
        // Load saved buttons from localStorage
        this.loadButtons();
        
        // Setup form submission
        document.getElementById('buttonForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // Initial render
        this.renderButtons();
        this.renderPreview();
    }

    handleFormSubmit() {
        const formData = this.getFormData();
        
        if (this.editingIndex >= 0) {
            // Update existing button
            this.buttons[this.editingIndex] = formData;
            this.editingIndex = -1;
            document.querySelector('#buttonForm button[type="submit"]').textContent = '➕ Tambah Tombol';
        } else {
            // Add new button
            this.buttons.push(formData);
        }

        this.saveButtons();
        this.renderButtons();
        this.renderPreview();
        this.clearForm();
    }

    getFormData() {
        return {
            name: document.getElementById('buttonName').value,
            url: document.getElementById('buttonUrl').value,
            description: document.getElementById('buttonDescription').value,
            icon: document.getElementById('buttonIcon').value,
            category: document.getElementById('buttonCategory').value,
            color: document.getElementById('buttonColor').value,
            cssClass: this.generateCssClass(document.getElementById('buttonName').value)
        };
    }

    generateCssClass(name) {
        return name.toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    clearForm() {
        document.getElementById('buttonForm').reset();
    }

    editButton(index) {
        const button = this.buttons[index];
        
        document.getElementById('buttonName').value = button.name;
        document.getElementById('buttonUrl').value = button.url;
        document.getElementById('buttonDescription').value = button.description;
        document.getElementById('buttonIcon').value = button.icon;
        document.getElementById('buttonCategory').value = button.category;
        document.getElementById('buttonColor').value = button.color;
        
        this.editingIndex = index;
        document.querySelector('#buttonForm button[type="submit"]').textContent = '✏️ Update Tombol';
    }

    deleteButton(index) {
        if (confirm('Yakin ingin menghapus tombol ini?')) {
            this.buttons.splice(index, 1);
            this.saveButtons();
            this.renderButtons();
            this.renderPreview();
        }
    }

    renderButtons() {
        const buttonList = document.getElementById('buttonList');
        
        if (this.buttons.length === 0) {
            buttonList.innerHTML = '<h3>📋 Daftar Tombol:</h3><p style="color: #666; text-align: center; padding: 20px;">Belum ada tombol yang ditambahkan</p>';
            return;
        }

        let html = '<h3>📋 Daftar Tombol:</h3>';
        
        this.buttons.forEach((button, index) => {
            html += `
                <div class="button-item">
                    <div class="button-info">
                        <h4>${button.icon} ${button.name}</h4>
                        <p>${button.description}</p>
                        <small style="color: #999;">${this.getCategoryName(button.category)}</small>
                    </div>
                    <div class="button-actions">
                        <button class="btn btn-primary btn-small" onclick="buttonEditor.editButton(${index})">
                            ✏️ Edit
                        </button>
                        <button class="btn btn-danger btn-small" onclick="buttonEditor.deleteButton(${index})">
                            🗑️ Hapus
                        </button>
                    </div>
                </div>
            `;
        });

        buttonList.innerHTML = html;
    }

    renderPreview() {
        const previewArea = document.getElementById('previewArea');
        
        if (this.buttons.length === 0) {
            previewArea.innerHTML = '<p style="color: #666; text-align: center; padding: 40px;">Tambahkan tombol untuk melihat preview</p>';
            return;
        }

        // Group buttons by category
        const categories = {
            'aplikasi-umum': [],
            'tools': [],
            'aplikasi-eve': []
        };

        this.buttons.forEach(button => {
            if (categories[button.category]) {
                categories[button.category].push(button);
            }
        });

        let html = '';

        // Render each category
        Object.keys(categories).forEach(categoryKey => {
            if (categories[categoryKey].length > 0) {
                html += `
                    <div style="margin-bottom: 30px;">
                        <h3 style="color: #333; margin-bottom: 15px;">${this.getCategoryName(categoryKey)}</h3>
                        <div>
                `;

                categories[categoryKey].forEach(button => {
                    html += `
                        <a href="${button.url}" class="preview-button" target="_blank">
                            <div class="preview-icon" style="color: ${button.color};">${button.icon}</div>
                            <div class="preview-content">
                                <div class="preview-name">${button.name}</div>
                                <div class="preview-description">${button.description}</div>
                            </div>
                            <div class="preview-arrow">›</div>
                        </a>
                    `;
                });

                html += `
                        </div>
                    </div>
                `;
            }
        });

        previewArea.innerHTML = html;
    }

    getCategoryName(category) {
        const names = {
            'aplikasi-umum': '📱 Aplikasi Umum',
            'tools': '🛠️ Tools',
            'aplikasi-eve': '🚀 Aplikasi EVE'
        };
        return names[category] || category;
    }

    saveButtons() {
        localStorage.setItem('buttonEditorData', JSON.stringify(this.buttons));
    }

    loadButtons() {
        const saved = localStorage.getItem('buttonEditorData');
        if (saved) {
            this.buttons = JSON.parse(saved);
        }
    }

    generateHtmlCode() {
        if (this.buttons.length === 0) {
            return 'Belum ada tombol yang ditambahkan.';
        }

        // Group buttons by category
        const categories = {
            'aplikasi-umum': [],
            'tools': [],
            'aplikasi-eve': []
        };

        this.buttons.forEach(button => {
            if (categories[button.category]) {
                categories[button.category].push(button);
            }
        });

        let html = '';

        // Generate HTML for each category
        Object.keys(categories).forEach(categoryKey => {
            if (categories[categoryKey].length > 0) {
                html += `        <!-- ${this.getCategoryName(categoryKey)} -->\n`;
                html += `        <div class="app-group loading">\n`;
                html += `            <h2 class="group-title">${this.getCategoryName(categoryKey)}</h2>\n`;
                html += `            <div class="app-grid compact-grid">\n`;

                categories[categoryKey].forEach(button => {
                    html += `                <a href="${button.url}" class="app-card compact ${button.cssClass}" target="_blank">\n`;
                    html += `                    <div class="app-icon">${button.icon}</div>\n`;
                    html += `                    <div class="app-content">\n`;
                    html += `                        <div class="app-name">${button.name}</div>\n`;
                    html += `                        <div class="app-description">${button.description}</div>\n`;
                    html += `                    </div>\n`;
                    html += `                    <div class="app-arrow">›</div>\n`;
                    html += `                </a>\n`;
                });

                html += `            </div>\n`;
                html += `        </div>\n\n`;
            }
        });

        return html;
    }

    generateCssCode() {
        if (this.buttons.length === 0) {
            return '';
        }

        let css = '\n/* Generated Button Colors */\n';
        
        this.buttons.forEach(button => {
            css += `.app-card.${button.cssClass} .app-icon { color: ${button.color}; }\n`;
        });

        return css;
    }
}

// Initialize the button editor
const buttonEditor = new ButtonEditor();

// Global functions for HTML buttons
function generateCode() {
    const htmlCode = buttonEditor.generateHtmlCode();
    const cssCode = buttonEditor.generateCssCode();
    
    const fullCode = `HTML Code (paste ke dalam <div class="container">):\n\n${htmlCode}\n\nCSS Code (paste ke dalam style.css):\n${cssCode}`;
    
    document.getElementById('codeOutput').textContent = fullCode;
}

function copyCode() {
    const codeOutput = document.getElementById('codeOutput');
    
    // Create a temporary textarea to copy the text
    const textarea = document.createElement('textarea');
    textarea.value = codeOutput.textContent;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    
    // Show feedback
    const originalText = document.querySelector('button[onclick="copyCode()"]').textContent;
    document.querySelector('button[onclick="copyCode()"]').textContent = '✅ Copied!';
    
    setTimeout(() => {
        document.querySelector('button[onclick="copyCode()"]').textContent = originalText;
    }, 2000);
}
