import React, { useState, useRef } from 'react';
import { X, Plus, Save, Trash2, Image, Link, Type, Tag, Layout, Hash, Zap, BookOpen, Chrome, Upload } from 'lucide-react';
import { Project, ProfileInfo } from '../types';
import { saveProject, deleteProject, updateProfile } from '../services/projectService';
import { getDirectImageUrl, fileToBase64 } from '../lib/imageUtils';

interface AdminPanelProps {
  projects: Project[];
  profile: ProfileInfo;
  onRefresh: () => void;
  onClose: () => void;
}

export default function AdminPanel({ projects, profile, onRefresh, onClose }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'projects' | 'profile'>('projects');
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [editProfile, setEditProfile] = useState<ProfileInfo>(profile);
  const [isLoading, setIsLoading] = useState(false);
  const projectIconInputRef = useRef<HTMLInputElement>(null);
  const profileLogoInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'project' | 'profile') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const base64 = await fileToBase64(file);
      if (type === 'project' && editingProject) {
        setEditingProject({ ...editingProject, icon: base64, iconType: undefined });
      } else if (type === 'profile') {
        setEditProfile({ ...editProfile, logo: base64 });
      }
    } catch (error: any) {
      alert(error.message || 'Lỗi khi tải ảnh');
    } finally {
      // Reset input value so same file can be selected again
      e.target.value = '';
    }
  };

  const handleSaveProject = async () => {
    if (!editingProject?.title) return;
    setIsLoading(true);
    try {
      await saveProject({
        ...editingProject,
        order: editingProject.order ?? projects.length,
        gradient: editingProject.gradient ?? 'from-blue-400/30 to-purple-400/30',
      } as Project);
      setEditingProject(null);
      onRefresh();
    } catch (e: any) {
      console.error('Save failed:', e);
      let errorMsg = 'Lỗi khi lưu dự án';
      try {
        const parsed = JSON.parse(e.message);
        if (parsed.error) errorMsg += `: ${parsed.error}`;
      } catch {
        if (e.message) errorMsg += `: ${e.message}`;
      }
      alert(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa?')) return;
    setIsLoading(true);
    try {
      await deleteProject(id);
      onRefresh();
    } catch (e) {
      alert('Lỗi khi xóa dự án');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      await updateProfile(editProfile);
      onRefresh();
      alert('Đã cập nhật thông tin');
    } catch (e) {
      alert('Lỗi khi cập nhật profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-slate-800">Bảng điều khiển Admin</h2>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button 
                onClick={() => setActiveTab('projects')}
                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'projects' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Dự án
              </button>
              <button 
                onClick={() => setActiveTab('profile')}
                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'profile' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Cá nhân
              </button>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'projects' ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <p className="text-slate-500 text-sm">Quản lý các công cụ và dự án hiển thị trên hệ sinh thái.</p>
                <button 
                  onClick={() => setEditingProject({ title: '', description: '', link: '', badge: '', status: '', order: projects.length })}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                >
                  <Plus size={18} /> Thêm dự án
                </button>
              </div>

              {editingProject && (
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 animate-in fade-in slide-in-from-top-4">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    {editingProject.id ? 'Chỉnh sửa dự án' : 'Dự án mới'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400">Tiêu đề</label>
                      <input 
                        type="text" 
                        value={editingProject.title} 
                        onChange={e => setEditingProject({...editingProject, title: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
                        placeholder="Tên dự án..."
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400">Mô tả</label>
                      <textarea 
                        value={editingProject.description || ''} 
                        onChange={e => setEditingProject({...editingProject, description: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white h-24"
                        placeholder="Mô tả ngắn về công cụ..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400">Link</label>
                      <input 
                        type="text" 
                        value={editingProject.link} 
                        onChange={e => setEditingProject({...editingProject, link: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
                        placeholder="https://..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400">
                        Icon URL (Hỗ trợ Google Drive hoặc Tải lên)
                      </label>
                      <div className="flex gap-3">
                        <div className="flex-1 relative">
                          <input 
                            type="text" 
                            value={editingProject.icon || ''} 
                            onChange={e => setEditingProject({...editingProject, icon: e.target.value, iconType: undefined})}
                            className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
                            placeholder="Dán link hoặc tải lên..."
                          />
                          <button 
                            onClick={() => projectIconInputRef.current?.click()}
                            className="absolute right-2 top-1.5 p-2 bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors"
                            title="Tải ảnh lên"
                          >
                            <Upload size={18} />
                          </button>
                          <input 
                            type="file" 
                            ref={projectIconInputRef}
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'project')}
                          />
                        </div>
                        {editingProject.icon && (
                          <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm">
                            <img src={getDirectImageUrl(editingProject.icon)} className="w-full h-full object-cover" alt="Preview" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400">Icon Type (Mặc định nếu URL trống)</label>
                      <select 
                        value={editingProject.iconType || 'default'} 
                        onChange={e => setEditingProject({...editingProject, iconType: e.target.value as any, icon: e.target.value === 'default' ? editingProject.icon : ''})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
                      >
                        <option value="default">Mặc định (Icon Tia sét)</option>
                        <option value="loading">Đang tải (Spin animation)</option>
                        <option value="blue-image">Chrome/Blue Image</option>
                        <option value="flow-veo">Flow Veo (Zap + Text)</option>
                        <option value="book">Sách (Book Icon)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400">Thứ tự</label>
                      <input 
                        type="number" 
                        value={editingProject.order ?? projects.length} 
                        onChange={e => setEditingProject({...editingProject, order: parseInt(e.target.value)})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <button 
                      onClick={handleSaveProject}
                      disabled={isLoading}
                      className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
                    >
                      <Save size={18} /> Lưu thay đổi
                    </button>
                    <button 
                      onClick={() => setEditingProject(null)}
                      className="px-6 py-2.5 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-all"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3">
                {projects.map(p => (
                  <div key={p.id || p.title} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-200 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden">
                        {p.icon ? (
                          <img src={getDirectImageUrl(p.icon)} className="w-8 h-8 object-cover" />
                        ) : p.iconType === 'book' ? (
                          <div className="w-full h-full bg-blue-500 flex items-center justify-center">
                            <BookOpen size={20} className="text-white" />
                          </div>
                        ) : p.iconType === 'blue-image' ? (
                          <div className="w-full h-full bg-white flex items-center justify-center">
                            <Chrome size={20} className="text-blue-500 shadow-sm" />
                          </div>
                        ) : (
                          <Zap size={20} className="text-blue-500" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">{p.title}</h4>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">{p.badge}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setEditingProject(p)}
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                      >
                        <Type size={18} />
                      </button>
                      <button 
                        onClick={() => p.id && handleDeleteProject(p.id)}
                        className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6 max-w-2xl mx-auto">
              <h3 className="font-bold text-slate-800 mb-4">Thông tin cá nhân & Brand</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Tên hiển thị</label>
                  <input 
                    type="text" 
                    value={editProfile.name} 
                    onChange={e => setEditProfile({...editProfile, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Tên Thương hiệu</label>
                  <input 
                    type="text" 
                    value={editProfile.brandName} 
                    onChange={e => setEditProfile({...editProfile, brandName: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Email liên hệ</label>
                  <input 
                    type="email" 
                    value={editProfile.email} 
                    onChange={e => setEditProfile({...editProfile, email: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Số điện thoại</label>
                  <input 
                    type="text" 
                    value={editProfile.phone} 
                    onChange={e => setEditProfile({...editProfile, phone: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Logo (Link hoặc Tải lên)</label>
                  <div className="flex gap-4">
                    <div className="flex-1 relative">
                      <input 
                        type="text" 
                        value={editProfile.logo || ''} 
                        onChange={e => setEditProfile({...editProfile, logo: e.target.value})}
                        className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        placeholder="Dán link logo hoặc tải lên..."
                      />
                      <button 
                        onClick={() => profileLogoInputRef.current?.click()}
                        className="absolute right-2 top-1.5 p-2 bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors"
                        title="Tải ảnh lên"
                      >
                        <Upload size={18} />
                      </button>
                      <input 
                        type="file" 
                        ref={profileLogoInputRef}
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'profile')}
                      />
                    </div>
                    {editProfile.logo && (
                      <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center">
                        <img src={getDirectImageUrl(editProfile.logo)} className="w-full h-full object-contain" alt="Logo Preview" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Facebook URL</label>
                  <input 
                    type="text" 
                    value={editProfile.facebook} 
                    onChange={e => setEditProfile({...editProfile, facebook: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
              <button 
                onClick={handleSaveProfile}
                disabled={isLoading}
                className="mt-4 flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
              >
                <Save size={20} /> Lưu thông tin profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
