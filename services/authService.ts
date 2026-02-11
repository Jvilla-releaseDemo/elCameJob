
import { UserDTO, UserType } from '../types';

const STORAGE_KEY = 'elcamejob_users';
const SESSION_KEY = 'current_user';

// Mock database initialization with demo users
const initDemoUsers = () => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing || JSON.parse(existing).length === 0) {
    const demoUsers: UserDTO[] = [
      {
        id: 'user_juan_123',
        nombres: 'Juan Pérez',
        cedula: '12345678',
        email: 'juan@demo.com',
        password: '12345', // Contraseña para demo
        tipo: UserType.CLIENTE,
        telefono: '3001234567',
        direccion: 'Calle 123 #45-67, Bogotá',
        fechaRegistro: new Date().toISOString()
      },
      {
        id: 'user_maria_456',
        nombres: 'María Rodríguez',
        cedula: '87654321',
        email: 'maria@demo.com',
        password: '12345', // Contraseña para demo
        tipo: UserType.CLIENTE,
        telefono: '3109876543',
        direccion: 'Av. Siempre Viva 742',
        fechaRegistro: new Date().toISOString()
      },
      {
        id: 'worker_carlos_789',
        nombres: 'Carlos Ruiz',
        cedula: '11223344',
        email: 'carlos@demo.com',
        password: '12345', // Contraseña para demo
        tipo: UserType.TRABAJADOR,
        cargo: 'Electricista Certificado',
        departamento: 'Mantenimiento',
        fechaRegistro: new Date().toISOString()
      },
      {
        id: 'worker_ana_012',
        nombres: 'Ana Torres',
        cedula: '55667788',
        email: 'ana@demo.com',
        password: '12345', // Contraseña para demo
        tipo: UserType.TRABAJADOR,
        cargo: 'Servicios de Limpieza',
        departamento: 'Hogar',
        fechaRegistro: new Date().toISOString()
      }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoUsers));
  }
};

// Execute initialization
initDemoUsers();

const getUsers = (): UserDTO[] => {
  const users = localStorage.getItem(STORAGE_KEY);
  return users ? JSON.parse(users) : [];
};

const saveUser = (user: UserDTO) => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

export const register = async (userData: any): Promise<UserDTO> => {
  await new Promise(resolve => setTimeout(resolve, 800));

  const users = getUsers();
  if (users.find(u => u.email === userData.email)) {
    throw new Error('El correo electrónico ya está registrado');
  }

  const newUser: UserDTO = {
    id: Math.random().toString(36).substr(2, 9),
    nombres: userData.nombres,
    cedula: userData.cedula,
    email: userData.email,
    password: userData.password, // Guardamos la contraseña ingresada
    tipo: userData.tipo,
    direccion: userData.direccion,
    telefono: userData.telefono,
    cargo: userData.cargo,
    departamento: userData.departamento,
    fechaRegistro: new Date().toISOString()
  };

  saveUser(newUser);
  
  // No guardamos el password en la sesión por seguridad (mock)
  const { password, ...userSession } = newUser;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(userSession));
  return userSession as UserDTO;
};

export const login = async (email: string, passwordInput: string): Promise<UserDTO> => {
  await new Promise(resolve => setTimeout(resolve, 800));

  const users = getUsers();
  const user = users.find(u => u.email === email);

  // Validación real de la contraseña almacenada
  if (!user || user.password !== passwordInput) {
    throw new Error('Credenciales inválidas. Por favor verifica tu correo y contraseña.');
  }

  // Retornamos el usuario sin el campo password
  const { password, ...userSession } = user;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(userSession));
  return userSession as UserDTO;
};

export const getCurrentUser = (): UserDTO | null => {
  const user = sessionStorage.getItem(SESSION_KEY);
  return user ? JSON.parse(user) : null;
};

export const logout = () => {
  sessionStorage.removeItem(SESSION_KEY);
};
