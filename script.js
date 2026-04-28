class CountdownTimer {
    constructor() {
        this.targetDate = null;
        this.intervalId = null;
        
        // Timezone mapping data
        this.timezoneData = {
            'UTC-12': {
                cities: ['Baker Island', 'Howland Island'],
                abbreviations: ['BIT']
            },
            'UTC-11': {
                cities: ['American Samoa', 'Niue'],
                abbreviations: ['SST']
            },
            'UTC-10': {
                cities: ['Hawaii', 'Cook Islands', 'Tahiti'],
                abbreviations: ['HST', 'TAHT']
            },
            'UTC-9': {
                cities: ['Alaska', 'Gambier Islands'],
                abbreviations: ['AKST', 'GAMT']
            },
            'UTC-8': {
                cities: ['Pacific Time (US & Canada)', 'Los Angeles', 'Vancouver', 'Tijuana'],
                abbreviations: ['PST', 'PT']
            },
            'UTC-7': {
                cities: ['Mountain Time (US & Canada)', 'Denver', 'Phoenix', 'Salt Lake City'],
                abbreviations: ['MST', 'MT']
            },
            'UTC-6': {
                cities: ['Central Time (US & Canada)', 'Chicago', 'Mexico City', 'Winnipeg'],
                abbreviations: ['CST', 'CT']
            },
            'UTC-5': {
                cities: ['Eastern Time (US & Canada)', 'New York', 'Toronto', 'Montreal', 'Bogota'],
                abbreviations: ['EST', 'ET', 'COT']
            },
            'UTC-4': {
                cities: ['Atlantic Time (Canada)', 'Caracas', 'La Paz', 'Santiago'],
                abbreviations: ['AST', 'VET', 'BOT', 'CLT']
            },
            'UTC-3': {
                cities: ['Brasília', 'Buenos Aires', 'Montevideo', 'Greenland'],
                abbreviations: ['BRT', 'ART', 'UYT', 'WGT']
            },
            'UTC-2': {
                cities: ['Fernando de Noronha', 'South Georgia', 'Mid-Atlantic'],
                abbreviations: ['FNT', 'GST']
            },
            'UTC-1': {
                cities: ['Azores', 'Cape Verde', 'DST'],
                abbreviations: ['AZOT', 'CVT']
            },
            'UTC+0': {
                cities: ['London', 'Dublin', 'Lisbon', 'Casablanca', 'Accra', 'Reykjavik'],
                abbreviations: ['GMT', 'UTC', 'WET', 'WEST']
            },
            'UTC+1': {
                cities: ['Berlin', 'Paris', 'Rome', 'Madrid', 'Amsterdam', 'Stockholm', 'Warsaw', 'Prague'],
                abbreviations: ['CET', 'CEST', 'MEZ']
            },
            'UTC+2': {
                cities: ['Athens', 'Helsinki', 'Bucharest', 'Cairo', 'Jerusalem', 'Johannesburg', 'Kyiv'],
                abbreviations: ['EET', 'EEST', 'IST', 'SAST']
            },
            'UTC+3': {
                cities: ['Moscow', 'Istanbul', 'Baghdad', 'Riyadh', 'Nairobi', 'Doha'],
                abbreviations: ['MSK', 'TRT', 'AST', 'EAT']
            },
            'UTC+4': {
                cities: ['Dubai', 'Baku', 'Tbilisi', 'Yerevan', 'Samara'],
                abbreviations: ['GST', 'AZT', 'GET', 'YET', 'SAMT']
            },
            'UTC+5': {
                cities: ['Karachi', 'Tashkent', 'Ashgabat', 'Male', 'Minsk'],
                abbreviations: ['PKT', 'UZT', 'TMT', 'MVT', 'MSK']
            },
            'UTC+6': {
                cities: ['Dhaka', 'Almaty', 'Omsk', 'Bishkek', 'Thimphu'],
                abbreviations: ['BST', 'ALMT', 'OMST', 'KGT', 'BTT']
            },
            'UTC+7': {
                cities: ['Bangkok', 'Hanoi', 'Jakarta', 'Phnom Penh', 'Krasnoyarsk'],
                abbreviations: ['ICT', 'WIB', 'KRAT']
            },
            'UTC+8': {
                cities: ['Beijing', 'Shanghai', 'Hong Kong', 'Singapore', 'Taipei', 'Perth', 'Manila'],
                abbreviations: ['CST', 'HKT', 'SGT', 'PHT', 'WST']
            },
            'UTC+9': {
                cities: ['Tokyo', 'Seoul', 'Pyongyang', 'Osaka', 'Irkutsk'],
                abbreviations: ['JST', 'KST', 'WIB', 'IRKT']
            },
            'UTC+10': {
                cities: ['Sydney', 'Melbourne', 'Brisbane', 'Port Moresby', 'Yakutsk'],
                abbreviations: ['AEST', 'AEDT', 'PGT', 'YAKT']
            },
            'UTC+11': {
                cities: ['Solomon Islands', 'New Caledonia', 'Vladivostok'],
                abbreviations: ['SBT', 'NCT', 'VLAT']
            },
            'UTC+12': {
                cities: ['Auckland', 'Wellington', 'Fiji', 'Magadan', 'Tuvalu'],
                abbreviations: ['NZST', 'NZDT', 'FJT', 'MAGT', 'TVT']
            },
            'UTC+13': {
                cities: ['Samoa', 'Tonga', 'Kiribati', 'Phoenix Islands'],
                abbreviations: ['SST', 'TOT', 'GILT', 'PHOT']
            },
            'UTC+14': {
                cities: ['Kiritimati', 'Line Islands'],
                abbreviations: ['LINT']
            }
        };
        
        // Initialize settings with detected timezone
        this.settings = {
            title: 'New Year 2025',
            date: '2025-01-01',
            time: '00:00',
            timezone: this.detectUserTimezone(),
            theme: 'gradient',
            backgroundMedia: {
                type: 'none', // 'none', 'image', 'video'
                source: 'none', // 'url', 'local'
                url: null
            }
        };
        
        this.init();
    }
    
    init() {
        // Add a small delay to ensure DOM is fully ready
        setTimeout(() => {
            this.loadSettings();
            this.updateTheme();
            this.setupEventListeners();
            this.updateDisplay();
            this.updateBackgroundMedia();
            this.startCountdown();
        }, 100);
    }
    
    loadSettings() {
        const saved = localStorage.getItem('countdownSettings');
        if (saved) {
            const parsedSettings = JSON.parse(saved);
            
            // Validate and fix timezone if it's invalid
            if (parsedSettings.timezone && !this.timezoneData[parsedSettings.timezone]) {
                // Convert old "UTC" format to "UTC+0"
                if (parsedSettings.timezone === 'UTC') {
                    parsedSettings.timezone = 'UTC+0';
                } else {
                    // If it's some other invalid format, detect user timezone
                    parsedSettings.timezone = this.detectUserTimezone();
                }
                // Save the corrected settings
                localStorage.setItem('countdownSettings', JSON.stringify(parsedSettings));
            }
            
            // Remove old timezoneStyle property if it exists
            if (parsedSettings.timezoneStyle) {
                delete parsedSettings.timezoneStyle;
                localStorage.setItem('countdownSettings', JSON.stringify(parsedSettings));
            }
            
            this.settings = { ...this.settings, ...parsedSettings };
            this.populateForm();
        } else {
            this.populateForm();
        }
        this.updateTargetDate();
        this.updateCurrentSettingsDisplay();
    }
    
    saveSettings() {
        localStorage.setItem('countdownSettings', JSON.stringify(this.settings));
    }
    
    populateForm() {
        document.getElementById('title').value = this.settings.title;
        document.getElementById('date').value = this.settings.date;
        document.getElementById('time').value = this.settings.time;
        
        const themeRadios = document.querySelectorAll('input[name="theme"]');
        themeRadios.forEach(radio => {
            radio.checked = radio.value === this.settings.theme;
        });
        
        // Populate timezone selectors first
        this.populateTimezoneSelectors();
        
        // Then set current timezone values
        this.setTimezoneValues(this.settings.timezone);
        
        // Populate background media settings
        this.populateBackgroundMediaForm();
    }
    
    populateTimezoneSelectors() {
        const citySelect = document.getElementById('cityTimezone');
        const abbrSelect = document.getElementById('abbrTimezone');
        
        if (!citySelect || !abbrSelect) {
            console.error('Timezone selector elements not found!');
            return;
        }
        
        // Clear existing options
        citySelect.innerHTML = '<option value="">Select a city...</option>';
        abbrSelect.innerHTML = '<option value="">Select abbreviation...</option>';
        
        // Create sorted arrays for cities and abbreviations
        const cityOptions = [];
        const abbrOptions = [];
        
        // Collect all city options
        Object.entries(this.timezoneData).forEach(([utc, data]) => {
            data.cities.forEach(city => {
                cityOptions.push({ value: utc, text: city });
            });
        });
        
        // Collect all abbreviation options
        Object.entries(this.timezoneData).forEach(([utc, data]) => {
            data.abbreviations.forEach(abbr => {
                abbrOptions.push({ value: utc, text: abbr });
            });
        });
        
        // Sort options alphabetically by text
        cityOptions.sort((a, b) => a.text.localeCompare(b.text));
        abbrOptions.sort((a, b) => a.text.localeCompare(b.text));
        
        // Populate city selector with sorted options
        cityOptions.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.text;
            citySelect.appendChild(optionElement);
        });
        
        // Populate abbreviation selector with sorted options
        abbrOptions.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.text;
            abbrSelect.appendChild(optionElement);
        });
        
        // Add live search functionality
        this.addLiveSearch(citySelect, 'city');
        this.addLiveSearch(abbrSelect, 'abbr');
    }
    
    setTimezoneValues(value) {
        const utcOffset = document.getElementById('utcOffset');
        const cityTimezone = document.getElementById('cityTimezone');
        const abbrTimezone = document.getElementById('abbrTimezone');
        
        if (!utcOffset || !cityTimezone || !abbrTimezone) {
            console.error('Timezone elements not found in setTimezoneValues!');
            return;
        }
        
        // Set all selectors to the current timezone value
        utcOffset.value = value;
        cityTimezone.value = value;
        abbrTimezone.value = value;
        
        console.log('Set values - UTC:', utcOffset.value, 'City:', cityTimezone.value, 'Abbr:', abbrTimezone.value);
    }
    
    addLiveSearch(selectElement, type) {
        // Store original options for filtering
        const originalOptions = Array.from(selectElement.options).map(option => ({
            value: option.value,
            text: option.textContent
        }));
        
        // Create custom dropdown container
        const container = document.createElement('div');
        container.className = 'relative';
        selectElement.parentNode.insertBefore(container, selectElement);
        container.appendChild(selectElement);
        selectElement.style.display = 'none'; // Hide original select
        
        // Create custom input that looks like a select
        const customSelect = document.createElement('div');
        customSelect.className = 'relative';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = selectElement.options[0]?.textContent || `Select ${type === 'city' ? 'city' : 'abbreviation'}...`;
        input.className = 'form-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm cursor-pointer';
        
        const dropdown = document.createElement('div');
        dropdown.className = 'absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto hidden';
        
        customSelect.appendChild(input);
        customSelect.appendChild(dropdown);
        container.appendChild(customSelect);
        
        let currentValue = '';
        let isDropdownOpen = false;
        let filteredOptions = [...originalOptions];
        
        // Populate dropdown with options
        const populateDropdown = (options) => {
            dropdown.innerHTML = '';
            options.forEach(option => {
                const optionElement = document.createElement('div');
                optionElement.className = 'px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm';
                optionElement.textContent = option.text;
                optionElement.dataset.value = option.value;
                
                optionElement.addEventListener('click', () => {
                    selectOption(option);
                });
                
                dropdown.appendChild(optionElement);
            });
        };
        
        const selectOption = (option) => {
            input.value = option.text;
            currentValue = option.value;
            selectElement.value = option.value;
            
            // Trigger change event for sync
            selectElement.dispatchEvent(new Event('change'));
            
            closeDropdown();
        };
        
        const openDropdown = () => {
            isDropdownOpen = true;
            dropdown.classList.remove('hidden');
            populateDropdown(filteredOptions);
        };
        
        const closeDropdown = () => {
            isDropdownOpen = false;
            dropdown.classList.add('hidden');
        };
        
        const filterOptions = (searchTerm) => {
            if (!searchTerm) {
                filteredOptions = [...originalOptions];
            } else {
                filteredOptions = originalOptions.filter(option => 
                    option.text.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }
            
            if (isDropdownOpen) {
                populateDropdown(filteredOptions);
            }
        };
        
        // Event listeners
        input.addEventListener('focus', openDropdown);
        
        input.addEventListener('input', (e) => {
            const searchTerm = e.target.value;
            filterOptions(searchTerm);
            
            // If input matches exactly one option, select it
            if (filteredOptions.length === 1 && filteredOptions[0].text.toLowerCase() === searchTerm.toLowerCase()) {
                selectOption(filteredOptions[0]);
            }
        });
        
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeDropdown();
                input.blur();
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (filteredOptions.length > 0) {
                    selectOption(filteredOptions[0]);
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (!isDropdownOpen) {
                    openDropdown();
                }
            }
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!container.contains(e.target)) {
                closeDropdown();
            }
        });
        
        // Set initial value from original select
        if (selectElement.value) {
            const selectedOption = originalOptions.find(opt => opt.value === selectElement.value);
            if (selectedOption) {
                input.value = selectedOption.text;
                currentValue = selectedOption.value;
            }
        }
        
        // Listen for changes to the original select (from sync)
        selectElement.addEventListener('change', () => {
            if (selectElement.value !== currentValue) {
                const selectedOption = originalOptions.find(opt => opt.value === selectElement.value);
                if (selectedOption) {
                    input.value = selectedOption.text;
                    currentValue = selectedOption.value;
                }
            }
        });
    }
    
    syncTimezoneSelectors(source, value) {
        const utcOffset = document.getElementById('utcOffset');
        const cityTimezone = document.getElementById('cityTimezone');
        const abbrTimezone = document.getElementById('abbrTimezone');
        
        // Update all selectors to match the new value
        if (source !== 'utcOffset') {
            utcOffset.value = value;
        }
        if (source !== 'cityTimezone') {
            cityTimezone.value = value;
        }
        if (source !== 'abbrTimezone') {
            abbrTimezone.value = value;
        }
        
        // Update settings
        this.settings.timezone = value;
        this.updateTargetDate();
        this.updateTimezoneDisplay();
        this.updateCurrentSettingsDisplay();
        this.saveSettings();
    }
    
    updateTargetDate() {
        // Parse the date/time as if it's in the specified timezone
        const [year, month, day] = this.settings.date.split('-').map(Number);
        const [hours, minutes] = this.settings.time.split(':').map(Number);
        
        // Convert to the target timezone offset
        const offset = this.parseUTCOffset(this.settings.timezone);
        
        if (offset !== null) {
            // Create the date as if it's in the specified timezone
            // First, create it as UTC, then adjust backwards by the timezone offset
            const utcHours = hours - offset; // Subtract the offset to get UTC time
            
            // Create UTC date with adjusted hours
            this.targetDate = new Date(Date.UTC(year, month - 1, day, utcHours, minutes, 0));
        } else {
            // Fallback to local time if no timezone specified
            this.targetDate = new Date(year, month - 1, day, hours, minutes, 0);
        }
    }
    
    parseUTCOffset(utcString) {
        const match = utcString.match(/UTC([+-]\d+)/);
        return match ? parseInt(match[1]) : null;
    }
    
    detectUserTimezone() {
        // Try to detect user's timezone from browser
        try {
            const userOffset = -(new Date().getTimezoneOffset() / 60);
            const utcString = `UTC${userOffset >= 0 ? '+' : ''}${userOffset}`;
            
            // Check if this UTC offset exists in our data
            if (this.timezoneData && this.timezoneData[utcString]) {
                return utcString;
            }
            
            // Fallback to UTC+0 if not found
            return 'UTC+0';
        } catch (error) {
            console.log('Error detecting timezone:', error);
            // Fallback to UTC+0 if detection fails
            return 'UTC+0';
        }
    }
    
    setupEventListeners() {
        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('sidebar');
        const closeSidebar = document.getElementById('closeSidebar');
        
        const toggleSidebar = (open) => {
            if (open) {
                sidebar.classList.add('open');
                sidebarToggle.style.opacity = '0';
                setTimeout(() => {
                    sidebarToggle.style.display = 'none';
                }, 300);
            } else {
                sidebarToggle.style.display = 'block';
                setTimeout(() => {
                    sidebarToggle.style.opacity = '1';
                }, 10);
                sidebar.classList.remove('open');
            }
        };
        
        sidebarToggle.addEventListener('click', () => {
            toggleSidebar(true);
        });
        
        closeSidebar.addEventListener('click', () => {
            toggleSidebar(false);
        });
        
        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            if (sidebar.classList.contains('open') && 
                !sidebar.contains(e.target) && 
                !sidebarToggle.contains(e.target)) {
                toggleSidebar(false);
            }
        });
        
        // Form submission
        const configForm = document.getElementById('configForm');
        configForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateSettings();
        });
        
                
        // Real-time updates for theme
        const themeRadios = document.querySelectorAll('input[name="theme"]');
        themeRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                this.settings.theme = radio.value;
                this.updateTheme();
                this.updateCurrentSettingsDisplay();
                this.saveSettings();
            });
        });
        
        // Timezone selector event listeners
        document.getElementById('utcOffset').addEventListener('change', (e) => {
            this.syncTimezoneSelectors('utcOffset', e.target.value);
        });
        
        document.getElementById('cityTimezone').addEventListener('change', (e) => {
            if (e.target.value) {
                this.syncTimezoneSelectors('cityTimezone', e.target.value);
            }
        });
        
        document.getElementById('abbrTimezone').addEventListener('change', (e) => {
            if (e.target.value) {
                this.syncTimezoneSelectors('abbrTimezone', e.target.value);
            }
        });
        
        // Setup background media listeners
        this.setupBackgroundMediaListeners();
    }
    
    formatTimezone() {
        const data = this.timezoneData[this.settings.timezone];
        if (data) {
            const mainCity = data.cities[0];
            const mainAbbr = data.abbreviations[0];
            return `${this.settings.timezone} (${mainCity}, ${mainAbbr})`;
        }
        return this.settings.timezone;
    }
    
    updateSettings() {
        this.settings.title = document.getElementById('title').value;
        this.settings.date = document.getElementById('date').value;
        this.settings.time = document.getElementById('time').value;
        this.settings.timezone = document.getElementById('utcOffset').value;
        
        const themeRadios = document.querySelectorAll('input[name="theme"]');
        themeRadios.forEach(radio => {
            if (radio.checked) {
                this.settings.theme = radio.value;
            }
        });
        
        // Reset completed state if it was showing
        this.resetCompletedState();
        
        this.updateTheme();
        this.updateTargetDate();
        this.updateDisplay();
        this.updateCurrentSettingsDisplay();
        this.saveSettings();
        
        // Restart countdown with new settings
        this.startCountdown();
        
        // Close sidebar on mobile after applying
        if (window.innerWidth < 768) {
            document.getElementById('sidebar').classList.remove('open');
        }
        
        // Show success feedback
        this.showSuccessFeedback();
    }
    
    showSuccessFeedback() {
        const button = document.querySelector('#configForm button[type="submit"]');
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check mr-2"></i>Settings Applied!';
        button.classList.add('bg-green-500');
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.classList.remove('bg-green-500');
        }, 1500);
    }
    
    updateDisplay() {
        document.getElementById('countdownTitle').textContent = this.settings.title;
        this.updateTimezoneDisplay();
    }
    
    updateTimezoneDisplay() {
        document.getElementById('timezoneDisplay').textContent = this.formatTimezone();
    }
    
    updateTheme() {
        const container = document.getElementById('mainContainer');
        container.className = `theme-${this.settings.theme}`;
    }
    
    updateCurrentSettingsDisplay() {
        const display = document.getElementById('currentSettings');
        const formattedDate = new Date(this.settings.date + 'T' + this.settings.time).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        const themeNames = {
            'gradient': 'Gradient (Default)',
            'shadcn': 'shadcn/ui Dark',
            'minimal': 'Minimalistic Dark'
        };
        
        // Format background media info
        let backgroundMediaInfo = 'None';
        const media = this.settings.backgroundMedia;
        if (media.type && media.type !== 'none') {
            if (media.source === 'local') {
                backgroundMediaInfo = `Local ${media.type}`;
            } else if (media.source === 'url') {
                backgroundMediaInfo = `URL ${media.type}`;
            }
        }
        
        display.innerHTML = `
            <div><strong>Title:</strong> ${this.settings.title}</div>
            <div><strong>Date:</strong> ${formattedDate}</div>
            <div><strong>Time:</strong> ${this.settings.time}</div>
            <div><strong>Timezone:</strong> ${this.formatTimezone()}</div>
            <div><strong>Theme:</strong> ${themeNames[this.settings.theme]}</div>
            <div><strong>Background:</strong> ${backgroundMediaInfo}</div>
        `;
    }
    
    startCountdown() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        
        this.intervalId = setInterval(() => {
            this.calculateCountdown();
        }, 1000);
        
        this.calculateCountdown();
    }
    
    calculateCountdown() {
        if (!this.targetDate) {
            return;
        }
        
        const now = new Date();
        const difference = this.targetDate - now;
        
        if (difference <= 0) {
            this.showCompleted();
            clearInterval(this.intervalId);
            return;
        }
        
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        this.updateCountdownDisplay(days, hours, minutes, seconds);
    }
    
    updateCountdownDisplay(days, hours, minutes, seconds) {
        const elements = {
            days: document.getElementById('days'),
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds')
        };
        
        const values = { days, hours, minutes, seconds };
        
        Object.keys(elements).forEach(key => {
            const element = elements[key];
            const value = values[key];
            const formattedValue = value.toString().padStart(2, '0');
            
            if (element.textContent !== formattedValue) {
                element.textContent = formattedValue;
                element.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                }, 200);
            }
        });
    }
    
    showCompleted() {
        document.getElementById('countdown').classList.add('hidden');
        document.getElementById('completedMessage').classList.remove('hidden');
        
        // Add pulse animation to title when timer expires
        document.getElementById('countdownTitle').classList.add('pulse');
        
        // Add celebration animation
        this.createConfetti();
    }
    
    // Add a method to reset the completed state and show countdown again
    resetCompletedState() {
        document.getElementById('countdown').classList.remove('hidden');
        document.getElementById('completedMessage').classList.add('hidden');
        
        // Remove pulse animation from title when new settings are applied
        document.getElementById('countdownTitle').classList.remove('pulse');
        
        // Clear any existing confetti
        const confettiElements = document.querySelectorAll('[style*="position: fixed"]');
        confettiElements.forEach(el => el.remove());
    }
    
    createConfetti() {
        // Use theme-appropriate colors for confetti
        const themeColors = {
            gradient: ['#667eea', '#764ba2', '#f59e0b', '#10b981', '#ef4444'],
            shadcn: ['#3b82f6', '#1d4ed8', '#10b981', '#f59e0b', '#ef4444'],
            minimal: ['#f3f4f6', '#d1d5db', '#9ca3af', '#6b7280', '#4b5563']
        };
        
        const colors = themeColors[this.settings.theme] || themeColors.gradient;
        const confettiCount = 50;
        
        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.cssText = `
                    position: fixed;
                    width: 10px;
                    height: 10px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    left: ${Math.random() * 100}%;
                    top: -10px;
                    opacity: 0.8;
                    transform: rotate(${Math.random() * 360}deg);
                    animation: fall ${2 + Math.random() * 2}s linear;
                    z-index: 1000;
                    pointer-events: none;
                    box-sizing: border-box;
                `;
                document.body.appendChild(confetti);
                
                setTimeout(() => confetti.remove(), 4000);
            }, i * 50);
        }
        
        // Add fall animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fall {
                to {
                    transform: translateY(${window.innerHeight - 20}px) rotate(${Math.random() * 720}deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Background Media Methods
    setupBackgroundMediaListeners() {
        // Media type radio buttons
        const mediaTypeRadios = document.querySelectorAll('input[name="mediaType"]');
        mediaTypeRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                this.handleMediaTypeChange(radio.value);
            });
        });
        
        // URL input
        const mediaUrlInput = document.getElementById('mediaUrl');
        mediaUrlInput.addEventListener('input', (e) => {
            this.handleUrlInput(e.target.value);
        });
        
        // Local media dropdown
        const localMediaSelect = document.getElementById('localMedia');
        localMediaSelect.addEventListener('change', (e) => {
            this.handleLocalMediaChange(e.target.value);
        });
        
        // Remove media button
        const removeMediaBtn = document.getElementById('removeMedia');
        removeMediaBtn.addEventListener('click', () => {
            this.removeBackgroundMedia();
        });
        
        // Load local media files
        this.loadLocalMediaFiles();
    }
    
    handleMediaTypeChange(type) {
        const urlSection = document.getElementById('urlSection');
        const localSection = document.getElementById('localSection');
        
        // Hide all sections first
        urlSection.classList.add('hidden');
        localSection.classList.add('hidden');
        
        // Show relevant section
        if (type === 'url') {
            urlSection.classList.remove('hidden');
        } else if (type === 'local') {
            localSection.classList.remove('hidden');
        }
        
        // Update settings
        this.settings.backgroundMedia.source = type;
        if (type === 'none') {
            this.removeBackgroundMedia();
        }
    }
    
    handleUrlInput(url) {
        if (!url.trim()) return;
        
        // Detect file type from URL extension
        const fileType = this.detectFileTypeFromUrl(url);
        
        if (fileType) {
            this.settings.backgroundMedia = {
                type: fileType,
                source: 'url',
                url: url.trim()
            };
            
            // Update UI
            this.updateUrlInfo(url, fileType);
            this.updateBackgroundMedia();
            this.updateCurrentMediaDisplay();
            this.saveSettings();
        } else {
            // Invalid URL or unsupported format
            document.getElementById('urlInfo').innerHTML = 
                '<span class="text-red-500">Unsupported format or invalid URL</span>';
            document.getElementById('urlInfo').classList.remove('hidden');
        }
    }
    
    detectFileTypeFromUrl(url) {
        // Try to determine type from URL extension
        const extension = url.split('.').pop().toLowerCase();
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
        const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'];
        
        if (imageExtensions.includes(extension)) {
            return 'image';
        } else if (videoExtensions.includes(extension)) {
            return 'video';
        }
        
        return null;
    }
    
    updateUrlInfo(url, fileType) {
        const urlInfo = document.getElementById('urlInfo');
        urlInfo.innerHTML = `
            <span class="text-green-600">
                <i class="fas fa-${fileType === 'image' ? 'image' : 'video'} mr-1"></i>
                ${url} - ${fileType}
            </span>
        `;
        urlInfo.classList.remove('hidden');
    }
    
    async loadLocalMediaFiles() {
        const localMediaSelect = document.getElementById('localMedia');
        localMediaSelect.innerHTML = '<option value="">Loading media files...</option>';
        
        try {
            // Try to load the real file list from JSON
            const response = await fetch('media-files.json');
            if (response.ok) {
                const mediaFiles = await response.json();
                
                localMediaSelect.innerHTML = '<option value="">Select media file...</option>';
                
                if (mediaFiles.length === 0) {
                    localMediaSelect.innerHTML = '<option value="">No media files found</option>';
                    return;
                }
                
                mediaFiles.forEach(file => {
                    const option = document.createElement('option');
                    option.value = `media/${file.filename}`;
                    option.textContent = `${file.filename} (${file.type})`;
                    option.dataset.type = file.type;
                    localMediaSelect.appendChild(option);
                });
                
                            } else {
                throw new Error('Could not load media files list');
            }
        } catch (error) {
            console.log('Could not load media-files.json, using fallback');
            // Fallback to common files if JSON doesn't exist
            const fallbackFiles = [
                { filename: 'background.jpg', type: 'image' },
                { filename: 'background.png', type: 'image' },
                { filename: 'background.gif', type: 'image' },
                { filename: 'background.webp', type: 'image' },
                { filename: 'background.mp4', type: 'video' },
                { filename: 'background.webm', type: 'video' }
            ];
            
            localMediaSelect.innerHTML = '<option value="">Select media file...</option>';
            
            fallbackFiles.forEach(file => {
                const option = document.createElement('option');
                option.value = `media/${file.filename}`;
                option.textContent = `${file.filename} (${file.type})`;
                option.dataset.type = file.type;
                localMediaSelect.appendChild(option);
            });
        }
    }
    
    handleLocalMediaChange(url) {
        if (!url) return;
        
        const localMediaSelect = document.getElementById('localMedia');
        const selectedOption = localMediaSelect.options[localMediaSelect.selectedIndex];
        const fileType = selectedOption.dataset.type;
        
        this.settings.backgroundMedia = {
            type: fileType,
            source: 'local',
            url: url
        };
        
        // Update UI
        this.updateLocalMediaInfo(selectedOption.textContent, fileType);
        this.updateBackgroundMedia();
        this.updateCurrentMediaDisplay();
        this.saveSettings();
    }
    
    updateLocalMediaInfo(filename, fileType) {
        const localInfo = document.getElementById('localInfo');
        localInfo.innerHTML = `
            <span class="text-green-600">
                <i class="fas fa-${fileType === 'image' ? 'image' : 'video'} mr-1"></i>
                ${filename}
            </span>
        `;
        localInfo.classList.remove('hidden');
    }
    
    updateBackgroundMedia() {
        const container = document.getElementById('mainContainer');
        const imageElement = document.getElementById('backgroundImage');
        const videoElement = document.getElementById('backgroundVideo');
        const mediaContainer = document.getElementById('backgroundMediaContainer');
        const overlay = document.getElementById('backgroundOverlay');
        
        // Hide all media first
        imageElement.classList.add('hidden');
        videoElement.classList.add('hidden');
        mediaContainer.classList.add('hidden');
        overlay.classList.add('hidden');
        
        // Remove no-background class
        container.classList.remove('no-background');
        
        const media = this.settings.backgroundMedia;
        
        if (media.type === 'none' || !media.url) {
            container.classList.add('no-background');
            return;
        }
        
        // Show background media container and overlay
        mediaContainer.classList.remove('hidden');
        overlay.classList.remove('hidden');
        
        if (media.type === 'image') {
            const imageUrl = media.source === 'local' ? media.url : media.url;
            imageElement.src = imageUrl;
            imageElement.classList.remove('hidden');
        } else if (media.type === 'video') {
            // Reset video element
            videoElement.pause();
            videoElement.currentTime = 0;
            
            const videoUrl = media.source === 'local' ? media.url : media.url;
            videoElement.src = videoUrl;
            
            // Show video element
            videoElement.classList.remove('hidden');
            videoElement.style.display = 'block';
            
            // Load and play video
            videoElement.load();
            
            // Try to play after a short delay
            setTimeout(() => {
                videoElement.play().catch(e => console.log('Video autoplay failed:', e));
            }, 500);
        }
    }
    
    updateCurrentMediaDisplay() {
        const display = document.getElementById('currentMediaDisplay');
        const info = document.getElementById('currentMediaInfo');
        const media = this.settings.backgroundMedia;
        
        if (media.type === 'none' || !media.url) {
            display.classList.add('hidden');
            return;
        }
        
        display.classList.remove('hidden');
        
        let mediaInfo = '';
        if (media.source === 'local') {
            mediaInfo = `Local ${media.type}`;
        } else if (media.source === 'url') {
            mediaInfo = `URL: ${media.url.substring(0, 30)}${media.url.length > 30 ? '...' : ''}`;
        }
        
        info.innerHTML = `
            <i class="fas fa-${media.type === 'image' ? 'image' : 'video'} mr-1"></i>
            ${mediaInfo}
        `;
    }
    
    removeBackgroundMedia() {
        this.settings.backgroundMedia = {
            type: 'none',
            source: 'none',
            url: null
        };
        
        // Reset form
        document.querySelector('input[name="mediaType"][value="none"]').checked = true;
        document.getElementById('mediaUrl').value = '';
        document.getElementById('localMedia').value = '';
        document.getElementById('urlInfo').classList.add('hidden');
        document.getElementById('localInfo').classList.add('hidden');
        document.getElementById('urlSection').classList.add('hidden');
        document.getElementById('localSection').classList.add('hidden');
        
        // Update display
        this.updateBackgroundMedia();
        this.updateCurrentMediaDisplay();
        this.saveSettings();
    }
    
    populateBackgroundMediaForm() {
        const media = this.settings.backgroundMedia;
        
        // Set media type radio
        const mediaTypeRadio = document.querySelector(`input[name="mediaType"][value="${media.source || 'none'}"]`);
        if (mediaTypeRadio) {
            mediaTypeRadio.checked = true;
        }
        
        // Handle initial media type change to show/hide sections
        this.handleMediaTypeChange(media.source || 'none');
        
        // Set URL if it exists
        if (media.source === 'url' && media.url) {
            document.getElementById('mediaUrl').value = media.url;
        } else if (media.source === 'local' && media.url) {
            document.getElementById('localMedia').value = media.url;
        }
        
        // Update current media display
        this.updateCurrentMediaDisplay();
    }
}

// Initialize the countdown timer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CountdownTimer();
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.getElementById('sidebar').classList.remove('open');
    }
    if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('open');
    }
});
