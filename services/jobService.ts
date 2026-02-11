
import { JobDTO, JobStatus, ApplicationDTO, ApplicationStatus, UserDTO } from '../types';

const JOBS_KEY = 'elcamejob_jobs';
const APPS_KEY = 'elcamejob_applications';

// Mock jobs initialization
const initDemoJobs = () => {
  const existing = localStorage.getItem(JOBS_KEY);
  if (!existing || JSON.parse(existing).length === 0) {
    const demoJobs: JobDTO[] = [
      {
        id: 'job_1',
        clienteId: 'user_juan_123',
        clienteNombre: 'Juan Pérez',
        titulo: 'Reparación de tubería baño principal',
        descripcion: 'Tengo una fuga persistente en el lavamanos del baño principal. Necesito a alguien con experiencia en fontanería para cambio de empaques y revisión general.',
        categoria: 'Reparaciones',
        presupuesto: 85000,
        ubicacion: 'Bogotá, Chapinero',
        estado: JobStatus.ABIERTO,
        fechaPublicacion: new Date(Date.now() - 86400000).toISOString() // Ayer
      },
      {
        id: 'job_2',
        clienteId: 'user_juan_123',
        clienteNombre: 'Juan Pérez',
        titulo: 'Instalación de 3 ventiladores de techo',
        descripcion: 'Compré 3 ventiladores nuevos y necesito instalarlos en las habitaciones. Requiere conocimiento básico de electricidad y herramientas propias.',
        categoria: 'Mecánica',
        presupuesto: 150000,
        ubicacion: 'Bogotá, Chapinero',
        estado: JobStatus.ABIERTO,
        fechaPublicacion: new Date(Date.now() - 172800000).toISOString() // Hace 2 días
      },
      {
        id: 'job_3',
        clienteId: 'user_maria_456',
        clienteNombre: 'María Rodríguez',
        titulo: 'Limpieza profunda apartamento 3 habitaciones',
        descripcion: 'Busco apoyo para limpieza general de fin de mes. Incluye vidrios, cocina y baños. Se proporcionan los materiales.',
        categoria: 'Limpieza',
        presupuesto: 70000,
        ubicacion: 'Bogotá, Kennedy',
        estado: JobStatus.ABIERTO,
        fechaPublicacion: new Date().toISOString()
      }
    ];
    localStorage.setItem(JOBS_KEY, JSON.stringify(demoJobs));

    // Demo applications
    const demoApps: ApplicationDTO[] = [
      {
        id: 'app_1',
        jobId: 'job_1',
        trabajadorId: 'worker_carlos_789',
        trabajadorNombre: 'Carlos Ruiz',
        mensaje: 'Soy fontanero con 10 años de experiencia. Puedo ir hoy mismo por la tarde.',
        estado: ApplicationStatus.PENDIENTE,
        fechaPostulacion: new Date().toISOString()
      }
    ];
    localStorage.setItem(APPS_KEY, JSON.stringify(demoApps));
  }
};

// Execute initialization
initDemoJobs();

export const getJobs = (): JobDTO[] => {
  const jobs = localStorage.getItem(JOBS_KEY);
  return jobs ? JSON.parse(jobs) : [];
};

export const createJob = async (jobData: Partial<JobDTO>, user: UserDTO): Promise<JobDTO> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  const jobs = getJobs();
  const newJob: JobDTO = {
    id: Math.random().toString(36).substr(2, 9),
    clienteId: user.id,
    clienteNombre: user.nombres,
    titulo: jobData.titulo || '',
    descripcion: jobData.descripcion || '',
    categoria: jobData.categoria || 'General',
    presupuesto: Number(jobData.presupuesto) || 0,
    ubicacion: jobData.ubicacion || 'Remoto',
    estado: JobStatus.ABIERTO,
    fechaPublicacion: new Date().toISOString()
  };
  jobs.unshift(newJob);
  localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
  return newJob;
};

export const applyToJob = async (jobId: string, user: UserDTO, mensaje: string): Promise<ApplicationDTO> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  const apps = getApplications();
  
  if (apps.find(a => a.jobId === jobId && a.trabajadorId === user.id)) {
    throw new Error('Ya te has postulado a este trabajo');
  }

  const newApp: ApplicationDTO = {
    id: Math.random().toString(36).substr(2, 9),
    jobId,
    trabajadorId: user.id,
    trabajadorNombre: user.nombres,
    mensaje,
    estado: ApplicationStatus.PENDIENTE,
    fechaPostulacion: new Date().toISOString()
  };
  
  apps.push(newApp);
  localStorage.setItem(APPS_KEY, JSON.stringify(apps));
  return newApp;
};

export const getApplications = (): ApplicationDTO[] => {
  const apps = localStorage.getItem(APPS_KEY);
  return apps ? JSON.parse(apps) : [];
};

export const getJobsByClient = (clientId: string): JobDTO[] => {
  return getJobs().filter(j => j.clienteId === clientId);
};

export const getApplicationsByJob = (jobId: string): ApplicationDTO[] => {
  return getApplications().filter(a => a.jobId === jobId);
};

export const getApplicationsByWorker = (workerId: string): (ApplicationDTO & { jobTitle: string })[] => {
  const apps = getApplications();
  const jobs = getJobs();
  return apps
    .filter(a => a.trabajadorId === workerId)
    .map(a => ({
      ...a,
      jobTitle: jobs.find(j => j.id === a.jobId)?.titulo || 'Trabajo no encontrado'
    }));
};

export const updateApplicationStatus = async (appId: string, status: ApplicationStatus): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  const apps = getApplications();
  const index = apps.findIndex(a => a.id === appId);
  if (index !== -1) {
    apps[index].estado = status;
    localStorage.setItem(APPS_KEY, JSON.stringify(apps));
  }
};
