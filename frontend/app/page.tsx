// app/somepage/page.tsx
import { MainPanel } from "@/components/main/MainPanel";
import { MainGridPanel } from "@/components/main/MainGridPanel";

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
