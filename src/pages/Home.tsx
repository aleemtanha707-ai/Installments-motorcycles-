import React, { useState, useEffect } from 'react';
import { collection, query, limit, getDocs } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Bike } from '../types';
import { BikeCard } from '../components/BikeCard';
import { EMICalculator } from '../components/EMICalculator';
import { ArrowRight, ShieldCheck, Zap, Users, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export const Home: React.FC = () => {
  const [featuredBikes, setFeaturedBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const q = query(collection(db, 'bikes'), limit(3));
        const snapshot = await getDocs(q);
        const bikes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Bike));
        setFeaturedBikes(bikes);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'bikes');
      } finally {
        setLoading(false);
      }
    };
    fetchBikes();
  }, []);

  return (
    <div className="space-y-32">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-2 mb-8">
              <span className="w-12 h-px bg-emerald-500"></span>
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-600">Pakistan's #1 Platform</span>
            </div>
            <h1 className="text-7xl lg:text-8xl font-black text-gray-900 leading-[0.9] mb-8 tracking-tighter">
              Ride Now. <br />
              <span className="text-emerald-600">Pay Later.</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-lg leading-relaxed mb-12 font-medium">
              Get your dream motorcycle on easy monthly installments with zero hidden charges. Simple, fast, and reliable.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link
                to="/bikes"
                className="bg-black text-white px-10 py-5 rounded-2xl text-lg font-bold hover:bg-gray-800 transition-all shadow-2xl shadow-black/20 flex items-center gap-3"
              >
                <span>Browse Bikes</span>
                <ArrowRight size={20} />
              </Link>
              <div className="flex items-center gap-4 px-8 py-5 border border-black/5 rounded-2xl bg-white">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                      <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="User" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">10k+ Users</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Trusted across PK</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-100 rounded-full blur-[120px] opacity-50"></div>
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-100 rounded-full blur-[120px] opacity-50"></div>
            <img
              src="https://images.unsplash.com/photo-1558981403-c5f91cbba527?auto=format&fit=crop&q=80&w=1000"
              alt="Hero Bike"
              className="relative rounded-[40px] shadow-2xl shadow-black/10 rotate-3 hover:rotate-0 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: Zap, title: "Instant Approval", desc: "Get approved within 24 hours with minimal documentation." },
          { icon: ShieldCheck, title: "Zero Hidden Fees", desc: "Transparent pricing with no surprise charges at any step." },
          { icon: Users, title: "Flexible Plans", desc: "Choose from 6 to 36 months duration based on your budget." }
        ].map((f, i) => (
          <div key={i} className="bg-white p-10 rounded-[32px] border border-black/5 hover:border-emerald-500/20 transition-all group">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 mb-8 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all">
              <f.icon size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{f.title}</h3>
            <p className="text-gray-500 leading-relaxed font-medium">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Calculator Section */}
      <section className="bg-black rounded-[48px] p-12 lg:p-24 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-600/10 blur-[150px]"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center relative z-10">
          <div>
            <h2 className="text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-8 tracking-tighter">
              Plan Your <br />
              <span className="text-emerald-500 italic">Budget.</span>
            </h2>
            <p className="text-xl text-gray-400 leading-relaxed mb-12">
              Use our advanced EMI calculator to see exactly how much you'll pay each month. No guesswork, just clear numbers.
            </p>
            <div className="space-y-6">
              {[
                "Calculate by Bike Price",
                "Adjust Down Payment",
                "Select Custom Duration",
                "Instant Results"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 text-white/80 font-medium">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <Star size={12} fill="currentColor" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <EMICalculator />
        </div>
      </section>

      {/* Featured Bikes */}
      <section>
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-5xl font-black text-gray-900 tracking-tighter mb-4">Featured Bikes</h2>
            <p className="text-gray-500 font-medium">Our most popular motorcycles this month</p>
          </div>
          <Link to="/bikes" className="text-sm font-bold uppercase tracking-widest text-emerald-600 hover:text-emerald-700 flex items-center gap-2 group">
            <span>View All Bikes</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[500px] bg-gray-100 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredBikes.map(bike => (
              <BikeCard key={bike.id} bike={bike} />
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="text-center py-24">
        <h2 className="text-6xl font-black text-gray-900 tracking-tighter mb-8">Ready to Start Riding?</h2>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
          Join thousands of happy riders who got their bikes through MotoInstall. The process is simple and takes less than 5 minutes.
        </p>
        <Link
          to="/bikes"
          className="inline-flex bg-emerald-600 text-white px-12 py-6 rounded-2xl text-xl font-bold hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-600/20"
        >
          Apply for Installment
        </Link>
      </section>
    </div>
  );
};
