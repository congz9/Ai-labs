import { X, Globe } from 'lucide-react';
import { signIn, auth } from '../lib/firebase';

interface LoginModalProps {
  onSuccess: (email: string) => void;
  onClose: () => void;
}

export default function LoginModal({ onSuccess, onClose }: LoginModalProps) {
  const handleLogin = async () => {
    if (!auth) {
      // Fallback for when Firebase is not yet configured
      if (confirm('Firebase chưa được cấu hình. Bạn có muốn đăng nhập bằng Email hiện tại để thử nghiệm?')) {
        onSuccess('congga@s-connect.net');
      }
      return;
    }
    try {
      const user = await signIn();
      if (user && user.email) {
        onSuccess(user.email);
      }
    } catch (e) {
      alert('Lỗi đăng nhập: ' + (e as any).message);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-[32px] p-10 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6">
            <Globe size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Quản trị viên</h2>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            Vui lòng đăng nhập với Google để quản lý nội dung hệ sinh thái.
          </p>
          
          <button 
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-slate-200"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5 bg-white rounded-full p-0.5" />
            Tiếp tục với Google
          </button>
          
          <button onClick={onClose} className="mt-6 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-600 transition-colors">
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
}
