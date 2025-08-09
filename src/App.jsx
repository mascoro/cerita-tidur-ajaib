import React from 'react';

// Komponen Ikon SVG untuk elemen visual
const Star = ({ className, style }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
  </svg>
);

const Moon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2.75C6.88 2.75 2.75 6.88 2.75 12c0 5.12 4.13 9.25 9.25 9.25 1.4 0 2.74-.31 3.95-.88-1.55-.9-2.57-2.58-2.57-4.37 0-2.88 2.34-5.22 5.22-5.22.92 0 1.79.25 2.55.69A9.22 9.22 0 0012 2.75z"/>
    </svg>
);

// Komponen utama aplikasi
const App = () => {
    // State untuk mengelola alur aplikasi
    const [screen, setScreen] = React.useState('welcome'); // welcome, form, loading, story
    const [isLoading, setIsLoading] = React.useState(false); // State untuk menonaktifkan tombol saat loading
    const [story, setStory] = React.useState('');
    const [error, setError] = React.useState(null);
    
    // State untuk input pengguna
    const [age, setAge] = React.useState('');
    const [gender, setGender] = React.useState('');
    const [interest, setInterest] = React.useState('');
    const [style, setStyle] = React.useState('');
    const [lesson, setLesson] = React.useState('');

    // Fungsi untuk menghasilkan cerita menggunakan Gemini API
    const generateStory = async () => {
        if (!age || !gender || !interest || !style || !lesson) {
            setError('Mohon isi semua kolom untuk membuat cerita.');
            return;
        }
        setError(null);
        setScreen('loading');
        setIsLoading(true);

        const prompt = `
            Tolong buatkan sebuah cerita pengantar tidur untuk anak-anak dalam bahasa Indonesia.
            Cerita ini harus menenangkan, imajinatif, dan cocok untuk dibacakan sebelum tidur.
            Berikut adalah detail untuk ceritanya:
            - Usia Anak: ${age} tahun
            - Jenis Kelamin Anak: ${gender}
            - Minat Utama Anak: ${interest}
            - Gaya Cerita: ${style}
            - Pelajaran Moral yang ingin diajarkan: ${lesson}

            Pastikan ceritanya memiliki awal, tengah, dan akhir yang jelas.
            Gunakan bahasa yang mudah dipahami oleh anak seusia itu.
            Akhiri cerita dengan kalimat yang menenangkan dan mendorong anak untuk tidur nyenyak.
            Cerita harus orisinal dan kreatif.
        `;

        try {
            const apiKey = "AIzaSyBBCrBOMvctVf5F1q9YhFvZwlGhwVy_iug";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });

            if (!response.ok) {
                const errorBody = await response.json().catch(() => ({}));
                const errorMessage = errorBody?.error?.message || response.statusText;
                throw new Error(`API Error: ${errorMessage}`);
            }

            const result = await response.json();
            
            if (result.candidates && result.candidates.length > 0 && result.candidates[0].content?.parts?.[0]?.text) {
                const generatedText = result.candidates[0].content.parts[0].text;
                setStory(generatedText);
                setScreen('story');
            } else {
                throw new Error("Tidak ada cerita yang dihasilkan. Mohon coba lagi.");
            }
        } catch (e) {
            console.error(e);
            setError(`Maaf, terjadi kesalahan saat membuat cerita. (${e.message})`);
            setScreen('form');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setScreen('form');
        setStory('');
        setAge('');
        setGender('');
        setInterest('');
        setStyle('');
        setLesson('');
        setError(null);
    };

    const AnimatedBackground = () => (
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
            {Array.from({ length: 20 }).map((_, i) => (
                <Star key={i} className="absolute text-yellow-200/50 animate-pulse" style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    width: `${Math.random() * 2 + 1}px`,
                    height: `${Math.random() * 2 + 1}px`,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${Math.random() * 5 + 3}s`,
                }} />
            ))}
        </div>
    );
    
    const renderScreen = () => {
        switch (screen) {
            case 'form':
                return (
                    <div className="w-full max-w-2xl mx-auto p-8 bg-white/5 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/10 transition-all duration-500">
                        <h1 className="text-3xl font-bold text-center text-white mb-2">Buat Cerita Ajaibmu</h1>
                        <p className="text-center text-indigo-200 mb-8">Isi detail di bawah ini untuk memulai petualangan.</p>
                        
                        {error && <div className="bg-red-500/20 text-white p-3 rounded-lg mb-6 text-center border border-red-500/50">{error}</div>}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-indigo-200 mb-2">Usia Anak</label>
                                <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Contoh: 5" className="bg-indigo-900/20 border border-white/10 rounded-lg p-3 text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"/>
                            </div>
                            
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-indigo-200 mb-2">Jenis Kelamin</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button onClick={() => setGender('Laki-laki')} className={`p-3 rounded-lg transition-all text-white ${gender === 'Laki-laki' ? 'bg-indigo-500 ring-2 ring-white/80' : 'bg-indigo-900/20 border border-white/10'}`}>Laki-laki</button>
                                    <button onClick={() => setGender('Perempuan')} className={`p-3 rounded-lg transition-all text-white ${gender === 'Perempuan' ? 'bg-pink-500 ring-2 ring-white/80' : 'bg-indigo-900/20 border border-white/10'}`}>Perempuan</button>
                                </div>
                            </div>
                            
                            <div className="md:col-span-2">
                                <label className="text-sm font-medium text-indigo-200 mb-2">Bidang Minat Anak</label>
                                <input type="text" value={interest} onChange={(e) => setInterest(e.target.value)} placeholder="Contoh: dinosaurus, putri duyung, luar angkasa" className="w-full bg-indigo-900/20 border border-white/10 rounded-lg p-3 text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"/>
                            </div>
                            
                            <div className="md:col-span-2">
                                <label className="text-sm font-medium text-indigo-200 mb-2">Gaya Cerita</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {['Lucu', 'Petualangan', 'Menenangkan', 'Misteri'].map(s => (
                                        <button key={s} onClick={() => setStyle(s)} className={`p-3 rounded-lg transition-all text-sm text-white ${style === s ? 'bg-indigo-500 ring-2 ring-white/80' : 'bg-indigo-900/20 border border-white/10'}`}>{s}</button>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="md:col-span-2">
                                <label className="text-sm font-medium text-indigo-200 mb-2">Pelajaran yang Ingin Diajarkan</label>
                                <textarea value={lesson} onChange={(e) => setLesson(e.target.value)} placeholder="Contoh: pentingnya berbagi, kejujuran, keberanian" rows="3" className="w-full bg-indigo-900/20 border border-white/10 rounded-lg p-3 text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"></textarea>
                            </div>
                        </div>
                        
                        <button 
                            onClick={generateStory} 
                            disabled={isLoading}
                            className="w-full mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Bintang sedang merangkai cerita...' : 'Buat Cerita ✨'}
                        </button>
                    </div>
                );
            case 'loading':
                return (
                    <div className="text-center text-white">
                        <h2 className="text-3xl font-bold mb-4">Bintang-bintang sedang merangkai ceritamu...</h2>
                        <p className="text-indigo-200">Mohon tunggu sebentar.</p>
                        <div className="flex justify-center items-center space-x-2 mt-8">
                            <Star className="w-8 h-8 text-yellow-300 animate-pulse" style={{animationDelay: '0s'}}/>
                            <Star className="w-8 h-8 text-yellow-300 animate-pulse" style={{animationDelay: '0.2s'}}/>
                            <Star className="w-8 h-8 text-yellow-300 animate-pulse" style={{animationDelay: '0.4s'}}/>
                        </div>
                    </div>
                );
            case 'story':
                return (
                    <div className="w-full max-w-3xl mx-auto p-8 bg-white/5 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/10">
                        <h1 className="text-3xl font-bold text-center text-white mb-6">Inilah Ceritamu!</h1>
                        <div className="prose prose-invert prose-lg max-w-none text-indigo-100 whitespace-pre-wrap leading-relaxed text-left">
                           {story.split('\n').map((paragraph, index) => (
                                <p key={index} className="mb-4">{paragraph}</p>
                            ))}
                        </div>
                        <button onClick={handleReset} className="w-full mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
                             Tulis Cerita Lain
                        </button>
                    </div>
                );
            default: // Welcome screen
                return (
                    <div className="text-center">
                        <Moon className="w-24 h-24 text-yellow-200 mx-auto mb-6"/>
                        <h1 className="text-5xl font-bold text-white mb-4">Cerita Tidur Ajaib</h1>
                        <p className="text-xl text-indigo-200 max-w-xl mx-auto mb-10">Ciptakan dongeng pengantar tidur yang personal untuk si kecil hanya dalam beberapa detik.</p>
                        <button onClick={() => setScreen('form')} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-4 px-10 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
                             Mulai
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-900 via-gray-900 to-gray-900 -z-20"></div>
            <AnimatedBackground />
            {renderScreen()}
        </div>
    );
};

export default App;