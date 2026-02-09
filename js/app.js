// document.addEventListener("DOMContentLoaded", () => {
//   const jobForm = document.getElementById("jobForm");
//   const companyInput = document.getElementById("company");
//   const roleInput = document.getElementById("role");
//   const statusInput = document.getElementById("status");
//   const dateInput = document.getElementById("date");
//   const tableBody = document.getElementById("jobTableBody");
//   const submitBtn = jobForm.querySelector("button");

//   const searchInput = document.getElementById("searchInput");
//   const filterStatus = document.getElementById("filterStatus");
//   const sortDate = document.getElementById("sortDate");
//   const toast = document.getElementById("toast");
//   const donut = document.querySelector(".donut");

//   let applications = JSON.parse(localStorage.getItem("applications")) || [];
//   let editIndex = null;

//   const STATUS_COLORS = {
//     Applied: "#9FB8A0",
//     Shortlisted: "#E6C66A",
//     Interview: "#8FB6D9",
//     Offer: "#7FBF9A",
//     Rejected: "#D98F8F"
//   };

//   function saveToLocalStorage() {
//     localStorage.setItem("applications", JSON.stringify(applications));
//   }

//   function showToast(message) {
//     toast.textContent = message;
//     toast.classList.add("show");
//     setTimeout(() => toast.classList.remove("show"), 2500);
//   }

//   function updateStats() {
//     const counts = {
//       Applied: 0,
//       Shortlisted: 0,
//       Interview: 0,
//       Offer: 0,
//       Rejected: 0
//     };

//     applications.forEach(app => {
//       if (counts[app.status] !== undefined) {
//         counts[app.status]++;
//       }
//     });

//     document.getElementById("totalCount").textContent = applications.length;
//     document.getElementById("appliedCount").textContent = counts.Applied;
//     document.getElementById("shortlistedCount").textContent = counts.Shortlisted;
//     document.getElementById("interviewCount").textContent = counts.Interview;
//     document.getElementById("offerCount").textContent = counts.Offer;
//     document.getElementById("rejectedCount").textContent = counts.Rejected;

//     updateDonut(counts);
//   }

//   function updateDonut(counts) {
//     const total = Object.values(counts).reduce((a, b) => a + b, 0);

//     if (total === 0) {
//       donut.style.background = "conic-gradient(#EBF4DD 0deg 360deg)";
//       return;
//     }

//     let currentDeg = 0;
//     let gradientParts = [];

//     Object.keys(counts).forEach(status => {
//       const value = counts[status];
//       if (value === 0) return;

//       const sliceDeg = (value / total) * 360;
//       const start = currentDeg;
//       const end = currentDeg + sliceDeg;

//       gradientParts.push(
//         `${STATUS_COLORS[status]} ${start}deg ${end}deg`
//       );

//       currentDeg = end;
//     });

//     donut.style.background = `conic-gradient(${gradientParts.join(", ")})`;
//   }

//   function renderApplications() {
//     tableBody.innerHTML = "";

//     const searchText = searchInput.value.toLowerCase();
//     const selectedStatus = filterStatus.value;
//     const sortOrder = sortDate.value;

//     let filteredApps = applications.filter(app => {
//       const matchesSearch =
//         app.company.toLowerCase().includes(searchText) ||
//         app.role.toLowerCase().includes(searchText);

//       const matchesStatus =
//         selectedStatus === "All" || app.status === selectedStatus;

//       return matchesSearch && matchesStatus;
//     });

//     filteredApps.sort((a, b) => {
//       return sortOrder === "newest"
//         ? new Date(b.date) - new Date(a.date)
//         : new Date(a.date) - new Date(b.date);
//     });

//     filteredApps.forEach(app => {
//       const index = applications.indexOf(app);

//       const row = document.createElement("tr");
//       row.innerHTML = `
//         <td>${app.company}</td>
//         <td>${app.role}</td>
//         <td><span class="status ${app.status}">${app.status}</span></td>
//         <td>${app.date}</td>
//         <td>
//           <div class="actions">
//             <button class="action-btn edit-btn" onclick="editApplication(${index})">Edit</button>
//             <button class="action-btn delete-btn" onclick="deleteApplication(${index})">Delete</button>
//           </div>
//         </td>
//       `;
//       tableBody.appendChild(row);
//     });

//     updateStats();
//   }

//   jobForm.addEventListener("submit", e => {
//     e.preventDefault();

//     const appData = {
//       company: companyInput.value.trim(),
//       role: roleInput.value.trim(),
//       status: statusInput.value,
//       date: dateInput.value
//     };

//     if (editIndex !== null) {
//       if (!confirm("Update this application?")) return;
//       applications[editIndex] = appData;
//       editIndex = null;
//       submitBtn.textContent = "Add Application";
//       showToast("Application updated");
//     } else {
//       applications.push(appData);
//       showToast("Application added");
//     }

//     saveToLocalStorage();
//     renderApplications();
//     jobForm.reset();
//   });

//   window.editApplication = index => {
//     const app = applications[index];
//     companyInput.value = app.company;
//     roleInput.value = app.role;
//     statusInput.value = app.status;
//     dateInput.value = app.date;

//     editIndex = index;
//     submitBtn.textContent = "Update Application";
//   };

//   window.deleteApplication = index => {
//     if (!confirm("Delete this application?")) return;
//     applications.splice(index, 1);
//     saveToLocalStorage();
//     renderApplications();
//     showToast("Application deleted");
//   };

//   searchInput.addEventListener("input", renderApplications);
//   filterStatus.addEventListener("change", renderApplications);
//   sortDate.addEventListener("change", renderApplications);

//   renderApplications();
// });

document.addEventListener("DOMContentLoaded", () => {
  const jobForm = document.getElementById("jobForm");
  const companyInput = document.getElementById("company");
  const roleInput = document.getElementById("role");
  const statusInput = document.getElementById("status");
  const dateInput = document.getElementById("date");
  const tableBody = document.getElementById("jobTableBody");
  const submitBtn = jobForm.querySelector("button");

  const searchInput = document.getElementById("searchInput");
  const filterStatus = document.getElementById("filterStatus");
  const sortDate = document.getElementById("sortDate");

  const donut = document.querySelector(".donut");
  const notificationContainer = document.getElementById("notification-container");

  let applications = JSON.parse(localStorage.getItem("applications")) || [];
  let editIndex = null;

  const STATUS_COLORS = {
    Applied: "#2563EB",
    Shortlisted: "#FACC15",
    Interview: "#7C3AED",
    Offer: "#059669",
    Rejected: "#DC2626"
  };

  /* =======================
     NOTIFICATION FUNCTION
     ======================= */
  function showNotification(message, type = "success") {
    if (!notificationContainer) return;

    const note = document.createElement("div");
    note.className = `notification ${type}`;
    note.textContent = message;

    notificationContainer.appendChild(note);

    setTimeout(() => {
      note.remove();
    }, 3000);
  }

  function saveToLocalStorage() {
    localStorage.setItem("applications", JSON.stringify(applications));
  }

  function updateStats() {
    const counts = {
      Applied: 0,
      Shortlisted: 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0
    };

    applications.forEach(app => {
      counts[app.status]++;
    });

    document.getElementById("totalCount").textContent = applications.length;
    document.getElementById("appliedCount").textContent = counts.Applied;
    document.getElementById("shortlistedCount").textContent = counts.Shortlisted;
    document.getElementById("interviewCount").textContent = counts.Interview;
    document.getElementById("offerCount").textContent = counts.Offer;
    document.getElementById("rejectedCount").textContent = counts.Rejected;

    updateDonut(counts);
  }

  function updateDonut(counts) {
    const total = Object.values(counts).reduce((a, b) => a + b, 0);

    if (total === 0) {
      donut.style.background = "conic-gradient(#EBF4DD 0deg 360deg)";
      return;
    }

    let currentDeg = 0;
    let parts = [];

    Object.keys(counts).forEach(status => {
      const value = counts[status];
      if (!value) return;

      const slice = (value / total) * 360;
      parts.push(`${STATUS_COLORS[status]} ${currentDeg}deg ${currentDeg + slice}deg`);
      currentDeg += slice;
    });

    donut.style.background = `conic-gradient(${parts.join(",")})`;
  }

  function renderApplications() {
    tableBody.innerHTML = "";

    const searchText = searchInput.value.toLowerCase();
    const selectedStatus = filterStatus.value;
    const sortOrder = sortDate.value;

    let filtered = applications.filter(app => {
      const matchText =
        app.company.toLowerCase().includes(searchText) ||
        app.role.toLowerCase().includes(searchText);

      const matchStatus =
        selectedStatus === "All" || app.status === selectedStatus;

      return matchText && matchStatus;
    });

    filtered.sort((a, b) =>
      sortOrder === "newest"
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date)
    );

    filtered.forEach(app => {
      const index = applications.indexOf(app);

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${app.company}</td>
        <td>${app.role}</td>
        <td><span class="status ${app.status}">${app.status}</span></td>
        <td>${app.date}</td>
        <td>
          <div class="actions">
            <button onclick="editApplication(${index})">Edit</button>
            <button onclick="deleteApplication(${index})">Delete</button>
          </div>
        </td>
      `;
      tableBody.appendChild(row);
    });

    updateStats();
  }

  jobForm.addEventListener("submit", e => {
    e.preventDefault();

    const appData = {
      company: companyInput.value.trim(),
      role: roleInput.value.trim(),
      status: statusInput.value,
      date: dateInput.value
    };

    if (editIndex !== null) {
      applications[editIndex] = appData;
      editIndex = null;
      submitBtn.textContent = "Add Application";
      showNotification("Application updated", "info");
    } else {
      applications.push(appData);
      showNotification("Application added", "success");
    }

    saveToLocalStorage();
    renderApplications();
    jobForm.reset();
  });

  window.editApplication = index => {
    const app = applications[index];
    companyInput.value = app.company;
    roleInput.value = app.role;
    statusInput.value = app.status;
    dateInput.value = app.date;

    editIndex = index;
    submitBtn.textContent = "Update Application";
  };

  window.deleteApplication = index => {
    if (!confirm("Delete this application?")) return;

    applications.splice(index, 1);
    saveToLocalStorage();
    renderApplications();
    showNotification("Application deleted", "error");
  };

  searchInput.addEventListener("input", renderApplications);
  filterStatus.addEventListener("change", renderApplications);
  sortDate.addEventListener("change", renderApplications);

  renderApplications();
});