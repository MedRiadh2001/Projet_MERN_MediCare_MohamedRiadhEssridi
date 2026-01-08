import React, { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

export default function Clinics(){
  const { isAuthenticated, user } = useContext(AuthContext);
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nom:'', adresse:'', ville:'' });
  const [editingId, setEditingId] = useState(null);

  useEffect(()=>{
    setLoading(true);
    api.get('/api/clinics').then(r=>setClinics(r.data)).catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  const reload = ()=> api.get('/api/clinics').then(r=>setClinics(r.data)).catch(()=>{});

  const create = async (e)=>{
    e.preventDefault();
    try{
      const res = await api.post('/api/clinics', form);
      setClinics(prev=>[...prev, res.data]);
      setForm({ nom:'', adresse:'', ville:'' });
      alert('Clinique créée');
    }catch(err){ alert(err.response?.data?.message || 'Erreur'); }
  };

  const startEdit = (c)=>{
    setEditingId(c._id || c.id);
    setForm({ nom: c.nom||'', adresse: c.adresse||'', ville: c.ville||'' });
  };

  const saveEdit = async (e)=>{
    e.preventDefault();
    try{
      const id = editingId;
      const res = await api.put(`/api/clinics/${id}`, form);
      setClinics(prev=>prev.map(c=> (String(c._id||c.id)===String(id) ? res.data : c)));
      setEditingId(null);
      setForm({ nom:'', adresse:'', ville:'' });
      alert('Clinique mise à jour');
    }catch(err){ alert(err.response?.data?.message || 'Erreur'); }
  };

  const remove = async (id)=>{
    if (!window.confirm('Supprimer cette clinique ?')) return;
    try{
      await api.delete(`/api/clinics/${id}`);
      setClinics(prev=>prev.filter(c=> String(c._id||c.id)!==String(id)));
      alert('Clinique supprimée');
    }catch(err){ alert(err.response?.data?.message || 'Erreur'); }
  };

  const isAdmin = (user?.role || '').toLowerCase() === 'admin';

  return (
    <div className="container py-4">
      <h3>Cliniques</h3>

      {isAdmin && (
        <div className="card p-3 mb-3">
          <h5>{editingId ? 'Modifier la clinique' : 'Créer une clinique'}</h5>
          <form onSubmit={editingId ? saveEdit : create}>
            <div className="mb-2"><input className="form-control" placeholder="Nom" value={form.nom} onChange={e=>setForm({...form, nom:e.target.value})} required /></div>
            <div className="mb-2"><input className="form-control" placeholder="Adresse" value={form.adresse} onChange={e=>setForm({...form, adresse:e.target.value})} required /></div>
            <div className="mb-2"><input className="form-control" placeholder="Ville" value={form.ville} onChange={e=>setForm({...form, ville:e.target.value})} required /></div>
            <div className="d-flex gap-2">
              <button className="btn btn-primary" type="submit">{editingId ? 'Enregistrer' : 'Créer'}</button>
              {editingId && <button type="button" className="btn btn-outline-secondary" onClick={()=>{ setEditingId(null); setForm({ nom:'', adresse:'', ville:'' }); }}>Annuler</button>}
            </div>
          </form>
        </div>
      )}

      <div className="card p-3">
        <h5>Liste des cliniques</h5>
        {loading ? <div>Chargement...</div> : (
          <ul className="list-group list-group-flush">
            {clinics.length===0 && <li className="list-group-item text-muted">Aucune clinique</li>}
            {clinics.map(c=> (
              <li className="list-group-item d-flex justify-content-between align-items-center" key={c._id || c.id}>
                <div>
                  <div><strong>{c.nom}</strong> — <span className="text-muted">{c.ville}</span></div>
                  <div className="text-muted small">{c.adresse}</div>
                </div>
                <div className="d-flex gap-2">
                  {isAdmin && <button className="btn btn-sm btn-outline-secondary" onClick={()=>startEdit(c)}>Modifier</button>}
                  {isAdmin && <button className="btn btn-sm btn-outline-danger" onClick={()=>remove(c._id||c.id)}>Supprimer</button>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
