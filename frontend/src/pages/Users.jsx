import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Users() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        api.get('/api/users').then(r => setUsers(r.data)).catch(() => { });
    }, []);

    return (
        <div className="container py-4">
            <h3>Utilisateurs</h3>
            <div className="card p-3">
                <ul className="list-group list-group-flush">
                    {users.length === 0 && <li className="list-group-item text-muted">Aucun utilisateur trouvé</li>}
                    {users.map(u => (
                        <li className="list-group-item" key={u._id || u.id}>
                            <div><strong>{u.email}</strong></div>
                            <div className="text-muted">Role: {u.role}</div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
