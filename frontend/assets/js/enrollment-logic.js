/**
 * enrollment-logic.js
 * Handles Locations API, International Phone Sync, and Custom Dropdowns
 */

let iti;

document.addEventListener('DOMContentLoaded', function() {
    // --- 1. INITIALIZE ELEMENTS ---
    const phoneInput = document.querySelector("#placeholder-phone");
    const hiddenPhoneInput = document.querySelector("#phone");
    const nationalityInput = document.getElementById('nationality');
    const countryDisplay = document.getElementById('country-display');
    const countryOptions = document.getElementById('country-options');
    const countryList = document.getElementById('country-list');
    const countrySearch = document.getElementById('country-search');
    const stateSelect = document.getElementById('state');
    const citySelect = document.getElementById('city');

    if (!phoneInput || !nationalityInput) return;

    // --- 2. INITIALIZE PHONE INPUT (ITI) ---
    iti = window.intlTelInput(phoneInput, {
        initialCountry: "auto",
        geoIpLookup: callback => {
            fetch("https://ipapi.co/json")
                .then(res => res.json())
                .then(data => callback(data.country_code))
                .catch(() => callback("ng"));
        },
        utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input/build/js/utils.js"
    });

    phoneInput.addEventListener('change', () => {
        hiddenPhoneInput.value = iti.getNumber();
    });

    // --- 3. CUSTOM COUNTRY DROPDOWN LOGIC ---
    countryDisplay.addEventListener('click', (e) => {
        e.stopPropagation();
        countryOptions.classList.toggle('active');
        if (countryOptions.classList.contains('active')) {
            countrySearch.focus();
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.custom-select-container')) {
            countryOptions.classList.remove('active');
        }
    });

    countrySearch.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        document.querySelectorAll('.custom-option').forEach(opt => {
            const name = opt.textContent.toLowerCase();
            opt.style.display = name.includes(term) ? 'flex' : 'none';
        });
    });

    const populateDropdown = (el, data, placeholder) => {
        el.innerHTML = `<option value="" selected hidden>${placeholder}</option>`;
        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item;
            option.textContent = item;
            el.appendChild(option);
        });
        el.disabled = false;
    };

    const onCountrySelect = (countryName, isoCode) => {
        nationalityInput.value = countryName;
        // Sync ITI Phone with selected country
        if (isoCode && iti) {
            iti.setCountry(isoCode.toLowerCase());
        }

        // Trigger State Fetch
        stateSelect.disabled = true;
        stateSelect.innerHTML = '<option>Loading states...</option>';
        citySelect.disabled = true;
        citySelect.innerHTML = '<option>Select state first</option>';

        fetch("https://countriesnow.space/api/v0.1/countries/states", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ country: countryName })
        })
        .then(res => res.json())
        .then(res => {
            if (!res.data || !res.data.states) throw new Error("No states");
            const states = res.data.states.map(s => s.name);
            populateDropdown(stateSelect, states, "Select State");
        })
        .catch(() => {
            stateSelect.innerHTML = '<option value="">No states found</option>';
            stateSelect.disabled = false;
        });
    };

    // --- 4. FETCH COUNTRIES & FLAGS ---
    fetch("https://countriesnow.space/api/v0.1/countries/info?returns=flag,unicode,iso2")
        .then(res => res.json())
        .then(res => {
            countryList.innerHTML = '';
            res.data.forEach(item => {
                if (!item.iso2) return;
                
                // Use FlagCDN with fallback to Cloudflare/Factor
                const primaryFlag = `https://flagcdn.com/w40/${item.iso2.toLowerCase()}.png`;
                const backupFlag = `https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/4x3/${item.iso2.toLowerCase()}.svg`;

                const opt = document.createElement('div');
                opt.className = 'custom-option';
                opt.innerHTML = `
                    <img src="${primaryFlag}" 
                         onerror="this.onerror=null; this.src='${backupFlag}';" 
                         alt="${item.name}" loading="lazy">
                    <span>${item.name}</span>
                `;
                
                opt.addEventListener('click', () => {
                    countryDisplay.innerHTML = `
                        <img src="${primaryFlag}" onerror="this.onerror=null; this.src='${backupFlag}';" alt="${item.name}">
                        <span>${item.name}</span>
                    `;
                    onCountrySelect(item.name, item.iso2);
                });
                countryList.appendChild(opt);
            });
        })
        .catch(err => {
            console.error("Failed to load countries:", err);
            countryDisplay.textContent = "Error loading countries";
        });

    // --- 5. STATE CHANGE -> FETCH CITIES ---
    stateSelect.addEventListener('change', function() {
        const country = nationalityInput.value;
        const state = this.value;
        citySelect.disabled = true;
        citySelect.innerHTML = '<option>Loading cities...</option>';

        fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ country, state })
        })
        .then(res => res.json())
        .then(res => {
            if (!res.data) throw new Error("No cities");
            populateDropdown(citySelect, res.data, "Select City");
        })
        .catch(() => {
            citySelect.innerHTML = '<option value="">No cities found</option>';
            citySelect.disabled = false;
        });
    });
});
