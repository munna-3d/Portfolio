"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, Loader2, XCircle } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function ContactPage() {
    const [selectedCategory, setSelectedCategory] = useState("Freelance Work");
    const [formState, setFormState] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [statusMessage, setStatusMessage] = useState("");
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", countryCode: "+91", message: "" });
    const categories = ["Freelance Work", "Job Opportunities", "General Inquiry"];

    const commonCountryCodes = [
        { code: "+93", label: "+93 (Afghanistan)" },
        { code: "+355", label: "+355 (Albania)" },
        { code: "+213", label: "+213 (Algeria)" },
        { code: "+376", label: "+376 (Andorra)" },
        { code: "+244", label: "+244 (Angola)" },
        { code: "+54", label: "+54 (Argentina)" },
        { code: "+374", label: "+374 (Armenia)" },
        { code: "+61", label: "+61 (Australia)" },
        { code: "+43", label: "+43 (Austria)" },
        { code: "+994", label: "+994 (Azerbaijan)" },
        { code: "+973", label: "+973 (Bahrain)" },
        { code: "+880", label: "+880 (Bangladesh)" },
        { code: "+375", label: "+375 (Belarus)" },
        { code: "+32", label: "+32 (Belgium)" },
        { code: "+501", label: "+501 (Belize)" },
        { code: "+229", label: "+229 (Benin)" },
        { code: "+975", label: "+975 (Bhutan)" },
        { code: "+591", label: "+591 (Bolivia)" },
        { code: "+387", label: "+387 (Bosnia and Herzegovina)" },
        { code: "+267", label: "+267 (Botswana)" },
        { code: "+55", label: "+55 (Brazil)" },
        { code: "+673", label: "+673 (Brunei)" },
        { code: "+359", label: "+359 (Bulgaria)" },
        { code: "+226", label: "+226 (Burkina Faso)" },
        { code: "+257", label: "+257 (Burundi)" },
        { code: "+855", label: "+855 (Cambodia)" },
        { code: "+237", label: "+237 (Cameroon)" },
        { code: "+1", label: "+1 (Canada/USA)" },
        { code: "+238", label: "+238 (Cape Verde)" },
        { code: "+236", label: "+236 (Central African Republic)" },
        { code: "+235", label: "+235 (Chad)" },
        { code: "+56", label: "+56 (Chile)" },
        { code: "+86", label: "+86 (China)" },
        { code: "+57", label: "+57 (Colombia)" },
        { code: "+269", label: "+269 (Comoros)" },
        { code: "+242", label: "+242 (Congo - Brazzaville)" },
        { code: "+243", label: "+243 (Congo - Kinshasa)" },
        { code: "+506", label: "+506 (Costa Rica)" },
        { code: "+385", label: "+385 (Croatia)" },
        { code: "+53", label: "+53 (Cuba)" },
        { code: "+357", label: "+357 (Cyprus)" },
        { code: "+420", label: "+420 (Czech Republic)" },
        { code: "+45", label: "+45 (Denmark)" },
        { code: "+253", label: "+253 (Djibouti)" },
        { code: "+20", label: "+20 (Egypt)" },
        { code: "+503", label: "+503 (El Salvador)" },
        { code: "+240", label: "+240 (Equatorial Guinea)" },
        { code: "+291", label: "+291 (Eritrea)" },
        { code: "+372", label: "+372 (Estonia)" },
        { code: "+251", label: "+251 (Ethiopia)" },
        { code: "+679", label: "+679 (Fiji)" },
        { code: "+358", label: "+358 (Finland)" },
        { code: "+33", label: "+33 (France)" },
        { code: "+241", label: "+241 (Gabon)" },
        { code: "+220", label: "+220 (Gambia)" },
        { code: "+995", label: "+995 (Georgia)" },
        { code: "+49", label: "+49 (Germany)" },
        { code: "+233", label: "+233 (Ghana)" },
        { code: "+30", label: "+30 (Greece)" },
        { code: "+502", label: "+502 (Guatemala)" },
        { code: "+224", label: "+224 (Guinea)" },
        { code: "+245", label: "+245 (Guinea-Bissau)" },
        { code: "+592", label: "+592 (Guyana)" },
        { code: "+509", label: "+509 (Haiti)" },
        { code: "+504", label: "+504 (Honduras)" },
        { code: "+852", label: "+852 (Hong Kong)" },
        { code: "+36", label: "+36 (Hungary)" },
        { code: "+354", label: "+354 (Iceland)" },
        { code: "+91", label: "+91 (India)" },
        { code: "+62", label: "+62 (Indonesia)" },
        { code: "+98", label: "+98 (Iran)" },
        { code: "+964", label: "+964 (Iraq)" },
        { code: "+353", label: "+353 (Ireland)" },
        { code: "+972", label: "+972 (Israel)" },
        { code: "+39", label: "+39 (Italy)" },
        { code: "+225", label: "+225 (Ivory Coast)" },
        { code: "+81", label: "+81 (Japan)" },
        { code: "+962", label: "+962 (Jordan)" },
        { code: "+7", label: "+7 (Russia/Kazakhstan)" },
        { code: "+254", label: "+254 (Kenya)" },
        { code: "+965", label: "+965 (Kuwait)" },
        { code: "+996", label: "+996 (Kyrgyzstan)" },
        { code: "+856", label: "+856 (Laos)" },
        { code: "+371", label: "+371 (Latvia)" },
        { code: "+961", label: "+961 (Lebanon)" },
        { code: "+231", label: "+231 (Liberia)" },
        { code: "+218", label: "+218 (Libya)" },
        { code: "+423", label: "+423 (Liechtenstein)" },
        { code: "+370", label: "+370 (Lithuania)" },
        { code: "+352", label: "+352 (Luxembourg)" },
        { code: "+853", label: "+853 (Macau)" },
        { code: "+389", label: "+389 (North Macedonia)" },
        { code: "+261", label: "+261 (Madagascar)" },
        { code: "+265", label: "+265 (Malawi)" },
        { code: "+60", label: "+60 (Malaysia)" },
        { code: "+960", label: "+960 (Maldives)" },
        { code: "+223", label: "+223 (Mali)" },
        { code: "+356", label: "+356 (Malta)" },
        { code: "+52", label: "+52 (Mexico)" },
        { code: "+373", label: "+373 (Moldova)" },
        { code: "+377", label: "+377 (Monaco)" },
        { code: "+976", label: "+976 (Mongolia)" },
        { code: "+382", label: "+382 (Montenegro)" },
        { code: "+212", label: "+212 (Morocco)" },
        { code: "+258", label: "+258 (Mozambique)" },
        { code: "+95", label: "+95 (Myanmar)" },
        { code: "+264", label: "+264 (Namibia)" },
        { code: "+977", label: "+977 (Nepal)" },
        { code: "+31", label: "+31 (Netherlands)" },
        { code: "+64", label: "+64 (New Zealand)" },
        { code: "+505", label: "+505 (Nicaragua)" },
        { code: "+227", label: "+227 (Niger)" },
        { code: "+234", label: "+234 (Nigeria)" },
        { code: "+47", label: "+47 (Norway)" },
        { code: "+968", label: "+968 (Oman)" },
        { code: "+92", label: "+92 (Pakistan)" },
        { code: "+507", label: "+507 (Panama)" },
        { code: "+595", label: "+595 (Paraguay)" },
        { code: "+51", label: "+51 (Peru)" },
        { code: "+63", label: "+63 (Philippines)" },
        { code: "+48", label: "+48 (Poland)" },
        { code: "+351", label: "+351 (Portugal)" },
        { code: "+974", label: "+974 (Qatar)" },
        { code: "+40", label: "+40 (Romania)" },
        { code: "+250", label: "+250 (Rwanda)" },
        { code: "+966", label: "+966 (Saudi Arabia)" },
        { code: "+221", label: "+221 (Senegal)" },
        { code: "+381", label: "+381 (Serbia)" },
        { code: "+65", label: "+65 (Singapore)" },
        { code: "+421", label: "+421 (Slovakia)" },
        { code: "+386", label: "+386 (Slovenia)" },
        { code: "+252", label: "+252 (Somalia)" },
        { code: "+27", label: "+27 (South Africa)" },
        { code: "+82", label: "+82 (South Korea)" },
        { code: "+34", label: "+34 (Spain)" },
        { code: "+94", label: "+94 (Sri Lanka)" },
        { code: "+249", label: "+249 (Sudan)" },
        { code: "+46", label: "+46 (Sweden)" },
        { code: "+41", label: "+41 (Switzerland)" },
        { code: "+963", label: "+963 (Syria)" },
        { code: "+886", label: "+886 (Taiwan)" },
        { code: "+992", label: "+992 (Tajikistan)" },
        { code: "+255", label: "+255 (Tanzania)" },
        { code: "+66", label: "+66 (Thailand)" },
        { code: "+216", label: "+216 (Tunisia)" },
        { code: "+90", label: "+90 (Turkey)" },
        { code: "+993", label: "+993 (Turkmenistan)" },
        { code: "+256", label: "+256 (Uganda)" },
        { code: "+380", label: "+380 (Ukraine)" },
        { code: "+971", label: "+971 (United Arab Emirates)" },
        { code: "+44", label: "+44 (United Kingdom)" },
        { code: "+598", label: "+598 (Uruguay)" },
        { code: "+998", label: "+998 (Uzbekistan)" },
        { code: "+58", label: "+58 (Venezuela)" },
        { code: "+84", label: "+84 (Vietnam)" },
        { code: "+967", label: "+967 (Yemen)" },
        { code: "+260", label: "+260 (Zambia)" },
        { code: "+263", label: "+263 (Zimbabwe)" }
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message || !formData.phone) return;
        
        setFormState("submitting");
        setStatusMessage("");

        try {
            const formBody = new URLSearchParams();
            formBody.append("entry.1930666528", selectedCategory);
            formBody.append("entry.1976063434", formData.name);
            formBody.append("entry.1043508791", formData.email);
            if (formData.phone) {
                formBody.append("entry.835817942", `${formData.countryCode} ${formData.phone}`);
            }
            formBody.append("entry.1403723555", formData.message);

            await fetch("https://docs.google.com/forms/d/e/1FAIpQLSdt1ZCqb3cKSeebIM85TTnkMGwIHTHm8TrnO7hFU2pVY4gONQ/formResponse", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formBody.toString(),
                mode: "no-cors"
            });

            setFormState("success");
            setStatusMessage("Congrats! Your message has sent.");
            setShowSuccessPopup(true);
            setFormData({ name: "", email: "", phone: "", countryCode: "+91", message: "" });
            
            setTimeout(() => {
                setShowSuccessPopup(false);
            }, 3000);

            setTimeout(() => {
                setFormState("idle");
                setStatusMessage("");
            }, 6000);
        } catch (error) {
            setFormState("error");
            setStatusMessage("Something went wrong");
            
            setTimeout(() => {
                setFormState("idle");
                setStatusMessage("");
            }, 4000);
        }
    };

    return (
        <main className="min-h-screen relative flex flex-col bg-[#121212] font-sans selection:bg-pink-500/30">
            <Navbar />

            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="https://images.unsplash.com/photo-1742712608977-4f47f57c6093?q=80&w=2225&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                    alt="Studio Background" 
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30 backdrop-blur-[2px]" />
            </div>

            {/* Main Content Area */}
            <div className="relative z-10 flex-grow flex items-center pt-24 pb-12 px-6 lg:px-20 mx-auto w-full max-w-[1600px]">
                
                <div className="w-full flex flex-col lg:flex-row justify-between items-end lg:items-center gap-16 lg:gap-8">
                    
                    {/* Left Side Info Details (Positioned at bottom on desktop like the reference) */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="lg:absolute lg:bottom-12 lg:left-20 flex gap-12 lg:gap-24 hidden md:flex"
                    >
                        <div>
                            <p className="text-gray-400 text-sm md:text-base font-medium mb-1">Collaborate</p>
                            <a href="mailto:moon3d.xx@gmail.com" className="text-white text-base md:text-lg font-bold tracking-wide hover:text-pink-500 transition-colors">
                                moon3d.xx@gmail.com
                            </a>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm md:text-base font-medium mb-1">Location</p>
                            <p className="text-white text-base md:text-lg font-bold tracking-wide">
                                Assam, India
                            </p>
                        </div>
                    </motion.div>

                    {/* Spacer for Flex to push card to right */}
                    <div className="hidden lg:block flex-grow" />

                    {/* Right Side Glassmorphism Form Card */}
                    <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="w-full lg:w-[600px] shrink-0 bg-[#1a1a1a]/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.5)] relative overflow-hidden group"
                    >
                        {/* Subtle background glow */}
                        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full group-hover:bg-pink-500/20 transition-colors duration-700" />
                        
                        <h1 className="text-3xl md:text-4xl font-black text-white mb-8 tracking-tight uppercase relative z-10">
                            Let&apos;s Get Talking
                        </h1>

                        <div className="flex flex-wrap gap-3 mb-10 relative z-10">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
                                        selectedCategory === cat 
                                        ? "bg-cyan-500 text-black border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.4)]" 
                                        : "bg-transparent text-gray-400 border-white/20 hover:border-white/50 hover:text-white"
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <form className="space-y-8 relative z-10" onSubmit={handleSubmit}>
                            
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="relative group/input"
                            >
                                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-10 block pointer-events-none transition-colors group-focus-within/input:text-cyan-400">
                                    Full Name
                                </label>
                                <input 
                                    type="text" 
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    placeholder="Your Full Name" 
                                    required
                                    className="w-full bg-transparent border-b border-white/20 pb-3 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 transition-colors text-lg"
                                />
                                <div className="absolute bottom-0 left-0 h-[2px] w-full bg-cyan-500 origin-left scale-x-0 group-focus-within/input:scale-x-100 transition-transform duration-500" />
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="relative group/input"
                            >
                                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-10 block pointer-events-none transition-colors group-focus-within/input:text-cyan-400">
                                    Email
                                </label>
                                <input 
                                    type="email" 
                                    value={formData.email}
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                    placeholder="Email Address" 
                                    required
                                    className="w-full bg-transparent border-b border-white/20 pb-3 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 transition-colors text-lg"
                                />
                                <div className="absolute bottom-0 left-0 h-[2px] w-full bg-cyan-500 origin-left scale-x-0 group-focus-within/input:scale-x-100 transition-transform duration-500" />
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="relative group/input"
                            >
                                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-10 block pointer-events-none transition-colors group-focus-within/input:text-cyan-400">
                                    Phone Number
                                </label>
                                <div className="flex items-end gap-3 w-full">
                                    <select
                                        value={formData.countryCode}
                                        onChange={e => setFormData({...formData, countryCode: e.target.value})}
                                        className="bg-transparent border-b border-white/20 pb-3 text-white focus:outline-none focus:border-cyan-500 transition-colors text-lg w-32 cursor-pointer [&>option]:bg-[#121212] [&>option]:text-white"
                                    >
                                        {commonCountryCodes.map(c => (
                                            <option key={c.code} value={c.code}>{c.label}</option>
                                        ))}
                                    </select>
                                    <input 
                                        type="tel" 
                                        value={formData.phone}
                                        onChange={e => {
                                            const numericValue = e.target.value.replace(/\D/g, '');
                                            setFormData({...formData, phone: numericValue});
                                        }}
                                        placeholder="Phone Number" 
                                        required
                                        className="flex-grow bg-transparent border-b border-white/20 pb-3 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 transition-colors text-lg"
                                    />
                                </div>
                                <div className="absolute bottom-0 left-0 h-[2px] w-full bg-cyan-500 origin-left scale-x-0 group-focus-within/input:scale-x-100 transition-transform duration-500" />
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="relative group/input"
                            >
                                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-10 block pointer-events-none transition-colors group-focus-within/input:text-cyan-400">
                                    Message
                                </label>
                                <textarea 
                                    placeholder="Your Message..." 
                                    value={formData.message}
                                    onChange={e => setFormData({...formData, message: e.target.value})}
                                    required
                                    rows={2}
                                    className="w-full bg-transparent border-b border-white/20 pb-3 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 transition-colors text-lg resize-none"
                                />
                                <div className="absolute bottom-0 left-0 h-[2px] w-full bg-cyan-500 origin-left scale-x-0 group-focus-within/input:scale-x-100 transition-transform duration-500" />
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                                className="pt-4 flex flex-col sm:flex-row items-center gap-6"
                            >
                                <button 
                                    type="submit"
                                    disabled={formState !== "idle"}
                                    className={`group relative flex items-center justify-center gap-3 px-8 py-3 rounded-full border transition-all duration-300 w-48 h-12 overflow-hidden ${ 
                                        formState === "success" 
                                            ? "bg-emerald-500 border-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.5)]" 
                                            : formState === "error"
                                                ? "bg-red-500 border-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]"
                                                : formState === "submitting"
                                                    ? "bg-white/10 border-white/30 text-white cursor-not-allowed"
                                                    : "border-white/30 text-white hover:bg-white hover:text-black hover:border-white"
                                    }`}
                                >
                                    <AnimatePresence mode="wait">
                                        {formState === "idle" && (
                                            <motion.div 
                                                key="idle" 
                                                initial={{ opacity: 0, y: 10 }} 
                                                animate={{ opacity: 1, y: 0 }} 
                                                exit={{ opacity: 0, y: -10 }}
                                                className="flex items-center gap-3"
                                            >
                                                <span className="font-bold uppercase tracking-widest text-xs">Submit</span>
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </motion.div>
                                        )}
                                        {formState === "submitting" && (
                                            <motion.div 
                                                key="submitting" 
                                                initial={{ opacity: 0, scale: 0.5 }} 
                                                animate={{ opacity: 1, scale: 1 }} 
                                                exit={{ opacity: 0, scale: 0.5 }}
                                            >
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            </motion.div>
                                        )}
                                        {formState === "success" && (
                                            <motion.div 
                                                key="success" 
                                                initial={{ opacity: 0, scale: 0.5 }} 
                                                animate={{ opacity: 1, scale: 1 }} 
                                                exit={{ opacity: 0, scale: 0.5 }}
                                                className="flex items-center gap-2"
                                            >
                                                <CheckCircle2 className="w-5 h-5" />
                                                <span className="font-bold uppercase tracking-widest text-xs">Sent</span>
                                            </motion.div>
                                        )}
                                        {formState === "error" && (
                                            <motion.div 
                                                key="error" 
                                                initial={{ opacity: 0, scale: 0.5 }} 
                                                animate={{ opacity: 1, scale: 1 }} 
                                                exit={{ opacity: 0, scale: 0.5 }}
                                                className="flex items-center gap-2"
                                            >
                                                <XCircle className="w-5 h-5" />
                                                <span className="font-bold uppercase tracking-widest text-xs">Failed</span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </button>

                                <AnimatePresence>
                                    {statusMessage && (
                                        <motion.div 
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            className={`text-sm font-medium ${formState === 'error' ? 'text-red-400' : 'text-emerald-400'}`}
                                        >
                                            {statusMessage}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>

                        </form>
                    </motion.div>

                </div>
            </div>
            
            {/* Mobile-only contact details at bottom */}
            <div className="md:hidden pb-12 px-6 text-center space-y-6 relative z-10 border-t border-white/10 pt-8 mt-8 bg-black/50 backdrop-blur-md">
                <div>
                    <p className="text-gray-400 text-sm font-medium mb-1">Collaborate</p>
                    <a href="mailto:moon3d.xx@gmail.com" className="text-white text-base font-bold tracking-wide">
                        moon3d.xx@gmail.com
                    </a>
                </div>
                <div>
                    <p className="text-gray-400 text-sm font-medium mb-1">Location</p>
                    <p className="text-white text-base font-bold tracking-wide">
                        Assam, India
                    </p>
                </div>
            </div>

            {/* Success Popup Modal */}
            <AnimatePresence>
                {showSuccessPopup && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowSuccessPopup(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative z-[101] w-full max-w-sm md:max-w-lg bg-black/90 border border-white/10 rounded-3xl p-8 md:p-16 text-center shadow-2xl shadow-cyan-500/20 backdrop-blur-xl"
                        >
                            <div className="w-16 h-16 md:w-24 md:h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-10 relative">
                                <motion.div 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", damping: 12, delay: 0.2 }}
                                >
                                    <CheckCircle2 className="w-8 h-8 md:w-12 md:h-12 text-emerald-400" />
                                </motion.div>
                                <motion.div 
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="absolute inset-0 bg-emerald-500/20 rounded-full blur-lg"
                                />
                            </div>
                            
                            <motion.h2 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-2xl md:text-4xl font-bold text-white mb-3 md:mb-4"
                            >
                                Congrats!
                            </motion.h2>
                            
                            <motion.p 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-gray-300 text-base md:text-xl font-medium"
                            >
                                Your message has sent!
                            </motion.p>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </main>
    );
}
