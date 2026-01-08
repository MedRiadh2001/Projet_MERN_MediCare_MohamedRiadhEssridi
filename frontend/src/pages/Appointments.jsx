import React, { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

export default function Appointments() {
    const { isAuthenticated, user } = useContext(AuthContext);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ date: '', clinic: '', doctor: '', reason: '', notes: '' });
    const [clinics, setClinics] = useState([]);
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        if (!isAuthenticated) return;
        setLoading(true);
        api.get('/api/appointments').then(r => setAppointments(r.data)).catch(() => { }).finally(() => setLoading(false));
        api.get('/api/clinics').then(r => setClinics(r.data)).catch(() => { });
    }, [isAuthenticated]);

    const create = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...form, patient: user?.id || user?._id };
            const res = await api.post('/api/appointments', payload);
            setAppointments(prev => [...prev, res.data]);
            setForm({ date: '', clinic: '', doctor: '', notes: '' });
        } catch (err) {
            alert(err.response?.data?.message || 'Erreur');
        }
    };

    if (!isAuthenticated) return (
        <div className="container py-4">
            <div className="alert alert-warning">Veuillez vous connecter pour gérer vos rendez-vous.</div>
        </div>
    );

    const role = (user?.role || '').toLowerCase();
    const uid = user?.id || user?._id;
    const visible = appointments.filter(a => {
        if (!user) return false;
        if (role === 'doctor') return String(a.doctor?._id || a.doctor) === String(uid);
        return String(a.patient?._id || a.patient) === String(uid);
    });

    const statuses = ['scheduled', 'completed', 'cancelled', 'no-show'];

    const updateStatus = async (id, status) => {
        try {
            const res = await api.put(`/api/appointments/${id}`, { status });
            setAppointments(prev => prev.map(a => (String(a._id || a.id) === String(id) ? res.data : a)));
        } catch (err) { alert(err.response?.data?.message || 'Erreur mise à jour statut'); }
    };

    return (
        <div className="container py-4">
            <h3>Rendez-vous</h3>
            <div className="row">
                <div className="col-md-6">
                    {role === 'patient' && (
                        <form onSubmit={create} className="card p-3 mb-3">
                            <div className="mb-3">
                                <label className="form-label">Date</label>
                                <input type="datetime-local" className="form-control" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Clinique</label>
                                <select className="form-select" value={form.clinic} onChange={e => { const cid = e.target.value; setForm({ ...form, clinic: cid, doctor: '' }); const c = clinics.find(x => (x._id || x.id) === cid); setDoctors(c?.doctors || []); }} required>
                                    <option value="">Choisir une clinique</option>
                                    {clinics.map(c => <option key={c._id || c.id} value={c._id || c.id}>{c.nom} — {c.ville}</option>)}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Docteur</label>
                                <select className="form-select" value={form.doctor} onChange={e => setForm({ ...form, doctor: e.target.value })} required>
                                    <option value="">Choisir un médecin</option>
                                    {doctors.map(d => <option key={d._id || d.id} value={d._id || d.id}>{d.email || d.username}</option>)}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Raison</label>
                                <textarea className="form-control" value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })}></textarea>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Notes</label>
                                <textarea className="form-control" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}></textarea>
                            </div>
                            <button className="btn btn-primary">Créer</button>
                        </form>
                    )}
                    {role === 'doctor' && (
                        <div className="card p-3 mb-3"><div className="text-muted">En tant que médecin vous pouvez consulter et mettre à jour le statut des rendez-vous ci‑contre.</div></div>
                    )}
                </div>

                <div className="col-md-6">
                    <div className="card p-3">
                        <h5>Mes rendez-vous</h5>
                        {loading ? <div>Chargement...</div> : (
                            <ul className="list-group list-group-flush">
                                {visible.length === 0 && <li className="list-group-item text-muted">Aucun rendez-vous</li>}
                                {visible.map(a => (
                                    <li className="list-group-item d-flex justify-content-between align-items-start" key={a._id || a.id}>
                                        <div>
                                            <div><strong>{new Date(a.date).toLocaleString()}</strong></div>
                                            
                                            <div className="text-primary fw-bold">
                                                {(a.clinic?.nom || "Clinique inconnue")}
                                            </div>

                                            <div className="text-muted">
                                                Médecin: {a.doctor?.profile ? `Dr. ${a.doctor.profile.prenom} ${a.doctor.profile.nom}` : a.doctor?.email}
                                            </div>

                                            <div className="text-muted">
                                                Patient: {a.patient?.profile ? `${a.patient.profile.prenom} ${a.patient.profile.nom}` : a.patient?.email}
                                            </div>

                                            <div className="mt-2">
                                                <strong>Raison:</strong> {a.reason || "Non spécifiée"}
                                            </div>

                                            {a.notes && (
                                                <div className="small text-secondary">
                                                    <strong>Notes:</strong> {a.notes}
                                                </div>
                                            )}
                                        </div>

                                        <div className="text-end">
                                            <div className="mb-2">
                                                <span className={`badge ${a.status === 'scheduled' ? 'bg-primary' : 'bg-secondary'}`}>
                                                    {a.status}
                                                </span>
                                            </div>
                                            
                                            {/* MODIFICATION ICI : Le select ne s'affiche que si le statut est 'scheduled' */}
                                            {role === 'doctor' && a.status === 'scheduled' && (
                                                <select
                                                    className="form-select form-select-sm"
                                                    value={a.status}
                                                    onChange={e => updateStatus(a._id || a.id, e.target.value)}
                                                >
                                                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                            )}
                                            
                                            {/* Optionnel : Message si le statut est déjà validé */}
                                            {role === 'doctor' && a.status !== 'scheduled' && (
                                                <small className="text-muted italic">Statut finalisé</small>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
}