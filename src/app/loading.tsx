export default function RootLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 space-y-4">
      <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
      <p className="text-gray-500 font-medium animate-pulse">กำลังโหลด...</p>
    </div>
  );
}
