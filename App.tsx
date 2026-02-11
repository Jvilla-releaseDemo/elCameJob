
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import { getCurrentUser, logout } from './services/authService';
import { 
  getJobs, 
  createJob, 
  applyToJob, 
  getJobsByClient, 
  getApplicationsByWorker, 
  getApplicationsByJob,
  updateApplicationStatus 
} from './services/jobService';
import { UserDTO, ToastMessage, UserType, JobDTO, JobStatus, ApplicationDTO, ApplicationStatus } from './types';
import { Toast } from './components/UI/Toast';
import { Logo } from './components/UI/Logo';
import { Button } from './components/UI/Button';
import { Input } from './components/UI/Input';

interface AuthContextType {
  user: UserDTO | null;
  setUser: (user: UserDTO | null) => void;
  addToast: (msg: string, type: ToastMessage['type']) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

// --- Internal components defined before Dashboard to avoid hoisting issues and typed as React.FC to fix JSX errors ---

// Fix for Error in file App.tsx: Proper typing for EmptyState
interface EmptyStateProps {
  title: string;
  subtitle: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, subtitle }) => (
  <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-gray-100">
    <div className="mb-6 flex justify-center"><Logo className="w-20 h-20 opacity-20" allowLaunch={false} /></div>
    <h3 className="text-xl font-black text-gray-400">{title}</h3>
    <p className="text-gray-300 mt-2 font-medium">{subtitle}</p>
  </div>
);

// Fix for Error in file App.tsx line 191: Type for JobCard with key support
interface JobCardProps {
  job: JobDTO;
  onApply: (jobId: string) => void;
  userType?: UserType;
}

const JobCard: React.FC<JobCardProps> = ({ job, onApply, userType }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col md:flex-row items-center justify-between gap-8 group">
    <div className="flex-1">
      <div className="flex items-center gap-3 mb-3">
        <span className="px-4 py-1.5 bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-widest rounded-full">{job.categoria}</span>
        <span className="text-gray-300 text-xs font-bold">• {new Date(job.fechaPublicacion).toLocaleDateString()}</span>
      </div>
      <h3 className="text-2xl font-black text-gray-900 group-hover:text-primary transition-colors">{job.titulo}</h3>
      <p className="text-gray-500 mt-3 font-medium line-clamp-2">{job.descripcion}</p>
      <div className="flex items-center gap-6 mt-6">
        <div className="flex items-center gap-2 text-success font-black">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          ${job.presupuesto.toLocaleString()}
        </div>
        <div className="flex items-center gap-2 text-gray-400 font-bold text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          {job.ubicacion}
        </div>
      </div>
    </div>
    {userType === UserType.TRABAJADOR && (
      <Button onClick={() => onApply(job.id)} variant="outline" className="md:w-48 shadow-lg shadow-primary/5">Postularme</Button>
    )}
  </div>
);

// Fix for Error in file App.tsx line 199: Type for ClientJobCard
interface ClientJobCardProps {
  job: JobDTO;
  onViewApplicants: (job: JobDTO) => void;
}

const ClientJobCard: React.FC<ClientJobCardProps> = ({ job, onViewApplicants }) => {
  const applicantCount = getApplicationsByJob(job.id).length;
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
      <div className="flex-1">
        <h3 className="text-2xl font-black text-gray-900">{job.titulo}</h3>
        <p className="text-gray-400 font-bold mt-2">Estado: <span className="text-primary">{job.estado}</span></p>
      </div>
      <div className="flex items-center gap-4">
        <div className="bg-gray-50 px-6 py-3 rounded-2xl text-center">
          <span className="block text-[10px] font-black text-gray-400 uppercase">Postulantes</span>
          <span className="text-xl font-black text-gray-900">{applicantCount}</span>
        </div>
        <Button onClick={() => onViewApplicants(job)} variant="outline">Ver Detalle</Button>
      </div>
    </div>
  );
};

// Fix for Error in file App.tsx line 207: Type for WorkerAppCard
interface WorkerAppCardProps {
  app: ApplicationDTO & { jobTitle: string };
}

const WorkerAppCard: React.FC<WorkerAppCardProps> = ({ app }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
    <div className="flex-1">
      <h3 className="text-xl font-black text-gray-900">{app.jobTitle}</h3>
      <p className="text-gray-400 text-sm font-bold mt-1">Postulado el: {new Date(app.fechaPostulacion).toLocaleDateString()}</p>
    </div>
    <div className={`px-6 py-3 rounded-2xl font-black text-sm uppercase ${app.estado === ApplicationStatus.PENDIENTE ? 'bg-yellow-50 text-yellow-600' : app.estado === ApplicationStatus.ACEPTADA ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
      {app.estado}
    </div>
  </div>
);

// Fix for Error in file App.tsx lines 222, 245: Type for Modal with children
interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
    <div className="bg-white w-full max-w-xl rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
      <button onClick={onClose} className="absolute top-8 right-8 text-gray-400 hover:text-primary transition-colors"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg></button>
      <h2 className="text-3xl font-black text-gray-900 mb-6">{title}</h2>
      <div className="max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">{children}</div>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const { user, setUser, addToast } = useAuth();
  const [activeTab, setActiveTab] = useState<'explorar' | 'mis-cosas' | 'mensajes'>('explorar');
  const [isLaunching, setIsLaunching] = useState(false);
  const [jobs, setJobs] = useState<JobDTO[]>([]);
  const [myApps, setMyApps] = useState<(ApplicationDTO & { jobTitle: string })[]>([]);
  const [selectedJobApps, setSelectedJobApps] = useState<{job: JobDTO, apps: ApplicationDTO[]} | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newJobData, setNewJobData] = useState({ titulo: '', descripcion: '', presupuesto: '', categoria: 'Reparaciones', ubicacion: 'Bogotá' });
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    refreshData();
  }, [activeTab, user]);

  const refreshData = () => {
    if (!user) return;
    if (activeTab === 'explorar') {
      setJobs(getJobs().filter(j => j.estado === JobStatus.ABIERTO));
    } else if (activeTab === 'mis-cosas') {
      if (user.tipo === UserType.CLIENTE) {
        setJobs(getJobsByClient(user.id));
      } else {
        setMyApps(getApplicationsByWorker(user.id));
      }
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    addToast("Has salido de la plataforma", "info");
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      await createJob(newJobData as any, user);
      addToast("¡Trabajo publicado con éxito!", "success");
      setShowCreateModal(false);
      setNewJobData({ titulo: '', descripcion: '', presupuesto: '', categoria: 'Reparaciones', ubicacion: 'Bogotá' });
      refreshData();
    } catch (err: any) {
      addToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId: string) => {
    if (!user) return;
    try {
      await applyToJob(jobId, user, "Hola, tengo experiencia en este tipo de trabajos y disponibilidad inmediata.");
      addToast("Postulación enviada correctamente", "success");
      refreshData();
    } catch (err: any) {
      addToast(err.message, "warning");
    }
  };

  const handleViewApplicants = (job: JobDTO) => {
    const apps = getApplicationsByJob(job.id);
    setSelectedJobApps({ job, apps });
  };

  const handleUpdateAppStatus = async (appId: string, status: ApplicationStatus) => {
    try {
      await updateApplicationStatus(appId, status);
      addToast(`Postulación ${status.toLowerCase()}`, "info");
      if (selectedJobApps) {
        const updatedApps = getApplicationsByJob(selectedJobApps.job.id);
        setSelectedJobApps({ ...selectedJobApps, apps: updatedApps });
      }
    } catch (err: any) {
      addToast("Error al actualizar estado", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFF] flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden md:flex w-72 bg-white border-r border-gray-100 flex-col p-8 shadow-[10px_0_30px_rgba(0,0,0,0.02)] z-20">
        <div className="flex items-center gap-4 mb-14">
          <Logo className="w-12 h-12" onLaunchStateChange={setIsLaunching} />
          <div className={`flex flex-col transition-all duration-300 ${isLaunching ? 'animate-vibrate-text' : ''}`}>
            <span className="font-black text-2xl tracking-tighter text-gray-900 leading-none">elCameJob</span>
            <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-primary mt-1">SENA ADSO MVP</span>
          </div>
        </div>
        
        <nav className="flex-1 space-y-3">
          <button 
            onClick={() => setActiveTab('explorar')}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all duration-300 ${activeTab === 'explorar' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50 hover:text-primary'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            Explorar
          </button>
          <button 
            onClick={() => setActiveTab('mis-cosas')}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all duration-300 ${activeTab === 'mis-cosas' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50 hover:text-primary'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
            {user?.tipo === UserType.CLIENTE ? 'Mis Publicaciones' : 'Mis Postulaciones'}
          </button>
          <button 
            onClick={() => setActiveTab('mensajes')}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all duration-300 ${activeTab === 'mensajes' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50 hover:text-primary'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
            Mensajes
          </button>
        </nav>

        <button onClick={handleLogout} className="mt-auto flex items-center gap-4 px-6 py-4 rounded-2xl text-error font-black hover:bg-error/5 transition-all group">
          <div className="w-10 h-10 bg-error/10 rounded-xl flex items-center justify-center group-hover:bg-error group-hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          </div>
          Cerrar Sesión
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-6 md:p-12 overflow-y-auto relative custom-scrollbar">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[120px] -z-10"></div>
        
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-14">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
              {activeTab === 'explorar' ? 'Oportunidades de hoy' : activeTab === 'mis-cosas' ? (user?.tipo === UserType.CLIENTE ? 'Tus publicaciones' : 'Tus candidaturas') : 'Bandeja de mensajes'}
            </h1>
            <p className="text-gray-400 font-bold mt-2">¡Hola, {user?.nombres.split(' ')[0]}! Tienes el control total.</p>
          </div>
          
          <div className="flex items-center gap-4">
            {user?.tipo === UserType.CLIENTE && activeTab === 'mis-cosas' && (
              <Button onClick={() => setShowCreateModal(true)} variant="primary" className="shadow-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
                Publicar Nuevo
              </Button>
            )}
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-100 font-black text-primary text-xl">
              {user?.nombres.charAt(0)}
            </div>
          </div>
        </header>

        {/* Dynamic Content based on activeTab */}
        <div className="grid grid-cols-1 gap-6">
          {activeTab === 'explorar' && (
            jobs.length === 0 ? (
              <EmptyState title="No hay empleos disponibles" subtitle="Vuelve más tarde para ver nuevas oportunidades." />
            ) : (
              jobs.map(job => <JobCard key={job.id} job={job} onApply={handleApply} userType={user?.tipo} />)
            )
          )}

          {activeTab === 'mis-cosas' && user?.tipo === UserType.CLIENTE && (
            jobs.length === 0 ? (
              <EmptyState title="Aún no has publicado nada" subtitle="Publica tu primera necesidad para encontrar expertos." />
            ) : (
              jobs.map(job => <ClientJobCard key={job.id} job={job} onViewApplicants={handleViewApplicants} />)
            )
          )}

          {activeTab === 'mis-cosas' && user?.tipo === UserType.TRABAJADOR && (
            myApps.length === 0 ? (
              <EmptyState title="No te has postulado a nada" subtitle="Explora la pestaña 'Explorar' para encontrar trabajo." />
            ) : (
              myApps.map(app => <WorkerAppCard key={app.id} app={app} />)
            )
          )}

          {activeTab === 'mensajes' && (
            <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-gray-100">
               <div className="text-6xl mb-6">💬</div>
               <h3 className="text-2xl font-black text-gray-400">Sistema de mensajería próximamente</h3>
               <p className="text-gray-300 mt-2">Estamos trabajando para que puedas chatear directamente con clientes y trabajadores.</p>
            </div>
          )}
        </div>

        {/* Modals */}
        {showCreateModal && (
          <Modal title="Publicar Trabajo" onClose={() => setShowCreateModal(false)}>
            <form onSubmit={handleCreateJob} className="space-y-6">
              <Input label="Título de la necesidad" value={newJobData.titulo} onChange={(e) => setNewJobData({...newJobData, titulo: e.target.value})} placeholder="Ej: Reparación de tubería baño" required />
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-textPrimary">Categoría</label>
                  <select className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-secondary transition-all" value={newJobData.categoria} onChange={(e) => setNewJobData({...newJobData, categoria: e.target.value})}>
                    <option>Reparaciones</option><option>Limpieza</option><option>Mensajería</option><option>Construcción</option><option>Mecánica</option>
                  </select>
                </div>
                <Input label="Ubicación" value={newJobData.ubicacion} onChange={(e) => setNewJobData({...newJobData, ubicacion: e.target.value})} placeholder="Bogotá, Kennedy" required />
              </div>
              <Input label="Presupuesto aproximado ($)" type="number" value={newJobData.presupuesto} onChange={(e) => setNewJobData({...newJobData, presupuesto: e.target.value})} placeholder="50000" required />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-textPrimary">Descripción detallada</label>
                <textarea className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-secondary transition-all min-h-[120px]" value={newJobData.descripcion} onChange={(e) => setNewJobData({...newJobData, descripcion: e.target.value})} placeholder="Cuéntanos más sobre el trabajo..." required />
              </div>
              <Button type="submit" fullWidth loading={loading}>Publicar ahora 🚀</Button>
            </form>
          </Modal>
        )}

        {selectedJobApps && (
          <Modal title={`Postulantes para: ${selectedJobApps.job.titulo}`} onClose={() => setSelectedJobApps(null)}>
            <div className="space-y-4">
              {selectedJobApps.apps.length === 0 ? (
                <p className="text-center py-10 text-gray-400 font-bold">Aún no hay postulantes para este trabajo.</p>
              ) : (
                selectedJobApps.apps.map(app => (
                  <div key={app.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                      <h4 className="font-black text-gray-900 text-lg">{app.trabajadorNombre}</h4>
                      <p className="text-gray-500 text-sm italic">"{app.mensaje}"</p>
                      <span className={`inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-black uppercase ${app.estado === ApplicationStatus.PENDIENTE ? 'bg-yellow-100 text-yellow-600' : app.estado === ApplicationStatus.ACEPTADA ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                        {app.estado}
                      </span>
                    </div>
                    {app.estado === ApplicationStatus.PENDIENTE && (
                      <div className="flex gap-2">
                        <Button onClick={() => handleUpdateAppStatus(app.id, ApplicationStatus.ACEPTADA)} variant="primary" className="!px-4 !py-2 !text-xs">Aceptar</Button>
                        <Button onClick={() => handleUpdateAppStatus(app.id, ApplicationStatus.RECHAZADA)} variant="outline" className="!px-4 !py-2 !text-xs !text-error !border-error/20">Rechazar</Button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </Modal>
        )}
      </main>

      <style>{`
        @keyframes vibrate-text {
          0% { transform: translate(0); }
          25% { transform: translate(-1px, 1px); }
          50% { transform: translate(1px, -1px); }
          75% { transform: translate(-1px, -1px); }
          100% { transform: translate(0); }
        }
        .animate-vibrate-text { animation: vibrate-text 0.1s linear infinite; }
      `}</style>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = getCurrentUser();
    if (savedUser) setUser(savedUser);
    setLoading(false);
  }, []);

  const addToast = (message: string, type: ToastMessage['type']) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFDFF]">
      <div className="flex flex-col items-center gap-10">
        <Logo className="w-32 h-32" allowLaunch={false} />
        <p className="text-gray-300 font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">Cargando Sistema</p>
      </div>
    </div>
  );

  return (
    <AuthContext.Provider value={{ user, setUser, addToast }}>
      <HashRouter>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/registro" element={user ? <Navigate to="/dashboard" /> : <Register />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </HashRouter>

      <div className="fixed bottom-10 right-10 z-[150] flex flex-col gap-4 pointer-events-none">
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} onClose={removeToast} />
        ))}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(133, 56, 199, 0.1); border-radius: 20px; }
      `}</style>
    </AuthContext.Provider>
  );
};

export default App;
