import React, { useEffect, useState } from "react";
import api from "../api";

export default function DoctorDashboard() {
  const [slots, setSlots] = useState([]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [schedule, setSchedule] = useState(null);
  const [appts, setAppts] = useState([]);
  const [edit, setEdit] = useState({});

  const loadMine = async () => {
    const { data } = await api.get("/schedules/mine");
    setSchedule(data);
    setSlots(data?.slots || []);
  };

  const loadAppts = async () => {
    const { data } = await api.get("/appointments/doctor/mine");
    setAppts(data);
  };

  useEffect(() => { loadMine(); loadAppts(); }, []);

  const addSlot = async () => {
    if (!start || !end) return;
    await api.post("/schedules", { slots: [{ start, end }] });
    setStart(""); setEnd("");
    loadMine();
  };

  const saveAppt = async (a) => {
    await api.put(`/appointments/doctor/${a._id}`, { diagnosis: a.diagnosis, notes: a.notes, status: a.status, nextVisitAt: a.nextVisitAt });
    loadAppts();
  };

  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="font-semibold mb-2">Цагийн хуваарь</h2>
        <div className="grid md:grid-cols-3 gap-2">
          <input type="datetime-local" value={start} onChange={e=>setStart(e.target.value)} />
          <input type="datetime-local" value={end} onChange={e=>setEnd(e.target.value)} />
          <button className="btn" onClick={addSlot}>Нэмэх</button>
        </div>
        <div className="mt-3 space-y-1">
          {(slots||[]).map((s, idx) => (
            <div key={idx} className="border rounded p-2">{new Date(s.start).toLocaleString()} - {new Date(s.end).toLocaleString()} {s.booked ? "(захиалсан)" : ""}</div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="font-semibold mb-2">Миний өвчтөнүүд</h2>
        <div className="space-y-2">
          {appts.map(a => (
            <div key={a._id} className="border rounded p-2 space-y-2">
              <div><b>{a.patient?.name}</b> | {a.service?.name} | {new Date(a.start).toLocaleString()}</div>
              <div className="grid md:grid-cols-2 gap-2">
                <input placeholder="Онош" defaultValue={a.diagnosis || ""} onChange={e=>a.diagnosis=e.target.value}/>
                <input placeholder="Тэмдэглэл" defaultValue={a.notes || ""} onChange={e=>a.notes=e.target.value}/>
                <select defaultValue={a.status} onChange={e=>a.status=e.target.value}>
                  <option value="booked">booked</option>
                  <option value="completed">completed</option>
                  <option value="cancelled">cancelled</option>
                </select>
                <input type="datetime-local" defaultValue={a.nextVisitAt ? a.nextVisitAt.substring(0,16) : ""} onChange={e=>a.nextVisitAt=e.target.value}/>
              </div>
              <button className="btn" onClick={()=>saveAppt(a)}>Хадгалах</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}