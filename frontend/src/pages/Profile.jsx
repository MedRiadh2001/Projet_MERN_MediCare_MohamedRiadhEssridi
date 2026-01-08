import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

export default function Profile() {
    const { user, token } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [clinics, setClinics] = useState([]);
    const [myClinic, setMyClinic] = useState(null);
    const [form, setForm] = useState({ nom: '', prenom: '', telephone: '', specialite: '' });
    const [loading, setLoading] = useState(false);

    const userId = user?.id || user?._id;

    useEffect(() => {
        const load = async () => {
            if (!token || !userId) return;
            setLoading(true);
                try {
                const res = await api.get(`/api/users/${userId}/profile`);
                setProfile(res.data);
                setForm({
                    nom: res.data.nom || '',
                    prenom: res.data.prenom || '',
                    telephone: res.data.telephone || '',
                    specialite: res.data.specialite || ''
                    
                });
                // load clinics to determine registration
                const cl = await api.get('/api/clinics').then(r=>r.data).catch(()=>[]);
                setClinics(cl);
                const found = cl.find(c => (c.doctors || []).some(d => String(d._id || d) === String(userId)));
                setMyClinic(found || null);
            } catch (err) {
                // no profile yet -> keep form empty
                setProfile(null);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [token, userId]);

    const createProfile = async (e) => {
        e.preventDefault();
        if (!userId) return alert('Utilisateur non identifié');
        try {
            const res = await api.post(`/api/users/${userId}/profile`, form);
            setProfile(res.data);
            setEditing(false);
            alert('Profil créé');
        } catch (err) {
            alert(err.response?.data?.message || 'Erreur création profil');
        }
    };

    const updateProfile = async (e) => {
        e.preventDefault();
        if (!userId) return alert('Utilisateur non identifié');
        try {
            const res = await api.put(`/api/users/${userId}/profile`, form);
            setProfile(res.data);
            setEditing(false);
            alert('Profil mis à jour');
        } catch (err) {
            alert(err.response?.data?.message || 'Erreur mise à jour');
        }
    };

    if (!token) return (
        <div className="container py-4"><div className="alert alert-warning">Veuillez vous connecter pour accéder au profil.</div></div>
    );

    return (
        <div className="container py-4">
            <h3>Profil</h3>
            <div className="card p-3">
                <div><strong>Utilisateur:</strong> {user?.email}</div>
                <div><strong>Role:</strong> {user?.role || '—'}</div>
                <hr />

                {loading ? <div>Chargement...</div> : (
                    profile && !editing ? (
                        <div>
                            <div className="mb-2"><strong>Nom:</strong> {profile.nom}</div>
                            <div className="mb-2"><strong>Prenom:</strong> {profile.prenom}</div>
                            <div className="mb-2"><strong>Téléphone:</strong> {profile.telephone}</div>
                            {user?.role === 'Doctor' && profile?.specialite && (
                                <div className="mt-3">
                                    <h6>Clinique</h6>
                                    {myClinic ? (
                                        <div>
                                            <div><strong>{myClinic.nom}</strong> — {myClinic.ville}</div>
                                            <div className="mt-2"><button className="btn btn-sm btn-outline-danger" onClick={async ()=>{
                                                try{
                                                    const clinic = await api.get(`/api/clinics/${myClinic._id || myClinic.id}`).then(r=>r.data);
                                                    const doctors = (clinic.doctors||[]).map(d=>d._id||d).filter(id=>String(id)!==String(userId));
                                                    await api.put(`/api/clinics/${myClinic._id || myClinic.id}`, { doctors });
                                                    setMyClinic(null);
                                                    setClinics(prev => prev.map(c => c._id === myClinic._id ? { ...c, doctors } : c));
                                                    alert('Désinscription réussie');
                                                }catch(e){ alert('Erreur'); }
                                            }}>Se désinscrire</button></div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="mb-2">Vous n'êtes inscrit dans aucune clinique.</div>
                                            <div className="d-flex gap-2 align-items-center">
                                                <select className="form-select w-auto" id="clinic-select">
                                                    <option value="">Choisir une clinique</option>
                                                    {clinics.map(c=> <option key={c._id||c.id} value={c._id||c.id}>{c.nom} — {c.ville}</option>)}
                                                </select>
                                                <button className="btn btn-sm btn-primary" onClick={async ()=>{
                                                    const sel = document.getElementById('clinic-select').value;
                                                    if (!sel) return alert('Choisissez une clinique');
                                                    try{
                                                        const clinic = await api.get(`/api/clinics/${sel}`).then(r=>r.data);
                                                        const doctors = (clinic.doctors||[]).map(d=>d._id||d);
                                                        if (doctors.find(id=>String(id)===String(userId))) return alert('Déjà inscrit');
                                                        doctors.push(userId);
                                                        const updated = await api.put(`/api/clinics/${sel}`, { doctors }).then(r=>r.data);
                                                        setMyClinic(updated);
                                                        setClinics(prev => prev.map(c => (c._id === updated._id ? updated : c)));
                                                        alert('Inscription réussie');
                                                    }catch(e){ alert('Erreur'); }
                                                }}>S'inscrire</button>
                                            </div>
                                        </div>
                                    )}
                                    <div className="mb-2"><strong>Spécialité:</strong> {profile.specialite}</div>
                                </div>
                            )}
                            <div className="mt-3">
                                <button className="btn btn-primary me-2" onClick={() => setEditing(true)}>Modifier le profil</button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={profile ? updateProfile : createProfile}>
                            <div className="mb-3">
                                <label className="form-label">Nom</label>
                                <input className="form-control" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Prenom</label>
                                <input className="form-control" value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Téléphone</label>
                                <input className="form-control" value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })} />
                            </div>
                            {user?.role === 'Doctor' && (
                                <div className="mb-3">
                                    <label className="form-label">Spécialité</label>
                                    <select className="form-control" value={form.specialite} onChange={e => setForm({ ...form, specialite: e.target.value })}>
                                        <option value="">Sélectionner une spécialité</option>
                                        <option value="Généraliste">Généraliste</option>
                                        <option value="Cardiologie">Cardiologie</option>
                                        <option value="Dermatologie">Dermatologie</option>
                                        <option value="Gynécologie">Gynécologie</option>
                                        <option value="Neurologie">Neurologie</option>
                                    </select>
                                </div>
                            )}
                            <div className="d-flex gap-2">
                                <button className="btn btn-success" type="submit">{profile ? 'Mettre à jour' : 'Créer le profil'}</button>
                                <button type="button" className="btn btn-outline-secondary" onClick={() => { setEditing(false); if (!profile) setForm({ nom: '', prenom: '', telephone: '', specialite: '' }); }}>Annuler</button>
                            </div>
                        </form>
                    )
                )}
            </div>
        </div>
    );
}
