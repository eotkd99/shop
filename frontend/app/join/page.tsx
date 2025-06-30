"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";

export default function JoinPage() {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [email, setEmail] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      const res = await axios.post("http://localhost:8000/api/join/", {
        username: id,
        password: pw,
        password2: pw2,
        email,
        agree,
      });

      if (res.status === 201) {
        window.location.href = "/login";
        return;
      }

    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          let errorMsg = "회원가입에 실패했습니다.";
          if (error.response.data) {
            const errors = error.response.data;
            errorMsg = Object.values(errors).flat().join(" ");
          }
          setError(errorMsg);
        } else if (error.request) {
          setError("네트워크 오류가 발생했습니다.");
        } else {
          setError("알 수 없는 오류 발생: " + error.message);
        }
      } else {
        setError("알 수 없는 오류 발생");
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-[380px] shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">회원가입</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleJoin} className="flex flex-col gap-5">
            <Input id="userid" type="text" autoComplete="username" value={id} onChange={e => setId(e.target.value)} placeholder="아이디" required />
            <Input id="email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="이메일" required />
            <Input id="password" type="password" autoComplete="new-password" value={pw} onChange={e => setPw(e.target.value)} placeholder="비밀번호" required />
            <Input id="password2" type="password" autoComplete="new-password" value={pw2} onChange={e => setPw2(e.target.value)} placeholder="비밀번호 확인" required />
            <div className="flex items-center gap-2">
              <Checkbox id="agree" checked={agree} onCheckedChange={v => setAgree(!!v)} />
              <Label htmlFor="agree" className="text-sm cursor-pointer">약관에 동의합니다</Label>
            </div>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <Button type="submit" className="w-full mt-2 cursor-pointer">회원가입</Button>
          </form>
        </CardContent>
        <CardFooter className="flex items-center justify-center px-6 pb-4">
          <a href="/login" className="text-xs text-gray-500 hover:underline text-center inline-block">로그인 화면으로</a>
        </CardFooter>
      </Card>
    </div>
  );
}
