import React, { useState, useEffect } from 'react';
import { Calculator, Bike as BikeIcon } from 'lucide-react';

interface EMICalculatorProps {
  initialPrice?: number;
  initialDownPayment?: number;
  initialMonths?: number;
}

export const EMICalculator: React.FC<EMICalculatorProps> = ({
  initialPrice = 200000,
  initialDownPayment = 50000,
  initialMonths = 12
}) => {
  const [price, setPrice] = useState(initialPrice);
  const [downPayment, setDownPayment] = useState(initialDownPayment);
  const [months, setMonths] = useState(initialMonths);
  const [monthly, setMonthly] = useState(0);

  useEffect(() => {
    const remaining = price - downPayment;
    if (remaining > 0 && months > 0) {
      setMonthly(Math.round(remaining / months));
    } else {
      setMonthly(0);
    }
  }, [price, downPayment, months]);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-black/5 p-8 max-w-xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
          <Calculator size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">EMI Calculator</h3>
          <p className="text-sm text-gray-500 italic">Calculate your monthly installments</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wider">Bike Price (PKR)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wider">Down Payment (PKR)</label>
          <input
            type="number"
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 uppercase tracking-wider">Duration (Months)</label>
          <select
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
          >
            {[6, 12, 18, 24, 36].map(m => (
              <option key={m} value={m}>{m} Months</option>
            ))}
          </select>
        </div>

        <div className="pt-6 border-t border-gray-100 mt-8">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-widest font-medium mb-1">Monthly Installment</p>
              <p className="text-4xl font-bold text-gray-900">
                Rs. {monthly.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 italic">Total Payable (Excl. markup)</p>
              <p className="text-sm font-medium text-gray-600">Rs. {price.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
