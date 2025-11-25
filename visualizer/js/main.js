// Main Application Controller

class BibleVisualizer {
    constructor() {
        this.currentViz = 'arc';
        this.filters = {
            testament: 'all',
            book: '',
            minConnections: 1
        };

        this.visualizations = {
            arc: null,
            network: null,
            chord: null,
            heatmap: null,
            sunburst: null,
            geomap: null,
            timeline: null,
            people: null
        };

        // Theme system
        this.themes = ['blackgold', 'professional', 'vibrant', 'matrix', 'sunset', 'royal', 'ocean'];
        this.currentTheme = 'blackgold'; // Default to black & gold theme
    }

    async init() {
        try {
            // Debug logging
            console.log('🔍 Initializing Bible Visualizer...');
            console.log('📄 DOM ready state:', document.readyState);
            console.log('🎯 .viz-container exists?', !!document.querySelector('.viz-container'));
            console.log('🌐 Current URL:', window.location.href);

            // Show loading state with progress
            this.showLoading();

            // Setup progress callback
            dataLoader.onProgress((percent, message) => {
                this.updateLoadingProgress(percent, message);
            });

            // Setup theographic progress callback
            theographicLoader.onProgress((percent, message) => {
                console.log(`📍 Theographic: ${percent}% - ${message}`);
            });

            // Try loading preview first for instant results
            const previewLoaded = dataLoader.loadPreview();

            if (previewLoaded) {
                console.log('⚡ Preview loaded instantly!');

                // Hide loading, show preview mode banner
                this.hideLoading();
                this.showPreviewBanner();

                // Initialize UI with preview data
                console.log('🎨 Initializing UI with preview...');
                this.initializeUI();

                // Apply default theme on page load
                document.documentElement.setAttribute('data-theme', this.currentTheme);
                console.log(`🎨 Applied default theme: ${this.currentTheme}`);

                // Initialize visualizations
                console.log('📊 Initializing visualizations...');
                this.initializeVisualizations();

                // Render initial visualization
                console.log('🖼️ Rendering preview visualization...');
                this.renderCurrentVisualization();

                // Load full data in background
                console.log('📥 Loading full dataset in background...');
                dataLoader.load().then(() => {
                    console.log('✅ Full data loaded! Updating visualization...');
                    this.showFullDataBanner();
                    this.renderCurrentVisualization();
                }).catch(err => {
                    console.warn('Full data load failed, continuing with preview:', err);
                    this.showPreviewOnlyBanner();
                });

                // Load theographic data in background
                console.log('📍 Loading theographic data (people, places, events)...');
                theographicLoader.load().then(() => {
                    console.log('✅ Theographic data loaded!');
                    // Re-render if user is on a theographic visualization
                    if (['geomap', 'timeline', 'people'].includes(this.currentViz)) {
                        console.log('🔄 Re-rendering theographic visualization...');
                        this.renderCurrentVisualization();
                    }
                }).catch(err => {
                    console.warn('Theographic data load failed:', err);
                });

            } else {
                // No preview available, load full data normally
                console.log('📥 Loading full dataset...');
                await dataLoader.load();
                console.log('✅ Data loaded successfully!');

                // Hide loading
                this.hideLoading();

                // Initialize UI
                console.log('🎨 Initializing UI...');
                this.initializeUI();

                // Apply default theme on page load
                document.documentElement.setAttribute('data-theme', this.currentTheme);
                console.log(`🎨 Applied default theme: ${this.currentTheme}`);

                // Initialize visualizations
                console.log('📊 Initializing visualizations...');
                this.initializeVisualizations();

                // Render initial visualization
                console.log('🖼️ Rendering initial visualization...');
                this.renderCurrentVisualization();

                // Load theographic data in background
                console.log('📍 Loading theographic data (people, places, events)...');
                theographicLoader.load().then(() => {
                    console.log('✅ Theographic data loaded!');
                    // Re-render if user is on a theographic visualization
                    if (['geomap', 'timeline', 'people'].includes(this.currentViz)) {
                        console.log('🔄 Re-rendering theographic visualization...');
                        this.renderCurrentVisualization();
                    }
                }).catch(err => {
                    console.warn('Theographic data load failed:', err);
                });
            }

            console.log('✅ Bible Visualizer initialized successfully!');
        } catch (error) {
            console.error('❌ Initialization error:', error);
            console.error('📋 Error details:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
            this.showError(error.message || 'Failed to load data. Please refresh the page.');
        }
    }

    initializeUI() {
        // Tab buttons
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.viz);
            });
        });

        // Book selector
        const bookSelect = document.getElementById('book-select');
        const books = dataLoader.getBooks();
        books.forEach(book => {
            const option = document.createElement('option');
            option.value = book.name;
            option.textContent = book.name;
            bookSelect.appendChild(option);
        });

        // Testament filter
        document.getElementById('testament-filter').addEventListener('change', (e) => {
            this.filters.testament = e.target.value;
            this.renderCurrentVisualization();
        });

        // Book filter
        bookSelect.addEventListener('change', (e) => {
            this.filters.book = e.target.value;
            this.renderCurrentVisualization();
        });

        // Min connections slider
        const minSlider = document.getElementById('min-connections');
        const minValue = document.getElementById('min-value');
        minSlider.addEventListener('input', (e) => {
            this.filters.minConnections = parseInt(e.target.value);
            minValue.textContent = e.target.value;
        });
        minSlider.addEventListener('change', () => {
            this.renderCurrentVisualization();
        });

        // Reset button
        document.getElementById('reset-btn').addEventListener('click', () => {
            this.resetFilters();
        });

        // Theme button
        document.getElementById('theme-btn').addEventListener('click', () => {
            this.cycleTheme();
        });

        // Export button
        document.getElementById('export-btn').addEventListener('click', () => {
            this.exportCurrentVisualization();
        });
    }

    initializeVisualizations() {
        try {
            // Create visualization instances
            console.log('Creating visualization instances...');

            this.visualizations.arc = new ArcDiagramTableauStyle('arc-svg', 'arc-tooltip');
            console.log('✅ ArcDiagramTableauStyle created (true circular arcs)');

            this.visualizations.network = new NetworkGraph('network-svg', 'network-tooltip');
            console.log('✅ NetworkGraph created');

            this.visualizations.chord = new ChordDiagram('chord-svg', 'chord-tooltip');
            console.log('✅ ChordDiagram created');

            this.visualizations.heatmap = new Heatmap('heatmap-svg', 'heatmap-tooltip');
            console.log('✅ Heatmap created');

            this.visualizations.sunburst = new Sunburst('sunburst-svg', 'sunburst-tooltip');
            console.log('✅ Sunburst created');

            this.visualizations.geomap = new GeographicMap('geomap-container', 'geomap-tooltip');
            console.log('✅ GeographicMap created');

            this.visualizations.timeline = new Timeline('timeline-svg', 'timeline-tooltip');
            console.log('✅ Timeline created');

            this.visualizations.people = new PeopleNetwork('people-svg', 'people-tooltip');
            console.log('✅ PeopleNetwork created');

            console.log('✅ All visualizations initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize visualizations:', error);
            throw error;  // Re-throw to be caught by init()
        }
    }

    switchTab(vizName) {
        // Update active tab
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-viz="${vizName}"]`).classList.add('active');

        // Update active panel
        document.querySelectorAll('.viz-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(`${vizName}-viz`).classList.add('active');

        this.currentViz = vizName;
        this.renderCurrentVisualization();
    }

    renderCurrentVisualization() {
        const viz = this.visualizations[this.currentViz];

        if (viz && typeof viz.render === 'function') {
            viz.render(this.filters);
        } else if (this.currentViz === 'stats') {
            this.renderStats();
        }
    }

    renderStats() {
        const stats = dataLoader.getComprehensiveStats();
        const theoStats = theographicLoader.isLoaded ? theographicLoader.getStats() : {};
        const statsContent = document.getElementById('stats-content');

        statsContent.innerHTML = `
            <div class="stats-section">
                <h2 class="section-title">📊 Core Statistics</h2>
                <div class="stats-grid">
                    <div class="stat-card highlight">
                        <h4>Total Cross-References</h4>
                        <div class="stat-value">${stats.total_verse_references?.toLocaleString() || '0'}</div>
                    </div>
                    <div class="stat-card highlight">
                        <h4>Chapter Connections</h4>
                        <div class="stat-value">${stats.total_chapter_connections?.toLocaleString() || '0'}</div>
                    </div>
                    <div class="stat-card">
                        <h4>Total Chapters</h4>
                        <div class="stat-value">${stats.totalChapters?.toLocaleString() || '1,189'}</div>
                        <small>${stats.otChapters} OT • ${stats.ntChapters} NT</small>
                    </div>
                    <div class="stat-card">
                        <h4>Total Books</h4>
                        <div class="stat-value">${stats.otBooks + stats.ntBooks || '66'}</div>
                        <small>${stats.otBooks} OT • ${stats.ntBooks} NT</small>
                    </div>
                </div>
            </div>

            <div class="stats-section">
                <h2 class="section-title">🔗 Cross-Reference Analytics</h2>
                <div class="stats-grid">
                    <div class="stat-card">
                        <h4>Most Connected Chapter</h4>
                        <div class="stat-value">${stats.mostConnectedChapter?.chapter?.book || 'N/A'} ${stats.mostConnectedChapter?.chapter?.chapter || ''}</div>
                        <small>${stats.mostConnectedChapter?.degree?.toLocaleString() || '0'} total connections</small>
                    </div>
                    <div class="stat-card">
                        <h4>Longest Connection</h4>
                        <div class="stat-value">${stats.longestConnection?.distance || '0'} chapters</div>
                        <small>${stats.longestConnection?.source?.book || ''} → ${stats.longestConnection?.target?.book || ''}</small>
                    </div>
                    <div class="stat-card">
                        <h4>Strongest Connection</h4>
                        <div class="stat-value">${stats.strongestConnection?.weight || '0'} refs</div>
                        <small>${stats.strongestConnection?.source?.book || ''} → ${stats.strongestConnection?.target?.book || ''}</small>
                    </div>
                    <div class="stat-card">
                        <h4>Average Distance</h4>
                        <div class="stat-value">${stats.avgDistance || '0'} chapters</div>
                        <small>Mean separation between refs</small>
                    </div>
                    <div class="stat-card">
                        <h4>Connection Density</h4>
                        <div class="stat-value">OT: ${stats.otDensity}%</div>
                        <small>NT: ${stats.ntDensity}%</small>
                    </div>
                    <div class="stat-card">
                        <h4>Reciprocal Connections</h4>
                        <div class="stat-value">${stats.reciprocalConnections?.toLocaleString() || '0'}</div>
                        <small>${stats.reciprocityRate}% bidirectional</small>
                    </div>
                    <div class="stat-card">
                        <h4>Avg Connections/Chapter</h4>
                        <div class="stat-value">${stats.avgConnectionsPerChapter || '0'}</div>
                        <small>Per chapter average</small>
                    </div>
                </div>
            </div>

            ${theographicLoader.isLoaded ? `
            <div class="stats-section">
                <h2 class="section-title">👥 People & Places</h2>
                <div class="stats-grid">
                    <div class="stat-card">
                        <h4>Biblical People</h4>
                        <div class="stat-value">${theoStats.totalPeople?.toLocaleString() || '0'}</div>
                        <small>${theoStats.peopleWithLocations || 0} with locations</small>
                    </div>
                    <div class="stat-card">
                        <h4>Geographic Places</h4>
                        <div class="stat-value">${theoStats.totalPlaces?.toLocaleString() || '0'}</div>
                        <small>${theoStats.placesWithCoords || 0} with GPS coordinates</small>
                    </div>
                    <div class="stat-card">
                        <h4>Historical Events</h4>
                        <div class="stat-value">${theoStats.totalEvents?.toLocaleString() || '0'}</div>
                    </div>
                    <div class="stat-card">
                        <h4>Time Periods</h4>
                        <div class="stat-value">${theoStats.totalPeriods?.toLocaleString() || '0'}</div>
                    </div>
                    <div class="stat-card">
                        <h4>Dictionary Entries</h4>
                        <div class="stat-value">${theoStats.dictionaryEntries?.toLocaleString() || '0'}</div>
                        <small>Easton's Bible Dictionary</small>
                    </div>
                </div>
            </div>
            ` : ''}

            <div class="stats-section">
                <h2 class="section-title">📖 Book Collections</h2>
                <div class="stats-grid">
                    <div class="stat-card">
                        <h4>Gospel Connections</h4>
                        <div class="stat-value">${Object.values(stats.gospelConnections || {}).reduce((a, b) => a + b, 0).toLocaleString()}</div>
                        <small>Matthew • Mark • Luke • John</small>
                    </div>
                    <div class="stat-card">
                        <h4>Pauline Epistles</h4>
                        <div class="stat-value">${stats.paulineConnections?.toLocaleString() || '0'}</div>
                        <small>Internal connections</small>
                    </div>
                    <div class="stat-card">
                        <h4>Torah/Pentateuch</h4>
                        <div class="stat-value">${stats.torahConnections?.toLocaleString() || '0'}</div>
                        <small>Genesis → Deuteronomy</small>
                    </div>
                    <div class="stat-card">
                        <h4>Longest Book</h4>
                        <div class="stat-value">${stats.longestBook?.name || 'Psalms'}</div>
                        <small>${stats.longestBook?.chapters || 150} chapters</small>
                    </div>
                    <div class="stat-card">
                        <h4>Shortest Books</h4>
                        <div class="stat-value">${stats.shortestBook?.name || 'Obadiah'}</div>
                        <small>${stats.shortestBook?.chapters || 1} chapter</small>
                    </div>
                </div>
            </div>

            <div class="stats-section">
                <h2 class="section-title">🏆 Top Books</h2>
                <div class="stats-grid-wide">
                    <div class="stat-card">
                        <h4>Most Referenced</h4>
                        <ul class="stat-list">
                            ${stats.most_referenced_books?.slice(0, 10).map((item, i) => `
                                <li>
                                    <span class="rank">${i + 1}.</span>
                                    <span class="book-name">${item.book}</span>
                                    <span class="count">${item.count.toLocaleString()}</span>
                                </li>
                            `).join('') || ''}
                        </ul>
                    </div>
                    <div class="stat-card">
                        <h4>Most Self-Referencing</h4>
                        <ul class="stat-list">
                            ${stats.mostSelfReferencingBooks?.slice(0, 10).map((item, i) => `
                                <li>
                                    <span class="rank">${i + 1}.</span>
                                    <span class="book-name">${item[0]}</span>
                                    <span class="count">${item[1].toLocaleString()}</span>
                                </li>
                            `).join('') || ''}
                        </ul>
                    </div>
                    <div class="stat-card">
                        <h4>Cross-Testament Bridges</h4>
                        <ul class="stat-list">
                            ${stats.topBridgeBooks?.slice(0, 10).map((item, i) => `
                                <li>
                                    <span class="rank">${i + 1}.</span>
                                    <span class="book-name">${item[0]}</span>
                                    <span class="count">${item[1].toLocaleString()}</span>
                                </li>
                            `).join('') || ''}
                        </ul>
                    </div>
                </div>
            </div>

            <div class="stats-section">
                <h2 class="section-title">🎯 Testament Distribution</h2>
                <div class="stats-grid">
                    <div class="stat-card">
                        <h4>OT → OT</h4>
                        <div class="stat-value">${stats.testament_distribution?.OT_to_OT?.toLocaleString() || 0}</div>
                        <small>Old Testament internal</small>
                    </div>
                    <div class="stat-card">
                        <h4>NT → NT</h4>
                        <div class="stat-value">${stats.testament_distribution?.NT_to_NT?.toLocaleString() || 0}</div>
                        <small>New Testament internal</small>
                    </div>
                    <div class="stat-card">
                        <h4>OT → NT</h4>
                        <div class="stat-value">${stats.testament_distribution?.OT_to_NT?.toLocaleString() || 0}</div>
                        <small>Old to New Testament</small>
                    </div>
                    <div class="stat-card">
                        <h4>NT → OT</h4>
                        <div class="stat-value">${stats.testament_distribution?.NT_to_OT?.toLocaleString() || 0}</div>
                        <small>New to Old Testament</small>
                    </div>
                </div>
            </div>

            <div class="stats-footer">
                <p style="color: #888; text-align: center; margin-top: 30px;">
                    📊 Comprehensive Statistics Dashboard • Created by <strong style="color: #FFD700;">Ringmast4r</strong>
                </p>
            </div>
        `;
    }

    resetFilters() {
        this.filters = {
            testament: 'all',
            book: '',
            minConnections: 1
        };

        document.getElementById('testament-filter').value = 'all';
        document.getElementById('book-select').value = '';
        document.getElementById('min-connections').value = '1';
        document.getElementById('min-value').textContent = '1';

        this.renderCurrentVisualization();
    }

    cycleTheme() {
        // Get current theme index and cycle to next
        const currentIndex = this.themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % this.themes.length;
        this.currentTheme = this.themes[nextIndex];

        // Apply theme to document
        document.documentElement.setAttribute('data-theme', this.currentTheme);

        // Show notification
        const themeName = this.currentTheme.charAt(0).toUpperCase() + this.currentTheme.slice(1);
        console.log(`🎨 Theme changed to: ${themeName}`);

        // Optionally show visual feedback
        const themeBtn = document.getElementById('theme-btn');
        themeBtn.textContent = `🎨 ${themeName}`;
        setTimeout(() => {
            themeBtn.textContent = '🎨 Theme';
        }, 2000);
    }

    exportCurrentVisualization() {
        const svgElement = document.querySelector(`#${this.currentViz}-svg`);
        if (!svgElement) return;

        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgElement);
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `bible-${this.currentViz}-visualization.svg`;
        link.click();

        URL.revokeObjectURL(url);
    }

    showPreviewBanner() {
        const header = document.querySelector('header');
        if (!header) return;

        const banner = document.createElement('div');
        banner.id = 'preview-banner';
        banner.style.cssText = `
            background: linear-gradient(90deg, #FF8C00 0%, #FFD700 100%);
            color: #1a1a2e;
            padding: 12px 20px;
            text-align: center;
            font-weight: bold;
            font-size: 0.95rem;
            margin-top: 15px;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        `;
        banner.innerHTML = `
            ⚡ PREVIEW MODE: Showing top 200 connections (instant load!) |
            <span style="font-size: 0.85rem; opacity: 0.9;">Loading full 190K connections in background...</span>
        `;
        header.appendChild(banner);
    }

    showFullDataBanner() {
        const banner = document.getElementById('preview-banner');
        if (!banner) return;

        banner.style.background = 'linear-gradient(90deg, #2ecc71 0%, #27ae60 100%)';
        banner.innerHTML = `
            ✅ FULL DATASET LOADED: All 190,522 connections available!
            <span style="font-size: 0.85rem; opacity: 0.9;">Visualization updated</span>
        `;

        // Remove banner after 5 seconds
        setTimeout(() => {
            banner.style.transition = 'opacity 0.5s';
            banner.style.opacity = '0';
            setTimeout(() => banner.remove(), 500);
        }, 5000);
    }

    showPreviewOnlyBanner() {
        const banner = document.getElementById('preview-banner');
        if (!banner) return;

        banner.style.background = 'linear-gradient(90deg, #e74c3c 0%, #c0392b 100%)';
        banner.innerHTML = `
            ℹ️ PREVIEW ONLY: Full dataset failed to load. Using top 200 connections.
            <button onclick="location.reload()" style="margin-left: 10px; padding: 4px 12px; border: none; border-radius: 4px; background: white; color: #1a1a2e; cursor: pointer; font-weight: bold;">Retry</button>
        `;
    }

    updateLoadingProgress(percent, message) {
        const progressBar = document.getElementById('loading-progress-bar');
        const progressText = document.getElementById('loading-progress-text');

        if (progressBar) {
            progressBar.style.width = `${percent}%`;
        }
        if (progressText) {
            progressText.textContent = message;
        }
    }

    showLoading() {
        const container = document.querySelector('.viz-container');
        if (!container) {
            console.error('❌ FATAL: .viz-container element not found! Cannot show loading state.');
            console.error('📋 Available elements:', document.querySelectorAll('[class*="viz"]'));
            return;
        }

        console.log('⏳ Showing loading indicator...');

        // Create loading overlay (don't destroy existing content!)
        const loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loading-overlay';
        loadingOverlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--bg-medium);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        loadingOverlay.innerHTML = `
            <div class="loading" style="text-align: center; padding: 100px; color: #FFD700; font-size: 1.5rem;">
                <div style="font-size: 3rem; margin-bottom: 20px;">⏳</div>
                <div>Loading Bible Cross-Reference Data...</div>
                <div id="loading-progress-text" style="font-size: 1rem; color: #00CED1; margin-top: 10px;">
                    Initializing...
                </div>
                <div style="width: 80%; max-width: 400px; height: 20px; background: #333; border-radius: 10px; margin: 20px auto; overflow: hidden;">
                    <div id="loading-progress-bar" style="height: 100%; background: linear-gradient(90deg, #FFD700, #00CED1); width: 0%; transition: width 0.3s ease;"></div>
                </div>
                <div style="margin-top: 20px; color: #888; font-size: 0.9rem;">
                    <div style="animation: pulse 1.5s ease-in-out infinite;">Loading 340,000+ verse connections...</div>
                </div>
                <div style="margin-top: 15px; color: #666; font-size: 0.8rem;">
                    Using jsDelivr CDN for faster global delivery
                </div>
            </div>
        `;

        // Make container position relative so overlay works
        container.style.position = 'relative';
        container.appendChild(loadingOverlay);
    }

    hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            console.log('✅ Removing loading overlay...');
            overlay.remove();
        }
    }

    showError(message) {
        const container = document.querySelector('.viz-container');
        if (!container) {
            console.error('❌ FATAL: .viz-container element not found! Cannot show error.');
            console.error('📋 Error message was:', message);
            alert(`ERROR: ${message}\n\nThe page structure is broken. Please check the browser console (F12) for details.`);
            return;
        }

        console.log('⚠️ Showing error message:', message);
        container.innerHTML = `
            <div style="color: #ff6b6b; text-align: center; padding: 60px; max-width: 600px; margin: 0 auto;">
                <div style="font-size: 4rem; margin-bottom: 20px;">⚠️</div>
                <div style="font-size: 1.5rem; color: #FFD700; margin-bottom: 20px;">${message}</div>
                <div style="color: #b8b8d1; font-size: 1rem; line-height: 1.6;">
                    <p><strong>Possible issues:</strong></p>
                    <ul style="text-align: left; display: inline-block;">
                        <li>Data files still deploying to GitHub Pages (wait 1-2 minutes)</li>
                        <li>Large file size (15MB) - may take time to load</li>
                        <li>Check browser console (F12) for detailed errors</li>
                        <li>JavaScript file missing or failed to load</li>
                    </ul>
                    <p style="margin-top: 20px;">
                        <button onclick="location.reload()" style="background: #FFD700; color: #1a1a2e; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 1rem;">
                            Retry Loading
                        </button>
                    </p>
                    <p style="margin-top: 15px; font-size: 0.85rem;">
                        <a href="https://github.com/Ringmast4r/PROJECT-BIBLE-A-Proselytize-Project/issues" target="_blank" style="color: #00CED1;">Report this issue on GitHub</a>
                    </p>
                </div>
            </div>
        `;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new BibleVisualizer();
    app.init();

    // Add responsive window resize handling
    let resizeTimeout;
    window.addEventListener('resize', () => {
        // Debounce resize events to avoid excessive re-rendering
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            console.log('🔄 Window resized - re-rendering visualization...');
            app.renderCurrentVisualization();
        }, 250); // Wait 250ms after user stops resizing
    });
});
