"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';

type MainGridPanelItem = {
  id: number;
  name: string;
  path: string;
};

export function MainGridPanel() {
  const [data, setData] = useState<MainGridPanelItem[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/main_resources/grid_panel")
      .then((response) => setData(response.data))
      .catch((error) => console.error("Error fetching data:", error));
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
