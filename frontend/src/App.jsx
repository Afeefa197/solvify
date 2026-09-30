import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [page, setPage] = useState("home");
  const [loginEmail, setLoginEmail] = useState("");
const [loginPassword, setLoginPassword] = useState("");
const [registerName, setRegisterName] = useState("");
const [registerEmail, setRegisterEmail] = useState("");
const [registerPassword, setRegisterPassword] = useState("");
  const [allTeams, setAllTeams] = useState([]);
const [loadingAllTeams, setLoadingAllTeams] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState(
  localStorage.getItem("solvify_token")
);
const [dashboardStats, setDashboardStats] = useState(null);
const [dashboardLoading, setDashboardLoading] = useState(false);
const [dashboardError, setDashboardError] = useState("");

const [currentUser, setCurrentUser] = useState(
  JSON.parse(localStorage.getItem("solvify_user")) || null
);

  const [problems, setProblems] = useState([]);
  const [loadingProblems, setLoadingProblems] =
    useState(false);

  // SELECTED PROBLEM
  const [selectedProblem, setSelectedProblem] =
    useState(null);

  // VALIDATION
  const [validationCount, setValidationCount] =
    useState(0);

  const [validationMessage, setValidationMessage] =
    useState("");

  const [validating, setValidating] =
    useState(false);

  const [hasValidated, setHasValidated] =
    useState(false);

  // DELETE
  const [deleting, setDeleting] =
    useState(false);
    // BUILDER PROFILE
const [builderTab, setBuilderTab] =
  useState("menu");

const [builderName, setBuilderName] =
  useState("");

const [builderEmail, setBuilderEmail] =
  useState("");

const [builderSkills, setBuilderSkills] =
  useState("");

const [builderBio, setBuilderBio] =
  useState("");

const [builderMessage, setBuilderMessage] =
  useState("");

const [builderError, setBuilderError] =
  useState("");

const [creatingBuilder, setCreatingBuilder] =
  useState(false);
  const [builders, setBuilders] =
  useState([]);

const [loadingBuilders, setLoadingBuilders] =
  useState(false);
  const [selectedBuilder, setSelectedBuilder] = useState(null);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [teamProgress, setTeamProgress] = useState([]);
const [loadingProgress, setLoadingProgress] = useState(false);
const [editingProgressId, setEditingProgressId] = useState(null);
const [editStage, setEditStage] = useState("");
const [editDescription, setEditDescription] = useState("");
const [showProgress, setShowProgress] = useState(false);
  const [showBuilderSelector, setShowBuilderSelector] = useState(false);
const [matchingProblems, setMatchingProblems] = useState([]);
const [loadingMatches, setLoadingMatches] = useState(false);
const [creatingTeam, setCreatingTeam] = useState(false);
const [problemTeams, setProblemTeams] = useState([]);
const [loadingTeams, setLoadingTeams] = useState(false);

  // FETCH PROBLEMS
  const fetchProblems = async () => {
    setLoadingProblems(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/problems"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch problems"
        );
      }

      setProblems(data.problems);
    } catch (error) {
      console.error(
        "Fetch problems error:",
        error
      );

      setError(
        `Unable to load problems: ${error.message}`
      );
    } finally {
      setLoadingProblems(false);
    }
  };
  const fetchDashboardStats = async () => {
  if (!token) {
    return;
  }

  setDashboardLoading(true);
  setDashboardError("");

  try {
    const response = await fetch(
      "http://localhost:5000/api/dashboard/stats",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to load dashboard"
      );
    }

    setDashboardStats(data.stats);
  } catch (error) {
    setDashboardError(error.message);
  } finally {
    setDashboardLoading(false);
  }
};
// FETCH BUILDERS
const fetchBuilders = async () => {
  setLoadingBuilders(true);

  try {
    const response = await fetch(
      "http://localhost:5000/api/builders"
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to fetch builders"
      );
    }

    setBuilders(data.builders);
  } catch (error) {
    console.error(
      "Fetch builders error:",
      error
    );
  } finally {
    setLoadingBuilders(false);
  }
};
const fetchMatchingProblems = async (builderId) => {
  setLoadingMatches(true);
  setSelectedBuilder(builderId);

  try {
    const response = await fetch(
      `http://localhost:5000/api/matching/builders/${builderId}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to fetch matching problems"
      );
    }

    setMatchingProblems(data.problems);
  } catch (error) {
    console.error("Matching problems error:", error);
    setMatchingProblems([]);
  } finally {
    setLoadingMatches(false);
  }
};
const createTeam = async (problemId) => {
  if (!selectedBuilder) {
  alert("Please select a builder first.");
  return;
}
  const teamName = window.prompt(
    "Enter a name for your team:"
  );

  if (!teamName || !teamName.trim()) {
    return;
  }

  setCreatingTeam(true);

  try {
    const response = await fetch(
      "http://localhost:5000/api/teams",
      {
        method: "POST",
        headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
},
        body: JSON.stringify({
  problemId,
  teamName: teamName.trim(),
  builderId: selectedBuilder,
}),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to create team"
      );
    }

    alert("Team created successfully!");

fetchAllTeams();

if (selectedProblem) {
  fetchProblemTeams(selectedProblem.id);
}
  } catch (error) {
    console.error("Team creation error:", error);
    alert(error.message);
  } finally {
    setCreatingTeam(false);
  }
};
const joinTeam = async (teamId, builderId) => {
 if (!builderId) {
  alert("Please select a builder first.");
  return;
}
if (!selectedTeamId) {
  alert("Please select a team first.");
  return;
}

  try {
    const response = await fetch(
      "http://localhost:5000/api/teams/join",
      {
        method: "POST",
        headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
},
        body: JSON.stringify({
  teamId,
  builderId,
}),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to join team"
      );
    }

    alert("Joined team successfully!");

    if (selectedProblem) {
      fetchProblemTeams(selectedProblem.id);
    }
  } catch (error) {
    console.error("Join team error:", error);
    alert(error.message);
  }
};
const fetchProblemTeams = async (problemId) => {
  setLoadingTeams(true);

  try {
    const response = await fetch(
      `http://localhost:5000/api/teams/problem/${problemId}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to fetch teams"
      );
    }

    setProblemTeams(data.teams);
  } catch (error) {
    console.error("Team fetch error:", error);
    setProblemTeams([]);
  } finally {
    setLoadingTeams(false);
  }
};
const fetchTeamProgress = async (teamId) => {
  setLoadingProgress(true);

  try {
    const response = await fetch(
      `http://localhost:5000/api/progress/team/${teamId}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to fetch progress"
      );
    }

    setTeamProgress(data.progress);
  } catch (error) {
    console.error("Fetch progress error:", error);
    alert(error.message);
  } finally {
    setLoadingProgress(false);
  }
};
const updateTeamProgress = async (
  progressId,
  stage,
  description
) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/progress/${progressId}`,
      {
        method: "PUT",
        headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
},
        body: JSON.stringify({
          stage,
          description,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to update progress"
      );
    }

    await fetchTeamProgress(selectedTeamId);

    alert("Progress updated successfully!");
  } catch (error) {
    console.error("Update progress error:", error);
    alert(error.message);
  }
};
const createTeamProgress = async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/progress",
      {
        method: "POST",
        headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
},
        body: JSON.stringify({
          teamId: selectedTeamId,
          stage: editStage,
          description: editDescription,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to create progress"
      );
    }

    await fetchTeamProgress(selectedTeamId);

    setEditingProgressId(null);
    setEditStage("");
    setEditDescription("");

    alert("Progress added successfully!");
  } catch (error) {
    console.error("Create progress error:", error);
    alert(error.message);
  }
};
const fetchAllTeams = async () => {
  setLoadingAllTeams(true);

  try {
    const response = await fetch(
      "http://localhost:5000/api/teams"
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to fetch teams"
      );
    }

    setAllTeams(data.teams);
  } catch (error) {
    console.error("Fetch all teams error:", error);
    setAllTeams([]);
  } finally {
    setLoadingAllTeams(false);
  }
};
const loginUser = async (email, password) => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    localStorage.setItem("solvify_token", data.token);
    localStorage.setItem(
      "solvify_user",
      JSON.stringify(data.user)
    );

    setToken(data.token);
    setCurrentUser(data.user);

    setMessage("Login successful!");
    setError("");
    setPage("home");
  } catch (error) {
    setError(error.message);
    setMessage("");
  }
};

  // SUBMIT PROBLEM
  const submitProblem = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    try {
      console.log(
        "Sending problem to backend..."
      );

      const response = await fetch(
        "http://localhost:5000/api/problems",
        {
          method: "POST",

          headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
},
          body: JSON.stringify({
            title,
            description,
            
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Backend response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to submit problem"
        );
      }

      setMessage(
        "Problem submitted successfully!"
      );

      setTitle("");
      setDescription("");
      

      fetchProblems();

      setTimeout(() => {
        setPage("problems");
        setMessage("");
      }, 1000);
    } catch (error) {
      console.error(
        "Submit problem error:",
        error
      );

      setError(
        `Unable to submit problem: ${error.message}`
      );
    }
  };

  // OPEN PROBLEM DETAILS
  const openProblemDetails = async (
    problem
  ) => {
    setSelectedProblem(problem);
    setPage("problem-details");
    fetchProblemTeams(problem.id);

    // RESET VALIDATION STATE
    setValidationMessage("");
    setHasValidated(false);
    setValidationCount(0);

    // FETCH VALIDATION COUNT
    try {
      const response = await fetch(
        `http://localhost:5000/api/validations/${problem.id}`
      );

      const data = await response.json();

      if (response.ok) {
        setValidationCount(
          data.validationCount
        );
      } else {
        console.error(
          "Failed to fetch validation count:",
          data.message
        );
      }
    } catch (error) {
      console.error(
        "Failed to fetch validation count:",
        error
      );
    }
  };

  // VALIDATE PROBLEM
  const validateProblem = async () => {
    if (
      !selectedProblem ||
      hasValidated
    ) {
      return;
    }

    setValidating(true);
    setValidationMessage("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/validations/${selectedProblem.id}`,
        {
  method: "POST",
  headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
},
}
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Validation failed"
        );
      }

      setValidationCount(
        data.validationCount
      );

      setHasValidated(true);

      setValidationMessage(
        "Thank you for validating this problem!"
      );
    } catch (error) {
      console.error(
        "Validation error:",
        error
      );

      setValidationMessage(
        error.message
      );
    } finally {
      setValidating(false);
    }
  };

  // DELETE PROBLEM
  const deleteProblem = async () => {
    if (!selectedProblem) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${selectedProblem.title}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/problems/${selectedProblem.id}`,
        {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${token}`,
  },
}
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete problem"
        );
      }

      // Remove deleted problem from frontend
      setProblems((currentProblems) =>
        currentProblems.filter(
          (problem) =>
            problem.id !== selectedProblem.id
        )
      );

      // Clear selected problem
      setSelectedProblem(null);

      // Go back to problems
      setPage("problems");
    } catch (error) {
      console.error(
        "Delete problem error:",
        error
      );

      setError(
        `Unable to delete problem: ${error.message}`
      );
    } finally {
      setDeleting(false);
    }
  };
  // CREATE BUILDER PROFILE
const submitBuilderProfile = async (event) => {
  event.preventDefault();

  setBuilderMessage("");
  setBuilderError("");
  const authToken =
  token || localStorage.getItem("solvify_token");
  const name = currentUser?.name || "";
const email = currentUser?.email || "";

  const skills = builderSkills
    .split(",")
    .map((skill) => skill.trim())
    .filter((skill) => skill.length > 0);

  if (skills.length === 0) {
    setBuilderError(
      "Please enter at least one skill."
    );
    return;
  }

  setCreatingBuilder(true);

  try {
    const response = await fetch(
      "http://localhost:5000/api/builders",
      {
        method: "POST",
        headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
},
        body: JSON.stringify({
  name,
  email,
  skills,
  bio: builderBio,
}),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to create builder profile"
      );
    }

    setBuilderMessage(
      "Builder profile created successfully!"
    );

    setBuilderName("");
    setBuilderEmail("");
    setBuilderSkills("");
    setBuilderBio("");
    fetchBuilders();
  } catch (error) {
    console.error(
      "Create builder profile error:",
      error
    );

    setBuilderError(
      `Unable to create builder profile: ${error.message}`
    );
  } finally {
    setCreatingBuilder(false);
  }
};

  // WHEN PROBLEMS PAGE OPENS
useEffect(() => {
  if (page === "problems" || page === "home") {
    fetchProblems();
  }

  if (page === "builders" || page === "home") {
    fetchBuilders();
  }

  if (page === "teams" || page === "home") {
    fetchAllTeams();
  }
  if (page === "dashboard" && token) {
  fetchDashboardStats();
}

  if (page === "builder-profile" && currentUser) {
    setBuilderName(currentUser.name);
    setBuilderEmail(currentUser.email);
  }
}, [page, currentUser, token]);
if (page === "profile") {
  return (
    <div className="app">
      <main className="report-page">
        <div className="report-container">

          <p className="tagline">MY PROFILE</p>

          <h1>
            {currentUser?.name || "My Profile"}
          </h1>

          <p className="report-description">
            {currentUser?.email || "No email available"}
          </p>

          <div style={{ marginTop: "30px" }}>
            <h3>Account</h3>

            <p>
              Name: {currentUser?.name}
            </p>

            <p>
              Email: {currentUser?.email}
            </p>
          </div>

          <button
  className="primary-btn"
  onClick={() => {
    localStorage.removeItem("solvify_token");
    localStorage.removeItem("solvify_user");

    setToken(null);
    setCurrentUser(null);
    setPage("home");
  }}
>
  Logout
</button>

        </div>
      </main>
    </div>
  );
}
if (page === "register") {
  return (
    <div className="app">
      <main className="report-page">
        <div className="report-container">

          <p className="tagline">
            JOIN SOLVIFY
          </p>

          <h1>Create your account</h1>

          <p className="report-description">
            Create an account to submit and manage real-world problems.
          </p>

         <form
  className="report-form"
  onSubmit={async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: registerName,
            email: registerEmail,
            password: registerPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      setMessage("Account created successfully! Please login.");
      setError("");
      setPage("login");
    } catch (error) {
      setError("Unable to connect to the server.");
    }
  }}
>

            <label>Name</label>

            <input
  type="text"
  placeholder="Enter your name"
  value={registerName}
  onChange={(event) =>
    setRegisterName(event.target.value)
  }
  required
/>

            <label>Email</label>

            <input
  type="email"
  placeholder="Enter your email"
  value={registerEmail}
  onChange={(event) =>
    setRegisterEmail(event.target.value)
  }
  required
/>

            <label>Password</label>

            <input
  type="password"
  placeholder="Create a password"
  value={registerPassword}
  onChange={(event) =>
    setRegisterPassword(event.target.value)
  }
  required
/>

            <button
              type="submit"
              className="primary-btn submit-btn"
            >
              Create Account
            </button>

            <div className="login-actions">
  <button
    type="button"
    className="builder-back-btn"
    onClick={() => setPage("login")}
  >
    ← Back to Login
  </button>

  <button
    type="button"
    className="builder-back-btn"
    onClick={() => setPage("home")}
  >
    Back to Home
  </button>
</div>

          </form>

        </div>
      </main>
    </div>
  );
}
if (page === "login") {
  return (
    <div className="app">
      <main className="report-page">
        <div className="report-container">

          <p className="tagline">
            WELCOME BACK
          </p>

          <h1>Login to SOLVIFY</h1>

          <p className="report-description">
            Login to submit and manage your problems.
          </p>

          <form
            className="report-form"
            onSubmit={(event) => {
              event.preventDefault();
              loginUser(loginEmail, loginPassword);
            }}
          >

            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={loginEmail}
              onChange={(event) =>
                setLoginEmail(event.target.value)
              }
              required
            />

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={loginPassword}
              onChange={(event) =>
                setLoginPassword(event.target.value)
              }
              required
            />

            {message && (
              <p className="success-message">
                {message}
              </p>
            )}

            {error && (
              <p className="error-message">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="primary-btn submit-btn"
            >
              Login
            </button>

            <div className="login-actions">

  <button
    type="button"
    className="builder-back-btn"
    onClick={() => setPage("home")}
  >
    ← Back to Home
  </button>

  <button
    type="button"
    className="builder-back-btn"
    onClick={() => setPage("register")}
  >
    Create a new account
  </button>

</div>

          </form>

        </div>
      </main>
    </div>
  );
}
  // ---------------- REPORT PAGE ----------------

  if (page === "report") {
    if (!token) {
  return (
    <div className="app">
      <main className="report-page">
        <div className="report-container">
          <h1>Login Required</h1>
          <p className="report-description">
            Please login to report a problem.
          </p>

          <button
            className="primary-btn"
            onClick={() => {
  if (!token) {
    setPage("login");
  } else {
    setPage("profile");
  }
}}
          >
            Login
          </button>
        </div>
      </main>
    </div>
  );
}
    return (
      <div className="app">

        <nav className="navbar">

          <div className="logo">
            SOLVIFY
          </div>

          <button
            className="back-btn"
            onClick={() =>
              setPage("home")
            }
          >
            ← Back to Home
          </button>

        </nav>

        <main className="report-page">

          <div className="report-container">

            <p className="tagline">
              SHARE A REAL-WORLD PROBLEM
            </p>

            <h1>
              Report a Problem
            </h1>

            <p className="report-description">
              Tell us about a problem you are
              facing. Your problem could become
              the starting point for a practical
              solution.
            </p>

           <form
  className="report-form"
  onSubmit={submitProblem}
>

              <label>
                Problem Title
              </label>

              <input
                type="text"
                placeholder="Example: College parking is overcrowded"
                value={title}
                onChange={(event) =>
                  setTitle(
                    event.target.value
                  )
                }
                required
              />

              <label>
                Describe the Problem
              </label>

              <textarea
                rows="7"
                placeholder="Explain what is happening, who is affected, and why it is a problem..."
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                required
              />

              
              {message && (
                <p className="success-message">
                  {message}
                </p>
              )}

              {error && (
                <p className="error-message">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="primary-btn submit-btn"
              >
                Submit Problem
              </button>

            </form>
            
           

          </div>

        </main>

      </div>
    );
  }

  

  // ---------------- BUILDER PROFILE PAGE ----------------

if (page === "builders") {
  return (
    <div className="app">

      <nav className="navbar">

        <div className="logo">
          SOLVIFY
        </div>

        <div className="nav-links">

  <button
    onClick={() => setPage("home")}
  >
    Home
  </button>
  

  <button
    onClick={() => setPage("problems")}
  >
    Problems
  </button>

  <button
    onClick={() => {
      setBuilderTab("available");
      fetchBuilders();
      setPage("builders");
    }}
  >
    Builders
  </button>

  <button
    onClick={() => setPage("teams")}
  >
    Teams
  </button>

</div>

<button
  className="profile-btn"
  onClick={() => {
    if (!token) {
      setPage("login");
    } else {
      setPage("profile");
    }
  }}
>
  Profile
</button>
</nav>

      <main className="report-page">

        <div className="report-container">

          <p className="tagline">
            JOIN THE BUILDER COMMUNITY
          </p>

          <div className="builder-options">

  <div
    className="builder-option-card"
    onClick={() => setBuilderTab("create")}
  >
    <div className="builder-option-icon">
      👤
    </div>

    <h2>
      Create Builder Profile
    </h2>

    <p>
      Create your builder profile and
      tell SOLVIFY about your skills,
      interests, and experience.
    </p>

    <span>
      Create Profile →
    </span>
  </div>

  <div
    className="builder-option-card"
    onClick={() => {
      setBuilderTab("available");
      fetchBuilders();
    }}
  >
    <div className="builder-option-icon">
      👥
    </div>

    <h2>
      Available Builders
    </h2>

    <p>
      Explore builders, their skills,
      experience, and interests.
    </p>

    <span>
      Explore Builders →
    </span>
  </div>

</div>
<h1>
  {builderTab === "menu"
    ? "Builders"
    : builderTab === "create"
    ? "Create Builder Profile"
    : "Available Builders"}
</h1>

          {builderTab !== "menu" && (
  <p className="report-description">
    Tell SOLVIFY what you can build.
    Your skills will later be used to
    match you with real-world problems.
  </p>
)}

          {builderTab === "create" && (
  <form
    className="report-form"
    onSubmit={submitBuilderProfile}
  >

            <label>Your Name</label>

<input
  type="text"
  value={currentUser?.name || ""}
  readOnly
/>

<label>Email</label>

<input
  type="email"
  value={currentUser?.email || ""}
  readOnly
/>
            <label>
              Skills
            </label>

            <input
              type="text"
              placeholder="Example: Java, React, Node.js, PostgreSQL"
              value={builderSkills}
              onChange={(event) =>
                setBuilderSkills(
                  event.target.value
                )
              }
              required
            />

            <p
              style={{
                marginTop: "6px",
                color: "#888",
                fontSize: "14px",
              }}
            >
              Enter multiple skills separated by commas.
            </p>

            <label>
              About You
            </label>

            <textarea
              rows="6"
              placeholder="Tell us about your interests, experience, or what you like building..."
              value={builderBio}
              onChange={(event) =>
                setBuilderBio(
                  event.target.value
                )
              }
            />

            {builderMessage && (
              <p className="success-message">
                {builderMessage}
              </p>
            )}

            {builderError && (
              <p className="error-message">
                {builderError}
              </p>
            )}

            <button
              type="submit"
              className="primary-btn submit-btn"
              disabled={creatingBuilder}
            >
              {creatingBuilder
                ? "Creating Profile..."
                : "Create Builder Profile"}
            </button>
             

          </form>
          )}
          
           
          

{/* BUILDER LIST */}


{builderTab === "available" && (
  <div
    style={{
      marginTop: "40px",
      paddingBottom: "40px",
    }}
    
  >
  <h2>Available Builders</h2>

  {loadingBuilders ? (
    <p>Loading builders...</p>
  ) : builders.length === 0 ? (
    <p>No builders registered yet.</p>
  ) : (
    <div>
      {builders.map((builder) => (
        <div
  key={builder.id}
  className="builder-card"
>
          <h3>{builder.name}</h3>

          <p>
            <strong>Email:</strong>{" "}
            {builder.email}
          </p>

          <div className="builder-skills">
  <strong>Skills</strong>

  <div className="builder-skill-tags">
    {builder.skills.map((skill, index) => (
      <span
        className="builder-skill-tag"
        key={index}
      >
        {skill}
      </span>
    ))}
  </div>
</div>

          {builder.bio && (
            <p>
              <strong>About:</strong>{" "}
              {builder.bio}
            </p>
          )}
          <button
  className="matching-btn"
  onClick={() => fetchMatchingProblems(builder.id)}
>
  Find Matching Problems →
</button>
        </div>
      ))}
    </div>
  )}

</div>
)}
{builderTab === "available" && selectedBuilder && (
  <div className="matching-results">
    <h2>Matching Problems</h2>

    {loadingMatches ? (
      <p>Finding matching problems...</p>
    ) : matchingProblems.length === 0 ? (
      <p>No matching problems found for this builder.</p>
    ) : (
      <div>
        {matchingProblems.map((problem) => (
          <div
            key={problem.id}
            className="matching-problem-card"
          >
            <div className="matching-problem-header">
              <h3>{problem.title}</h3>

              <span className="match-percentage">
                {problem.matchPercentage}% Match
              </span>
            </div>

            <p>{problem.problem_statement}</p>

            <div className="matched-skills">
              <strong>Matched Skills:</strong>

              <div className="builder-skill-tags">
                {problem.matchedSkills.map(
                  (skill, index) => (
                    <span
                      className="builder-skill-tag"
                      key={index}
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            </div>
            <div className="matched-skills">
  <strong>Missing Skills:</strong>

  <div className="builder-skill-tags">
    {problem.missingSkills.map(
      (skill, index) => (
        <span
          className="builder-skill-tag missing-skill-tag"
          key={index}
        >
          {skill}
        </span>
      )
    )}
  </div>
</div>

            <button
              className="primary-btn"
              onClick={() => openProblemDetails(problem)}
            >
              View Problem →
            </button>
            <button
  className="primary-btn"
  onClick={() => createTeam(problem.id)}
  disabled={creatingTeam}
>
  {creatingTeam
    ? "Creating Team..."
    : "Create Team →"}
</button>
          </div>
        ))}
      </div>
    )}
  </div>
)}

{builderTab !== "menu" && (
  <div className="builder-back-container">
    <button
      className="builder-back-btn"
      onClick={() => setBuilderTab("menu")}
    >
      ← Back to Builders
    </button>
  </div>
)}

        

      

        </div>

      </main>

    </div>
  );
}
  if (page === "problem-details") {

    if (!selectedProblem) {
      setPage("problems");
      return null;
    }

    return (
      <div className="app">

        <nav className="navbar">

          <div className="logo">
            SOLVIFY
          </div>

          <div className="nav-links">

            <button
              onClick={() =>
                setPage("home")
              }
            >
              Home
            </button>
            <button
  onClick={() => {
    if (!token) {
      setPage("login");
    } else {
      setPage("dashboard");
    }
  }}
>
  Dashboard
</button>

            <button
              onClick={() =>
                setPage("problems")
              }
            >
              Problems
            </button>

            <button
  onClick={() =>
    setPage("builders")
  }
>
  Builders
</button>

            <button onClick={() => setPage("teams")}>
  Teams
</button>



          </div>

          <button
  className="profile-btn"
  onClick={() => {
    if (!token) {
      setPage("login");
    } else {
      setPage("profile");
    }
  }}
>
  Profile
</button>

        </nav>

        <main className="problem-details-page">

          <div className="problem-details-container">

            {/* BACK BUTTON */}

            <button
              className="details-back-btn"
              onClick={() =>
                setPage("problems")
              }
            >
              ← Back to Problems
            </button>

            {/* PROBLEM HEADER */}

            <div className="details-header">

              <div className="details-badges">

                <span className="category-badge">
                  {selectedProblem.category ||
                    "Other"}
                </span>

                <span className="status-badge">
                  {selectedProblem.status}
                </span>

              </div>

              <h1>
                {selectedProblem.title}
              </h1>

              <p className="details-description">
                {selectedProblem.description}
              </p>

              <div className="details-meta">

                <span>
                  Problem #
                  {selectedProblem.id}
                </span>

                <span>
                  {new Date(
                    selectedProblem.created_at
                  ).toLocaleDateString()}
                </span>

              </div>

            </div>

            {/* AI SECTION */}

            <div className="ai-detail-card">

              <div className="ai-detail-heading">

                <div className="ai-icon">
                  🤖
                </div>

                <div>

                  <p className="ai-label">
                    AI ANALYSIS
                  </p>

                  <h2>
                    AI-Structured Challenge
                  </h2>

                  <p>
                    Gemini has analyzed this
                    real-world problem and
                    converted it into a
                    structured engineering
                    challenge.
                  </p>

                </div>

              </div>

              <div className="ai-detail-content">

                {/* PROBLEM STATEMENT */}

                <div className="detail-section">

                  <div className="section-number">
                    01
                  </div>

                  <div className="section-content">

                    <h3>
                      Problem Statement
                    </h3>

                    <p>
                      {selectedProblem.problem_statement ||
                        "AI analysis not available for this problem."}
                    </p>

                  </div>

                </div>

                {/* AFFECTED USERS */}

                <div className="detail-section">

                  <div className="section-number">
                    02
                  </div>

                  <div className="section-content">

                    <h3>
                      Affected Users
                    </h3>

                    <div className="tag-list">

                      {selectedProblem.affected_users &&
                      selectedProblem
                        .affected_users
                        .length > 0 ? (
                        selectedProblem
                          .affected_users
                          .map(
                            (
                              user,
                              index
                            ) => (
                              <span
                                className="detail-tag"
                                key={index}
                              >
                                {user}
                              </span>
                            )
                          )
                      ) : (
                        <p>
                          Not available
                        </p>
                      )}

                    </div>

                  </div>

                </div>

                {/* REQUIRED SKILLS */}

                <div className="detail-section">

                  <div className="section-number">
                    03
                  </div>

                  <div className="section-content">

                    <h3>
                      Required Skills
                    </h3>

                    <div className="tag-list">

                      {selectedProblem.required_skills &&
                      selectedProblem
                        .required_skills
                        .length > 0 ? (
                        selectedProblem
                          .required_skills
                          .map(
                            (
                              skill,
                              index
                            ) => (
                              <span
                                className="skill-tag"
                                key={index}
                              >
                                {skill}
                              </span>
                            )
                          )
                      ) : (
                        <p>
                          Not available
                        </p>
                      )}

                    </div>

                  </div>

                </div>

                {/* DIFFICULTY */}

                <div className="detail-section">

                  <div className="section-number">
                    04
                  </div>

                  <div className="section-content">

                    <h3>
                      Difficulty
                    </h3>

                    <span className="difficulty-large">
                      {selectedProblem.difficulty ||
                        "Not available"}
                    </span>

                  </div>

                </div>

                {/* EXPECTED SOLUTION AREA */}

                <div className="detail-section">

                  <div className="section-number">
                    05
                  </div>

                  <div className="section-content">

                    <h3>
                      Expected Solution Area
                    </h3>

                    <p>
                      {selectedProblem.expected_solution_area ||
                        "Not available"}
                    </p>

                  </div>

                </div>

              </div>

            </div>
            {/* TEAM FORMATION */}

<div className="team-card">

  <div className="team-heading">

    <div className="team-icon">
      👥
    </div>

    <div>
      <p className="team-label">
        TEAM FORMATION
      </p>

      <h2>
        Builders Working on This Problem
      </h2>

      <p>
        See the teams that have formed
        to work on this challenge.
      </p>
    </div>

  </div>

  <div className="team-content">

    {loadingTeams ? (
      <p>Loading teams...</p>
    ) : problemTeams.length === 0 ? (
      <p>
        No team has been formed for this
        problem yet.
      </p>
    ) : (
      <div className="team-list">

        {problemTeams.map((team) => (
          <div
  className="team-item"
  key={team.id}
>
  <h3>
    {team.team_name}
  </h3>

  <p>
    {team.member_count}{" "}
    {Number(team.member_count) === 1
      ? "member"
      : "members"}
  </p>

  {team.members &&
    team.members.length > 0 && (
      <div className="team-members">
        <strong>Members:</strong>

        {team.members.map((member) => (
          <div
            className="team-member"
            key={member.builderId}
          >
            <span className="team-member-name">
              {member.name}
            </span>

            <span className="team-member-skills">
              {member.skills.join(", ")}
            </span>
          </div>
        ))}
      </div>
    )}
    <button
  className="primary-btn join-team-btn"
  onClick={() => {
  setSelectedTeamId(team.id);
  setShowBuilderSelector(true);
  fetchBuilders();
}}
>
  Join Team →
</button>
</div>
        ))}

      </div>
    )}

  </div>

</div>
{showBuilderSelector && (
  <div className="team-card">
    <div className="team-heading">
      <div className="team-icon">👤</div>

      <div>
        <p className="team-label">
          SELECT BUILDER
        </p>

        <h2>
          Who is joining this team?
        </h2>

        <p>
          Select the builder who wants to join this team.
        </p>
      </div>
    </div>

    <div className="team-content">

      {loadingBuilders ? (
        <p>Loading builders...</p>
      ) : builders.length === 0 ? (
        <p>No builders are registered yet.</p>
      ) : (
        <div className="team-list">

          {builders.map((builder) => (
            <div
              className="team-item"
              key={builder.id}
            >
              <h3>{builder.name}</h3>

              <p>
                {builder.skills.join(", ")}
              </p>

              <button
                className="primary-btn"
                onClick={async () => {
                 setSelectedBuilder(builder.id);

await joinTeam(selectedTeamId, builder.id);

                  setShowBuilderSelector(false);
                  setSelectedTeamId(null);
                }}
              >
                Join as {builder.name} →
              </button>
            </div>
          ))}

        </div>
      )}

      <button
        className="builder-back-btn"
        onClick={() => {
          setShowBuilderSelector(false);
          setSelectedTeamId(null);
        }}
      >
        Cancel
      </button>

    </div>
  </div>
)}

            {/* COMMUNITY VALIDATION */}

            <div className="validation-card">

              <div className="validation-heading">

                <div className="validation-icon">
                  ✓
                </div>

                <div>

                  <p className="validation-label">
                    COMMUNITY VALIDATION
                  </p>

                  <h2>
                    Is this a real problem?
                  </h2>

                  <p>
                    Validate this problem if
                    you or people around you
                    experience the same issue.
                  </p>

                </div>

              </div>

              <div className="validation-content">

                <div className="validation-count">

                  <strong>
                    ✓ {validationCount}
                  </strong>

                  <span>
                    {validationCount === 1
                      ? "person has validated this problem"
                      : "people have validated this problem"}
                  </span>

                </div>

                {validationMessage && (
                  <p className="validation-message">
                    {validationMessage}
                  </p>
                )}

                <button
                  className="primary-btn"
                  onClick={
                    validateProblem
                  }
                  disabled={
                    validating ||
                    hasValidated
                  }
                >
                  {validating
                    ? "Validating..."
                    : hasValidated
                    ? "✓ Thank you for validating!"
                    : "✓ Validate This Problem"}
                </button>

              </div>

            </div>

            {/* PROBLEM OWNER ACTIONS */}

            <div
              style={{
                marginTop: "30px",
                padding: "25px",
                borderRadius: "16px",
                border: "1px solid #3a3a3a",
                background: "#111111",
              }}
            >

              <p
                style={{
                  margin: "0 0 8px",
                  fontSize: "13px",
                  fontWeight: "700",
                  letterSpacing: "1px",
                  color: "#999",
                }}
              >
                PROBLEM OWNER ACTIONS
              </p>

              <h2
                style={{
                  margin: "0 0 8px",
                  color: "white",
                }}
              >
                Want to remove this problem?
              </h2>

              <p
                style={{
                  margin: "0 0 20px",
                  color: "#aaa",
                  lineHeight: "1.6",
                }}
              >
                You can permanently delete this
                problem if it was submitted by
                mistake or is no longer relevant.
              </p>

              {currentUser?.id === selectedProblem.created_by && (
  <button
    onClick={deleteProblem}
    disabled={deleting}
    style={{
      padding: "12px 20px",
      borderRadius: "8px",
      border: "1px solid #ef4444",
      background: "transparent",
      color: "#ef4444",
      fontWeight: "600",
      cursor: deleting
        ? "not-allowed"
        : "pointer",
      opacity: deleting
        ? 0.6
        : 1,
    }}
  >
    {deleting
      ? "Deleting..."
      : "🗑 Delete Problem"}
  </button>
)}

            </div>

            {/* FUTURE BUILD SECTION */}

            <div className="next-step-card">

              <div>

                <p className="next-step-label">
                  NEXT STEP
                </p>

                <h2>
                  Ready to build a solution?
                </h2>

                <p>
                  Skilled builders can review
                  this challenge and work together
                  to develop a practical solution.
                </p>

              </div>

              <button
  className="primary-btn"
  onClick={() => {
    setBuilderTab("available");
    fetchBuilders();
    setPage("builders");
  }}
>
  Find Builders
</button>

            </div>

          </div>

        </main>

      </div>
    );
  }

  // ---------------- PROBLEMS PAGE ----------------

  if (page === "problems") {

    return (
      <div className="app">

        <nav className="navbar">

          <div className="logo">
            SOLVIFY
          </div>

          <div className="nav-links">

            <button
              onClick={() =>
                setPage("home")
              }
            >
              Home
            </button>

            <button
              onClick={() =>
                setPage("problems")
              }
            >
              Problems
            </button>

            <button onClick={() => setPage("builders")}>
  Builders
</button>

            <button onClick={() => setPage("teams")}>
  Teams
</button>

          </div>

          <button
  className="profile-btn"
  onClick={() => {
    if (!token) {
      setPage("login");
    } else {
      setPage("profile");
    }
  }}
>
  Profile
</button>

        </nav>

        <main className="problems-page">

          <div className="problems-container">

            <p className="tagline">
              REAL-WORLD CHALLENGES
            </p>

            <h1>
              Explore Problems
            </h1>

            <p className="problems-description">
              Discover real-world problems
              submitted by people and
              communities.
            </p>

            {loadingProblems && (
              <p className="loading-message">
                Loading problems...
              </p>
            )}

            {error && (
              <p className="error-message">
                {error}
              </p>
            )}

            {!loadingProblems &&
              !error &&
              problems.length === 0 && (

                <div className="empty-problems">

                  <h3>
                    No problems yet
                  </h3>

                  <p>
                    Be the first person to
                    report a real-world
                    problem.
                  </p>

                  <button
                    className="primary-btn"
                    onClick={() => {
  if (!token) {
    setPage("login");
  } else {
    setPage("report");
  }
}}
                  >
                    Report a Problem
                  </button>

                </div>

              )}

            <div className="problem-list">

              {problems.map(
                (problem) => (

                  <div
                    className="problem-card clickable-problem"
                    key={problem.id}
                    onClick={() =>
                      openProblemDetails(
                        problem
                      )
                    }
                  >

                    <div className="problem-card-top">

                      <span className="category-badge">
                        {problem.category ||
                          "Other"}
                      </span>

                      <span className="status-badge">
                        {problem.status}
                      </span>

                    </div>

                    <h2>
                      {problem.title}
                    </h2>

                    <p>
                      {problem.description}
                    </p>

                    <div className="problem-card-bottom">

                      <span>
                        Problem #
                        {problem.id}
                      </span>

                      <span>
                        View Details →
                      </span>

                    </div>

                  </div>

                )
              )}

            </div>

          </div>

        </main>

      </div>
    );
  }
  if (page === "teams") {
  return (
    <div className="app">

      <nav className="navbar">
        <div className="logo">
          SOLVIFY
        </div>

        <div className="nav-links">
          <button onClick={() => setPage("home")}>
            Home
          </button>

          <button onClick={() => setPage("problems")}>
            Problems
          </button>
          

          <button
            onClick={() => {
              setBuilderTab("available");
              fetchBuilders();
              setPage("builders");
            }}
          >
            Builders
          </button>

          <button onClick={() => setPage("teams")}>
            Teams
          </button>
        </div>
          <button
          className="profile-btn"
          onClick={() => {
            if (!token) {
              setPage("login");
            } else {
              setPage("profile");
            }
          }}
        >
          Profile
        </button>
      </nav>
      

      <main className="problems-page">
        <div className="problems-container">

          <p className="tagline">
            TEAM COLLABORATION
          </p>

          <h1>Teams</h1>

          <p className="problems-description">
            Explore teams working on real-world problems.
          </p>

          {loadingAllTeams ? (
            <p>Loading teams...</p>
          ) : allTeams.length === 0 ? (
            <div className="empty-problems">
              <h3>No teams yet</h3>

              <p>
                Teams will appear here when builders
                start working together.
              </p>
            </div>
          ) : (
            <div className="problem-list">

              { allTeams.map((team) => (
                <div
                  className="problem-card"
                  key={team.id}
                >

                  <div className="problem-card-top">

                    <span className="category-badge">
                      TEAM
                    </span>

                    <span className="status-badge">
                      {team.member_count}{" "}
                      {Number(team.member_count) === 1
                        ? "member"
                        : "members"}
                    </span>

                  </div>

                  <h2>
                    {team.team_name}
                  </h2>

                  <p>
                    Working on:{" "}
                    <strong>
                      {team.problem_title}
                    </strong>
                  </p>

                  <div className="problem-card-bottom">

                    <span>
                      Team #{team.id}
                    </span>

                    <span>
                      Problem #{team.problem_id}
                    </span>

                  </div>
                  <button
  className="primary-btn"
  onClick={() => {
  setSelectedTeamId(team.id);
  fetchTeamProgress(team.id);
  setPage("progress");
}}
>
  View Progress →
</button>

                </div>
              ))}
             


            </div>
          )}

        </div>
      </main>

    </div>
  );
}
if (page === "progress") {
  return (
    <div className="app">

      <nav className="navbar">
        <div className="logo">
          SOLVIFY
        </div>

        <div className="nav-links">
          <button onClick={() => setPage("home")}>
            Home
          </button>

          <button onClick={() => setPage("problems")}>
            Problems
          </button>

          <button
            onClick={() => {
              setBuilderTab("available");
              fetchBuilders();
              setPage("builders");
            }}
          >
            Builders
          </button>

          <button onClick={() => setPage("teams")}>
            Teams
          </button>
        </div>
      </nav>

      <main className="problems-page progress-page">

        <div className="problems-container">

          <button
            className="builder-back-btn"
            onClick={() => setPage("teams")}
          >
            ← Back to Teams
          </button>

          <p className="tagline">
            PROTOTYPE DEVELOPMENT
          </p>

          <h1>Prototype Progress</h1>

          <button
  className="add-progress-btn"
  onClick={() => {
    setEditingProgressId("new");
    setEditStage("PLANNING");
    setEditDescription("");
  }}
>
  + Add Progress Update
</button>
{editingProgressId === "new" && (
  <div className="progress-edit-panel">

    <h3>Add Progress Update</h3>

    <label>Stage</label>

    <select
      value={editStage}
      onChange={(e) => setEditStage(e.target.value)}
    >
      <option value="PLANNING">Planning</option>
      <option value="DEVELOPMENT">Development</option>
      <option value="TESTING">Testing</option>
      <option value="COMPLETED">Completed</option>
    </select>

    <label>Description</label>

    <textarea
      value={editDescription}
      onChange={(e) => setEditDescription(e.target.value)}
      placeholder="Describe the current progress..."
      rows="4"
    />

    <div className="progress-edit-actions">

      <button
        className="progress-save-btn"
        onClick={createTeamProgress}
      >
        Add Progress
      </button>

      <button
        className="progress-cancel-btn"
        onClick={() => setEditingProgressId(null)}
      >
        Cancel
      </button>

    </div>

  </div>
)}

          {loadingProgress ? (
            <p>Loading progress...</p>
          ) : teamProgress.length === 0 ? (
            <div className="empty-problems">
              <h3>No progress recorded yet</h3>
              <p>
                This team has not added any prototype
                progress yet.
              </p>
            </div>
          ) : (
            <div className="problem-list">

              {teamProgress.map((progress) => (
                <div
                  className="problem-card"
                  key={progress.id}
                >

                  <div className="problem-card-top">

                    <span className="category-badge">
                      {progress.stage}
                    </span>

                  </div>
                  {editingProgressId === progress.id && (
  <div className="progress-edit-panel">

    <h3>Update Prototype Progress</h3>

    <label>Stage</label>

    <select
      value={editStage}
      onChange={(e) => setEditStage(e.target.value)}
    >
      <option value="PLANNING">Planning</option>
      <option value="DEVELOPMENT">Development</option>
      <option value="TESTING">Testing</option>
      <option value="COMPLETED">Completed</option>
    </select>

    <label>Description</label>

    <textarea
      value={editDescription}
      onChange={(e) => setEditDescription(e.target.value)}
      placeholder="Describe the current progress..."
      rows="4"
    />

    <div className="progress-edit-actions">

      <button
        className="progress-save-btn"
        onClick={async () => {
          await updateTeamProgress(
            progress.id,
            editStage,
            editDescription
          );

          setEditingProgressId(null);
        }}
      >
        Save Changes
      </button>

      <button
        className="progress-cancel-btn"
        onClick={() => setEditingProgressId(null)}
      >
        Cancel
      </button>

    </div>

  </div>
)}
                  


                  <h2>
                    {progress.stage}
                  </h2>

                  <p>
                    {progress.description}
                  </p>

                  <div className="problem-card-bottom">
                    <span>
                      Progress #{progress.id}
                    </span>

                    <span>
                      {new Date(
                        progress.updated_at
                      ).toLocaleString()}
                    </span>
                  </div>
                  <button
  className="progress-edit-btn"
  onClick={() => {
    setEditingProgressId(progress.id);
    setEditStage(progress.stage);
    setEditDescription(progress.description || "");
  }}
>
  Update Progress
</button>
                  
                  

                </div>
              ))}

            </div>
          )}

        </div>

      </main>

    </div>
  );
}
// ---------------- DASHBOARD PAGE ----------------

if (page === "dashboard") {
  return (
    <div className="app">

      <nav className="navbar">

        <div className="logo">
          SOLVIFY
        </div>

        <div className="nav-links">

          <button onClick={() => setPage("home")}>
            Home
          </button>

          <button onClick={() => setPage("problems")}>
            Problems
          </button>

          <button
            onClick={() => {
              setBuilderTab("available");
              fetchBuilders();
              setPage("builders");
            }}
          >
            Builders
          </button>

          <button onClick={() => setPage("teams")}>
            Teams
          </button>

        </div>

        <button
          className="profile-btn"
          onClick={() => setPage("profile")}
        >
          Profile
        </button>

      </nav>

      <main className="problems-page">

        <div className="problems-container">

          <p className="tagline">
            SOLVIFY ANALYTICS
          </p>

          <h1>Dashboard</h1>

          <p className="problems-description">
            Overview of real-world problems,
            builders, teams, and prototypes.
          </p>

          {dashboardLoading && (
            <p>Loading dashboard...</p>
          )}

          {dashboardError && (
            <p className="error-message">
              {dashboardError}
            </p>
          )}

          {dashboardStats && (
            <>
              <div className="stats">

                <div>
                  <h2>
                    {dashboardStats.total_problems}
                  </h2>
                  <p>Problems</p>
                </div>

                <div>
                  <h2>
                    {dashboardStats.total_validations}
                  </h2>
                  <p>Validations</p>
                </div>

                <div>
                  <h2>
                    {dashboardStats.total_builders}
                  </h2>
                  <p>Builders</p>
                </div>

                <div>
                  <h2>
                    {dashboardStats.total_teams}
                  </h2>
                  <p>Teams</p>
                </div>

                <div>
                  <h2>
                    {dashboardStats.total_progress_records}
                  </h2>
                  <p>Progress Updates</p>
                </div>

              </div>

              <div className="dashboard-section">

                <h2>Problems by Category</h2>

                {dashboardStats.categories.length === 0 ? (
                  <p>No category data available yet.</p>
                ) : (
                  <div className="problem-list">

                    {dashboardStats.categories.map(
                      (item) => (
                        <div
                          className="problem-card"
                          key={item.category}
                        >
                          <h3>
                            {item.category}
                          </h3>

                          <p>
                            {item.count}{" "}
                            {item.count === 1
                              ? "problem"
                              : "problems"}
                          </p>
                        </div>
                      )
                    )}

                  </div>
                )}

              </div>

              <div className="dashboard-section">

                <h2>Prototype Progress</h2>

                {dashboardStats.stages.length === 0 ? (
                  <p>
                    No prototype progress recorded yet.
                  </p>
                ) : (
                  <div className="problem-list">

                    {dashboardStats.stages.map(
                      (item) => (
                        <div
                          className="problem-card"
                          key={item.stage}
                        >
                          <h3>
                            {item.stage}
                          </h3>

                          <p>
                            {item.count}{" "}
                            {item.count === 1
                              ? "update"
                              : "updates"}
                          </p>
                        </div>
                      )
                    )}

                  </div>
                )}

              </div>

            </>
          )}

        </div>

      </main>

    </div>
  );
}

  // ---------------- HOME PAGE ----------------

  return (
    <div className="app">

      <nav className="navbar">

        <div className="logo">
          SOLVIFY
        </div>

        <div className="nav-links">

          <button
            onClick={() =>
              setPage("home")
            }
          >
            Home
          </button>

          <button
            onClick={() =>
              setPage("problems")
            }
          >
            Problems
          </button>

          <button onClick={() => setPage("builders")}>
  Builders
</button>

          <button onClick={() => setPage("teams")}>
  Teams
</button>
        </div>

        <button
  className="profile-btn"
  onClick={() => {
    if (!token) {
      setPage("login");
    } else {
      setPage("profile");
    }
  }}
>
  Profile
</button>
      </nav>

      <main>

        <section className="hero">

          <div className="hero-content">

            <p className="tagline">
              TURN PROBLEMS INTO SOLUTIONS
            </p>

            <h1>
              Have a problem?
              <br />

              <span>
                Let's build the solution.
              </span>
            </h1>

            <p className="hero-text">
              Report real-world problems,
              connect with skilled builders,
              and turn ideas into practical
              solutions.
            </p>

            <div className="hero-buttons">

              <button
  className="primary-btn"
  onClick={() => {
    if (!token) {
      setPage("login");
    } else {
      setPage("report");
    }
  }}
>
  Report a Problem
</button>

              <button
                className="secondary-btn"
                onClick={() =>
                  setPage("problems")
                }
              >
                Explore Problems
              </button>

            </div>

          </div>

        </section>

        <section className="how-section">

          <h2>
            How SOLVIFY Works
          </h2>

          <div className="steps">

            <div className="step-card">

              <div className="step-number">
                01
              </div>

              <h3>
                Report
              </h3>

              <p>
                Share a real-world problem
                that needs a solution.
              </p>

            </div>

            <div className="step-card">

              <div className="step-number">
                02
              </div>

              <h3>
                Structure
              </h3>

              <p>
                AI turns the problem into
                a clear engineering challenge.
              </p>

            </div>

            <div className="step-card">

              <div className="step-number">
                03
              </div>

              <h3>
                Validate
              </h3>

              <p>
                The community validates
                genuine and important
                problems.
              </p>

            </div>

            <div className="step-card">

              <div className="step-number">
                04
              </div>

              <h3>
                Build
              </h3>

              <p>
                Skilled builders form teams
                and create solutions.
              </p>

            </div>

          </div>

        </section>

        <section className="stats">

          <div>

            <h2>
              {problems.length}
            </h2>
            

            <p>
              Problems Submitted
            </p>

          </div>

          <div>

            <h2>
              {
                problems.filter(
                  (problem) =>
                    problem.status ===
                    "PENDING"
                ).length
              }
            </h2>

            <p>
              Active Problems
            </p>

          </div>

          <div>

            <h2>
  {builders.length}
</h2>

            <p>
              Builders
            </p>

          </div>

          <div>

            <h2>
              {allTeams.length}
            </h2>

            <p>
              Teams
            </p>

          </div>

        </section>

      </main>

    </div>
  );
}

export default App;