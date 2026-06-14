import { collection, getDocsFromServer, addDoc, updateDoc, deleteDoc, doc, query, orderBy, setDoc, getDocFromServer } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Project, ProfileInfo } from '../types';

const PROJECTS_COLLECTION = 'projects';
const PROFILE_DOC = 'profile/main';

const defaultProjects: Project[] = [
  {
    title: 'Smart TOC for ChatGPT, Gemini, Grok, Claude',
    description: 'Tạo mục lục thông minh, trích xuất dữ liệu nhanh chóng',
    link: 'https://chromewebstore.google.com/detail/ihijfkjfhhafbhmlipiafgkanfianoeo',
    badge: 'AI Assistant',
    icon: 'https://lh3.googleusercontent.com/ihijfkjfhhafbhmlipiafgkanfianoeo=s256',
    gradient: 'from-blue-400/30 to-purple-400/30',
    status: 'Cài đặt ngay',
    order: 0
  },
  {
    title: 'PROMPT CỦA TÔI',
    description: 'Hệ thống lưu trữ và quản lý câu lệnh AI cá nhân hiệu quả.',
    link: 'https://chromewebstore.google.com/detail/mkehmiaaknheoplginbpjkahboeiegll?utm_source=item-share-cb',
    badge: 'Library',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
    gradient: 'from-cyan-400/30 to-blue-400/30',
    status: 'Cài đặt ngay',
    order: 1
  },
  {
    title: 'AUTO COMMENT',
    description: 'Tự động hóa comment tương tác kênh youtube',
    link: 'https://chromewebstore.google.com/detail/mffldhjlfnadnieibcbmljpmlbngemcp?utm_source=item-share-cb',
    badge: 'Marketing',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo.svg',
    gradient: 'from-orange-400/30 to-red-400/30',
    status: 'Cài đặt ngay',
    order: 2
  },
  {
    title: 'MOHO SCRIPTS',
    description: 'Tập hợp các scripts tối ưu cho phần mềm diễn họa Moho Animation.',
    link: 'https://mohoscripts.com/scripts/list/author=congz',
    badge: 'Animation',
    icon: 'https://mohoscripts.com/common/img/logo_v2.png',
    iconBg: '#e31e24',
    gradient: 'from-sky-400/30 to-teal-400/30',
    status: 'Xem thư viện',
    order: 3
  },
  {
    title: 'MASTER FLOW',
    description: 'Tự động hóa tạo ảnh và video trên flow veo 3',
    link: 'https://chromewebstore.google.com/detail/liopnbejolglcjfpajdeihgiodfbdfpa?utm_source=item-share-cb',
    badge: 'Workflow',
    iconType: 'flow-veo',
    gradient: 'from-blue-500/30 to-indigo-500/30',
    status: 'Cài đặt ngay',
    order: 4
  },
  {
    title: 'RENAME IMAGE',
    description: 'Đổi tên ảnh hàng loạt chuyên nghiệp',
    link: 'https://congz9.github.io/Rename-Image1/',
    badge: 'Utilities',
    iconType: 'blue-image',
    gradient: 'from-sky-400/30 to-cyan-400/30',
    status: 'Truy cập ngay',
    order: 5
  },
  {
    title: 'RESEARCH LAB',
    description: 'Đang nghiên cứu và thử nghiệm các mô hình AI mới.',
    link: '#',
    badge: 'Lab',
    iconType: 'loading',
    gradient: 'from-slate-400/20 to-slate-500/20',
    status: 'Đang tải...',
    order: 6
  },
  {
    title: 'FUTURE TOOL AI',
    description: 'Giải pháp tự động hóa thế hệ mới đang được lên ý tưởng.',
    link: '#',
    badge: 'Concept',
    iconType: 'loading',
    gradient: 'from-slate-400/20 to-slate-500/20',
    status: 'Sắp tới',
    order: 7
  },
  {
    title: 'UPCOMING FEATURE',
    description: 'Hệ thống tích hợp đa nền tảng đang trong giai đoạn phát triển.',
    link: '#',
    badge: 'Early Access',
    iconType: 'loading',
    gradient: 'from-slate-400/20 to-slate-500/20',
    status: 'Sớm ra mắt',
    order: 8
  }
];

const defaultProfile: ProfileInfo = {
  name: 'CÔNGZ',
  brandName: 'AILABS',
  logo: 'https://lh3.googleusercontent.com/ihijfkjfhhafbhmlipiafgkanfianoeo=s256',
  email: 'giangcong1089@gmail.com',
  phone: '0388343855',
  facebook: 'https://www.facebook.com/GiangCong08',
  coffeeLink: '',
  momoNo: '0388343855',
  bankName: 'TCB', // Default Techcombank
  bankAccount: '0388343855',
  bankOwner: 'CONG GIANG',
  paypalLink: 'https://paypal.me/Congzg'
};

export const getProjects = async (): Promise<Project[]> => {
  if (!db) return defaultProjects;
  try {
    const q = query(collection(db, PROJECTS_COLLECTION), orderBy('order', 'asc'));
    const snapshot = await getDocsFromServer(q);
    
    if (snapshot.empty) {
      return defaultProjects;
    }
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
  } catch (e) {
    console.warn('Firestore offline or error, using default projects:', e);
    return defaultProjects;
  }
};

export const saveProject = async (project: Project) => {
  if (!db) return;
  try {
    // Sanitize data: remove undefined fields which Firestore doesn't like
    const { id, ...rest } = project;
    const sanitizedData = Object.fromEntries(
      Object.entries(rest).filter(([_, v]) => v !== undefined)
    );

    if (id) {
      await updateDoc(doc(db, PROJECTS_COLLECTION, id), sanitizedData);
    } else {
      await addDoc(collection(db, PROJECTS_COLLECTION), sanitizedData);
    }
  } catch (e) {
    handleFirestoreError(e, OperationType.WRITE, PROJECTS_COLLECTION);
  }
};

export const deleteProject = async (id: string) => {
  if (!db) return;
  try {
    await deleteDoc(doc(db, PROJECTS_COLLECTION, id));
  } catch (e) {
    handleFirestoreError(e, OperationType.DELETE, PROJECTS_COLLECTION + '/' + id);
  }
};

export const getProfile = async (): Promise<ProfileInfo> => {
  if (!db) return defaultProfile;
  try {
    const docSnap = await getDocFromServer(doc(db, PROFILE_DOC));
    if (docSnap.exists()) {
      return {
        ...defaultProfile,
        ...docSnap.data()
      } as ProfileInfo;
    }
    return defaultProfile;
  } catch (e) {
    console.warn('Firestore offline or error, using default profile:', e);
    return defaultProfile;
  }
};

export const seedDatabase = async () => {
  if (!db) return;
  try {
    const projectsSnap = await getDocsFromServer(collection(db, PROJECTS_COLLECTION));
    if (projectsSnap.empty) {
      console.log('Seeding initial projects...');
      for (const project of defaultProjects) {
        await addDoc(collection(db, PROJECTS_COLLECTION), project);
      }
    }

    const profileSnap = await getDocFromServer(doc(db, PROFILE_DOC));
    if (!profileSnap.exists()) {
      console.log('Seeding initial profile...');
      await setDoc(doc(db, PROFILE_DOC), defaultProfile);
    }
    return true;
  } catch (e) {
    console.error('Auto-seeding failed:', e);
    return false;
  }
};

export const updateProfile = async (profile: ProfileInfo) => {
  if (!db) return;
  try {
    const sanitizedData = Object.fromEntries(
      Object.entries(profile).filter(([_, v]) => v !== undefined)
    );
    await setDoc(doc(db, PROFILE_DOC), sanitizedData);
  } catch (e) {
    handleFirestoreError(e, OperationType.WRITE, PROFILE_DOC);
  }
};
