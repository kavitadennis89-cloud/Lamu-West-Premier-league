const menuItems = document.querySelectorAll(".sidebar li");
const pageTitle = document.getElementById("pageTitle");
const content = document.getElementById("content");

menuItems.forEach(function(item) {

    item.addEventListener("click", function() {

        menuItems.forEach(function(menu) {
            menu.classList.remove("active");
        });

        this.classList.add("active");

        const page = this.dataset.page;

        pageTitle.textContent = this.textContent.trim();

        if (page === "dashboard") {

            content.innerHTML = `
                <div class="card">
                    <h3>🏆 Dashboard</h3>
                    <p>Lamu West Premier League Admin Panel.</p>
                </div>
            `;

        }

        else if (page === "teams") {

            content.innerHTML = `
                <div class="card">
                    <h3>⚽ Teams Management</h3>
                    <p>Teams section is ready.</p>
                </div>
            `;

        }

        else if (page === "players") {

            content.innerHTML = `
                <div class="card">
                    <h3>👕 Players Management</h3>

                    <p>
                        Manage Lamu West Premier League players.
                    </p>

                    <br>

                    <button id="addPlayerBtn">
                        ➕ Add Player
                    </button>

                </div>
            `;

            document
                .getElementById("addPlayerBtn")
                .addEventListener("click", function() {

                    alert("Player system is working!");

                });

        }

        else if (page === "fixtures") {

            content.innerHTML = `
                <div class="card">
                    <h3>📅 Fixtures</h3>
                    <p>Fixtures management coming next.</p>
                </div>
            `;

        }

        else if (page === "results") {

            content.innerHTML = `
                <div class="card">
                    <h3>🥅 Results</h3>
                    <p>Results management coming next.</p>
                </div>
            `;

        }

        else if (page === "scorers") {

            content.innerHTML = `
                <div class="card">
                    <h3>⚽ Top Scorers</h3>
                    <p>Top scorers management coming next.</p>
                </div>
            `;

        }

        else if (page === "logos") {

            content.innerHTML = `
                <div class="card">
                    <h3>🖼️ Team Logos</h3>
                    <p>Team logos management coming next.</p>
                </div>
            `;

        }

        else if (page === "lineups") {

            content.innerHTML = `
                <div class="card">
                    <h3>📋 Lineups</h3>
                    <p>Lineup builder coming next.</p>
                </div>
            `;

        }

        else if (page === "settings") {

            content.innerHTML = `
                <div class="card">
                    <h3>⚙️ Settings</h3>
                    <p>League settings coming next.</p>
                </div>
            `;

        }

    });

});


console.log("LWPL ADMIN READY");
