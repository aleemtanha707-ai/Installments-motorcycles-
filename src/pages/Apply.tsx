import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, Timestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, auth } from '../firebase';
import { Bike, Application } from '../types';
import { useAuth } from '../App';
import { ShieldCheck, User, Phone, MapPin, CreditCard, Wallet, Send, CheckCircle2 } from 'lucide-react';

export const Apply: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [bike, setBike] = useState<Bike | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    cnic: '',
    phone: '',
    city: '',
    income: '',
    address: ''
  });

  useEffect(() => {
    const fetchBike = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'bikes', id);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          setBike({ id: snapshot.id, ...snapshot.data() } as Bike);
        } else {
          navigate('/bikes');
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `bikes/${id}`);
      } finally {
        setLoading(false);
      }
    };
    fetchBike();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !bike) return;

    setSubmitting(true);
    try {
      const applicationData: Omit<Application, 'id'> = {
        userId: user.uid,
        bikeId: bike.id,
        bikeName: bike.name,
        status: 'pending',
        createdAt: Timestamp.now(),
        fullName: formData.fullName,
        cnic: formData.cnic,
        phone: formData.phone,
        city: formData.city,
        income: Number(formData.income),
        address: formData.address
      };

      await addDoc(collection(db, 'applications'), applicationData);
      setSuccess(true);
      setTimeout(() => navigate('/'), 5000);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'applications');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto text-center py-24">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-300">
          <User size={32} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-4">Login Required</h2>
        <p className="text-gray-500 font-medium mb-8">Please login with Google to apply for installments.</p>
        <button
          onClick={() => {}} // Handle login
          className="bg-black text-white px-10 py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all"
        >
          Login with Google
        </button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto text-center py-24 bg-white rounded-[48px] border border-black/5 shadow-2xl shadow-black/5">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-10 text-emerald-600">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-5xl font-black text-gray-900 mb-6 tracking-tighter">Application Submitted!</h2>
        <p className="text-xl text-gray-500 font-medium mb-12 max-w-md mx-auto leading-relaxed">
          Your application for <span className="text-black font-bold">{bike?.name}</span> has been received. Our team will contact you within 24 hours.
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-black text-white px-10 py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-6xl font-black text-gray-900 tracking-tighter mb-4">Apply Now</h1>
        <p className="text-gray-500 font-medium">Complete the form below to start your installment process for {bike?.name}.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[40px] border border-black/5 shadow-sm space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <User size={14} />
                  <span>Full Name</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Muhammad Ali"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-black transition-all outline-none font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <CreditCard size={14} />
                  <span>CNIC Number</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="42101-1234567-1"
                  value={formData.cnic}
                  onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
                  className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-black transition-all outline-none font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Phone size={14} />
                  <span>Phone Number</span>
                </label>
                <input
                  required
                  type="tel"
                  placeholder="0300 1234567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-black transition-all outline-none font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <MapPin size={14} />
                  <span>City</span>
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Karachi"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-black transition-all outline-none font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Wallet size={14} />
                <span>Monthly Income (PKR)</span>
              </label>
              <input
                required
                type="number"
                placeholder="e.g. 50000"
                value={formData.income}
                onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-black transition-all outline-none font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <MapPin size={14} />
                <span>Residential Address</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="Your full home address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-black transition-all outline-none font-medium resize-none"
              ></textarea>
            </div>

            <button
              disabled={submitting}
              type="submit"
              className="w-full bg-black text-white py-6 rounded-[24px] text-xl font-bold hover:bg-gray-800 transition-all shadow-2xl shadow-black/10 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Submit Application</span>
                  <Send size={20} />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-[32px] border border-black/5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Selected Bike</h3>
            <div className="flex items-center gap-4 mb-8">
              <img
                src={bike?.image}
                alt={bike?.name}
                className="w-20 h-20 rounded-2xl object-cover border border-black/5"
                referrerPolicy="no-referrer"
              />
              <div>
                <p className="font-bold text-gray-900">{bike?.name}</p>
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">{bike?.company}</p>
              </div>
            </div>
            <div className="space-y-4 border-t border-gray-50 pt-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-medium">Down Payment</span>
                <span className="font-bold">Rs. {bike?.down_payment.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-medium">Monthly EMI</span>
                <span className="font-bold text-emerald-600">Rs. {bike?.monthly.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-medium">Duration</span>
                <span className="font-bold">{bike?.duration} Months</span>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 p-8 rounded-[32px] border border-emerald-100">
            <div className="flex items-center gap-3 mb-4 text-emerald-600">
              <ShieldCheck size={24} />
              <h4 className="font-bold uppercase text-xs tracking-widest">Secure Process</h4>
            </div>
            <p className="text-xs font-medium text-emerald-800/70 leading-relaxed">
              Your data is encrypted and secure. We only use this information to process your installment application.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
