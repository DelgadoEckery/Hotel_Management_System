import React, { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || "";
const credentials = { username: "pms_admin", password: "hotelpms2026" };

export default function App() {
  const [loggedIn, setLoggedIn] = useState(
    () => sessionStorage.getItem("pms-auth") === "yes",
  );
  const [page, setPage] = useState(() => location.hash.slice(1) || "rooms");
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [login, setLogin] = useState({ username: "", password: "" });

  async function loadRooms() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(API + "/api/rooms", {
        headers: { Accept: "application/json" },
      });
      if (!response.ok)
        throw new Error(
          "Could not load rooms. Check that the Laravel API is running.",
        );
      setRooms(await response.json());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (loggedIn) loadRooms();
  }, [loggedIn]);
  useEffect(() => {
    const change = () => setPage(location.hash.slice(1) || "rooms");
    addEventListener("hashchange", change);
    return () => removeEventListener("hashchange", change);
  }, []);
  function go(route) {
    location.hash = route;
    setPage(route);
    setError("");
  }
  function signIn(e) {
    e.preventDefault();
    if (
      login.username !== credentials.username ||
      login.password !== credentials.password
    ) {
      setError("Incorrect username or password.");
      return;
    }
    sessionStorage.setItem("pms-auth", "yes");
    setLoggedIn(true);
    setError("");
  }
  async function addRoom(e) {
    e.preventDefault();
    setError("");
    setNotice("");
    const form = Object.fromEntries(new FormData(e.currentTarget));
    form.nightly_rate = Number(form.nightly_rate);
    try {
      const response = await fetch(API + "/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not save room.");
      setRooms((list) => [data, ...list]);
      setNotice("Room saved successfully.");
      go("rooms");
    } catch (e) {
      setError(e.message);
    }
  }
  if (!loggedIn)
    return (
      <div className="login-page">
        <form className="login-card" onSubmit={signIn}>
          <div className="brand-mark">H</div>
          <p className="eyebrow">HOTEL MANAGEMENT</p>
          <h1>Welcome back</h1>
          <p className="muted">Sign in to manage your rooms.</p>
          <label>
            Username
            <input
              required
              value={login.username}
              onChange={(e) => setLogin({ ...login, username: e.target.value })}
              autoComplete="username"
            />
          </label>
          <label>
            Password
            <input
              required
              type="password"
              value={login.password}
              onChange={(e) => setLogin({ ...login, password: e.target.value })}
              autoComplete="current-password"
            />
          </label>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <button className="primary">Sign in</button>
        </form>
      </div>
    );

  const id = page.startsWith("rooms/") ? page.slice(6) : "";
  const room = rooms.find((r) => String(r.id) === id);
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">H</span>
          <span>
            Haven<span className="brand-dot">.</span>
            <small>PROPERTY MANAGEMENT</small>
          </span>
        </div>
        <div className="nav-label">WORKSPACE</div>
        <button
          className={
            page === "rooms" || page.startsWith("rooms/") ? "nav active" : "nav"
          }
          onClick={() => go("rooms")}
        >
          ▦　 Room list
        </button>
        <button
          className={page === "add" ? "nav active" : "nav"}
          onClick={() => go("add")}
        >
          ＋　 Add room
        </button>
        <div className="side-bottom">
          <span className="avatar">PA</span>
          <span>
            Property Admin<small>Administrator</small>
          </span>
          <button
            className="signout"
            onClick={() => {
              sessionStorage.removeItem("pms-auth");
              setLoggedIn(false);
            }}
          >
            Sign out
          </button>
        </div>
      </aside>
      <main className="main">
        <header>
          <span>
            Haven /{" "}
            {room ? "Room details" : page === "add" ? "Add room" : "Rooms"}
          </span>
          <span className="online">
            <i /> Hotel workspace
          </span>
        </header>
        <section className="content">
          {page === "add" ? (
            <>
              <button className="back" onClick={() => go("rooms")}>
                ← Back to rooms
              </button>
              <div className="title">
                <p className="eyebrow">ROOM INVENTORY</p>
                <h1>Add a room</h1>
                <p className="muted">Add a room to your hotel catalog.</p>
              </div>
              <form className="form-card" onSubmit={addRoom}>
                <label>
                  Room number
                  <input
                    name="room_number"
                    required
                    maxLength="20"
                    placeholder="e.g. 204"
                  />
                </label>
                <label>
                  Room type
                  <select name="room_type" required defaultValue="">
                    <option value="" disabled>
                      Select a room type
                    </option>
                    <option>Standard Single</option>
                    <option>Deluxe Double</option>
                    <option>Executive Suite</option>
                    <option>Penthouse</option>
                  </select>
                </label>
                <label>
                  Nightly rate ($)
                  <input
                    name="nightly_rate"
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="150.00"
                  />
                </label>
                {error && (
                  <p className="error" role="alert">
                    {error}
                  </p>
                )}
                <button className="primary">Save room</button>
              </form>
            </>
          ) : room ? (
            <>
              <button className="back" onClick={() => go("rooms")}>
                ← Back to rooms
              </button>
              <div className="title">
                <p className="eyebrow">ROOM DETAILS</p>
                <h1>Room {room.room_number}</h1>
                <p className="muted">Full room information.</p>
              </div>
              <article className="detail-card">
                <div className="room-icon">⌂</div>
                <div>
                  <span className="eyebrow">ROOM NUMBER</span>
                  <h2>{room.room_number}</h2>
                </div>
                <div>
                  <span className="eyebrow">ROOM TYPE</span>
                  <h2>{room.room_type}</h2>
                </div>
                <div>
                  <span className="eyebrow">NIGHTLY RATE</span>
                  <h2>${Number(room.nightly_rate).toFixed(2)}</h2>
                </div>
              </article>
            </>
          ) : (
            <>
              <div className="title title-row">
                <div>
                  <p className="eyebrow">HOTEL INVENTORY</p>
                  <h1>Rooms</h1>
                  <p className="muted">
                    Manage your room catalog and nightly rates.
                  </p>
                </div>
                <button
                  className="primary add-button"
                  onClick={() => go("add")}
                >
                  ＋ Add room
                </button>
              </div>
              {notice && (
                <p className="notice" role="status">
                  {notice}
                </p>
              )}
              {error && (
                <p className="error" role="alert">
                  {error}
                  <button className="retry" onClick={loadRooms}>
                    Retry
                  </button>
                </p>
              )}
              <div className="list-head">
                <div>
                  <h2>All rooms</h2>
                  <p>{rooms.length} rooms in your catalog</p>
                </div>
                <span className="count">{rooms.length}</span>
              </div>
              {loading ? (
                <div className="empty">Loading rooms…</div>
              ) : rooms.length === 0 ? (
                <div className="empty">
                  <div className="empty-icon">⌂</div>
                  <h2>No rooms yet</h2>
                  <p>Add your first hotel room to get started.</p>
                  <button className="primary" onClick={() => go("add")}>
                    Add your first room
                  </button>
                </div>
              ) : (
                <div className="room-list">
                  {rooms.map((item) => (
                    <button
                      className="room-row"
                      key={item.id}
                      onClick={() => go("rooms/" + item.id)}
                    >
                      <span className="room-icon">⌂</span>
                      <span>
                        <strong>Room {item.room_number}</strong>
                        <small>{item.room_type}</small>
                      </span>
                      <span className="rate">
                        ${Number(item.nightly_rate).toFixed(2)}
                        <small>per night</small>
                      </span>
                      <span className="arrow">→</span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}
