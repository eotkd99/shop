"use client";

import { useEffect, useState } from 'react';

type MainGridPanelItem = {
  id: number;
  name: string;
  path: string;
};

export function MainGridPanel() {
  const [data, setData] = useState<MainGridPanelItem[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/resources/main_grid_panel/")
      .then((res) => res.json())
      .then(setData);
  }, []);

  return (
    <div className="w-7/10 mx-auto mt-7 mb-7">
      <div className="grid grid-cols-3 grid-rows-2 gap-6">
        {data.map((item) => (
          <div key={item.id} className="bg-gray-100 h-60 flex items-center justify-center text-xl font-semibold rounded-lg shadow-sm">
            <img src={item.path} alt={item.name} className="w-full h-full object-cover rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
