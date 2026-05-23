import { 
  Zap, 
  Sparkles, 
  Chrome, 
  BookOpen, 
  Bot, 
  Brain, 
  Cpu, 
  Code, 
  Terminal, 
  MessageSquare, 
  Image, 
  Video, 
  Music, 
  Globe, 
  Rocket, 
  Award, 
  Shield, 
  Heart, 
  Flame, 
  Compass, 
  Layers, 
  Eye, 
  Settings, 
  Film 
} from 'lucide-react';

export interface PresetIcon {
  id: string;
  label: string;
  component: any;
  colorClass: string;
  bgClass: string;
}

export const PRESET_ICONS: PresetIcon[] = [
  { id: 'default', label: 'Mặc định (Tia sét)', component: Zap, colorClass: 'text-blue-500', bgClass: 'bg-blue-50' },
  { id: 'sparkles', label: 'Lấp lánh (Sparkles)', component: Sparkles, colorClass: 'text-amber-500', bgClass: 'bg-amber-50' },
  { id: 'chrome', label: 'Chrome / Web', component: Chrome, colorClass: 'text-sky-500', bgClass: 'bg-white ring-1 ring-slate-100 shadow-sm' },
  { id: 'book', label: 'Sách / Tài liệu', component: BookOpen, colorClass: 'text-white', bgClass: 'bg-blue-500' },
  { id: 'bot', label: 'AI / Trợ lý ảo', component: Bot, colorClass: 'text-indigo-600', bgClass: 'bg-indigo-50' },
  { id: 'brain', label: 'Phân tích / Trí tuệ', component: Brain, colorClass: 'text-purple-600', bgClass: 'bg-purple-50' },
  { id: 'cpu', label: 'Phần cứng / CPU', component: Cpu, colorClass: 'text-emerald-600', bgClass: 'bg-emerald-50' },
  { id: 'code', label: 'Trình duyệt code', component: Code, colorClass: 'text-blue-600', bgClass: 'bg-blue-100' },
  { id: 'terminal', label: 'Dòng lệnh (CLI)', component: Terminal, colorClass: 'text-slate-800', bgClass: 'bg-slate-100' },
  { id: 'message', label: 'Chat / Hỗ trợ', component: MessageSquare, colorClass: 'text-teal-600', bgClass: 'bg-teal-50' },
  { id: 'image', label: 'Hình ảnh / Graphics', component: Image, colorClass: 'text-pink-600', bgClass: 'bg-pink-50' },
  { id: 'video', label: 'Video / Phim ảnh', component: Video, colorClass: 'text-rose-600', bgClass: 'bg-rose-50' },
  { id: 'music', label: 'Âm nhạc / Âm thanh', component: Music, colorClass: 'text-violet-600', bgClass: 'bg-violet-50' },
  { id: 'globe', label: 'Toàn cầu / Website', component: Globe, colorClass: 'text-cyan-600', bgClass: 'bg-cyan-50' },
  { id: 'rocket', label: 'Tên lửa / Khởi nghiệp', component: Rocket, colorClass: 'text-orange-600', bgClass: 'bg-orange-50' },
  { id: 'award', label: 'Giải thưởng / Huy hiệu', component: Award, colorClass: 'text-yellow-600', bgClass: 'bg-yellow-50' },
  { id: 'shield', label: 'Bảo mật / Shield', component: Shield, colorClass: 'text-green-600', bgClass: 'bg-green-50' },
  { id: 'heart', label: 'Yêu thích / Sức khỏe', component: Heart, colorClass: 'text-red-500', bgClass: 'bg-red-50' },
  { id: 'flame', label: 'Xu hướng / Flame', component: Flame, colorClass: 'text-orange-500', bgClass: 'bg-orange-50' },
  { id: 'compass', label: 'Định vị / Khám phá', component: Compass, colorClass: 'text-teal-500', bgClass: 'bg-teal-50' },
  { id: 'layers', label: 'Phân lớp / Layers', component: Layers, colorClass: 'text-indigo-500', bgClass: 'bg-indigo-50' },
  { id: 'eye', label: 'Xem trước / Visual', component: Eye, colorClass: 'text-sky-600', bgClass: 'bg-sky-50' },
  { id: 'settings', label: 'Cấu hình / Cài đặt', component: Settings, colorClass: 'text-slate-600', bgClass: 'bg-slate-50' },
  { id: 'film', label: 'Điện ảnh / Quay phim', component: Film, colorClass: 'text-red-600', bgClass: 'bg-red-50' }
];

export const PRESET_ICONS_MAP: Record<string, any> = {
  default: Zap,
  sparkles: Sparkles,
  chrome: Chrome,
  'blue-image': Chrome, // Hỗ trợ dữ liệu cũ
  book: BookOpen,
  bot: Bot,
  brain: Brain,
  cpu: Cpu,
  code: Code,
  terminal: Terminal,
  message: MessageSquare,
  image: Image,
  video: Video,
  music: Music,
  globe: Globe,
  rocket: Rocket,
  award: Award,
  shield: Shield,
  heart: Heart,
  flame: Flame,
  compass: Compass,
  layers: Layers,
  eye: Eye,
  settings: Settings,
  film: Film,
};

export const getIconConfig = (id: string | undefined): PresetIcon => {
  const normalizedId = id === 'blue-image' ? 'chrome' : (id || 'default');
  const found = PRESET_ICONS.find(i => i.id === normalizedId);
  return found || PRESET_ICONS[0]; // defaults to Zap
};
