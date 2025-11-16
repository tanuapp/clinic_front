import React, { useEffect, useState } from "react";
import api from "../api";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [svcForm, setSvcForm] = useState({ name: "", description: "", durationMin: 30, fee: 0 });
  const [appts, setAppts] = useState([]);

  const load = async () => {
    const u = await api.get("/admin/users"); setUsers(u.data);
    const s = await api.get("/services"); setServices(s.data);
    const a = await api.get("/admin/appointments"); setAppts(a.data);
  };

  useEffect(() => { load(); }, []);

  const addService = async () => {
    await api.post("/services", svcForm);
    setSvcForm({ name: "", description: "", durationMin: 30, fee: 0 });
    load();
  };

  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="font-semibold mb-2">Үйлчилгээ удирдах</h2>
        <div className="grid md:grid-cols-4 gap-2">
          <input placeholder="Нэр" value={svcForm.name} onChange={e=>setSvcForm({...svcForm, name: e.target.value})}/>
          <input placeholder="Тайлбар" value={svcForm.description} onChange={e=>setSvcForm({...svcForm, description: e.target.value})}/>
          <input placeholder="Минут" type="number" value={svcForm.durationMin} onChange={e=>setSvcForm({...svcForm, durationMin: Number(e.target.value)})}/>
          <input placeholder="Төлбөр" type="number" value={svcForm.fee} onChange={e=>setSvcForm({...svcForm, fee: Number(e.target.value)})}/>
        </div>
        <div className="mt-2"><button className="btn" onClick={addService}>Нэмэх</button></div>
        <div className="mt-3 grid md:grid-cols-2 gap-2">
          {services.map(s => <div key={s._id} className="border rounded p-2">{s.name} — {s.fee}₮</div>)}
        </div>
      </div>

      <div className="card">
        <h2 className="font-semibold mb-2">Хэрэглэгчид</h2>
        <div className="space-y-1">
          {users.map(u => <div key={u._id} className="border rounded p-2">{u.name} — {u.email} ({u.role})</div>)}
        </div>
      </div>

      <div className="card">
        <h2 className="font-semibold mb-2">Бүх цаг захиалга</h2>
        <div className="space-y-1">
          {appts.map(a => (
            <div key={a._id} className="border rounded p-2">
              {new Date(a.start).toLocaleString()} — {a.patient?.name} / {a.doctor?.name} / {a.service?.name} ({a.status})
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
