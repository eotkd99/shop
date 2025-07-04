// app/find-id/page.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function FindIdPage() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFindId = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    setError(null);

    try {
      const res = await fetch(`${BASE_URL}/api/users/find-id/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "아이디를 찾을 수 없습니다.");
        return;
      }
      setResult(`아이디: ${data.username}`);
    } catch {
      setError("요청 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-[380px] shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">아이디 찾기</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFindId} className="flex flex-col gap-4">
            <Input
              type="email"
              placeholder="가입한 이메일 입력"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {result && <div className="text-sm text-green-600 text-center">{result}</div>}
            {error && <div className="text-sm text-red-500 text-center">{error}</div>}
            <Button type="submit" className="w-full">아이디 찾기</Button>
          </form>
        </CardContent>
        <CardFooter>
          <Button variant="link" className="w-full" onClick={() => history.back()}>← 뒤로가기</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
