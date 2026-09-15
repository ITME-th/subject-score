export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex-1 flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-50 via-gray-50 to-white p-4 font-sans relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-emerald-200/20 blur-3xl"></div>
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] rounded-full bg-teal-200/20 blur-3xl"></div>
        <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] rounded-full bg-emerald-100/30 blur-3xl"></div>
      </div>
      
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] overflow-hidden">
        {children}
      </div>
    </div>
  );
}
