"use client";
import Link from "next/link";
import { useActionState } from "react";
import { registerAction } from "@/app/actions/auth";

export default function RegisterPage() {
  const [state, action, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    return await registerAction(formData);
  }, null);

  return (
    <div className="p-10">
      <div className="text-center mb-8">
        <div className="mx-auto w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-sm">
          S
        </div>
        <h1 className="text-2xl font-bold text-gray-900">สร้างบัญชีผู้ใช้งาน</h1>
        <p className="text-sm text-gray-500 mt-2">ลงทะเบียนสำหรับคุณครูเพื่อเข้าใช้งานระบบ</p>
      </div>

      <form action={action} className="space-y-5">
        {state?.error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
            {state.error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ-นามสกุล</label>
          <input 
            type="text" 
            name="name" 
            placeholder="เช่น คุณครูใจดี"
            required 
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none transition-all shadow-sm font-medium"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อผู้ใช้ (Username)</label>
          <input 
            type="text" 
            name="username" 
            placeholder="เช่น teacher123"
            required 
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none transition-all shadow-sm font-medium"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่าน</label>
          <input 
            type="password" 
            name="password" 
            placeholder="••••••••"
            required 
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none transition-all shadow-sm font-medium"
          />
        </div>

        <button 
          type="submit" 
          disabled={isPending}
          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-sm transition-all disabled:bg-emerald-300"
        >
          {isPending ? "กำลังลงทะเบียน..." : "ลงทะเบียนเข้าใช้งาน"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        มีบัญชีผู้ใช้งานแล้ว?{" "}
        <Link href="/login" className="text-emerald-600 hover:text-emerald-800 font-medium">
          เข้าสู่ระบบ
        </Link>
      </div>
    </div>
  );
}
