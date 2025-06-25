import { MainHeader } from "@/components/MainHeader";
import { MainCategory } from "@/components/MainCategory";
import { MainPanel } from "@/components/MainPanel";
import { MainGridPanel } from "@/components/MainGridPanel";

export default function SomePage() {
  return (
    <div>
      <div className="bg-white w-full z-50">
        <MainHeader />
        <MainCategory />
        <MainPanel />
        <MainGridPanel />
      </div>
    </div>
  );
}