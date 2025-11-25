// Theographic Bible Metadata Loader
// Loads people, places, events, and enhanced verse data

class TheographicDataLoader {
    constructor() {
        this.people = null;
        this.places = null;
        this.events = null;
        this.periods = null;
        this.peopleGroups = null;
        this.chapters = null;
        this.verses = null;
        this.books = null;
        this.easton = null;
        this.isLoaded = false;
        this.loadingProgress = 0;
        this.progressCallbacks = [];
    }

    /**
     * Register a callback for loading progress updates
     * @param {Function} callback - Called with (percentage, message)
     */
    onProgress(callback) {
        this.progressCallbacks.push(callback);
    }

    updateProgress(percentage, message) {
        this.loadingProgress = percentage;
        this.progressCallbacks.forEach(cb => cb(percentage, message));
    }

    async load() {
        if (this.isLoaded) return;

        try {
            const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            const basePath = isLocal
                ? '../data/theographic/'
                : 'https://cdn.jsdelivr.net/gh/Ringmast4r/PROJECT147@main/data/theographic/';

            console.log('Loading theographic data from:', basePath);

            // Load books first (small file)
            this.updateProgress(5, 'Loading books metadata...');
            const booksResponse = await fetch(basePath + 'books.json');
            this.books = await booksResponse.json();
            console.log('✓ Loaded', this.books.length, 'books');

            // Load people data
            this.updateProgress(15, 'Loading biblical people...');
            const peopleResponse = await fetch(basePath + 'people.json');
            this.people = await peopleResponse.json();
            console.log('✓ Loaded', this.people.length, 'people');

            // Load places data with coordinates
            this.updateProgress(30, 'Loading places with GPS coordinates...');
            const placesResponse = await fetch(basePath + 'places.json');
            this.places = await placesResponse.json();
            console.log('✓ Loaded', this.places.length, 'places');

            // Load events
            this.updateProgress(45, 'Loading biblical events...');
            const eventsResponse = await fetch(basePath + 'events.json');
            this.events = await eventsResponse.json();
            console.log('✓ Loaded', this.events.length, 'events');

            // Load periods (for timeline)
            this.updateProgress(55, 'Loading historical periods...');
            const periodsResponse = await fetch(basePath + 'periods.json');
            this.periods = await periodsResponse.json();
            console.log('✓ Loaded', this.periods.length, 'periods');

            // Load people groups
            this.updateProgress(65, 'Loading people groups...');
            const groupsResponse = await fetch(basePath + 'peopleGroups.json');
            this.peopleGroups = await groupsResponse.json();
            console.log('✓ Loaded', this.peopleGroups.length, 'people groups');

            // Load Easton's Bible Dictionary
            this.updateProgress(75, 'Loading Easton\'s Dictionary...');
            const eastonResponse = await fetch(basePath + 'easton.json');
            this.easton = await eastonResponse.json();
            console.log('✓ Loaded', this.easton.length, 'dictionary entries');

            // Load chapters metadata
            this.updateProgress(85, 'Loading chapters metadata...');
            const chaptersResponse = await fetch(basePath + 'chapters.json');
            this.chapters = await chaptersResponse.json();
            console.log('✓ Loaded', this.chapters.length, 'chapters');

            // Skip verses.json for now (36MB) - load on demand
            // this.updateProgress(90, 'Loading verse metadata (36MB)...');
            // const versesResponse = await fetch(basePath + 'verses.json');
            // this.verses = await versesResponse.json();
            // console.log('✓ Loaded', this.verses.length, 'verses');

            this.isLoaded = true;
            this.updateProgress(100, 'Theographic data loaded!');

            console.log('✓ Theographic data fully loaded:', {
                people: this.people.length,
                places: this.places.length,
                events: this.events.length,
                periods: this.periods.length
            });

            return true;
        } catch (error) {
            console.error('Error loading theographic data:', error);
            throw error;
        }
    }

    // Getter methods
    getPeople() {
        return this.people || [];
    }

    getPlaces() {
        return this.places || [];
    }

    getEvents() {
        return this.events || [];
    }

    getPeriods() {
        return this.periods || [];
    }

    getPeopleGroups() {
        return this.peopleGroups || [];
    }

    getBooks() {
        return this.books || [];
    }

    getChapters() {
        return this.chapters || [];
    }

    getEastonDictionary() {
        return this.easton || [];
    }

    // Search methods
    searchPerson(name) {
        if (!this.people) return null;
        const lowerName = name.toLowerCase();
        return this.people.find(p =>
            p.fields.name && p.fields.name.toLowerCase().includes(lowerName)
        );
    }

    searchPlace(name) {
        if (!this.places) return null;
        const lowerName = name.toLowerCase();
        return this.places.find(p =>
            (p.fields.kjvName && p.fields.kjvName.toLowerCase().includes(lowerName)) ||
            (p.fields.esvName && p.fields.esvName.toLowerCase().includes(lowerName))
        );
    }

    searchEvent(name) {
        if (!this.events) return null;
        const lowerName = name.toLowerCase();
        return this.events.find(e =>
            e.fields.name && e.fields.name.toLowerCase().includes(lowerName)
        );
    }

    // Get places with valid GPS coordinates for mapping
    getPlacesWithCoordinates() {
        if (!this.places) return [];
        return this.places.filter(place => {
            const lat = parseFloat(place.fields.latitude);
            const lon = parseFloat(place.fields.longitude);
            return !isNaN(lat) && !isNaN(lon);
        });
    }

    // Get people with birth/death locations
    getPeopleWithLocations() {
        if (!this.people) return [];
        return this.people.filter(person =>
            person.fields.birthPlace || person.fields.deathPlace
        );
    }

    // Get events sorted by period
    getEventsTimeline() {
        if (!this.events || !this.periods) return [];

        return this.events
            .filter(e => e.fields.period && e.fields.period.length > 0)
            .map(event => {
                const periodId = event.fields.period[0];
                const period = this.periods.find(p => p.id === periodId);
                return {
                    ...event,
                    periodInfo: period
                };
            })
            .sort((a, b) => {
                if (!a.periodInfo || !b.periodInfo) return 0;
                return (a.periodInfo.fields.yearNum || 0) - (b.periodInfo.fields.yearNum || 0);
            });
    }

    // Get statistics
    getStats() {
        if (!this.isLoaded) return {};

        return {
            totalPeople: this.people?.length || 0,
            totalPlaces: this.places?.length || 0,
            totalEvents: this.events?.length || 0,
            totalPeriods: this.periods?.length || 0,
            placesWithCoords: this.getPlacesWithCoordinates().length,
            peopleWithLocations: this.getPeopleWithLocations().length,
            dictionaryEntries: this.easton?.length || 0
        };
    }
}

// Global theographic data loader instance
const theographicLoader = new TheographicDataLoader();
