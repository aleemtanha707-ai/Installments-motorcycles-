import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Bike } from '../types';
import { EMICalculator } from '../components/EMICalculator';
import { ArrowLeft, ShieldCheck, Clock, CheckCircle2, Info, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const BikeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bike, setBike] = useState<Bike | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!bike) return null;

  const whatsappMessage = `Hi MotoInstall! I'm interested in the ${bike.name} (${bike.company}) on installments. Can you provide more details?`;
  const whatsappUrl = `https://wa.me/923001234567?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="space-y-16">
      <Link to="/bikes" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span>Back to fleet</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <div className="relative aspect-[4/3] rounded-[40px] overflow-hidden bg-white border border-black/5 shadow-2xl shadow-black/5">
            <img
              src={bike.image}
              alt={bike.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="grid grid-cols-3 gap-6">
            {[
              { label: 'Down Payment', value: `Rs. ${bike.down_payment.toLocaleString()}`, icon: ShieldCheck },
              { label: 'Monthly', value: `Rs. ${bike.monthly.toLocaleString()}`, icon: Clock },
              { label: 'Duration', value: `${bike.duration} Months`, icon: CheckCircle2 }
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-black/5 text-center">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 mx-auto mb-4">
                  <item.icon size={20} />
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                <p className="text-sm font-bold text-gray-900">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-white p-10 rounded-[32px] border border-black/5">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Info size={20} className="text-emerald-600" />
              <span>Bike Description</span>
            </h3>
            <p className="text-gray-500 leading-relaxed font-medium">
              {bike.description || `The ${bike.name} by ${bike.company} is one of the most reliable motorcycles in Pakistan. Known for its fuel efficiency and durable build, it's the perfect choice for daily commuting and long rides alike.`}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-12"
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-black text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                {bike.company}
              </span>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">In Stock</span>
            </div>
            <h1 className="text-6xl font-black text-gray-900 tracking-tighter mb-4 leading-none">{bike.name}</h1>
            <p className="text-4xl font-bold text-gray-900 mb-8">Rs. {bike.price.toLocaleString()}</p>
          </div>

          <EMICalculator 
            initialPrice={bike.price} 
            initialDownPayment={bike.down_payment} 
            initialMonths={bike.duration} 
          />

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to={`/apply/${bike.id}`}
              className="flex-1 bg-black text-white px-8 py-5 rounded-2xl text-lg font-bold hover:bg-gray-800 transition-all shadow-2xl shadow-black/10 text-center"
            >
              Apply Online
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-emerald-600 text-white px-8 py-5 rounded-2xl text-lg font-bold hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-600/10 flex items-center justify-center gap-3"
            >
              <MessageCircle size={24} />
              <span>WhatsApp Inquiry</span>
            </a>
          </div>

          <div className="p-8 bg-emerald-50 rounded-[32px] border border-emerald-100">
            <h4 className="text-sm font-bold text-emerald-900 uppercase tracking-widest mb-4">Required Documents</h4>
            <ul className="space-y-3 text-sm font-medium text-emerald-800/80">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                <span>Original CNIC & Copies</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                <span>Last 3 Months Salary Slip or Bank Statement</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                <span>Utility Bill (Electricity/Gas)</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                <span>Two Passport Size Photographs</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
