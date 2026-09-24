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
        <article>
            <h5>${event.participantHome.displayName} vs. ${event.participantAway.displayName}</h5>
            <p>${luxon.DateTime.fromISO(event.datePlanned)
                .toFormat("dd.MM.yyyy HH:mm")}
            </p>
            </article>
        `).join("");

    console.log(nextEvents);

}