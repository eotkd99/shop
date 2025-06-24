import { MainHeader } from "@/components/MainHeader";
import { CategoryHeader } from "@/components/CategoryHeader";
import { MainPanel } from "@/components/MainPanel";

export default function SomePage() {
  return (
    <div>
      <div className="bg-white w-full z-50">
        <MainHeader />
        <CategoryHeader />
        <MainPanel />
      </div>
    </div>
  );
}