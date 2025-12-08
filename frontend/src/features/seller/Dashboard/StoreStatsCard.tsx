// src/features/seller/Dashboard/StoreStatsCard.tsx

import React from "react";
import type { LucideIcon } from "lucide-react";

interface StoreStatsCardProps {
  title: string;
  value: string | number; // tetap boleh string atau number
  icon: LucideIcon;
  bgColor: string;
}

const StoreStatsCard: React.FC<StoreStatsCardProps> = ({
  title,
  value,
  icon: Icon,
  bgColor,
}) => {
  return (
    <div className="p-5 bg-white rounded-xl shadow-lg border border-gray-100 flex items-center justify-between transition-transform hover:scale-[1.02]">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        {/* Pastikan value selalu string saat dirender */}
        <h3 className="text-3xl font-bold text-gray-800 mt-1">
          {value.toString()}
        </h3>
      </div>
      <div className={`p-3 rounded-full ${bgColor}`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
    </div>
  );
};

export default StoreStatsCard;
