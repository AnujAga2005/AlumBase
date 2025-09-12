import React from 'react';
import { useState, useLayoutEffect, useRef, useEffect } from 'react';

// It's assumed GSAP is loaded globally in your project, e.g., in your index.html
const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
const SplitText = window.SplitText;

// --- Mock Data ---
const mockEvents = [
    {
        id: 1,
        title: 'Annual Alumni Meet & Greet',
        date: '2025-10-25T18:00:00',
        location: 'College Auditorium',
        category: 'Meetup',
        description: 'Join us for our biggest event of the year! Reconnect with old friends, network with fellow alumni, and hear about the latest developments at your alma mater.',
        isPublished: true,
        poster: 'https://placehold.co/600x300/1e293b/94a3b8?text=Annual+Meetup',
        registrations: [
            { name: 'Samantha Carter', email: 's.carter@sgc.mil', batch: 2015 },
            { name: 'John Sheppard', email: 'j.sheppard@atlantis.io', batch: 2004 },
            { name: 'Daniel Jackson', email: 'd.jackson@sgc.mil', batch: 1997 },
        ]
    },
    {
        id: 2,
        title: 'Webinar: AI in Modern Tech',
        date: '2025-11-15T14:00:00',
        location: 'Online',
        category: 'Webinar',
        description: 'A deep dive into the world of Artificial Intelligence with industry expert and alumnus, Dr. Rodney McKay. Learn about the latest trends and future possibilities.',
        isPublished: true,
        poster: 'https://placehold.co/600x300/0c4a6e/e0f2fe?text=AI+Webinar',
        registrations: [
             { name: 'Rodney McKay', email: 'r.mckay@atlantis.io', batch: 2004 },
             { name: 'Vala Mal Doran', email: 'v.mal@sgc.mil', batch: 2006 },
        ]
    },
    {
        id: 3,
        title: 'Cultural Fest: Nostalgia Night',
        date: '2025-12-05T19:00:00',
        location: 'Campus Grounds',
        category: 'Cultural',
        description: 'A throwback cultural evening with live music, food stalls, and performances. Relive your best college memories!',
        isPublished: false,
        poster: 'https://placehold.co/600x300/4a044e/f3e8ff?text=Cultural+Fest',
        registrations: [
            { name: 'Teal\'c', email: 'tealc@freejaffa.org', batch: 2007 },
        ]
    },
];

// --- Main Event Management Page Component ---
const EventsPage = () => {
    // State
    const [events, setEvents] = useState(mockEvents);
    const [filteredEvents, setFilteredEvents] = useState(mockEvents);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    // Animations
    useLayoutEffect(() => {
        if (!gsap || !SplitText) return;
        gsap.registerPlugin(ScrollTrigger, SplitText);

        const titleSplit = new SplitText(".event-page-title", { type: "chars" });
        gsap.from(titleSplit.chars, {
            yPercent: 120, opacity: 0, stagger: 0.03,
            ease: "power2.out", duration: 1, delay: 0.3
        });
        gsap.from(".event-page-controls > *", {
            y: 30, opacity: 0, stagger: 0.15,
            ease: "power1.out", duration: 1, delay: 0.8
        });
    }, []);
    
    // Search filter effect
    useEffect(() => {
        const result = events.filter(event => 
            event.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredEvents(result);
    }, [searchTerm, events]);
    
    // Handlers
    const handleCreateEvent = () => {
        setSelectedEvent(null);
        setIsModalOpen(true);
    };
    
    const handleEditEvent = (event) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };
    
    const handleViewRegistrations = (event) => {
        setSelectedEvent(event);
        setIsDrawerOpen(true);
    };

    const handleSaveEvent = (eventData) => {
        if (eventData.id) {
            // Update existing event
            setEvents(events.map(e => e.id === eventData.id ? eventData : e));
        } else {
            // Create new event
            const newEvent = { ...eventData, id: Date.now(), registrations: [] };
            setEvents([newEvent, ...events]);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="bg-black text-white font-sans min-h-screen">
            <header className="py-20 text-center bg-gray-900/50">
                <h1 className="event-page-title text-5xl md:text-7xl font-bold bg-gradient-to-r from-green-500 to-teal-400 bg-clip-text text-transparent">
                    Event Management
                </h1>
            </header>

            <main className="container mx-auto p-4 md:p-8">
                <div className="event-page-controls flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
                    <button onClick={handleCreateEvent} className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:scale-105 transition-transform">
                        Create Event
                    </button>
                    <input
                        type="text"
                        placeholder="Search by event name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-1/3 p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredEvents.map(event => (
                        <EventCard 
                            key={event.id} 
                            event={event}
                            onEdit={() => handleEditEvent(event)}
                            onViewRegistrations={() => handleViewRegistrations(event)}
                        />
                    ))}
                </div>
            </main>
            
            <EventModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveEvent}
                event={selectedEvent}
            />

            <RegistrationsDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                event={selectedEvent}
            />
        </div>
    );
};

// --- Event Card Component ---
const EventCard = ({ event, onEdit, onViewRegistrations }) => {
    const cardRef = useRef(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useLayoutEffect(() => {
        if (!gsap) return;
        gsap.from(cardRef.current, {
            scrollTrigger: { trigger: cardRef.current, start: "top 90%", toggleActions: "play none none none" },
            opacity: 0, y: 60, duration: 0.8, ease: 'power2.out'
        });
    }, []);

    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const formattedTime = eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    return (
        <div ref={cardRef} className="bg-gray-900/60 border border-gray-800 rounded-lg flex flex-col overflow-hidden transition-all duration-300 hover:border-teal-500/50">
            <img src={event.poster} alt={event.title} className="w-full h-48 object-cover" />
            <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold mb-2 flex-grow">{event.title}</h3>
                    <div className="relative">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-400 hover:text-white p-1 text-2xl">⋮</button>
                        {isMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10">
                                <a href="#" onClick={(e) => { e.preventDefault(); onEdit(); setIsMenuOpen(false); }} className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Edit</a>
                                <a href="#" onClick={(e) => { e.preventDefault(); /* onDelete(); */ setIsMenuOpen(false); }} className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Delete</a>
                            </div>
                        )}
                    </div>
                </div>
                <div className="text-sm text-gray-400 mb-3 space-y-1">
                    <p><strong>Date:</strong> {formattedDate} at {formattedTime}</p>
                    <p><strong>Location:</strong> {event.location}</p>
                </div>
                <p className="text-gray-300 text-sm mb-4 flex-grow">{event.description.substring(0, 100)}...</p>
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-700">
                    <span className="text-sm font-semibold">{event.registrations.length} Registrations</span>
                    <button onClick={onViewRegistrations} className="text-teal-400 font-bold text-sm hover:underline">View Registrations</button>
                </div>
            </div>
        </div>
    );
};

// --- Create/Edit Event Modal ---
const EventModal = ({ isOpen, onClose, onSave, event }) => {
    const [formData, setFormData] = useState({});
    
    useEffect(() => {
        setFormData(event || { title: '', description: '', date: '', location: '', category: 'Meetup', isPublished: true });
    }, [event]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-80 z-[100] flex items-center justify-center p-4">
            <div onClick={(e) => e.stopPropagation()} className="bg-gray-900 text-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-purple-500/50 p-8">
                <h2 className="text-2xl font-bold mb-6">{event ? 'Edit Event' : 'Create New Event'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="title" value={formData.title || ''} onChange={handleChange} placeholder="Event Title" className="w-full p-3 bg-gray-800 rounded" required />
                    <textarea name="description" value={formData.description || ''} onChange={handleChange} placeholder="Description" rows="4" className="w-full p-3 bg-gray-800 rounded" required></textarea>
                    <input type="datetime-local" name="date" value={formData.date ? formData.date.substring(0, 16) : ''} onChange={handleChange} className="w-full p-3 bg-gray-800 rounded" required />
                    <input type="text" name="location" value={formData.location || ''} onChange={handleChange} placeholder="Location / Online" className="w-full p-3 bg-gray-800 rounded" required />
                    <select name="category" value={formData.category || 'Meetup'} onChange={handleChange} className="w-full p-3 bg-gray-800 rounded">
                        <option>Meetup</option>
                        <option>Webinar</option>
                        <option>Workshop</option>
                        <option>Cultural</option>
                    </select>
                    <div>
                        <label className="text-sm text-gray-400">Poster / Banner</label>
                        <input type="file" name="poster" className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"/>
                    </div>
                    <label className="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" name="isPublished" checked={formData.isPublished || false} onChange={handleChange} className="h-4 w-4 rounded bg-gray-700 text-purple-600"/>
                        <span className="text-gray-300">Published</span>
                    </label>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="py-2 px-6 bg-gray-700 rounded-lg hover:bg-gray-600">Cancel</button>
                        <button type="submit" className="py-2 px-6 bg-purple-600 rounded-lg hover:bg-purple-700">Save Event</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Registrations Drawer ---
const RegistrationsDrawer = ({ isOpen, onClose, event }) => {
    const drawerRef = useRef(null);

    useLayoutEffect(() => {
        if (!gsap) return;
        if (isOpen) {
            gsap.to(drawerRef.current, { x: 0, duration: 0.5, ease: 'power3.out' });
        } else {
            gsap.to(drawerRef.current, { x: '100%', duration: 0.5, ease: 'power3.in' });
        }
    }, [isOpen]);

    return (
        <div ref={drawerRef} className="fixed top-0 right-0 h-full w-full max-w-md bg-gray-900 text-white z-[110] shadow-2xl transform translate-x-full border-l border-gray-700 p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                   <h2 className="text-2xl font-bold">Registrations</h2>
                   <p className="text-sm text-gray-400">{event?.title}</p>
                </div>
                <button onClick={onClose} className="text-gray-400 text-3xl hover:text-white">&times;</button>
            </div>
            <div className="overflow-y-auto h-[calc(100%-80px)]">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-800">
                        <tr>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">Email</th>
                            <th scope="col" className="px-6 py-3">Batch</th>
                        </tr>
                    </thead>
                    <tbody>
                        {event?.registrations.map((reg, index) => (
                            <tr key={index} className="bg-gray-900 border-b border-gray-800">
                                <td className="px-6 py-4 font-medium text-white">{reg.name}</td>
                                <td className="px-6 py-4">{reg.email}</td>
                                <td className="px-6 py-4">{reg.batch}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EventsPage;

