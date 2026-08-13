console.log("LWPL Admin JS is working!");

const pageTitle = document.getElementById("pageTitle");
const content = document.getElementById("content");
const menuItems = document.querySelectorAll(".sidebar li");

menuItems.forEach(item => {
    item.addEventListener("click", () => {

        menuItems.forEach(i => i.classList.remove("active"));
        item.classList.add("active");

        const page = item.dataset.page;

        pageTitle.textContent = item.textContent.trim();

        loadPage(page);
    });
});


function loadPage(page) {

    if (page === "dashboard") {
        content.innerHTML = `
            <div class="card">
                <h3>Welcome to LWPL Admin 👋</h3>
                <p>Manage Lamu West Premier League from this panel.</p>
            </div>

            <div class="card">
                <h3>League Dashboard</h3>
                <p>Teams: <strong>0</strong></p>
                <p>Players: <strong>0</strong></p>
                <p>Fixtures: <strong>0</strong></p>
                <p>Results: <strong>0</strong></p>
            </div>
        `;
    }

    else if (page === "teams") {
        content.innerHTML = `
            <div class="card">
                <h3>⚽ Teams</h3>
                <p>Teams management will be added here.</p>
            </div>
        `;
    }

    else if (page === "players") {
        content.innerHTML = `
            <div class="card">
                <h3>👕 Players</h3>
                <p>Players management will be added here.</p>
            </div>
        `;
    }

    else if (page === "fixtures") {
        content.innerHTML = `
            <div class="card">
                <h3>📅 Fixtures</h3>
                <p>Fixtures management will be added here.</p>
            </div>
        `;
    }

    else if (page === "results") {
        content.innerHTML = `
            <div class="card">
                <h3>🥅 Results</h3>
                <p>Match results management will be added here.</p>
            </div>
        `;
    }

    else if (page === "scorers") {
        content.innerHTML = `
            <div class="card">
                <h3>⚽ Top Scorers</h3>
                <p>Top scorers management will be added here.</p>
            </div>
        `;
    }

    else if (page === "logos") {
        content.innerHTML = `
            <div class="card">
                <h3>🖼️ Team Logos</h3>
                <p>Team logo management will be added here.</p>
            </div>
        `;
    }

    else if (page === "lineups") {
        content.innerHTML = `
            <div class="card">
                <h3>📋 Lineups</h3>
                <p>Match lineup builder will be added here.</p>
            </div>
        `;
    }

    else if (page === "settings") {
        content.innerHTML = `
            <div class="card">
                <h3>⚙️ Settings</h3>
                <p>League settings will be added here.</p>
            </div>
        `;
    }
}
