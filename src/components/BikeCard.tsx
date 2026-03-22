import React from 'react';
import { Link } from 'react-router-dom';
import { Bike } from '../types';
import { ArrowRight, ShieldCheck, Clock } from 'lucide-react';

interface BikeCardProps {
  bike: Bike;
}

export const BikeCard: React.FC<BikeCardProps> = ({ bike }) => {
  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-black/5 hover:border-black/10 hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 flex flex-col h-full">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
        <img
          src={bike.image}
          alt={bike.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="bg-black/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
            {bike.company}
          </span>
          {bike.price > 300000 && (
            <span className="bg-emerald-500/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
              Premium
            </span>
          )}
        </div>
      </div>

      <div className="p-8 flex flex-col flex-grow">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">{bike.name}</h3>
          <p className="text-sm text-gray-400 font-medium uppercase tracking-widest">{bike.company} Motors</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-50 p-4 rounded-2xl border border-black/5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Down Payment</p>
            <p className="text-lg font-bold text-gray-900">Rs. {bike.down_payment.toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-2xl border border-black/5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Monthly</p>
            <p className="text-lg font-bold text-emerald-600">Rs. {bike.monthly.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-center gap-6 mb-8 text-xs font-bold text-gray-400 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-gray-300" />
            <span>{bike.duration} Months</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-gray-300" />
            <span>Verified</span>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Full Price</p>
            <p className="text-sm font-bold text-gray-900">Rs. {bike.price.toLocaleString()}</p>
          </div>
          <Link
            to={`/bikes/${bike.id}`}
            className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center hover:bg-emerald-600 transition-all group-hover:translate-x-1"
          >
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
};
