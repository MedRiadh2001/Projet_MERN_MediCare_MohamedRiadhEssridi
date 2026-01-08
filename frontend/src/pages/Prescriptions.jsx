import React, { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

export default function Prescriptions() {
    const { isAuthenticated, user } = useContext(AuthContext);
    const [list, setList] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);

    // État du formulaire
    const [form, setForm] = useState({ appointment: '', content: '', type: 'prescription' });

    // État spécifique pour les médicaments (Tableau d'objets)
    const [medications, setMedications] = useState([
        { name: '', dosage: '', frequency: '', duration: '' }
    ]);

    useEffect(() => {
        if (!isAuthenticated) return;
        api.get('/api/prescriptions').then(r => setList(r.data)).catch(() => { });
        api.get('/api/appointments').then(r => setAppointments(r.data)).catch(() => { });
    }, [isAuthenticated]);

    // Gérer les changements dans les lignes de médicaments
    const handleMedChange = (index, field, value) => {
        const newMeds = [...medications];
        newMeds[index][field] = value;
        setMedications(newMeds);
    };

    // Ajouter une ligne de médicament
    const addMedRow = () => {
        setMedications([...medications, { name: '', dosage: '', frequency: '', duration: '' }]);
    };

    // Supprimer une ligne
    const removeMedRow = (index) => {
        setMedications(medications.filter((_, i) => i !== index));
    };

    const create = async (e) => {
        e.preventDefault();
        if (!form.appointment) return alert("Veuillez choisir un rendez-vous");

        try {
            const finalMeds = medications.filter(m => m.name.trim() !== '');

            // On n'envoie que l'ID du rendez-vous, le contenu et les meds
            // Le backend déduira le patient et le docteur pour plus de sécurité
            const payload = {
                appointment: form.appointment,
                type: form.type,
                content: form.content,
                medications: finalMeds
            };

            const res = await api.post('/api/prescriptions', payload);

            // res.data est maintenant un objet déjà "populé" grâce à la modif backend
            setList(prev => [...prev, res.data]);

            // Reset
            setForm({ appointment: '', content: '', type: 'prescription' });
            setMedications([{ name: '', dosage: '', frequency: '', duration: '' }]);
            alert("Ordonnance créée avec succès !");
        } catch (err) {
            alert(err.response?.data?.message || 'Erreur lors de la création');
        }
    };

    const uid = user?.id || user?._id;
    const role = (user?.role || '').toLowerCase();

    // Filtrer les RDV : les miens ET non terminés (status !== completed)
    const myAppointments = appointments.filter(a =>
        String(a.doctor?._id || a.doctor) === String(uid) && a.status !== 'completed'
    );

    return (
        <div className="container py-4">
            <h3>Ordonnances</h3>
            <div className="row">
                {role === 'doctor' && (
                    <div className="col-md-12 mb-4">
                        <form onSubmit={create} className="card p-3 shadow-sm">
                            <h5>Nouvelle Prescription</h5>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Rendez-vous</label>
                                    <select className="form-select" value={form.appointment} onChange={e => setForm({ ...form, appointment: e.target.value })} required>
                                        <option value="">Choisir un patient...</option>
                                        {myAppointments.map(a => (
                                            <option key={a._id} value={a._id}>
                                                {new Date(a.date).toLocaleDateString()} - {a.patient?.profile?.nom + ' ' + a.patient?.profile?.prenom || a.patient?.email}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Type</label>
                                    <select className="form-select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                                        <option value="prescription">Ordonnance</option>
                                        <option value="note_medicale">Note Médicale</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Contenu / Diagnostic</label>
                                <textarea className="form-control" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required />
                            </div>

                            <h6>Médicaments</h6>
                            {medications.map((med, index) => (
                                <div key={index} className="row g-2 mb-2 align-items-end">
                                    <div className="col-md-3">
                                        <input className="form-control form-control-sm" placeholder="Nom" value={med.name} onChange={e => handleMedChange(index, 'name', e.target.value)} required />
                                    </div>
                                    <div className="col-md-2">
                                        <input className="form-control form-control-sm" placeholder="Dosage (ex: 500mg)" value={med.dosage} onChange={e => handleMedChange(index, 'dosage', e.target.value)} />
                                    </div>
                                    <div className="col-md-3">
                                        <input className="form-control form-control-sm" placeholder="Fréquence (ex: 3x/jour)" value={med.frequency} onChange={e => handleMedChange(index, 'frequency', e.target.value)} />
                                    </div>
                                    <div className="col-md-2">
                                        <input className="form-control form-control-sm" placeholder="Durée (ex: 7 jours)" value={med.duration} onChange={e => handleMedChange(index, 'duration', e.target.value)} />
                                    </div>
                                    <div className="col-md-2">
                                        {medications.length > 1 && (
                                            <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => removeMedRow(index)}>Supprimer</button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <button type="button" className="btn btn-sm btn-outline-secondary mb-3" onClick={addMedRow}>+ Ajouter un médicament</button>

                            <button className="btn btn-primary">Enregistrer l'ordonnance</button>
                        </form>
                    </div>
                )}

                {/* Liste des ordonnances (affichage) */}
                <div className="col-md-12">
                    <div className="card p-3 shadow-sm">
                        <h5>Historique des documents</h5>
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Type</th>
                                        <th>Patient</th>
                                        <th>Médicaments</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {list.filter(p => (role === 'doctor' ? (p.doctor?._id || p.doctor) === uid : (p.patient?._id || p.patient) === uid)).map(p => (
                                        <tr key={p._id}>
                                            <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                                            <td><span className="badge bg-info">{p.type}</span></td>
                                            <td>{p.patient?.profile?.nom + ' ' + p.patient?.profile?.prenom || p.patient?.email} </td>
                                            <td>
                                                {p.medications?.map((m, i) => (
                                                    <div key={i} className="small">
                                                        <strong>{m.name}</strong>: {m.dosage} - {m.frequency} ({m.duration})
                                                    </div>
                                                ))}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}