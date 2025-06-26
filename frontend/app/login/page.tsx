"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: id, password: pw }),
      });
      if (!res.ok) {
        setError("아이디 또는 비밀번호가 올바르지 않습니다.");
        return;
      }
      const data = await res.json();
      localStorage.setItem("jwt", data.token);
      window.location.href = "/";
    } catch {
      setError("로그인 중 오류가 발생했습니다.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-[380px] shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">로그인</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div>
              <Input
                id="userid"
                type="text"
                autoComplete="username"
                value={id}
                onChange={e => setId(e.target.value)}
                placeholder="아이디를 입력하세요"
                required
              />
            </div>
            <div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={pw}
                onChange={e => setPw(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="remember" checked={remember} onCheckedChange={v => setRemember(!!v)} />
              <Label htmlFor="remember" className="text-sm cursor-pointer">로그인 상태 유지</Label>
            </div>
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            <Button type="submit" className="w-full mt-2 cursor-pointer">로그인</Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center px-6 pb-4">
          <div className="flex items-center justify-center gap-2">
            <a href="/find-id" className="text-xs text-gray-500 hover:underline text-center inline-block">
              아이디 찾기
            </a>
            <span className="text-gray-300 text-xs">|</span>
            <a href="/find-password" className="text-xs text-gray-500 hover:underline text-center inline-block">
              비밀번호 찾기
            </a>
            <span className="text-gray-300 text-xs">|</span>
            <a href="/join" className="text-xs text-gray-500 hover:underline text-center inline-block">
              회원가입
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
