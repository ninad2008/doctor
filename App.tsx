/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Stethoscope, 
  Ear, 
  Wind, 
  Activity, 
  Calendar, 
  User, 
  Lock, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  LogOut,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Types
type AuthMode = 'none' | 'patient' | 'doctor';
type Appointment = {
  id: string;
  patientName: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  status: 'pending' | 'done';
  createdAt: number;
};

export default function App() {
  const [authMode, setAuthMode] = useState<AuthMode>('none');
  const [showAuthModal, setShowAuthModal] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Load appointments from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ent_appointments');
    if (saved) {
      setAppointments(JSON.parse(saved));
    }
  }, []);

  // Save appointments to localStorage
  const saveAppointments = (newApps: Appointment[]) => {
    setAppointments(newApps);
    localStorage.setItem('ent_appointments', JSON.stringify(newApps));
  };

  const handleLogout = () => {
    setAuthMode('none');
    setShowAuthModal(true);
  };

  const addAppointment = (app: Omit<Appointment, 'id' | 'status' | 'createdAt'>) => {
    const newApp: Appointment = {
      ...app,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      createdAt: Date.now(),
    };
    saveAppointments([...appointments, newApp]);
  };

  const markDone = (id: string) => {
    const updated = appointments.filter(app => app.id !== id);
    saveAppointments(updated);
  };

  return (
    <div className="min-h-screen font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 glass-morphism px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-medical-blue p-2 rounded-lg">
            <Stethoscope className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-medical-blue">ENT Specialist</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#services" className="text-sm font-medium hover:text-medical-blue transition-colors">Services</a>
          <a href="#about" className="text-sm font-medium hover:text-medical-blue transition-colors">About</a>
          <a href="#contact" className="text-sm font-medium hover:text-medical-blue transition-colors">Contact</a>
          {authMode !== 'none' && (
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
            >
              <LogOut size={16} /> Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-30 bg-white pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6 text-center">
              <a href="#services" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium">Services</a>
              <a href="#about" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium">About</a>
              <a href="#contact" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium">Contact</a>
              {authMode !== 'none' && (
                <button onClick={handleLogout} className="text-red-500 font-medium">Logout</button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {authMode === 'doctor' ? (
          <DoctorDashboard appointments={appointments} onMarkDone={markDone} />
        ) : (
          <>
            <HeroSection />
            <ServicesSection />
            <AboutSection />
            {authMode === 'patient' && (
              <BookingSection onBook={addAppointment} />
            )}
          </>
        )}
      </main>

      <Footer onStaffLogin={() => {
        setAuthMode('none');
        setShowAuthModal(true);
      }} />

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <AuthModal 
            onClose={() => setShowAuthModal(false)} 
            onAuth={(mode) => {
              setAuthMode(mode);
              setShowAuthModal(false);
            }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [frame, setFrame] = useState(1);
  const totalFrames = 160;

  // Frame-by-frame animation logic
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = 0;
    const fps = 24;
    const interval = 1000 / fps;

    const animate = (time: number) => {
      if (time - lastTime >= interval) {
        setFrame(prev => (prev % totalFrames) + 1);
        lastTime = time;
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Render frame to canvas (simulated since we don't have actual 160 images)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // In a real scenario, we would drawImage(preloadedImages[frame])
    // Here we simulate it with a nice placeholder and some dynamic overlays
    const img = new Image();
    img.src = `https://picsum.photos/seed/medical-clinic/1920/1080?blur=2`;
    img.referrerPolicy = 'no-referrer';
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Simulate "animation" with a pulsing medical scan effect
      ctx.strokeStyle = 'rgba(46, 134, 222, 0.3)';
      ctx.lineWidth = 2;
      const scanY = (frame / totalFrames) * canvas.height;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(canvas.width, scanY);
      ctx.stroke();
      
      ctx.fillStyle = 'rgba(46, 134, 222, 0.1)';
      ctx.fillRect(0, scanY - 20, canvas.width, 40);
    };
  }, [frame]);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 z-0">
        <canvas 
          ref={canvasRef} 
          id="heroFrame"
          width={1920} 
          height={1080}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-medical-light/50 via-transparent to-medical-light" />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-widest text-medical-blue uppercase bg-medical-blue/10 rounded-full">
            Excellence in ENT Care
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-medical-dark mb-6 leading-tight">
            Advanced Care for <br />
            <span className="text-medical-blue">Ear, Nose & Throat</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
            Dedicated to providing specialized medical solutions with cutting-edge technology 
            and a patient-centered approach. Your health is our priority.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#services" className="px-8 py-4 bg-medical-blue text-white rounded-xl font-semibold shadow-lg shadow-medical-blue/30 hover:bg-blue-600 transition-all transform hover:-translate-y-1">
              Our Services
            </a>
            <a href="#contact" className="px-8 py-4 bg-white text-medical-blue border border-medical-blue/20 rounded-xl font-semibold hover:bg-medical-light transition-all">
              Contact Us
            </a>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-medical-blue/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-1.5 bg-medical-blue rounded-full" />
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  const services = [
    {
      icon: <Ear className="w-8 h-8" />,
      title: "Audiology",
      desc: "Comprehensive hearing assessments, tinnitus management, and advanced hearing aid solutions."
    },
    {
      icon: <Wind className="w-8 h-8" />,
      title: "Sinus & Allergy",
      desc: "Expert treatment for chronic sinusitis, allergies, and nasal obstructions using minimally invasive techniques."
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: "Throat & Voice",
      desc: "Specialized care for voice disorders, swallowing difficulties, and tonsil-related issues."
    }
  ];

  return (
    <section id="services" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Specialized Services</h2>
          <p className="text-gray-500 max-w-xl mx-auto">We offer a wide range of ENT treatments tailored to your specific needs.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((s, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="p-8 rounded-2xl bg-medical-light border border-medical-blue/5 hover:shadow-xl transition-all"
            >
              <div className="w-16 h-16 bg-medical-blue/10 rounded-2xl flex items-center justify-center text-medical-blue mb-6">
                {s.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{s.title}</h3>
              <p className="text-gray-600 leading-relaxed mb-6">{s.desc}</p>
              <button className="text-medical-blue font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                Learn More <ChevronRight size={18} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="py-24 bg-medical-light">
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <img 
            src="https://picsum.photos/seed/doctor/800/1000" 
            alt="ENT Specialist" 
            className="rounded-3xl shadow-2xl"
            referrerPolicy="no-referrer"
          />
          <div className="absolute -bottom-8 -right-8 bg-white p-8 rounded-2xl shadow-xl hidden lg:block">
            <div className="flex items-center gap-4 mb-2">
              <div className="bg-green-100 text-green-600 p-2 rounded-full">
                <CheckCircle2 size={24} />
              </div>
              <span className="text-2xl font-bold">15+ Years</span>
            </div>
            <p className="text-gray-500 text-sm">Of Clinical Excellence</p>
          </div>
        </div>
        <div>
          <span className="text-medical-blue font-bold tracking-widest uppercase text-sm mb-4 block">About the Clinic</span>
          <h2 className="text-4xl font-bold mb-6 leading-tight">Leading the Way in <br />ENT Innovation</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Our clinic is equipped with the latest diagnostic and surgical technologies. 
            We believe in a holistic approach to ENT health, ensuring that every patient 
            receives personalized care that addresses the root cause of their symptoms.
          </p>
          <ul className="space-y-4 mb-10">
            {['Board Certified Specialists', 'State-of-the-art Diagnostics', 'Emergency ENT Services', 'Patient-First Philosophy'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 font-medium">
                <div className="w-5 h-5 bg-medical-blue/10 text-medical-blue rounded-full flex items-center justify-center">
                  <CheckCircle2 size={14} />
                </div>
                {item}
              </li>
            ))}
          </ul>
          <button className="px-8 py-4 bg-medical-dark text-white rounded-xl font-semibold hover:bg-black transition-all">
            Meet Our Doctors
          </button>
        </div>
      </div>
    </section>
  );
}

function BookingSection({ onBook }: { onBook: (app: any) => void }) {
  const [formData, setFormData] = useState({
    patientName: '',
    email: '',
    phone: '',
    service: 'Audiology',
    date: ''
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onBook(formData);
    setIsSuccess(true);
    setFormData({
      patientName: '',
      email: '',
      phone: '',
      service: 'Audiology',
      date: ''
    });
    setTimeout(() => setIsSuccess(false), 5000);
  };

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="bg-medical-blue rounded-3xl p-8 md:p-16 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Book an Appointment</h2>
              <p className="text-blue-100">Take the first step towards better ENT health today.</p>
            </div>

            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/20 backdrop-blur-md rounded-2xl p-12 text-center"
              >
                <div className="w-20 h-20 bg-white text-medical-blue rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Appointment Requested!</h3>
                <p className="text-blue-50">We'll contact you shortly to confirm your visit.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-blue-100">Full Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.patientName}
                    onChange={e => setFormData({...formData, patientName: e.target.value})}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 placeholder:text-blue-200/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-blue-100">Email Address</label>
                  <input 
                    required
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 placeholder:text-blue-200/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-blue-100">Phone Number</label>
                  <input 
                    required
                    type="tel" 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 placeholder:text-blue-200/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-blue-100">Service Needed</label>
                  <select 
                    value={formData.service}
                    onChange={e => setFormData({...formData, service: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
                  >
                    <option className="text-medical-dark">Audiology</option>
                    <option className="text-medical-dark">Sinus & Allergy</option>
                    <option className="text-medical-dark">Throat & Voice</option>
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-blue-100">Preferred Date</label>
                  <input 
                    required
                    type="date" 
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 text-white"
                  />
                </div>
                <button className="md:col-span-2 py-4 bg-white text-medical-blue rounded-xl font-bold text-lg hover:bg-blue-50 transition-all shadow-lg">
                  Confirm Booking
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function DoctorDashboard({ appointments, onMarkDone }: { appointments: Appointment[], onMarkDone: (id: string) => void }) {
  const pendingCount = appointments.filter(a => a.status === 'pending').length;

  return (
    <div className="pt-32 pb-24 px-6 container mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <h1 className="text-4xl font-bold mb-2">Staff Dashboard</h1>
          <p className="text-gray-500">Welcome back, Dr. Admin. Here are your pending appointments.</p>
        </div>
        <div className="bg-medical-blue p-6 rounded-2xl text-white shadow-lg shadow-medical-blue/20 flex items-center gap-6">
          <div className="bg-white/20 p-3 rounded-xl">
            <Calendar size={32} />
          </div>
          <div>
            <div className="text-3xl font-bold">{pendingCount}</div>
            <div className="text-sm text-blue-100 font-medium">Pending Appointments</div>
          </div>
        </div>
      </motion.div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-medical-light border-b border-gray-100">
              <tr>
                <th className="px-8 py-5 text-sm font-semibold text-gray-600">Patient</th>
                <th className="px-8 py-5 text-sm font-semibold text-gray-600">Service</th>
                <th className="px-8 py-5 text-sm font-semibold text-gray-600">Date</th>
                <th className="px-8 py-5 text-sm font-semibold text-gray-600">Contact</th>
                <th className="px-8 py-5 text-sm font-semibold text-gray-600 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-gray-400">
                    No appointments found.
                  </td>
                </tr>
              ) : (
                appointments.map((app) => (
                  <motion.tr 
                    key={app.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: 50 }}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="font-semibold text-medical-dark">{app.patientName}</div>
                      <div className="text-xs text-gray-400">ID: {app.id}</div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-medical-blue/10 text-medical-blue text-xs font-bold rounded-full uppercase">
                        {app.service}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-sm text-gray-600 font-medium">
                      {new Date(app.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-sm font-medium">{app.email}</div>
                      <div className="text-xs text-gray-400">{app.phone}</div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => onMarkDone(app.id)}
                        className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all group"
                        title="Mark as Done"
                      >
                        <CheckCircle2 size={20} className="group-active:scale-90 transition-transform" />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AuthModal({ onClose, onAuth }: { onClose: () => void, onAuth: (mode: AuthMode) => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Doctor Login Check
    if (email === 'admin' && password === '1234') {
      onAuth('doctor');
      return;
    }

    // Simple validation for patient
    if (email && password.length >= 4) {
      onAuth('patient');
    } else {
      setError('Please enter valid credentials (min 4 chars password)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-medical-dark/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="bg-medical-blue p-8 text-white text-center relative">
          <button onClick={onClose} className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
            <X size={24} />
          </button>
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-bold">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="text-blue-100 text-sm mt-1">Access our specialized ENT services</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  required
                  type="text" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-blue/20 focus:border-medical-blue transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  required
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-blue/20 focus:border-medical-blue transition-all"
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-xs font-medium">{error}</p>}

            <button className="w-full py-4 bg-medical-blue text-white rounded-xl font-bold shadow-lg shadow-medical-blue/20 hover:bg-blue-600 transition-all">
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-medium text-gray-500 hover:text-medical-blue transition-colors"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Footer({ onStaffLogin }: { onStaffLogin: () => void }) {
  return (
    <footer id="contact" className="bg-medical-dark text-white pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-medical-blue p-2 rounded-lg">
                <Stethoscope className="text-white w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-tight">ENT Specialist Clinic</span>
            </div>
            <p className="text-gray-400 max-w-sm mb-8">
              Providing world-class Ear, Nose, and Throat care with a focus on innovation 
              and patient comfort. Your health is our mission.
            </p>
            <div className="flex gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-medical-blue transition-colors cursor-pointer">
                  <Activity size={18} />
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-6">Contact Info</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-medical-blue shrink-0 mt-1" />
                <span>123 Medical Plaza, Health District, NY 10001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-medical-blue shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-medical-blue shrink-0" />
                <span>contact@entclinic.com</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Working Hours</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex justify-between">
                <span>Mon - Fri</span>
                <span className="text-white font-medium">9:00 - 18:00</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday</span>
                <span className="text-white font-medium">10:00 - 14:00</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span className="text-red-400 font-medium">Closed</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-10 border-t border-white/10 flex flex-col md:row justify-between items-center gap-6">
          <p className="text-gray-500 text-sm">© 2026 ENT Specialist Clinic. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-gray-500 hover:text-white">Privacy Policy</a>
            <a href="#" className="text-xs text-gray-500 hover:text-white">Terms of Service</a>
            <button 
              onClick={onStaffLogin}
              className="text-xs text-gray-700 hover:text-medical-blue transition-colors font-medium"
            >
              Staff Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
