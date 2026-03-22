import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, updateDoc, doc, addDoc, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Bike, Application } from '../types';
import { useAuth } from '../App';
import { LayoutDashboard, Bike as BikeIcon, FileText, Plus, Trash2, Check, X, ExternalLink, Image as ImageIcon } from 'lucide-react';

export const Admin: React.FC = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'applications' | 'bikes'>('applications');
  const [applications, setApplications] = useState<Application[]>([]);
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddBike, setShowAddBike] = useState(false);

  const [newBike, setNewBike] = useState<Omit<Bike, 'id'>>({
    name: '',
    company: 'Honda',
    price: 0,
    down_payment: 0,
    monthly: 0,
    duration: 12,
    image: '',
    description: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const appsSnapshot = await getDocs(query(collection(db, 'applications'), orderBy('createdAt', 'desc')));
      setApplications(appsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application)));

      const bikesSnapshot = await getDocs(query(collection(db, 'bikes'), orderBy('name', 'asc')));
      setBikes(bikesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Bike)));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'admin_data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchData();
    }
  }, [profile]);

  const handleStatusUpdate = async (appId: string, status: 'approved' | 'rejected') => {
    try {
      await updateDoc(doc(db, 'applications', appId), { status });
      setApplications(apps => apps.map(a => a.id === appId ? { ...a, status } : a));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `applications/${appId}`);
    }
  };

  const handleAddBike = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'bikes'), newBike);
      setShowAddBike(false);
      fetchData();
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'bikes');
    }
  };

  const handleDeleteBike = async (bikeId: string) => {
    if (!window.confirm('Are you sure you want to delete this bike?')) return;
    try {
      await deleteDoc(doc(db, 'bikes', bikeId));
      fetchData();
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `bikes/${bikeId}`);
    }
  };

  const seedData = async () => {
    const sampleBikes: Omit<Bike, 'id'>[] = [
      { name: 'CD 70', company: 'Honda', price: 157900, down_payment: 30000, monthly: 10658, duration: 12, image: 'https://picsum.photos/seed/honda70/800/600', description: 'The most fuel-efficient bike in Pakistan.' },
      { name: 'CG 125', company: 'Honda', price: 234900, down_payment: 50000, monthly: 15408, duration: 12, image: 'https://picsum.photos/seed/honda125/800/600', description: 'The king of power and sound.' },
      { name: 'YBR 125G', company: 'Yamaha', price: 485000, down_payment: 100000, monthly: 32083, duration: 12, image: 'https://picsum.photos/seed/yamaha/800/600', description: 'Premium off-road experience.' },
      { name: 'GS 150', company: 'Suzuki', price: 382000, down_payment: 80000, monthly: 25166, duration: 12, image: 'https://picsum.photos/seed/suzuki/800/600', description: 'Comfortable long-distance touring bike.' }
    ];

    for (const bike of sampleBikes) {
      await addDoc(collection(db, 'bikes'), bike);
    }
    fetchData();
  };

  if (profile?.role !== 'admin') {
    return (
      <div className="text-center py-24">
        <h2 className="text-3xl font-black text-gray-900 mb-4">Access Denied</h2>
        <p className="text-gray-500 font-medium">You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div>
          <h1 className="text-6xl font-black text-gray-900 tracking-tighter mb-4 leading-none">Admin Panel</h1>
          <p className="text-gray-500 font-medium">Manage your fleet and installment applications.</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={seedData}
            className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-200 transition-all"
          >
            Seed Sample Data
          </button>
          <button
            onClick={() => setShowAddBike(true)}
            className="flex items-center gap-2 bg-black text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-gray-800 transition-all shadow-lg shadow-black/10"
          >
            <Plus size={18} />
            <span>Add New Bike</span>
          </button>
        </div>
      </div>

      <div className="flex gap-4 border-b border-gray-100 pb-4">
        <button
          onClick={() => setActiveTab('applications')}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'applications' ? 'bg-black text-white' : 'text-gray-400 hover:text-black'
          }`}
        >
          Applications ({applications.length})
        </button>
        <button
          onClick={() => setActiveTab('bikes')}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'bikes' ? 'bg-black text-white' : 'text-gray-400 hover:text-black'
          }`}
        >
          Bikes Fleet ({bikes.length})
        </button>
      </div>

      {activeTab === 'applications' ? (
        <div className="bg-white rounded-[32px] border border-black/5 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Applicant</th>
                <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Bike</th>
                <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {applications.map(app => (
                <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-6">
                    <p className="font-bold text-gray-900">{app.fullName}</p>
                    <p className="text-xs text-gray-400">{app.phone}</p>
                  </td>
                  <td className="p-6">
                    <p className="font-bold text-gray-900">{app.bikeName}</p>
                    <p className="text-xs text-emerald-600 font-bold uppercase tracking-widest">PKR {app.income.toLocaleString()}/mo</p>
                  </td>
                  <td className="p-6 text-sm text-gray-500 font-medium">
                    {app.createdAt.toDate().toLocaleDateString()}
                  </td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      app.status === 'approved' ? 'bg-emerald-100 text-emerald-600' :
                      app.status === 'rejected' ? 'bg-red-100 text-red-600' :
                      'bg-orange-100 text-orange-600'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusUpdate(app.id, 'approved')}
                        className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                        title="Approve"
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(app.id, 'rejected')}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        title="Reject"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bikes.map(bike => (
            <div key={bike.id} className="bg-white p-8 rounded-[32px] border border-black/5 flex flex-col group">
              <div className="aspect-video rounded-2xl overflow-hidden mb-6 bg-gray-50">
                <img src={bike.image} alt={bike.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900">{bike.name}</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{bike.company}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Price</p>
                  <p className="text-sm font-bold">Rs. {bike.price.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Monthly</p>
                  <p className="text-sm font-bold text-emerald-600">Rs. {bike.monthly.toLocaleString()}</p>
                </div>
              </div>
              <button
                onClick={() => handleDeleteBike(bike.id)}
                className="mt-auto flex items-center justify-center gap-2 text-red-500 font-bold text-xs uppercase tracking-widest hover:text-red-600 transition-colors py-4 border-t border-gray-50"
              >
                <Trash2 size={16} />
                <span>Delete Bike</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Bike Modal */}
      {showAddBike && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-[40px] p-10 overflow-y-auto max-h-[90vh] shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Add New Bike</h2>
              <button onClick={() => setShowAddBike(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddBike} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Model Name</label>
                  <input
                    required
                    type="text"
                    value={newBike.name}
                    onChange={(e) => setNewBike({ ...newBike, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-black transition-all outline-none font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Company</label>
                  <select
                    value={newBike.company}
                    onChange={(e) => setNewBike({ ...newBike, company: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-black transition-all outline-none font-medium"
                  >
                    {['Honda', 'Yamaha', 'Suzuki', 'United', 'Road Prince'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Price (PKR)</label>
                  <input
                    required
                    type="number"
                    value={newBike.price}
                    onChange={(e) => setNewBike({ ...newBike, price: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-black transition-all outline-none font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Down Payment</label>
                  <input
                    required
                    type="number"
                    value={newBike.down_payment}
                    onChange={(e) => setNewBike({ ...newBike, down_payment: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-black transition-all outline-none font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Monthly EMI</label>
                  <input
                    required
                    type="number"
                    value={newBike.monthly}
                    onChange={(e) => setNewBike({ ...newBike, monthly: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-black transition-all outline-none font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Duration (Months)</label>
                  <input
                    required
                    type="number"
                    value={newBike.duration}
                    onChange={(e) => setNewBike({ ...newBike, duration: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-black transition-all outline-none font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Image URL</label>
                <input
                  required
                  type="url"
                  value={newBike.image}
                  onChange={(e) => setNewBike({ ...newBike, image: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-black transition-all outline-none font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description</label>
                <textarea
                  rows={3}
                  value={newBike.description}
                  onChange={(e) => setNewBike({ ...newBike, description: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-black transition-all outline-none font-medium resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-5 rounded-2xl text-lg font-bold hover:bg-gray-800 transition-all shadow-xl shadow-black/10"
              >
                Add Bike to Fleet
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
