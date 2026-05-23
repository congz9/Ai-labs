export interface Project {
  id?: string;
  title: string;
  description: string;
  link: string;
  badge: string;
  icon?: string;
  icons?: string[];
  iconType?: 'blue-image' | 'loading' | 'default' | 'flow-veo' | 'book';
  iconBg?: string;
  gradient: string;
  status: string;
  order: number;
}

export interface ProfileInfo {
  name: string;
  brandName: string;
  logo?: string;
  email: string;
  phone: string;
  facebook: string;
}
