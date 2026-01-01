 

import React from 'react'

export default function LegendHeader() {
  return (
     <div className="flex gap-6 mb-3 items-center">
    <div className="flex items-center gap-2">
      <span className="w-3 h-3   bg-[#0A4F48]" />
      <span className="text-sm font-medium">Therapy</span>
    </div>

    <div className="flex items-center gap-2">
      <span className="w-3 h-3   bg-[#F4DBC7]" />
      <span className="text-sm font-medium">Workout</span>
    </div>

    <div className="flex items-center gap-2">
      <span className="w-3 h-3  
       bg-[#EBF3F2]" />
      <span className="text-sm font-medium">Diet</span>
    </div>
  </div>
  )
}
