import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse

from .database import engine, Base, DATABASE_TYPE
from .routers import auth, issues, tasks, admin

# Create tables
if DATABASE_TYPE != "mongodb":
    Base.metadata.create_all(bind=engine)

app = FastAPI(title="WeResolve API", version="1.0.0")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://weresolve.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure local static directory for uploads exists and mount it
static_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "static")
uploads_dir = os.path.join(static_dir, "uploads")
os.makedirs(uploads_dir, exist_ok=True)

app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

# Include Routers
app.include_router(auth.router, prefix="/api")
app.include_router(issues.router, prefix="/api")
app.include_router(tasks.router, prefix="/api")
app.include_router(admin.router, prefix="/api")

@app.get("/", response_class=HTMLResponse)
def home():
    return """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>WeResolve - Gateway Portal</title>
        <!-- Tailwind CSS CDN -->
        <script src="https://cdn.tailwindcss.com"></script>
        <!-- Inter Font -->
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&display=swap" rel="stylesheet">
        <style>
            body {
                font-family: 'Inter', sans-serif;
            }
            .glass {
                background: rgba(17, 24, 39, 0.8);
                backdrop-filter: blur(16px);
                -webkit-backdrop-filter: blur(16px);
            }
        </style>
    </head>
    <body class="bg-[#0b0f19] text-slate-100 min-h-screen flex flex-col justify-between relative overflow-x-hidden">
        
        <!-- Decorative blurred glow -->
        <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <!-- Header -->
        <header class="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between z-10">
            <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-500/30">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </div>
                <div class="leading-tight">
                    <h1 class="text-xl font-black text-white leading-none tracking-tight">WeResolve</h1>
                    <p class="text-[10px] text-indigo-400 font-bold uppercase tracking-wider mt-1">Civic Ecosystem</p>
                </div>
            </div>
            <div class="text-xs text-slate-500 font-bold">GATEWAY STATUS: <span class="text-green-500">ONLINE</span></div>
        </header>

        <!-- Main Form Container -->
        <main class="max-w-md mx-auto w-full px-6 py-12 flex-1 flex flex-col justify-center z-10">
            
            <div class="glass border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                <!-- Top Accent Line -->
                <div id="accent-line" class="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent transition-all duration-300"></div>

                <!-- Brand/Header -->
                <div class="text-center mb-6">
                    <span class="text-[10px] text-slate-500 font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/50">
                        Gateway Access
                    </span>
                    <div id="role-badge" class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-500/10 mt-4 mb-4 transition-all duration-300">
                        <span id="role-emoji" class="text-2xl">📣</span>
                    </div>
                    <h2 class="text-2xl font-black text-white tracking-tight leading-none">
                        WeResolve Portal
                    </h2>
                    <p id="portal-subtitle" class="mt-2 text-xs text-slate-400 font-semibold leading-relaxed">
                        Single sign-on access to municipal systems
                    </p>
                </div>

                <!-- Role Tab Buttons -->
                <div id="role-tabs" class="bg-[#1f2937]/60 p-1.5 rounded-2xl border border-slate-800/80 flex gap-1 mb-6">
                    <button type="button" onclick="selectRole('citizen')" id="tab-citizen" class="flex-1 py-2 rounded-xl text-xs font-black tracking-wide transition-all duration-300 flex items-center justify-center gap-1.5 bg-indigo-600 text-white shadow-lg shadow-indigo-500/15">
                        📣 Citizen
                    </button>
                    <button type="button" onclick="selectRole('solver')" id="tab-solver" class="flex-1 py-2 rounded-xl text-xs font-black tracking-wide transition-all duration-300 flex items-center justify-center gap-1.5 text-slate-400 hover:text-slate-200">
                        🛠️ Solver
                    </button>
                    <button type="button" onclick="selectRole('admin')" id="tab-admin" class="flex-1 py-2 rounded-xl text-xs font-black tracking-wide transition-all duration-300 flex items-center justify-center gap-1.5 text-slate-400 hover:text-slate-200">
                        🏛️ Admin
                    </button>
                </div>

                <!-- Error Alert Box -->
                <div id="error-alert" class="hidden bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex gap-3 text-xs text-red-400 font-bold mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span id="error-message">Error message</span>
                </div>

                <!-- Form -->
                <form id="login-form" onsubmit="handleFormSubmit(event)" class="space-y-5">
                    
                    <!-- Full Name (Hidden in Login Mode) -->
                    <div id="name-field-container" class="hidden">
                        <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
                            Full Name
                        </label>
                        <div class="relative flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3.5 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <input type="text" id="full-name-input" placeholder="Arjun Kumar" class="w-full pl-10 pr-4 py-3 bg-[#1f2937]/60 border border-slate-800 rounded-xl text-sm font-semibold text-white outline-none transition-all duration-300 focus:border-indigo-600 focus:ring-indigo-600/20" />
                        </div>
                    </div>

                    <!-- Email Input -->
                    <div>
                        <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
                            Email Address
                        </label>
                        <div class="relative flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3.5 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <input type="email" id="email-input" required placeholder="citizen@weresolve.org" class="w-full pl-10 pr-4 py-3 bg-[#1f2937]/60 border border-slate-800 rounded-xl text-sm font-semibold text-white outline-none transition-all duration-300 focus:border-indigo-600 focus:ring-indigo-600/20" />
                        </div>
                    </div>

                    <!-- Password Input -->
                    <div>
                        <label class="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
                            Password
                        </label>
                        <div class="relative flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3.5 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <input type="password" id="password-input" required placeholder="••••••••" class="w-full pl-10 pr-4 py-3 bg-[#1f2937]/60 border border-slate-800 rounded-xl text-sm font-semibold text-white outline-none transition-all duration-300 focus:border-indigo-600 focus:ring-indigo-600/20" />
                        </div>
                    </div>

                    <!-- Autocomplete seeds helper -->
                    <div id="seed-helper" class="bg-[#1f2937]/30 border border-slate-800/80 rounded-2xl p-4 text-[11px] text-slate-400 leading-normal transition-all duration-300">
                        <div class="flex justify-between items-center mb-1">
                            <span class="font-bold text-slate-300">💡 Quick Seed Autocomplete:</span>
                        </div>
                        <p class="mt-1 flex flex-wrap gap-1.5 items-center">
                            Fill as: 
                            <button type="button" onclick="quickFill('citizen')" class="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-extrabold border border-indigo-500/20 hover:bg-indigo-500/20 transition">Citizen</button>
                            <button type="button" onclick="quickFill('solver')" class="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 font-extrabold border border-purple-500/20 hover:bg-purple-500/20 transition">Solver</button>
                            <button type="button" onclick="quickFill('admin')" class="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-extrabold border border-blue-500/20 hover:bg-blue-500/20 transition">Admin</button>
                        </p>
                    </div>

                    <button type="submit" id="submit-button" class="w-full py-3.5 text-white rounded-xl font-bold transition duration-300 text-sm flex items-center justify-center gap-2 shadow-lg bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20">
                        Sign In as Citizen
                    </button>
                </form>

                <!-- Signup Toggle -->
                <div id="signup-toggle-container" class="text-center pt-4 border-t border-slate-800/80 mt-5">
                    <button type="button" onclick="toggleAuthMode()" id="signup-toggle-btn" class="text-xs font-bold hover:underline text-indigo-400">
                        Don't have an account? Sign Up
                    </button>
                </div>
            </div>

        </main>

        <!-- Footer -->
        <footer class="max-w-7xl mx-auto w-full px-6 py-6 text-center border-t border-slate-900 mt-12 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            &copy; 2026 WeResolve Civic Solutions. All rights reserved.
        </footer>

        <script>
            let currentRole = 'citizen';
            let isLoginMode = true;

            const seedInfo = {
                admin: {
                    email: 'admin@weresolve.gov',
                    pass: 'admin123',
                    emoji: '🏛️',
                    label: 'Admin',
                    port: '5173',
                    accentColorClass: 'indigo-600',
                    accentBgClass: 'bg-blue-600',
                    accentShadowClass: 'shadow-blue-500/20',
                    btnClass: 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20',
                    borderClass: 'focus:border-blue-600 focus:ring-blue-600/20',
                    textClass: 'text-blue-400'
                },
                citizen: {
                    email: 'citizen@weresolve.org',
                    pass: 'citizen123',
                    emoji: '📣',
                    label: 'Citizen',
                    port: '5174',
                    accentColorClass: 'indigo-600',
                    accentBgClass: 'bg-indigo-600',
                    accentShadowClass: 'shadow-indigo-500/20',
                    btnClass: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20',
                    borderClass: 'focus:border-indigo-600 focus:ring-indigo-600/20',
                    textClass: 'text-indigo-400'
                },
                solver: {
                    email: 'arjun@weresolve.org',
                    pass: 'solver123',
                    emoji: '🛠️',
                    label: 'Solver',
                    port: '5175',
                    accentColorClass: 'purple-600',
                    accentBgClass: 'bg-purple-600',
                    accentShadowClass: 'shadow-purple-500/20',
                    btnClass: 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/20',
                    borderClass: 'focus:border-purple-600 focus:ring-purple-600/20',
                    textClass: 'text-purple-400'
                }
            };

            function selectRole(role) {
                currentRole = role;
                setError('');
                updateUI();
            }

            function quickFill(role) {
                selectRole(role);
                document.getElementById('email-input').value = seedInfo[role].email;
                document.getElementById('password-input').value = seedInfo[role].pass;
            }

            function toggleAuthMode() {
                isLoginMode = !isLoginMode;
                setError('');
                updateUI();
            }

            function setError(msg) {
                const alertDiv = document.getElementById('error-alert');
                const msgSpan = document.getElementById('error-message');
                if (msg) {
                    msgSpan.textContent = msg;
                    alertDiv.classList.remove('hidden');
                } else {
                    alertDiv.classList.add('hidden');
                }
            }

            function updateUI() {
                const info = seedInfo[currentRole];
                
                // Update badge and tabs selection styling
                document.getElementById('role-emoji').textContent = info.emoji;
                
                const tabs = ['citizen', 'solver', 'admin'];
                tabs.forEach(role => {
                    const tabBtn = document.getElementById(`tab-${role}`);
                    if (role === currentRole) {
                        tabBtn.className = `flex-1 py-2 rounded-xl text-xs font-black tracking-wide transition-all duration-300 flex items-center justify-center gap-1.5 ${info.accentBgClass} text-white shadow-lg ${info.accentShadowClass}`;
                    } else {
                        tabBtn.className = "flex-1 py-2 rounded-xl text-xs font-black tracking-wide transition-all duration-300 flex items-center justify-center gap-1.5 text-slate-400 hover:text-slate-200";
                    }
                });

                // Update accent border glow and buttons colors
                const line = document.getElementById('accent-line');
                line.className = `absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-${currentRole === 'citizen' ? 'indigo-500' : currentRole === 'solver' ? 'via-purple-500' : 'via-blue-500'} to-transparent transition-all duration-300`;
                
                const badge = document.getElementById('role-badge');
                badge.className = `mx-auto flex h-14 w-14 items-center justify-center rounded-2xl shadow-xl mt-4 mb-4 transition-all duration-300 ${info.accentBgClass} ${info.accentShadowClass}`;

                // Autocomplete placeholder
                document.getElementById('email-input').placeholder = info.email;

                // Full Name input container (hidden if logging in)
                const nameContainer = document.getElementById('name-field-container');
                const fullNameInput = document.getElementById('full-name-input');
                if (!isLoginMode) {
                    nameContainer.classList.remove('hidden');
                    fullNameInput.required = true;
                } else {
                    nameContainer.classList.add('hidden');
                    fullNameInput.required = false;
                }

                // Inputs border classes
                const inputs = [
                    document.getElementById('full-name-input'),
                    document.getElementById('email-input'),
                    document.getElementById('password-input')
                ];
                inputs.forEach(input => {
                    // Reset class then add the correct focus style
                    input.className = `w-full pl-10 pr-4 py-3 bg-[#1f2937]/60 border border-slate-800 rounded-xl text-sm font-semibold text-white outline-none transition-all duration-300 ${info.borderClass}`;
                });

                // Submit button text & styling
                const submitBtn = document.getElementById('submit-button');
                submitBtn.className = `w-full py-3.5 text-white rounded-xl font-bold transition duration-300 text-sm flex items-center justify-center gap-2 shadow-lg ${info.btnClass}`;
                
                if (isLoginMode) {
                    submitBtn.textContent = `Sign In as ${info.label}`;
                } else {
                    submitBtn.textContent = `Create ${info.label} Account`;
                }

                // Signup toggle
                const toggleContainer = document.getElementById('signup-toggle-container');
                const toggleBtn = document.getElementById('signup-toggle-btn');
                toggleBtn.className = `text-xs font-bold hover:underline ${info.textClass}`;
                if (currentRole === 'admin') {
                    toggleContainer.classList.add('hidden');
                } else {
                    toggleContainer.classList.remove('hidden');
                    if (isLoginMode) {
                        toggleBtn.textContent = "Don't have an account? Sign Up";
                    } else {
                        toggleBtn.textContent = "Already have an account? Sign In";
                    }
                }
            }

            async function handleFormSubmit(e) {
                e.preventDefault();
                setError('');
                
                const email = document.getElementById('email-input').value;
                const password = document.getElementById('password-input').value;
                const fullName = document.getElementById('full-name-input').value;
                
                const submitBtn = document.getElementById('submit-button');
                submitBtn.disabled = true;
                const originalText = submitBtn.textContent;
                submitBtn.textContent = "Processing...";

                try {
                    let token = '';
                    let userRole = currentRole;

                    if (isLoginMode) {
                        // Log In
                        const response = await fetch('/api/auth/login', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email, password })
                        });
                        
                        if (!response.ok) {
                            const errJson = await response.json();
                            throw new Error(errJson.detail || 'Authentication failed');
                        }
                        
                        const data = await response.json();
                        token = data.access_token;
                        userRole = data.user.role;
                    } else {
                        // Sign Up
                        const signupRes = await fetch('/api/auth/signup', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email, password, full_name: fullName, role: currentRole })
                        });
                        
                        if (!signupRes.ok) {
                            const errJson = await signupRes.json();
                            throw new Error(errJson.detail || 'Registration failed');
                        }

                        // Automatically log in after registration
                        const loginRes = await fetch('/api/auth/login', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email, password })
                        });
                        
                        if (!loginRes.ok) {
                            const errJson = await loginRes.json();
                            throw new Error(errJson.detail || 'Authentication after signup failed');
                        }
                        
                        const data = await loginRes.json();
                        token = data.access_token;
                        userRole = data.user.role;
                    }

                    // Direct to target port with token in query params
                    const targetPort = seedInfo[userRole].port;
                    window.location.href = `${window.location.protocol}//${window.location.hostname}:${targetPort}/?token=${token}`;

                } catch (err) {
                    setError(err.message);
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }
            }

            // Trigger initial UI update
            updateUI();
        </script>
    </body>
    </html>
    """
