import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState(null);
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await register({ email, password, role });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur');
        }
    };

    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h3 className="card-title">Créer un compte</h3>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={onSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input className="form-control" value={email} onChange={e => setEmail(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Mot de passe</label>
                                    <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Role</label>
                                    <select className="form-control" value={role} onChange={e => setRole(e.target.value)}>
                                        <option value="">Sélectionner un rôle</option>
                                        <option value="Patient">Patient</option>
                                        <option value="Doctor">Médecin</option>
                                    </select>
                                </div>
                                <div>
                                    <button className="btn btn-primary" type="submit">S'inscrire</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
