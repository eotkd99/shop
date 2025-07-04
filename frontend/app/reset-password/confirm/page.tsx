"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function PasswordResetConfirmPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid || !token) {
      setError("유효하지 않은 링크입니다.");
    }
  }, [uid, token]);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setMessage(null);
  setError(null);

  if (!uid || !token) {
    setError("유효하지 않은 링크입니다.");
    return;
  }

  if (newPassword !== confirmPassword) {
    setError("비밀번호가 일치하지 않습니다.");
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/api/users/reset-password/confirm/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid,
        token,
        new_password: newPassword, 
        confirm_password: confirmPassword,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.detail || "비밀번호 변경에 실패했습니다.");
      return;
    }

    setMessage("비밀번호가 성공적으로 변경되었습니다.");
    setTimeout(() => router.push("/login"), 3000);
  } catch {
    setError("서버 오류가 발생했습니다.");
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-[380px] shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">비밀번호 재설정</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              type="password"
              placeholder="새 비밀번호"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {message && <p className="text-green-600 text-sm text-center">{message}</p>}
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <Button type="submit" className="w-full">비밀번호 변경</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
