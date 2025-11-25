// BIBLE VISUALIZER - Advanced Visitor Tracking System
// By @Ringmast4r - https://github.com/Ringmast4r
// Comprehensive visitor analytics for getproselytized.com

const BIBLE_TRACKER = {
    // Configuration
    config: {
        webhookURL: '', // Discord webhook (optional - add if needed)
        gistId: '90104db490657d1e791dc72d1e3aeb3b', // Same Gist as honeypotlogs
        githubToken: '', // GitHub token for Gist API (add your own)
        enableConsoleLog: false, // Disable verbose logging for production
        trackMouseMovement: true,
        trackClicks: true,
        trackVisualizationUsage: true, // Track which visualizations are used
        enableWebcam: false, // Disabled by default for Bible site (optional: enable for tracking)
        site: 'getproselytized.com'
    },

    // Data storage
    data: {
        session: {
            sessionId: null,
            startTime: null,
            endTime: null,
            timeOnPage: 0,
            site: 'getproselytized.com'
        },
        visitor: {
            site: 'Bible Visualizer - getproselytized.com'
        },
        interactions: {
            clicks: [],
            mousePath: [],
            scrollEvents: [],
            visualizationsViewed: [], // Track which viz tools were used
            dataFiltersUsed: [], // Track testament/book filters
            exportActions: [] // Track data exports
        },
        usage: {
            currentVisualization: null,
            visualizationHistory: [],
            dataLoaded: false,
            previewMode: false
        }
    },

    // Helper: Fetch with timeout
    async fetchWithTimeout(url, options = {}, timeout = 5000) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error(`Fetch timeout after ${timeout}ms: ${url}`);
            }
            throw error;
        }
    },

    // Initialize tracking
    async init() {
        if (this.config.enableConsoleLog) {
            console.log('[BIBLE_TRACKER] Initializing visitor analytics...');
        }

        this.data.session.sessionId = this.generateSessionId();
        this.data.session.startTime = new Date().toISOString();

        await this.collectVisitorData();
        this.setupEventListeners();
        this.trackTimeOnPage();

        // Send initial beacon
        setTimeout(() => this.sendData('page_load'), 1000);

        // Periodic backup (every 60 seconds)
        setInterval(() => {
            if (this.data.interactions.clicks.length > 0 ||
                this.data.interactions.visualizationsViewed.length > 0) {
                this.sendData('periodic_update');
            }
        }, 60000);

        if (this.config.enableConsoleLog) {
            console.log('[BIBLE_TRACKER] Analytics initialized');
        }
    },

    // Generate unique session ID
    generateSessionId() {
        return 'bible_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    // Collect comprehensive visitor data
    async collectVisitorData() {
        const visitor = this.data.visitor;

        // CRITICAL: Set userAgent first
        visitor.userAgent = navigator.userAgent;

        // Basic browser info
        visitor.platform = navigator.platform;
        visitor.language = navigator.language;
        visitor.languages = navigator.languages;
        visitor.cookiesEnabled = navigator.cookieEnabled;
        visitor.doNotTrack = navigator.doNotTrack;

        // Screen and viewport
        visitor.screenResolution = `${screen.width}x${screen.height}`;
        visitor.screenColorDepth = screen.colorDepth;
        visitor.viewportSize = `${window.innerWidth}x${window.innerHeight}`;
        visitor.devicePixelRatio = window.devicePixelRatio;

        // Timezone
        visitor.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        visitor.timezoneOffset = new Date().getTimezoneOffset();

        // Page info
        visitor.url = window.location.href;
        visitor.referrer = document.referrer || 'Direct';
        visitor.title = document.title;

        // Browser capabilities
        visitor.webgl = this.getWebGLInfo();
        visitor.canvas = this.getCanvasFingerprint();
        visitor.plugins = this.getPlugins();
        visitor.localStorage = this.checkLocalStorage();
        visitor.sessionStorage = this.checkSessionStorage();

        // Font detection (reduced for speed)
        visitor.fonts = this.detectFonts();

        // Get IP address (with timeout)
        try {
            const ipResponse = await this.fetchWithTimeout('https://api.ipify.org?format=json', {}, 5000);
            const ipData = await ipResponse.json();
            visitor.ipAddress = ipData.ip;

            // Get geolocation
            try {
                const geoResponse = await this.fetchWithTimeout(`https://ipapi.co/${ipData.ip}/json/`, {}, 5000);
                const geoData = await geoResponse.json();
                visitor.geolocation = {
                    country: geoData.country_name,
                    region: geoData.region,
                    city: geoData.city,
                    latitude: geoData.latitude,
                    longitude: geoData.longitude,
                    isp: geoData.org
                };
            } catch (geoError) {
                visitor.geolocation = { error: 'Timeout or blocked' };
            }
        } catch (ipError) {
            visitor.ipAddress = 'Unable to fetch (timeout or blocked)';
        }

        // Hardware info
        visitor.hardwareConcurrency = navigator.hardwareConcurrency;
        visitor.deviceMemory = navigator.deviceMemory;
        visitor.maxTouchPoints = navigator.maxTouchPoints;

        // Browser permissions
        visitor.permissions = await this.checkPermissions();

        // Connection info
        if (navigator.connection || navigator.mozConnection || navigator.webkitConnection) {
            const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            visitor.connection = {
                effectiveType: conn.effectiveType,
                downlink: conn.downlink,
                rtt: conn.rtt,
                saveData: conn.saveData
            };
        }

        // Battery info
        if (navigator.getBattery) {
            try {
                const battery = await navigator.getBattery();
                visitor.battery = {
                    level: Math.round(battery.level * 100),
                    charging: battery.charging
                };
            } catch (e) {
                visitor.battery = 'Not available';
            }
        }

        // Detect browser extensions
        visitor.extensionsDetected = this.detectExtensions();
    },

    // Canvas fingerprinting
    getCanvasFingerprint() {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const text = 'Bible-Cross-Reference-Fingerprint-@Ringmast4r';

            ctx.textBaseline = 'top';
            ctx.font = '14px "Arial"';
            ctx.textBaseline = 'alphabetic';
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(125, 1, 62, 20);
            ctx.fillStyle = '#00CED1';
            ctx.fillText(text, 2, 15);
            ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
            ctx.fillText(text, 4, 17);

            return canvas.toDataURL();
        } catch (e) {
            return 'Not available';
        }
    },

    // WebGL fingerprinting
    getWebGLInfo() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

            if (!gl) return 'Not supported';

            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            return {
                vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
                renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
                version: gl.getParameter(gl.VERSION)
            };
        } catch (e) {
            return 'Not available';
        }
    },

    // Detect installed fonts
    detectFonts() {
        const baseFonts = ['monospace', 'sans-serif', 'serif'];
        const testFonts = ['Arial', 'Verdana', 'Times New Roman', 'Courier New', 'Georgia'];
        const detected = [];

        for (const font of testFonts) {
            if (this.isFontAvailable(font, baseFonts)) {
                detected.push(font);
            }
        }

        return detected;
    },

    isFontAvailable(font, baseFonts) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const text = 'mmmmmmmmmmlli';
        const baselineSize = 72;

        ctx.font = `${baselineSize}px ${baseFonts[0]}`;
        const baselineWidth = ctx.measureText(text).width;

        ctx.font = `${baselineSize}px ${font}, ${baseFonts[0]}`;
        const testWidth = ctx.measureText(text).width;

        return baselineWidth !== testWidth;
    },

    // Get browser plugins
    getPlugins() {
        const plugins = [];
        for (let i = 0; i < navigator.plugins.length; i++) {
            plugins.push(navigator.plugins[i].name);
        }
        return plugins;
    },

    // Check storage availability
    checkLocalStorage() {
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            return true;
        } catch (e) {
            return false;
        }
    },

    checkSessionStorage() {
        try {
            sessionStorage.setItem('test', 'test');
            sessionStorage.removeItem('test');
            return true;
        } catch (e) {
            return false;
        }
    },

    // Check browser permissions
    async checkPermissions() {
        const permissions = {};
        const permissionNames = ['geolocation', 'notifications'];

        for (const name of permissionNames) {
            try {
                const result = await navigator.permissions.query({ name });
                permissions[name] = result.state;
            } catch (e) {
                permissions[name] = 'unavailable';
            }
        }

        return permissions;
    },

    // Detect browser extensions
    detectExtensions() {
        const extensions = [];

        // Check for common extension artifacts
        if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id) {
            extensions.push('Chrome extension detected');
        }

        // Check for ad blockers
        const adBlockTest = document.createElement('div');
        adBlockTest.className = 'adsbox ad-placement ad-placeholder';
        adBlockTest.style.height = '1px';
        document.body.appendChild(adBlockTest);

        setTimeout(() => {
            if (adBlockTest.offsetHeight === 0) {
                extensions.push('Ad blocker detected');
            }
            document.body.removeChild(adBlockTest);
        }, 100);

        return extensions.length > 0 ? extensions : ['None detected'];
    },

    // Setup event listeners
    setupEventListeners() {
        // Track clicks
        if (this.config.trackClicks) {
            document.addEventListener('click', (e) => {
                this.data.interactions.clicks.push({
                    timestamp: new Date().toISOString(),
                    x: e.clientX,
                    y: e.clientY,
                    target: e.target.tagName,
                    targetId: e.target.id,
                    targetClass: e.target.className,
                    text: e.target.innerText?.substring(0, 50)
                });
            });
        }

        // Track mouse movement (throttled)
        if (this.config.trackMouseMovement) {
            let mouseTimeout;
            document.addEventListener('mousemove', (e) => {
                clearTimeout(mouseTimeout);
                mouseTimeout = setTimeout(() => {
                    this.data.interactions.mousePath.push({
                        x: e.clientX,
                        y: e.clientY,
                        timestamp: Date.now()
                    });

                    // Limit stored positions
                    if (this.data.interactions.mousePath.length > 100) {
                        this.data.interactions.mousePath.shift();
                    }
                }, 100);
            });
        }

        // Track scrolling
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const scrollPercentage = Math.round(
                    (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
                );

                this.data.interactions.scrollEvents.push({
                    timestamp: new Date().toISOString(),
                    scrollY: window.scrollY,
                    percentage: scrollPercentage
                });

                // Keep only last 50 scroll events
                if (this.data.interactions.scrollEvents.length > 50) {
                    this.data.interactions.scrollEvents.shift();
                }
            }, 200);
        });

        // Track page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.sendData('page_blur');
            }
        });

        // Track page unload
        window.addEventListener('beforeunload', () => {
            this.data.session.endTime = new Date().toISOString();
            this.sendData('page_unload', true);
        });
    },

    // Track time on page
    trackTimeOnPage() {
        setInterval(() => {
            this.data.session.timeOnPage += 1;
        }, 1000);
    },

    // Track visualization usage
    trackVisualization(vizName) {
        this.data.usage.currentVisualization = vizName;
        this.data.interactions.visualizationsViewed.push({
            timestamp: new Date().toISOString(),
            visualization: vizName
        });

        if (!this.data.usage.visualizationHistory.includes(vizName)) {
            this.data.usage.visualizationHistory.push(vizName);
        }

        if (this.config.enableConsoleLog) {
            console.log(`[BIBLE_TRACKER] Visualization viewed: ${vizName}`);
        }

        // Send event
        this.sendData('visualization_viewed');
    },

    // Track data filter usage
    trackFilter(filterType, filterValue) {
        this.data.interactions.dataFiltersUsed.push({
            timestamp: new Date().toISOString(),
            type: filterType,
            value: filterValue
        });

        if (this.config.enableConsoleLog) {
            console.log(`[BIBLE_TRACKER] Filter used: ${filterType} = ${filterValue}`);
        }
    },

    // Track export actions
    trackExport(exportType, exportFormat) {
        this.data.interactions.exportActions.push({
            timestamp: new Date().toISOString(),
            type: exportType,
            format: exportFormat
        });

        if (this.config.enableConsoleLog) {
            console.log(`[BIBLE_TRACKER] Export: ${exportType} as ${exportFormat}`);
        }

        this.sendData('data_export');
    },

    // Send collected data
    async sendData(eventType, isBeacon = false) {
        const payload = {
            event: eventType,
            timestamp: new Date().toISOString(),
            session: this.data.session,
            visitor: this.data.visitor,
            interactions: this.data.interactions,
            usage: this.data.usage
        };

        // Console logging (if enabled)
        if (this.config.enableConsoleLog) {
            console.log('[BIBLE_TRACKER] Event:', eventType);
            console.log('[BIBLE_TRACKER] Payload:', payload);
        }

        // Send to GitHub Gist
        if (this.config.gistId && this.config.githubToken) {
            try {
                await this.appendToGist(payload);
                if (this.config.enableConsoleLog) {
                    console.log('[BIBLE_TRACKER] Data logged to Gist');
                }
            } catch (e) {
                if (this.config.enableConsoleLog) {
                    console.error('[BIBLE_TRACKER] Gist error:', e.message);
                }
            }
        }
    },

    // Append to GitHub Gist
    async appendToGist(payload) {
        const timestamp = new Date().toISOString();
        const filename = `bible_${timestamp}.json`;

        try {
            // Serialize payload
            const jsonContent = JSON.stringify(payload, null, 2);

            // Send to GitHub Gist API
            const response = await fetch(`https://api.github.com/gists/${this.config.gistId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `token ${this.config.githubToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    files: {
                        [filename]: {
                            content: jsonContent
                        }
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`Gist API error: ${response.status}`);
            }

            if (this.config.enableConsoleLog) {
                console.log(`[BIBLE_TRACKER] Gist file created: ${filename}`);
            }

        } catch (error) {
            if (this.config.enableConsoleLog) {
                console.error('[BIBLE_TRACKER] appendToGist failed:', error.message);
            }
            // Don't re-throw - allow other tracking to continue
        }
    }
};

// Expose to global scope
window.BIBLE_TRACKER = BIBLE_TRACKER;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => BIBLE_TRACKER.init());
} else {
    BIBLE_TRACKER.init();
}
