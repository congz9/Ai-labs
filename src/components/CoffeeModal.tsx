import React, { useState } from 'react';
import { X, Coffee, Heart, Copy, Check, QrCode, CreditCard, Sparkles, Maximize2, DollarSign, ExternalLink, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ProfileInfo } from '../types';
import { getDirectImageUrl } from '../lib/imageUtils';

interface CoffeeModalProps {
  profile: ProfileInfo;
  onClose: () => void;
}

const PRESET_AMOUNTS = [
  { value: 20000, label: '☕ 20k', desc: 'Mời một ly cà phê ấm áp' },
  { value: 50000, label: '🥤 50k', desc: 'Mời một đồ uống full topping' },
  { value: 100000, label: '🚀 100k', desc: 'Tiếp thêm động lực đột phá' },
  { value: 0, label: '💎 Tùy tâm', desc: 'Ủng hộ theo ý của bạn' },
];

export default function CoffeeModal({ profile, onClose }: CoffeeModalProps) {
  const [activeTab, setActiveTab] = useState<'bank' | 'paypal'>('bank');
  const [amount, setAmount] = useState<number>(20000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedPreset, setSelectedPreset] = useState<number>(20000);
  const [senderName, setSenderName] = useState<string>('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [zoomedImgUrl, setZoomedImgUrl] = useState<string | null>(null);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getFinalAmount = () => {
    if (selectedPreset === 0) {
      return parseInt(customAmount) || 0;
    }
    return selectedPreset;
  };

  const getVietQRMemo = () => {
    const cleanName = senderName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .replace(/[^a-zA-Z0-9 ]/g, '');
    const suffix = cleanName ? ` tu ${cleanName}` : '';
    return `Ung ho AILABS${suffix}`.substring(0, 25);
  };

  const normalizeBankCode = (bankName: string): string => {
    const clean = (bankName || '').trim().toUpperCase()
      .replace(/\s+/g, '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    if (/TECHCOMBANK|TECKCOMBACK|TECKCOMBANK|TCB|TECHCOM/i.test(clean)) return 'TCB';
    if (/VIETCOMBANK|VCB|VIETCOM/i.test(clean)) return 'VCB';
    if (/VIETINBANK|CTG|VIETIN/i.test(clean)) return 'CTG';
    if (/BIDV|DTPT/i.test(clean)) return 'BIDV';
    if (/AGRIBANK|VBA|NONGNGHIEP/i.test(clean)) return 'VBA';
    if (/MBBANK|MB|MBPIN|MILITARY/i.test(clean)) return 'MB';
    if (/TPBANK|TPB/i.test(clean)) return 'TPB';
    if (/VPBANK|VPB/i.test(clean)) return 'VPB';
    if (/ACB|A_CHAU/i.test(clean)) return 'ACB';
    if (/SACOMBANK|STB/i.test(clean)) return 'STB';
    if (/HDBANK|HDB/i.test(clean)) return 'HDB';
    if (/SHB/i.test(clean)) return 'SHB';
    if (/VIB/i.test(clean)) return 'VIB';
    if (/MSB|MARITIME/i.test(clean)) return 'MSB';
    if (/SEABANK|SEAB/i.test(clean)) return 'SEAB';
    if (/OCB/i.test(clean)) return 'OCB';
    if (/LIENVIET|LPB|LPBANK/i.test(clean)) return 'LPB';
    
    return clean || 'TCB';
  };

  const getVietQRUrl = () => {
    const bankClean = normalizeBankCode(profile.bankName || 'TCB');
    const accountClean = profile.bankAccount || '';
    const nameClean = encodeURIComponent(profile.bankOwner || '');
    const currentAmount = getFinalAmount();
    const memoClean = encodeURIComponent(getVietQRMemo());

    // Vietnamese banks transfer formats via VietQR API (compact2 template)
    return `https://img.vietqr.io/image/${bankClean}-${accountClean}-compact2.jpg?amount=${currentAmount}&addInfo=${memoClean}&accountName=${nameClean}`;
  };

  const getPaypalLinkWithAmount = () => {
    return profile.paypalLink || '';
  };

  const getPaypalQRUrl = () => {
    if (!profile.paypalLink) return '';
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(profile.paypalLink)}`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/45 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-[32px] w-full max-w-lg max-h-[90vh] shadow-2xl border border-slate-100 flex flex-col overflow-hidden text-slate-800"
      >
        {/* Header decoration banner */}
        <div className="h-28 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-blue-500/10 relative flex items-center px-8 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 flex items-center justify-center text-amber-600 shadow-inner">
            <Coffee size={24} className="animate-bounce" />
          </div>
          <div className="ml-4">
            <h3 className="font-extrabold text-lg text-slate-800 tracking-tight flex items-center gap-1.5">
              Buy Me A Coffee <Sparkles size={16} className="text-amber-500" />
            </h3>
            <p className="text-xs font-semibold text-slate-500">Mời tác giả ly cà phê ấm áp</p>
          </div>
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 p-2 bg-white hover:bg-slate-50 rounded-full border border-slate-100 transition-colors text-slate-400 hover:text-slate-600 shadow-sm"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab section */}
        <div className="flex border-b border-slate-100 p-2 gap-1 bg-slate-50/50">
          {profile.bankAccount && (
            <button
              onClick={() => setActiveTab('bank')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'bank' ? 'bg-white shadow-sm border border-slate-100 text-blue-600' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <CreditCard size={14} /> Chuyển khoản VietQR
            </button>
          )}
          {profile.paypalLink && (
            <button
              onClick={() => setActiveTab('paypal')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'paypal' ? 'bg-white shadow-sm border border-slate-100 text-sky-600' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <DollarSign size={14} /> PayPal (Quốc tế)
            </button>
          )}
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {activeTab !== 'paypal' && (
            <>
              {/* Visual pricing options */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Chọn mức ủng hộ</label>
                <div className="grid grid-cols-2 gap-2">
                  {PRESET_AMOUNTS.map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() => {
                        setSelectedPreset(preset.value);
                        if (preset.value > 0) setAmount(preset.value);
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all relative ${
                        selectedPreset === preset.value
                          ? 'border-blue-500 bg-blue-50/20 text-blue-900 ring-2 ring-blue-500/10'
                          : 'border-slate-100 bg-white hover:bg-slate-50 hover:border-slate-200'
                      }`}
                    >
                      <div className="font-bold text-sm">{preset.label}</div>
                      <div className="text-[9.5px] font-medium text-slate-400 mt-0.5 leading-snug">{preset.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedPreset === 0 && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Số tiền tự chọn (VNĐ)</label>
                    <input
                      type="number"
                      placeholder="Ví dụ: 30000"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
                    />
                  </div>
                )}
                <div className={`space-y-1.5 ${selectedPreset !== 0 ? 'col-span-2' : ''}`}>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Tên của bạn (Tùy chọn)</label>
                  <input
                    type="text"
                    maxLength={15}
                    placeholder="Ví dụ: Minh"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
                  />
                </div>
              </div>
            </>
          )}

          <AnimatePresence mode="wait">
            {activeTab === 'bank' && (
              <motion.div
                key="bank-tab"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                {/* QR Display Container */}
                <div className="bg-slate-50/70 rounded-3xl p-5 border border-slate-100 flex flex-col md:flex-row gap-5 items-center justify-center">
                  <button 
                    onClick={() => setZoomedImgUrl(getVietQRUrl())}
                    className="w-[170px] h-[170px] bg-white rounded-2xl p-2 border border-slate-100 shadow-sm flex items-center justify-center relative group overflow-hidden cursor-zoom-in text-left focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    title="Bấm để phóng to mã QR"
                  >
                    <img 
                      src={getVietQRUrl()} 
                      alt="VietQR Code" 
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    {/* Hover indicator overlay */}
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white gap-1.5 p-2 md:backdrop-blur-[1px]">
                      <span className="bg-white/20 p-1.5 rounded-full backdrop-blur-sm">
                        <Maximize2 size={16} />
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-wider text-center">Bấm để phóng to</span>
                    </div>
                  </button>
                  
                  <div className="flex-1 space-y-3 w-full text-xs">
                    <div className="p-3 bg-white rounded-2xl border border-slate-100 space-y-2">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                        <span className="text-slate-400 font-semibold">Tài khoản thụ hưởng</span>
                        <span className="font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md text-[10px] uppercase">{profile.bankName}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[11px] font-bold text-slate-700">{profile.bankAccount}</p>
                          <p className="text-[10px] font-black uppercase text-slate-400">{profile.bankOwner}</p>
                        </div>
                        <button
                          onClick={() => handleCopy(profile.bankAccount || '', 'stk')}
                          className="p-2 bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors border border-slate-100 flex items-center gap-1"
                        >
                          {copiedField === 'stk' ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                          <span className="text-[10px] font-black tracking-tight">{copiedField === 'stk' ? 'OK' : 'COPY'}</span>
                        </button>
                      </div>
                    </div>
 
                    <div className="bg-amber-500/5 rounded-2xl p-3 border border-amber-500/10 text-[10.5px] text-amber-800 leading-normal font-semibold flex gap-2">
                      <Heart size={14} className="shrink-0 text-amber-500 mt-0.5" />
                      <span>Quét mã VietQR bằng bất kỳ ứng dụng Ngân hàng nào để chuyển tiền nhanh 24/7 cực dễ dàng.</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'paypal' && (
              <motion.div
                key="paypal-tab"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-4"
              >
                {/* QR Display Container */}
                <div className="bg-slate-50/70 rounded-3xl p-5 border border-slate-100 flex flex-col md:flex-row gap-5 items-center justify-center">
                  <button 
                    onClick={() => setZoomedImgUrl(getPaypalQRUrl())}
                    className="w-[170px] h-[170px] bg-white rounded-2xl p-2 border border-slate-100 shadow-sm flex items-center justify-center relative group overflow-hidden cursor-zoom-in text-left focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    title="Bấm để phóng to mã QR"
                  >
                    <img 
                      src={getPaypalQRUrl()} 
                      alt="PayPal QR Code" 
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    {/* Hover indicator overlay */}
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white gap-1.5 p-2 md:backdrop-blur-[1px]">
                      <span className="bg-white/20 p-1.5 rounded-full backdrop-blur-sm">
                        <Maximize2 size={16} />
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-wider text-center">Bấm để phóng to</span>
                    </div>
                  </button>
                  
                  <div className="flex-1 space-y-3 w-full text-xs">
                    <div className="p-3 bg-white rounded-2xl border border-slate-100 space-y-2">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                        <span className="text-slate-400 font-semibold text-[10px] uppercase">Tài khoản nhận</span>
                        <span className="font-extrabold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md text-[10px] uppercase">PayPal</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="overflow-hidden mr-1">
                          <p className="text-[11px] font-bold text-slate-700 truncate">{profile.name}</p>
                          <p className="text-[9.5px] font-black uppercase text-slate-400 font-mono truncate max-w-[120px]" title={profile.paypalLink}>
                            {profile.paypalLink?.replace('https://', '')}
                          </p>
                        </div>
                        <button
                          onClick={() => handleCopy(getPaypalLinkWithAmount(), 'paypal')}
                          className="p-2 bg-slate-50 hover:bg-sky-50 text-slate-400 hover:text-sky-600 rounded-lg transition-colors border border-slate-100 flex items-center gap-1 shrink-0"
                        >
                          {copiedField === 'paypal' ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                          <span className="text-[10px] font-bold">{copiedField === 'paypal' ? 'Xong' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="bg-sky-500/5 rounded-2xl p-3 border border-sky-500/10 text-[10.5px] text-sky-800 leading-normal font-semibold flex gap-2">
                      <Heart size={14} className="shrink-0 text-sky-500 mt-0.5" />
                      <span>Quét mã PayPal của tôi ở trên để gửi đóng góp quốc tế an toàn bằng mọi loại thẻ thanh toán.</span>
                    </div>
                  </div>
                </div>

                {/* Direct Action Button */}
                <a
                  href={getPaypalLinkWithAmount()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs tracking-wider uppercase rounded-xl shadow-lg shadow-sky-100 hover:shadow-sky-200/40 transition-all active:scale-[0.98]"
                >
                  Mở link PayPal.Me <ExternalLink size={14} />
                </a>

                <div className="text-[10px] text-slate-400 italic text-center leading-relaxed">
                  *Nhà hảo tâm có thể quét trực tiếp mã QR này bằng ứng dụng camera hoặc PayPal để chuyển nhanh.
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hidden preloader to cache QR images and eliminate loading delays when switching tabs or changing amounts */}
          <div className="hidden" aria-hidden="true">
            {profile.bankAccount && <img src={getVietQRUrl()} alt="preload-vietqr" />}
            {profile.paypalLink && <img src={getPaypalQRUrl()} alt="preload-paypal" />}
          </div>
        </div>

        {/* Footer info bar */}
        <div className="bg-slate-50 px-8 py-4 flex justify-between items-center border-t border-slate-100 text-[10px] font-semibold text-slate-400">
          <span className="flex items-center gap-1">
            <Heart size={10} className="text-rose-500 fill-rose-500 animate-pulse" />
          </span>
          <span>© {profile.name} {profile.brandName}</span>
        </div>
      </motion.div>

      {/* Enlarged QR Lightbox Overlay */}
      <AnimatePresence>
        {zoomedImgUrl && (
          <div 
            className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/85 backdrop-blur-md cursor-zoom-out p-4"
            onClick={() => setZoomedImgUrl(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative max-w-full w-[#360px] bg-white p-6 rounded-[32px] shadow-2xl border border-slate-100 flex flex-col items-center gap-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-full flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-xs font-black uppercase text-slate-400 tracking-wider">Mã QR Phóng To</span>
                <button
                  onClick={() => setZoomedImgUrl(null)}
                  className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="w-[280px] h-[280px] bg-white rounded-3xl p-3 border border-slate-100 shadow-inner flex items-center justify-center">
                <img 
                  src={zoomedImgUrl} 
                  alt="Enlarged VietQR Code" 
                  className="w-full h-full object-contain rounded-2xl cursor-zoom-out"
                  onClick={() => setZoomedImgUrl(null)}
                  title="Bấm để thu nhỏ"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="text-center space-y-1.5">
                <p className="font-extrabold text-slate-800 text-sm">Quét mã VietQR</p>
                <p className="text-[10.5px] text-slate-400 font-semibold leading-normal">
                  Chụp màn hình hoặc dùng app ngân hàng quét trực tiếp. Bấm bên ngoài hoặc nút đóng để quay lại.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
