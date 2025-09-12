import React, { useState, useLayoutEffect, useRef, useEffect } from 'react';

// Access GSAP from the window object
const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
const SplitText = window.SplitText;

// --- Mock Data ---
const mockAlumni = [
    { id: 1, name: 'Samantha Carter', batch: 2015, company: 'Stargate Command', designation: 'Astrophysicist', location: 'Colorado Springs', industry: 'Aerospace & Defense', degree: 'Ph.D. in Astrophysics', branch: 'Physics', profilePic: 'https://placehold.co/100x100/7c3aed/FFFFFF?text=SC', linkedin: '#', email: 's.carter@sgc.mil', bio: 'Expert in quantum mechanics and wormhole physics. Led multiple off-world missions and saved the galaxy a few times.', skills: ['Astrophysics', 'Quantum Mechanics', 'Naquadah Theory', 'Diplomacy'] },
    { id: 2, name: 'John Sheppard', batch: 2004, company: 'Atlantis Expedition', designation: 'Military Commander', location: 'Pegasus Galaxy', industry: 'Exploration', degree: 'B.S. Aerospace Engineering', branch: 'Mechanical', profilePic: 'https://placehold.co/100x100/db2777/FFFFFF?text=JS', linkedin: '#', email: 'j.sheppard@atlantis.io', bio: 'Highly skilled pilot with a knack for getting into and out of trouble. Natural leader and expert in ancient technology.', skills: ['Piloting', 'Combat Strategy', 'Ancient Technology', 'Leadership'] },
    { id: 3, name: 'Daniel Jackson', batch: 1997, company: 'Stargate Command', designation: 'Archaeologist & Linguist', location: 'Colorado Springs', industry: 'Research', degree: 'Ph.D. in Archaeology', branch: 'Humanities', profilePic: 'https://placehold.co/100x100/16a34a/FFFFFF?text=DJ', linkedin: '#', email: 'd.jackson@sgc.mil', bio: 'Translated dozens of alien languages and uncovered the secrets of the Stargate network. Occasionally ascends to a higher plane of existence.', skills: ['Linguistics', 'Archaeology', 'History', 'Goa\'uld Language'] },
    { id: 4, name: 'Teal\'c', batch: 2007, company: 'Free Jaffa Nation', designation: 'Leader', location: 'Dakara', industry: 'Government', degree: 'Honorary Doctorate', branch: 'Politics', profilePic: 'https://placehold.co/100x100/ca8a04/FFFFFF?text=T', linkedin: '#', email: 'tealc@freejaffa.org', bio: 'Former First Prime of Apophis who led his people to freedom. A warrior of great strength, honor, and surprising humor. Indeed.', skills: ['Staff Weapon', 'Jaffa Tactics', 'Honor', 'Kelno\'reem'] },
    { id: 5, name: 'Rodney McKay', batch: 2004, company: 'Atlantis Expedition', designation: 'Chief Science Officer', location: 'Pegasus Galaxy', industry: 'Research', degree: 'Ph.D. in Physics', branch: 'Physics', profilePic: 'https://placehold.co/100x100/0ea5e9/FFFFFF?text=RM', linkedin: '#', email: 'r.mckay@atlantis.io', bio: 'One of the most brilliant and arrogant minds in two galaxies. Claims to be allergic to citrus.', skills: ['Ancient Technology', 'Astrophysics', 'Problem Solving', 'Complaining'] },
    { id: 6, name: 'Vala Mal Doran', batch: 2006, company: 'Stargate Command', designation: 'Consultant', location: 'Colorado Springs', industry: 'Security', degree: 'Self-Taught', branch: 'Life Skills', profilePic: 'https://placehold.co/100x100/be185d/FFFFFF?text=VM', linkedin: '#', email: 'v.mal@sgc.mil', bio: 'Former con artist and host to a Goa\'uld. Now a valuable, if unpredictable, member of the team. Has a thing for treasure.', skills: ['Subterfuge', 'Negotiation', 'Lockpicking', 'Sarcasm'] },
    { id: 7, name: 'George Hammond', batch: 1970, company: 'Stargate Command', designation: 'General', location: 'Washington D.C.', industry: 'Aerospace & Defense', degree: 'M.S. Systems Management', branch: 'Management', profilePic: 'https://placehold.co/100x100/4f46e5/FFFFFF?text=GH', linkedin: '#', email: 'g.hammond@pentagon.mil', bio: 'The heart and soul of the SGC. A compassionate leader who always had his people\'s backs. Godspeed.', skills: ['Leadership', 'Military Strategy', 'Red Phone', 'Integrity'] },
    { id: 8, name: 'Ronon Dex', batch: 2005, company: 'Atlantis Expedition', designation: 'Security Specialist', location: 'Pegasus Galaxy', industry: 'Security', degree: 'Satedan Military Academy', branch: 'Combat', profilePic: 'https://placehold.co/100x100/d97706/FFFFFF?text=RD', linkedin: '#', email: 'r.dex@atlantis.io', bio: 'A fierce warrior from Sateda, hunted by the Wraith for years. Extremely loyal and prefers to shoot first.', skills: ['Particle Magnum', 'Hand-to-Hand Combat', 'Tracking', 'Intimidation'] },
];

// --- Main Alumni Directory Page Component ---
const AlumniDirectoryPage = () => {
    // State management
    const [alumniList, setAlumniList] = useState(mockAlumni);
    const [filteredAlumni, setFilteredAlumni] = useState(mockAlumni);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ batch: [], location: [], industry: [] });
    const [sortBy, setSortBy] = useState('name-asc');
    const [selectedAlumnus, setSelectedAlumnus] = useState(null);
    
    // GSAP animations on load
    useLayoutEffect(() => {
        if (!gsap || !SplitText) return;
        gsap.registerPlugin(ScrollTrigger, SplitText);

        const titleSplit = new SplitText(".directory-title", { type: "chars" });
        gsap.from(titleSplit.chars, {
            yPercent: 120,
            opacity: 0,
            stagger: 0.03,
            ease: "power2.out",
            duration: 1,
            delay: 0.3
        });
        gsap.from(".directory-subtitle", { y: 20, opacity: 0, ease: "power1.out", duration: 1, delay: 0.8 });
    }, []);

    // Effect for filtering and sorting
    useEffect(() => {
        let result = [...alumniList];

        // Search filtering
        if (searchTerm) {
            result = result.filter(alum =>
                alum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                alum.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                String(alum.batch).includes(searchTerm) ||
                alum.location.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sidebar filtering
        Object.keys(filters).forEach(key => {
            if (filters[key].length > 0) {
                result = result.filter(alum => filters[key].includes(String(alum[key])));
            }
        });
        
        // Sorting
        const [sortKey, sortDir] = sortBy.split('-');
        result.sort((a, b) => {
            let valA = a[sortKey];
            let valB = b[sortKey];

            if (typeof valA === 'string') {
                valA = valA.toLowerCase();
                valB = valB.toLowerCase();
            }

            if (valA < valB) return sortDir === 'asc' ? -1 : 1;
            if (valA > valB) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });

        if (sortKey === 'batch') {
           if (sortDir === 'desc') result.reverse(); // Newest first
        }


        setFilteredAlumni(result);
    }, [searchTerm, filters, sortBy, alumniList]);


    const handleFilterChange = (category, value) => {
        setFilters(prev => {
            const currentFilters = prev[category] || [];
            const newFilters = currentFilters.includes(value)
                ? currentFilters.filter(item => item !== value)
                : [...currentFilters, value];
            return { ...prev, [category]: newFilters };
        });
    };
    
    const openModal = (alumnus) => setSelectedAlumnus(alumnus);
    const closeModal = () => setSelectedAlumnus(null);

    // Dynamically generate filter options
    const filterOptions = {
        batch: [...new Set(alumniList.map(a => a.batch))].sort((a, b) => b - a),
        location: [...new Set(alumniList.map(a => a.location))].sort(),
        industry: [...new Set(alumniList.map(a => a.industry))].sort(),
    };

    return (
        <div className="bg-black text-white font-sans min-h-screen">
            {/* Header */}
            <header className="py-20 text-center bg-gray-900/50">
                <h1 className="directory-title text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">Alumni Directory</h1>
                <p className="directory-subtitle text-lg text-gray-400 mt-4">Connect with a network of innovators and leaders.</p>
            </header>

            {/* Main Content */}
            <main className="container mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8">
                {/* Filters Sidebar */}
                <aside className="w-full lg:w-1/4 xl:w-1/5">
                    <div className="sticky top-8 bg-gray-900/70 border border-gray-700 rounded-lg p-6">
                        <h2 className="text-2xl font-bold mb-6">Filters</h2>
                        {/* Batch Filter */}
                        <FilterGroup title="Batch / Graduation" options={filterOptions.batch} category="batch" selected={filters.batch} onChange={handleFilterChange} />
                        {/* Location Filter */}
                        <FilterGroup title="Location / City" options={filterOptions.location} category="location" selected={filters.location} onChange={handleFilterChange} />
                        {/* Industry Filter */}
                        <FilterGroup title="Company / Industry" options={filterOptions.industry} category="industry" selected={filters.industry} onChange={handleFilterChange} />
                    </div>
                </aside>
                
                {/* Results */}
                <section className="w-full lg:w-3/4 xl:w-4/5">
                    {/* Search and Sort */}
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
                        <input
                            type="text"
                            placeholder="Search by name, company, batch, loc..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full md:w-1/2 p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full md:w-auto p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="name-asc">Sort By: Name (A-Z)</option>
                            <option value="name-desc">Sort By: Name (Z-A)</option>
                            <option value="batch-desc">Sort By: Batch (Newest)</option>
                            <option value="batch-asc">Sort By: Batch (Oldest)</option>
                            <option value="company-asc">Sort By: Company (A-Z)</option>
                        </select>
                    </div>

                    {/* Alumni List */}
                    <div className="space-y-4">
                        {filteredAlumni.length > 0 ? (
                            filteredAlumni.map(alumnus => (
                                <AlumniCard key={alumnus.id} alumnus={alumnus} onCardClick={() => openModal(alumnus)} />
                            ))
                        ) : (
                            <p className="text-center text-gray-400 py-10">No alumni found matching your criteria.</p>
                        )}
                    </div>
                </section>
            </main>
            
            <AlumniDetailModal alumnus={selectedAlumnus} onClose={closeModal} />
        </div>
    );
};

// --- Filter Group Component ---
const FilterGroup = ({ title, options, category, selected, onChange }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="border-b border-gray-700 mb-4 pb-4">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-lg font-semibold mb-2">
                {title}
                <span>{isOpen ? '-' : '+'}</span>
            </button>
            {isOpen && (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {options.map(option => (
                        <label key={option} className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selected.includes(String(option))}
                                onChange={() => onChange(category, String(option))}
                                className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-purple-600 focus:ring-purple-500"
                            />
                            <span className="text-gray-300">{option}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};


// --- Alumni Card Component ---
const AlumniCard = ({ alumnus, onCardClick }) => {
    const cardRef = useRef(null);
    useLayoutEffect(() => {
        if (!gsap) return;
        gsap.from(cardRef.current, {
            scrollTrigger: {
                trigger: cardRef.current,
                start: "top 95%",
                toggleActions: "play none none none"
            },
            opacity: 0,
            x: 50,
            duration: 0.6,
            ease: 'power2.out'
        });
    }, [])

    return (
        <div ref={cardRef} onClick={onCardClick} className="bg-gray-900/60 border border-gray-800 rounded-lg p-4 flex items-center gap-4 transition-all duration-300 hover:bg-gray-800 hover:border-purple-500 cursor-pointer">
            <img src={alumnus.profilePic} alt={alumnus.name} className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-gray-700" />
            <div className="flex-grow">
                <h3 className="text-xl font-bold">{alumnus.name} <span className="text-sm font-normal text-gray-400">({alumnus.batch})</span></h3>
                <p className="text-gray-300">{alumnus.designation} at {alumnus.company}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
                 <a href={alumnus.linkedin} onClick={(e) => e.stopPropagation()} target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">LinkedIn</a>
                 <a href={`mailto:${alumnus.email}`} onClick={(e) => e.stopPropagation()} className="bg-gray-700 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:bg-gray-600 transition-colors">Email</a>
            </div>
        </div>
    );
};

// --- Alumni Detail Modal ---
const AlumniDetailModal = ({ alumnus, onClose }) => {
    const modalRef = useRef(null);
    const backdropRef = useRef(null);
    const [copyStatus, setCopyStatus] = useState('Copy Email');

    useLayoutEffect(() => {
        if (!gsap) return;
        const tl = gsap.timeline({ paused: true });
        tl.to(backdropRef.current, { autoAlpha: 1, duration: 0.3 })
          .fromTo(modalRef.current, { scale: 0.8, opacity: 0, y: 50 }, { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, "-=0.2")
          .eventCallback('onReverseComplete', () => document.body.style.overflow = 'auto');
        
        if (alumnus) {
            document.body.style.overflow = 'hidden';
            tl.play();
        } else {
            tl.reverse();
        }
        
        return () => { tl.kill(); };
    }, [alumnus]);

    if (!alumnus) return null;

    const handleCopyEmail = () => {
        navigator.clipboard.writeText(alumnus.email);
        setCopyStatus('Copied!');
        setTimeout(() => setCopyStatus('Copy Email'), 2000);
    };

    return (
        <div ref={backdropRef} onClick={onClose} className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4" style={{ opacity: 0, visibility: 'hidden' }}>
            <div ref={modalRef} onClick={(e) => e.stopPropagation()} className="bg-gray-900 text-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-purple-500/50 p-8">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-6">
                        <img src={alumnus.profilePic.replace("100x100", "150x150")} alt={alumnus.name} className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-gray-700" />
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold">{alumnus.name}</h2>
                            <p className="text-gray-400 text-lg">{alumnus.designation} at {alumnus.company}</p>
                            <p className="text-gray-500">{alumnus.location} • Batch of {alumnus.batch}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 text-3xl hover:text-white transition-colors">&times;</button>
                </div>

                <div className="space-y-4 mb-6">
                    <h4 className="font-semibold text-purple-400">Bio</h4>
                    <p className="text-gray-300">{alumnus.bio}</p>
                </div>
                
                <div className="space-y-4 mb-6">
                    <h4 className="font-semibold text-purple-400">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                        {alumnus.skills.map(skill => (
                            <span key={skill} className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">{skill}</span>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-700">
                    <a href={alumnus.linkedin} target="_blank" rel="noopener noreferrer" className="flex-1 text-center bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors">View LinkedIn</a>
                    <button onClick={handleCopyEmail} className="flex-1 bg-gray-700 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-600 transition-colors">{copyStatus}</button>
                </div>
            </div>
        </div>
    );
};

export default AlumniDirectoryPage;
