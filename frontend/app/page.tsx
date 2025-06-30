// app/somepage/page.tsx
import { MainPanel } from "@/components/MainPanel";
import { MainGridPanel } from "@/components/MainGridPanel";

export default function SomePage() {
  return (
    <div>
      <div className="bg-white w-full z-50">
        <MainPanel />
        <MainGridPanel />
      </div>
    </div>
  );
}
