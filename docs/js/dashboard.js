window.pages = window.pages || {};

window.pages.dashboard = async function() {
    const data = await loadData();

    const today = new Date().setHours(0, 0, 0, 0);

    const nextEvents = data
        .filter(row => new Date(row.datePlanned).setHours(0, 0, 0, 0) >= today)
        .sort((a, b) => Date.parse(a.datePlanned) - Date.parse(b.datePlanned))
        .slice(0, 5);


    container = document.getElementById("upcoming-events");

    container.innerHTML = nextEvents.map(event => `
<article class="fixture">

    <div class="fixture-meta">
        <small>${event.event.name}</small>
        <strong>${event.round.name}</strong>
    </div>

    <div class="fixture-main">

        <div class="fixture-date">
            <span class="fixture-day">
                ${luxon.DateTime.fromISO(event.datePlanned).toFormat("dd")}
            </span>
            <span class="fixture-month">
                ${luxon.DateTime.fromISO(event.datePlanned).toFormat("MMM")}
            </span>
            <span class="fixture-time">
                ${luxon.DateTime.fromISO(event.datePlanned).toFormat("HH:mm")}
            </span>
        </div>

        <div class="fixture-teams">
            <span class="home">
                ${event.participantHome.displayName}
            </span>

            <span class="vs">vs.</span>

            <span class="away">
                ${event.participantAway.displayName}
            </span>
        </div>

    </div>

</article>
        `).join("");

    console.log(nextEvents);

}