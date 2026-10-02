import React from 'react';

export const ProductCardSkeleton = () => (
  <div className="rounded-3xl bg-[#FFFBEB] p-6 border border-[#E8DCCF] animate-pulse space-y-4">
    <div className="w-full h-64 bg-[#FEF3C7] rounded-2xl"></div>
    <div className="h-6 bg-[#FEF3C7] rounded w-3/4"></div>
    <div className="h-4 bg-[#FEF3C7] rounded w-1/2"></div>
    <div className="h-10 bg-[#E8DCCF] rounded-xl w-full mt-4"></div>
  </div>
);

export const DashboardCardSkeleton = () => (
  <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm animate-pulse space-y-3">
    <div className="h-4 bg-gray-100 rounded w-1/3"></div>
    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
    <div className="h-3 bg-gray-100 rounded w-1/4"></div>
  </div>
);
