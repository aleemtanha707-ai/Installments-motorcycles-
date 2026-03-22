import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Bike } from '../types';
import { BikeCard } from '../components/BikeCard';
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react';

export const Bikes: React.FC = () => {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [priceRange, setPriceRange] = useState(500000);

  const companies = ['All', 'Honda', 'Yamaha', 'Suzuki', 'United', 'Road Prince'];

  useEffect(() => {
    const fetchBikes = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'bikes'), orderBy('price', 'asc'));
        const snapshot = await getDocs(q);
        const bikesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Bike));
        setBikes(bikesData);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'bikes');
      } finally {
        setLoading(false);
      }
    };
    fetchBikes();
  }, []);

  const filteredBikes = bikes.filter(bike => {
    const matchesSearch = bike.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCompany = selectedCompany === 'All' || bike.company === selectedCompany;
    const matchesPrice = bike.price <= priceRange;
    return matchesSearch && matchesCompany && matchesPrice;
  });

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div>
          <h1 className="text-6xl font-black text-gray-900 tracking-tighter mb-4">Our Fleet</h1>
          <p className="text-gray-500 font-medium">Choose from a wide range of motorcycles on easy installments.</p>
        </div>
        <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-black/5 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-600 font-bold">
            <span className="text-2xl">{filteredBikes.length}</span>
            <span className="text-xs uppercase tracking-widest text-gray-400">Bikes Available</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-[32px] border border-black/5 space-y-8 sticky top-32">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <SlidersHorizontal size={20} />
                <span>Filters</span>
              </h3>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCompany('All');
                  setPriceRange(500000);
                }}
                className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors"
              >
                Reset
              </button>
            </div>

            {/* Search */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Search Model</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input
                  type="text"
                  placeholder="e.g. Honda 125"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-black transition-all outline-none text-sm font-medium"
                />
              </div>
            </div>

            {/* Company */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Company</label>
              <div className="flex flex-wrap gap-2">
                {companies.map(company => (
                  <button
                    key={company}
                    onClick={() => setSelectedCompany(company)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                      selectedCompany === company
                        ? 'bg-black text-white shadow-lg shadow-black/10'
                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {company}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <div className="flex justify-between items-end mb-3">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Max Price</label>
                <span className="text-sm font-bold text-gray-900">Rs. {priceRange.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="50000"
                max="1000000"
                step="10000"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-black"
              />
            </div>
          </div>
        </aside>

        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-[500px] bg-gray-100 rounded-3xl animate-pulse"></div>
              ))}
            </div>
          ) : filteredBikes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredBikes.map(bike => (
                <BikeCard key={bike.id} bike={bike} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[32px] border border-dashed border-gray-200 p-24 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                <Search size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No bikes found</h3>
              <p className="text-gray-500 font-medium mb-8">Try adjusting your filters or search term.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCompany('All');
                  setPriceRange(500000);
                }}
                className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
