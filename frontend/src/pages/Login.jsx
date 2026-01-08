import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try{
      await login(email, password);
      navigate('/chat');
    }catch(err){
      setError(err.response?.data?.message || 'Erreur de connexion');
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Se connecter</h3>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={onSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input className="form-control" value={email} onChange={e=>setEmail(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mot de passe</label>
                  <input type="password" className="form-control" value={password} onChange={e=>setPassword(e.target.value)} />
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-primary" type="submit">Connexion</button>
                  <Link to="/register" className="btn btn-outline-secondary">S'inscrire</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
