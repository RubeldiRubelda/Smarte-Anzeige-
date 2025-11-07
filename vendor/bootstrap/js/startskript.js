 // WMO Weather Codes zu Beschreibung
        const weatherCodes = {
            0: 'Klarer Himmel',
            1: 'Hauptsächlich klar',
            2: 'Teilweise bewölkt',
            3: 'Bedeckt',
            45: 'Nebel',
            48: 'Nebel mit Reifablagerung',
            51: 'Leichter Nieselregen',
            53: 'Mäßiger Nieselregen',
            55: 'Starker Nieselregen',
            61: 'Leichter Regen',
            63: 'Mäßiger Regen',
            65: 'Starker Regen',
            71: 'Leichter Schneefall',
            73: 'Mäßiger Schneefall',
            75: 'Starker Schneefall',
            77: 'Schneegriesel',
            80: 'Leichte Regenschauer',
            81: 'Mäßige Regenschauer',
            82: 'Starke Regenschauer',
            85: 'Leichte Schneeschauer',
            86: 'Starke Schneeschauer',
            95: 'Gewitter',
            96: 'Gewitter mit leichtem Hagel',
            99: 'Gewitter mit starkem Hagel'
        };

        // Wetter Icon SVGs
        const weatherIcons = {
            clear: '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>',
            cloudy: '<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>',
            rain: '<line x1="16" y1="13" x2="16" y2="21"></line><line x1="8" y1="13" x2="8" y2="21"></line><line x1="12" y1="15" x2="12" y2="23"></line><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path>',
            fog: '<path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><line x1="8" y1="19" x2="12" y2="19"></line><line x1="8" y1="22" x2="12" y2="22"></line>'
        };

        function getWeatherIcon(code) {
            if (code === 0 || code === 1) return weatherIcons.clear;
            if (code === 2 || code === 3) return weatherIcons.cloudy;
            if (code === 45 || code === 48) return weatherIcons.fog;
            if (code >= 51 && code <= 99) return weatherIcons.rain;
            return weatherIcons.clear;
        }

        function updateTime() {
            const now = new Date();
            $('#currentTime').text(now.toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' }));
            $('#currentDate').text(now.toLocaleDateString('de-CH', { weekday: 'long', day: 'numeric', month: 'long' }));
            $('#updateTime').text(now.toLocaleTimeString('de-CH'));
        }




                // Wetter von API laden
        function loadWeather() {
            $.ajax({
                url: 'https://api.open-meteo.com/v1/forecast?latitude=47.0794&longitude=8.3404&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,apparent_temperature,precipitation,rain,showers,snowfall,snow_depth,weather_code&timezone=Europe%2FBerlin&forecast_days=1',
                method: 'GET',
                success: function(data) {
                    // Aktuelle Stunde ermitteln
                    const now = new Date();
                    const currentHour = now.getHours();
                    
                    // Daten für aktuelle Stunde
                    const temp = data.hourly.temperature_2m[currentHour];
                    const humidity = data.hourly.relative_humidity_2m[currentHour];
                    const feelsLike = data.hourly.apparent_temperature[currentHour];
                    const precipProb = data.hourly.precipitation_probability[currentHour];
                    const weatherCode = data.hourly.weather_code[currentHour];
                    
                    // UI aktualisieren
                    $('#weatherTemp').html(`${temp.toFixed(1)}°C`);
                    $('#weatherCondition').text(weatherCodes[weatherCode] || 'Unbekannt');
                    $('#weatherHumidity').text(`${humidity}%`);
                    $('#weatherFeelsLike').text(`${feelsLike.toFixed(1)}°C`);
                    $('#weatherPrecip').text(`${precipProb}%`);
                    
                    // Icon aktualisieren
                    const iconSvg = getWeatherIcon(weatherCode);
                    $('#weatherIcon').html(iconSvg);
                },
                error: function(error) {
                    console.error('Fehler beim Laden der Wetterdaten:', error);
                    $('#weatherTemp').text('--°C');
                    $('#weatherCondition').text('Fehler beim Laden');
                }
            });
        }

        // Initialisierung
        $(document).ready(function() {
            updateTime();
            renderDepartures();
            loadWeather();
            
            setInterval(updateTime, 1000);
            // Wetter alle 10 Minuten aktualisieren
            setInterval(loadWeather, 600000);
        });













        async function öVabfahrt() {
    try {
        const response = await fetch("http://transport.opendata.ch/v1/stationboard?station=Kriens%20Mattenhof&limit=1");
        const data = await response.json();

        // Stationsname auslesen
        const stationName = data?.station?.name ?? "Unbekannte Station";
        const bahnnr = data?.stationboard[0].category ?? "NaN";
        const bahnzahl = data?.stationboard[0].number ?? "NaN";
        const destination = data?.stationboard[0].to ?? "Unbekanntes Ziel";
        const delay = data?.stationboard[0].stop.delay ?? "Pünktlich";
        const departureTime = data?.stationboard[0].departure ?? "Unbekannte Zeit";

        // In HTML einsetzen
        
        document.getElementById("nr1").textContent = bahnnr + bahnzahl;
        document.getElementById("stationsname").textContent = "Fährt ab " + stationName + " nach " + destination;
        document.getElementById("abfahrt1").textContent = "Abfahrt: " + new Date(departureTime).toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' });
        if (delay !== 0) {
            document.getElementById("verspätung1").textContent = "Verspätung: " + delay + " Minuten";
        }

    } catch (error) {
        console.error("Fehler beim Laden:", error);
        document.getElementById("stationsname").textContent = "Fehler beim Laden";
    }
}

// Beim Laden der Seite ausführen
öVabfahrt();

