import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Home() {
    const { isAuthenticated } = useContext(AuthContext);
    return (
        <div className="container py-4">
            <div className="row">
                <div className="col-md-8">
                    <h2>Bienvenue sur MediCare</h2>
                    {!isAuthenticated && <p className="text-muted">Connectez-vous pour retrouver votre historique.</p>}
                    <p className="text-muted">Accédez au chatbot médical</p>
                    <div className="d-flex gap-2">
                        <Link to="/chat" className="btn btn-primary">Ouvrir le Chat</Link>
                        {!isAuthenticated && <Link to="/login" className="btn btn-outline-secondary">Se connecter</Link>}
                    </div>
                </div>
            </div>
        </div>
    )
}
