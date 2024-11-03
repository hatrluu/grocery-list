'use client';

import { useEffect, useState } from 'react';
import "./grocery-page.css";
import "./page.module.css";
import GroceryStore from './components/store/store';
import { Store } from './interfaces/store.interface';
import QRCode from './components/qr-code/qrCode';



export default function Home() {
  const [stores, setStores] = useState<Store[]>([]);
  const [newStoreName, setNewStoreName] = useState<string>('');
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    // Generate a unique session ID if not exists
    if (!sessionId) {
      setSessionId(Math.random().toString(36).substring(7));
    }
  }, []);

  const addStore = () => {
    if (!newStoreName.trim()) return;

    const newStore = {
      id: Math.random().toString(36).substring(7),
      name: newStoreName
    };

    setStores([...stores, newStore]);
    setNewStoreName('');
    localStorage.setItem('stores', JSON.stringify([...stores, newStore]));
  };

  return (
    <div className="page">
      <main className="main"  >
        <h1>Shared Grocery List</h1>
        <QRCode></QRCode>

        {/* Add Store Section */}
        <div className="addSection">
          <input
            type="text"
            value={newStoreName}
            onChange={(e) => setNewStoreName(e.target.value)}
            placeholder="Add new store"
          />
          <button onClick={addStore}>Add Store</button>
        </div>

        {/* Grocery Lists by Store */}
        {stores.map(store => (
          <GroceryStore key={store.id} groceryStore={store}></GroceryStore>
        ))}
      </main>
    </div>
  );
}
