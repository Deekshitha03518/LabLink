import { useState , useEffect } from "react";
import {
  LayoutDashboard,
  Search,
  FlaskConical,
  CalendarDays,
  ClipboardCheck,
  ChartNoAxesCombined,
  Settings,
  Bell,
  ChevronDown,
  ArrowUpRight,
  ArrowRight,
  Clock,
  MapPin,
  Cpu,
  Monitor,
  CircuitBoard,
  Printer,
  Sparkles,
  Plus,
  Menu,
  X,
  CheckCircle2,
  Filter,
  GraduationCap,
  Zap,
  CalendarCheck,
} from "lucide-react";
import "./App.css";

const equipment = [
  {
    id: 1,
    name: "NVIDIA RTX GPU Workstation",
    category: "Computing",
    department: "Computer Science",
    lab: "AI Research Lab",
    available: true,
    icon: Monitor,
    color: "purple",
    description: "High-performance workstation for AI and deep learning.",
    specs: "RTX 4090 • 64GB RAM",
  },
  {
    id: 2,
    name: "Arduino Mega 2560 Kit",
    category: "Electronics",
    department: "Electronics",
    lab: "Embedded Systems Lab",
    available: true,
    icon: CircuitBoard,
    color: "blue",
    description: "Microcontroller development kit for IoT projects.",
    specs: "Arduino • Sensors • Cables",
  },
  {
    id: 3,
    name: "Raspberry Pi 5 Kit",
    category: "Computing",
    department: "Computer Science",
    lab: "IoT Innovation Lab",
    available: false,
    icon: Cpu,
    color: "pink",
    description: "Single-board computer for IoT and edge computing.",
    specs: "8GB RAM • Accessories",
  },
  {
    id: 4,
    name: "3D Printer",
    category: "Manufacturing",
    department: "Mechanical",
    lab: "Advanced Manufacturing Lab",
    available: true,
    icon: Printer,
    color: "orange",
    description: "Create physical prototypes using 3D printing.",
    specs: "PLA • 220 × 220 mm",
  },
];

const navigation = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Explore Equipment", icon: FlaskConical },
  { name: "My Bookings", icon: CalendarDays },
  { name: "My Requests", icon: ClipboardCheck },
  { name: "Analytics", icon: ChartNoAxesCombined },
];

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [requests, setRequests] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem("lablinkBookings")) || [];
  } catch {
    return [];
  }
});

  const [projectTitle, setProjectTitle] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("12:00");
  const [toast, setToast] = useState("");
  useEffect(() => {
  localStorage.setItem("lablinkBookings", JSON.stringify(requests));
}, [requests]);

  const categories = ["All", "Computing", "Electronics", "Manufacturing"];

  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.department.toLowerCase().includes(search.toLowerCase()) ||
      item.lab.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || item.category === category;

    return matchesSearch && matchesCategory;
  });

  function openRequest(item) {
  if (!item.available) {
    setToast("This equipment is currently unavailable.");
    return;
  }

  setSelectedEquipment(item);
  setProjectTitle("");
  setBookingDate("");
  setStartTime("10:00");
  setEndTime("12:00");
  setShowModal(true);
}

  function submitRequest(e) {
  e.preventDefault();

  if (!selectedEquipment || !bookingDate || !startTime || !endTime) {
    setToast("Please complete all booking details.");
    return;
  }

  if (bookingDate < new Date().toLocaleDateString("en-CA")) {
    setToast("Please select a future date.");
    return;
  }

  if (startTime >= endTime) {
    setToast("End time must be after start time.");
    return;
  }

  const conflict = requests.some((request) => {
    return (
      request.equipmentId === selectedEquipment.id &&
      request.date === bookingDate &&
      request.status !== "Rejected" &&
      startTime < request.endTime &&
      endTime > request.startTime
    );
  });

  if (conflict) {
    setToast("This equipment is already requested for that time slot.");
    return;
  }

  const newRequest = {
    id: Date.now(),
    equipmentId: selectedEquipment.id,
    equipment: selectedEquipment.name,
    lab: selectedEquipment.lab,
    project: projectTitle,
    date: bookingDate,
    startTime,
    endTime,
    status: "Pending faculty approval",
  };

  setRequests((previous) => [newRequest, ...previous]);
  setShowModal(false);
  setToast("Booking request submitted successfully!");

  setTimeout(() => setToast(""), 3500);
}

  function selectPage(page) {
    setActivePage(page);
    setMobileMenu(false);
  }

  const pageDescriptions = {
    Dashboard: "Your campus laboratory overview at a glance.",
    "Explore Equipment": "Discover specialised equipment across campus.",
    "My Bookings": "Keep track of your laboratory reservations.",
    "My Requests": "Track your equipment access requests.",
    Analytics: "Explore your laboratory resource activity.",
    Settings: "Manage your LabLink experience.",
  };

  function updateRequestStatus(id, newStatus) {
  setRequests((previous) =>
    previous.map((request) =>
      request.id === id
        ? { ...request, status: newStatus }
        : request
    )
  );

  setToast(
    newStatus === "Approved"
      ? "Booking approved successfully!"
      : "Booking request rejected."
  );

  setTimeout(() => setToast(""), 3500);
}

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon">
            <FlaskConical size={23} />
          </div>
          <div>
            <h2>LabLink</h2>
            <span>SMART CAMPUS LABS</span>
          </div>
          <button
            className="mobile-close"
            onClick={() => setMobileMenu(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-label">WORKSPACE</div>

        <nav className="navigation">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                className={`nav-item ${
                  activePage === item.name ? "active" : ""
                }`}
                onClick={() => selectPage(item.name)}
              >
                <Icon size={19} />
                <span>{item.name}</span>
                {item.name === "My Requests" && requests.length > 0 && (
                  <span className="nav-count">{requests.length}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon">
              <Sparkles size={20} />
            </div>
            <strong>Need a lab?</strong>
            <p>Let AI find the perfect equipment for your project.</p>
            <button onClick={() => selectPage("Explore Equipment")}>
              Explore labs <ArrowRight size={14} />
            </button>
          </div>

          <button
            className={`nav-item ${
              activePage === "Settings" ? "active" : ""
            }`}
            onClick={() => selectPage("Settings")}
          >
            <Settings size={19} />
            <span>Settings</span>
          </button>

          <div className="profile">
            <div className="avatar">ST</div>
            <div className="profile-info">
              <strong>Student User</strong>
              <span>Computer Science</span>
            </div>
            <ChevronDown size={17} />
          </div>
        </div>
      </aside>

      {mobileMenu && (
        <div
          className="mobile-overlay"
          onClick={() => setMobileMenu(false)}
        />
      )}

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              className="menu-toggle"
              onClick={() => setMobileMenu(true)}
            >
              <Menu size={22} />
            </button>
            <span>Workspace</span>
            <span className="breadcrumb-separator">/</span>
            <strong>{activePage}</strong>
          </div>

          <div className="topbar-right">
            <div className="campus-status">
              <span className="status-dot" />
              Campus resources online
            </div>

            <div className="notification-wrap">
              <button
                className="icon-button"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell size={19} />
                <span className="notification-dot" />
              </button>

              {showNotifications && (
                <div className="notification-panel">
                  <strong>Notifications</strong>
                  <p>Welcome to LabLink! Explore available campus equipment.</p>
                  <p>Your project requests will appear here.</p>
                </div>
              )}
            </div>

            <div className="top-avatar">ST</div>
          </div>
        </header>

        <div className="page-container">
          {activePage === "Dashboard" && (
            <>
          <section className="welcome-section">
            <div>
              <div className="eyebrow">
                <Sparkles size={15} /> YOUR CAMPUS, CONNECTED
              </div>
              <h1>
                Good morning, <span>Student!</span>
              </h1>
              <p>{pageDescriptions[activePage]}</p>
            </div>

            <button
              className="primary-button"
              onClick={() => selectPage("Explore Equipment")}
            >
              <Plus size={18} />
              Find equipment
            </button>
          </section>

          <section className="stats-grid">
            <div className="stat-card">
              <div className="stat-top">
                <span>Available resources</span>
                <div className="stat-icon green">
                  <FlaskConical size={20} />
                </div>
              </div>
              <h2>128</h2>
              <div className="stat-foot positive">
                <span>●</span> Across 8 departments
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span>My active bookings</span>
                <div className="stat-icon blue">
                  <CalendarCheck size={20} />
                </div>
              </div>
              <h2>03</h2>
              <div className="stat-foot">Next session: Tomorrow</div>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span>Pending requests</span>
                <div className="stat-icon yellow">
                  <Clock size={20} />
                </div>
              </div>
              <h2>{requests.length + 2}</h2>
              <div className="stat-foot">Awaiting faculty review</div>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span>Departments connected</span>
                <div className="stat-icon purple">
                  <GraduationCap size={20} />
                </div>
              </div>
              <h2>08</h2>
              <div className="stat-foot positive">
                <span>●</span> Cross-campus access
              </div>
            </div>
          </section>

          <section className="ai-banner">
            <div className="ai-banner-content">
              <div className="ai-tag">
                <Sparkles size={14} /> LABLINK INTELLIGENCE
              </div>
              <h2>Your next breakthrough starts here.</h2>
              <p>
                Tell us about your project. Discover the right equipment
                and find available lab resources across departments.
              </p>
              <button onClick={() => selectPage("Explore Equipment")}>
                Explore smart discovery <ArrowRight size={16} />
              </button>
            </div>
            <div className="ai-art">
              <div className="ai-orbit orbit-one" />
              <div className="ai-orbit orbit-two" />
              <div className="ai-core">
                <Sparkles size={42} />
              </div>
              <div className="orbit-dot dot-one" />
              <div className="orbit-dot dot-two" />
            </div>
          </section>
            </>
          )}
          <section className="equipment-section">
            <div className="section-heading">
              <div>
                <span className="section-kicker">CAMPUS INVENTORY</span>
                <h2>
                  {activePage === "My Requests"
                    ? "My equipment requests"
                    : activePage === "My Bookings"
                    ? "My bookings"
                    : activePage === "Analytics"
                    ? "Resource insights"
                    : activePage === "Settings"
                    ? "Account settings"
                    : "Explore equipment"}
                </h2>
                <p>
                  {activePage === "My Requests"
                    ? "Track the status of your submitted requests."
                    : activePage === "My Bookings"
                    ? "Your upcoming laboratory sessions."
                    : activePage === "Analytics"
                    ? "Your campus resource activity."
                    : activePage === "Settings"
                    ? "Your student account information."
                    : "Specialised tools and workstations, all in one place."}
                </p>
              </div>

              {activePage !== "My Requests" &&
                activePage !== "Settings" && (
                  <button
                    className="text-button"
                    onClick={() => selectPage("Explore Equipment")}
                  >
                    View all <ArrowUpRight size={16} />
                  </button>
                )}
            </div>
                {activePage === "My Requests" ? (
  <div className="request-list">
    {requests.length === 0 ? (
      <div className="empty-state">
        <ClipboardCheck size={34} />
        <strong>No new requests yet</strong>
        <p>Equipment requests you submit will appear here.</p>
        <button
          className="primary-button"
          onClick={() => selectPage("Explore Equipment")}
        >
          Explore equipment
        </button>
      </div>
    ) : (
      requests.map((request) => (
        <div className="request-row" key={request.id}>
          <div className="equipment-icon blue">
            <FlaskConical />
          </div>
          <div className="request-details">
            <strong>{request.equipment}</strong>
            <span>Project: {request.project}</span>
            <span>Date: {request.date}</span>
            <span>
              Time: {request.startTime} - {request.endTime}
            </span>
          </div>
          <span className="request-status">{request.status}</span>
        </div>
      ))
    )}
  </div>
) : activePage === "Analytics" ? (
  <div className="faculty-analytics">
    <div className="analytics-panel">
      <div>
        <strong>Equipment access activity</strong>
        <p>Live booking statistics</p>
        <div className="bar-chart">
          {[45, 75, 55, 90, 65, 82, 58].map((height, i) => (
            <div className="bar-column" key={i}>
              <div style={{ height: `${height}%` }} />
              <span>{["M", "T", "W", "T", "F", "S", "S"][i]}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="analytics-summary">
        <span>Total booking requests</span>
        <strong>{requests.length}</strong>
        <p>All submitted requests</p>
      </div>
    </div>

    <div className="faculty-stats">
      <div className="stat-card">
        <span>Total Requests</span>
        <h2>{requests.length}</h2>
      </div>
      <div className="stat-card">
        <span>Pending</span>
        <h2>
          {requests.filter((r) => r.status === "Pending faculty approval").length}
        </h2>
      </div>
      <div className="stat-card">
        <span>Approved</span>
        <h2>
          {requests.filter((r) => r.status === "Approved").length}
        </h2>
      </div>
      <div className="stat-card">
        <span>Rejected</span>
        <h2>
          {requests.filter((r) => r.status === "Rejected").length}
        </h2>
      </div>
    </div>

    <div className="section-heading">
      <div>
        <span className="section-kicker">FACULTY WORKSPACE</span>
        <h2>Booking approval requests</h2>
        <p>Review and manage student equipment bookings.</p>
      </div>
    </div>

    <div className="request-list">
      {requests.length === 0 ? (
        <div className="empty-state">
          <ClipboardCheck size={34} />
          <strong>No booking requests</strong>
          <p>Student booking requests will appear here.</p>
        </div>
      ) : (
        requests.map((request) => (
          <div className="request-row" key={request.id}>
            <div className="equipment-icon blue">
              <FlaskConical />
            </div>

            <div className="request-details">
              <strong>{request.equipment}</strong>
              <span>Project: {request.project}</span>
              <span>Date: {request.date}</span>
              <span>
                Time: {request.startTime} - {request.endTime}
              </span>
              <span>Status: {request.status}</span>
            </div>

            {request.status === "Pending faculty approval" ? (
              <div className="approval-actions">
                <button
                  className="approve-button"
                  onClick={() => updateRequestStatus(request.id, "Approved")}
                >
                  Approve
                </button>
                <button
                  className="reject-button"
                  onClick={() => updateRequestStatus(request.id, "Rejected")}
                >
                  Reject
                </button>
              </div>
            ) : (
              <span className="request-status">{request.status}</span>
            )}
          </div>
        ))
      )}
    </div>
  </div>
) : activePage === "Settings" ? (
  <div className="empty-state">
    <Settings size={34} />
    <strong>Student account</strong>
    <p>Student User · Computer Science Department</p>
  </div>
) : activePage === "My Bookings" ? (
  <div className="request-list">
    {requests.filter((booking) => booking.status === "Approved").length === 0 ? (
      <div className="empty-state">
        <CalendarDays size={34} />
        <strong>No approved bookings yet</strong>
        <p>Your approved laboratory bookings will appear here.</p>
        <button
          className="primary-button"
          onClick={() => selectPage("Explore Equipment")}
        >
          Browse equipment
        </button>
      </div>
    ) : (
      requests
        .filter((booking) => booking.status === "Approved")
        .map((booking) => (
          <div className="request-row" key={booking.id}>
            <div className="equipment-icon blue">
              <CalendarDays />
            </div>
            <div className="request-details">
              <strong>{booking.equipment}</strong>
              <span>
                {booking.date} · {booking.startTime} - {booking.endTime}
              </span>
              <span>{booking.project}</span>
            </div>
            <span className="request-status">{booking.status}</span>
          </div>
        ))
    )}
  </div>
) : activePage === "Dashboard" ? (
  <div className="empty-state">
    <Sparkles size={34} />
    <strong>Your LabLink workspace is ready!</strong>
    <p>
      Discover specialised equipment, track your project requests and manage
      your laboratory bookings across departments.
    </p>
    <button
      className="primary-button"
      onClick={() => selectPage("Explore Equipment")}
    >
      Explore available equipment
      <ArrowRight size={17} />
    </button>
  </div>
) : (
  <>
    <div className="equipment-controls">
      <div className="search-box">
        <Search size={18} />
        <input
          placeholder="Search equipment, labs or departments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <button className="filter-button">
        <Filter size={17} /> Filter
      </button>
    </div>

    <div className="category-tabs">
      {categories.map((item) => (
        <button
          key={item}
          className={category === item ? "category-active" : ""}
          onClick={() => setCategory(item)}
        >
          {item}
        </button>
      ))}
    </div>

    <div className="equipment-grid">
      {filteredEquipment.map((item) => {
        const Icon = item.icon;
        return (
          <article className="equipment-card" key={item.id}>
            <div className={`equipment-visual ${item.color}`}>
              <div className="equipment-visual-icon">
                <Icon size={43} strokeWidth={1.5} />
              </div>
              <span
                className={`availability ${
                  item.available ? "available" : "unavailable"
                }`}
              >
                <span /> {item.available ? "Available" : "Booked"}
              </span>
            </div>

            <div className="equipment-info">
              <span className="equipment-category">{item.category}</span>
              <h3>{item.name}</h3>
              <p>{item.description}</p>

              <div className="equipment-specs">
                <Cpu size={14} /> {item.specs}
              </div>
              <div className="equipment-location">
                <MapPin size={14} /> {item.lab}
              </div>

              <div className="equipment-card-bottom">
                <span>{item.department}</span>
                <button
                  disabled={!item.available}
                  onClick={() => openRequest(item)}
                >
                  {item.available ? "Book equipment" : "Currently unavailable"}
                  {item.available && <ArrowRight size={15} />}
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>

    {filteredEquipment.length === 0 && (
      <div className="empty-state">
        <Search size={30} />
        <strong>No equipment found</strong>
        <p>Try another search or category.</p>
      </div>
    )}
  </>
)}
            </section>
            {activePage === "Dashboard" && (
          <section className="bottom-grid">
            <div className="bottom-card">
              <div className="bottom-card-heading">
                <div>
                  <span className="section-kicker">YOUR SCHEDULE</span>
                  <h3>Upcoming activity</h3>
                </div>
                <CalendarDays size={21} />
              </div>
              <div className="activity-row">
                <div className="activity-date">
                  <strong>24</strong>
                  <span>NOV</span>
                </div>
                <div>
                  <strong>Embedded Systems Lab</strong>
                  <p>Arduino Development Kit · 10:00 AM</p>
                </div>
              </div>
              <div className="activity-row">
                <div className="activity-date">
                  <strong>26</strong>
                  <span>NOV</span>
                </div>
                <div>
                  <strong>AI Research Lab</strong>
                  <p>GPU Workstation · 02:00 PM</p>
                </div>
              </div>
            </div>

            <div className="bottom-card insight-card">
              <div className="bottom-card-heading">
                <div>
                  <span className="section-kicker">SMART INSIGHT</span>
                  <h3>LabLink recommendation</h3>
                </div>
                <Sparkles size={21} />
              </div>
              <div className="insight-message">
                <Zap size={19} />
                <p>
                  Try exploring equipment from other departments.
                  You may discover resources that perfectly match
                  your project needs.
                </p>
              </div>
              <button onClick={() => selectPage("Explore Equipment")}>
                Discover resources <ArrowRight size={15} />
              </button>
            </div>
          </section>
            )}
          <footer className="footer">
            <span>© 2026 LabLink · Smart Campus Resource Sharing</span>
            <span>Built for innovation across departments.</span>
          </footer>
        </div>
      </main>

      {showModal && selectedEquipment && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="request-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-heading">
              <div>
                <span className="section-kicker">EQUIPMENT ACCESS</span>
                <h2>Submit a project request</h2>
              </div>
              <button
                className="icon-button"
                onClick={() => setShowModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="selected-equipment">
              <FlaskConical size={22} />
              <div>
                <strong>{selectedEquipment.name}</strong>
                <span>{selectedEquipment.lab}</span>
              </div>
            </div>

            <form onSubmit={submitRequest}>
              <label>Project title</label>
              <input
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="e.g. AI Traffic Monitoring System"
                required
              />

              <label>Booking date</label>
              <input
                type="date"
                value={bookingDate}
                min={new Date().toLocaleDateString("en-CA")}
                onChange={(e) => setBookingDate(e.target.value)}
                required
              />

              <label>Start time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />

              <label>End time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
              

              <div className="modal-note">
                <Sparkles size={16} />
               Your booking will be checked for conflicts before submission.
               Faculty approval is required
              </div>

              <button type="submit" className="primary-button submit-button">
                Submit access request <ArrowRight size={17} />
              </button>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className="toast">
          <CheckCircle2 size={19} /> {toast}
        </div>
      )}
    </div>
  );
}

export default App;