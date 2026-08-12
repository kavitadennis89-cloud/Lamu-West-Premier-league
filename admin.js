<!DOCTYPE html>
<html lang="en">

<head>

  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <title>Lamu West Premier League - Admin</title>

  <link rel="stylesheet" href="style.css">

</head>


<body>

  <h1>
    Lamu West Premier League - Admin Panel
  </h1>


  <!-- ========================== -->
  <!-- ADD TEAM -->
  <!-- ========================== -->

  <h2>⚽ Add Team</h2>

  <form id="teamForm">

    <input
      type="text"
      id="name"
      placeholder="Team Name"
      required
    >

    <input
      type="number"
      id="played"
      placeholder="Played"
      required
    >

    <input
      type="number"
      id="wins"
      placeholder="Wins"
      required
    >

    <input
      type="number"
      id="draws"
      placeholder="Draws"
      required
    >

    <input
      type="number"
      id="losses"
      placeholder="Losses"
      required
    >

    <input
      type="number"
      id="goalsFor"
      placeholder="Goals For"
      required
    >

    <input
      type="number"
      id="goalsAgainst"
      placeholder="Goals Against"
      required
    >

    <input
      type="number"
      id="points"
      placeholder="Points"
      required
    >

    <button type="submit">
      Save Team
    </button>

  </form>


  <hr>


  <!-- ========================== -->
  <!-- TEAMS -->
  <!-- ========================== -->

  <h2>⚽ Teams</h2>

  <div id="teamsList">

    <p>
      Loading teams...
    </p>

  </div>


  <hr>


  <!-- ========================== -->
  <!-- ADD FIXTURE -->
  <!-- ========================== -->

  <h2>📅 Add Fixture</h2>

  <form id="fixtureForm">

    <label for="fixtureHome">
      Home Team
    </label>

    <select
      id="fixtureHome"
      required
    >

      <option value="">
        Select Home Team
      </option>

    </select>


    <label for="fixtureAway">
      Away Team
    </label>

    <select
      id="fixtureAway"
      required
    >

      <option value="">
        Select Away Team
      </option>

    </select>


    <label for="fixtureDate">
      Match Date
    </label>

    <input
      type="date"
      id="fixtureDate"
      required
    >


    <button
      type="submit"
      id="saveFixture"
    >
      Save Fixture
    </button>

  </form>


  <hr>


  <!-- ========================== -->
  <!-- FIXTURES -->
  <!-- ========================== -->

  <h2>📅 Fixtures</h2>

  <div id="fixturesList">

    <p>
      No fixtures added yet.
    </p>

  </div>


  <hr>


  <!-- ========================== -->
  <!-- TOP SCORERS -->
  <!-- ========================== -->

  <h2>🥇 Add Top Scorer</h2>

  <form id="scorerForm">

    <label for="playerName">
      Player Name
    </label>

    <input
      type="text"
      id="playerName"
      placeholder="Player Name"
      required
    >


    <label for="scorerTeam">
      Team
    </label>

    <select
      id="scorerTeam"
      required
    >

      <option value="">
        Loading teams...
      </option>

    </select>


    <label for="playerGoals">
      Goals
    </label>

    <input
      type="number"
      id="playerGoals"
      min="0"
      placeholder="Goals"
      required
    >


    <button type="submit">
      Save Top Scorer
    </button>

  </form>


  <h2>🥇 Top Scorers</h2>

  <div id="scorersList">

    <p>
      No scorers added yet.
    </p>

  </div>


  <!-- ========================== -->
  <!-- JAVASCRIPT -->
  <!-- ========================== -->

  <script
    type="module"
    src="admin.js?v=3">
  </script>

</body>

</html>
