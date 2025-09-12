import React, { useState, useLayoutEffect, useRef } from 'react';

// GSAP CDN imports - these will be loaded from CDN
const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
const SplitText = window.SplitText;

// --- Main Donations Page Component ---
const App = () => {
    const categoriesRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');

    useLayoutEffect(() => {
        // Load GSAP and plugins from CDN
        const loadGSAP = async () => {
            if (!window.gsap) {
                const gsapScript = document.createElement('script');
                gsapScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
                document.head.appendChild(gsapScript);
                
                await new Promise(resolve => gsapScript.onload = resolve);
            }
            
            if (!window.ScrollTrigger) {
                const scrollTriggerScript = document.createElement('script');
                scrollTriggerScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js';
                document.head.appendChild(scrollTriggerScript);
                
                await new Promise(resolve => scrollTriggerScript.onload = resolve);
            }
            
            if (!window.SplitText) {
                const splitTextScript = document.createElement('script');
                splitTextScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/TextPlugin.min.js';
                document.head.appendChild(splitTextScript);
                
                await new Promise(resolve => splitTextScript.onload = resolve);
            }
            
            if (window.gsap && window.ScrollTrigger) {
                window.gsap.registerPlugin(window.ScrollTrigger);
            }
        };
        
        loadGSAP();
    }, []);

    const handleDonateNowClick = (category) => {
        setSelectedCategory(category);
        setIsModalOpen(true);
    };
    
    const handleScrollToCategories = () => {
        categoriesRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleCloseModal = () => {
        console.log('Closing modal'); // Debug log
        setIsModalOpen(false);
    };

    return (
        <div className="bg-black text-white font-sans overflow-x-hidden">
            <HeroSection onDonateClick={handleScrollToCategories} />
            <div ref={categoriesRef}>
                <CategoriesSection onDonateClick={handleDonateNowClick} />
            </div>
            <TestimonialsSection />
            <DonationModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                category={selectedCategory}
            />
        </div>
    );
};

// --- 1. Hero/Banner Section ---
const HeroSection = ({ onDonateClick }) => {
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const buttonRef = useRef(null);
    const overlayRef = useRef(null);

    useLayoutEffect(() => {
        if (!window.gsap) return;

        const tl = window.gsap.timeline({ delay: 0.5 });

        // Animate title characters
        if (titleRef.current) {
            const chars = titleRef.current.textContent.split('');
            titleRef.current.innerHTML = chars.map(char => 
                char === ' ' ? ' ' : `<span style="display: inline-block; transform: translateY(150%) rotate(10deg); opacity: 0;">${char}</span>`
            ).join('');

            tl.to(titleRef.current.querySelectorAll('span'), {
                y: 0,
                rotation: 0,
                opacity: 1,
                stagger: 0.03,
                ease: "power2.out",
                duration: 1,
            });
        }

        // Animate subtitle words
        if (subtitleRef.current) {
            const words = subtitleRef.current.textContent.split(' ');
            subtitleRef.current.innerHTML = words.map(word => 
                `<span style="display: inline-block; transform: translateY(50px); opacity: 0; margin-right: 0.25rem;">${word}</span>`
            ).join('');

            tl.to(subtitleRef.current.querySelectorAll('span'), {
                y: 0,
                opacity: 1,
                stagger: 0.02,
                ease: "power1.out",
            }, "-=0.8");
        }

        // Animate button
        if (buttonRef.current) {
            window.gsap.set(buttonRef.current, { opacity: 0, scale: 0.8 });
            tl.to(buttonRef.current, {
                opacity: 1,
                scale: 1,
                ease: "back.out(1.7)",
            }, "-=0.5");
        }

        // Parallax effect for overlay
        if (overlayRef.current) {
            window.gsap.to(overlayRef.current, {
                scrollTrigger: {
                    trigger: ".hero-section-donate",
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                },
                scale: 1.2,
                opacity: 0.5,
                ease: "power1.inOut"
            });
        }

    }, []);

    return (
        <section className="hero-section-donate relative w-full h-screen flex items-center justify-center text-center overflow-hidden">
            <div ref={overlayRef} className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 opacity-80"></div>
            <div className="relative z-10 p-6 flex flex-col items-center">
                <h1 ref={titleRef} className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6">
                    Give Back. Build the Future.
                </h1>
                <p ref={subtitleRef} className="text-lg md:text-xl max-w-3xl mx-auto text-gray-300 mb-10">
                    Your contribution, big or small, creates opportunities, fuels innovation, and strengthens our community for generations to come.
                </p>
                <button 
                    ref={buttonRef}
                    onClick={onDonateClick}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 px-10 rounded-full text-lg shadow-lg transition-transform duration-300 ease-in-out hover:scale-105"
                >
                    Donate Now
                </button>
            </div>
        </section>
    );
};

// --- 2. Categories Section ---
const CategoriesSection = React.forwardRef(({ onDonateClick }, ref) => {
    const sectionRef = useRef(null);

    const donationCategories = [
        {
            title: "Scholarships",
            description: "Empower deserving students to achieve their academic dreams without financial burden.",
            raised: 75000,
            target: 100000,
            gradient: "from-purple-600 to-blue-600",
        },
        {
            title: "Infrastructure",
            description: "Help us build and maintain state-of-the-art facilities for learning and research.",
            raised: 120000,
            target: 250000,
            gradient: "from-red-600 to-orange-600",
        },
        {
            title: "Community Fund",
            description: "Support alumni events, mentorship programs, and networking opportunities.",
            raised: 30000,
            target: 50000,
            gradient: "from-purple-800 to-yellow-500",
        },
        {
            title: "Research Grants",
            description: "Fuel groundbreaking research that solves real-world problems and pushes boundaries.",
            raised: 90000,
            target: 150000,
            gradient: "from-teal-600 to-green-500",
        }
    ];

    useLayoutEffect(() => {
        if (!window.gsap) return;

        const cards = sectionRef.current?.querySelectorAll('.donation-card');
        if (cards) {
            window.gsap.set(cards, { opacity: 0, y: 100 });
            window.gsap.to(cards, {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                    toggleActions: "play none none none"
                },
                opacity: 1,
                y: 0,
                stagger: 0.2,
                duration: 0.8,
                ease: "power2.out"
            });
        }
    }, []);

    return (
        <section ref={(node) => {
            sectionRef.current = node;
            if (ref) ref.current = node; // forward the ref to parent
        }} className="categories-section py-20 md:py-28 bg-black">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">Choose a Cause to Support</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {donationCategories.map((cat, index) => (
                        <DonationCard key={index} {...cat} onDonateClick={() => onDonateClick(cat.title)} />
                    ))}
                </div>
            </div>
        </section>
    );
});

// --- 2a. Donation Card Component ---
const DonationCard = ({ title, description, raised, target, gradient, onDonateClick }) => {
    const progress = (raised / target) * 100;

    return (
        <div className="donation-card bg-gray-900/50 border border-gray-700 rounded-xl p-6 flex flex-col h-full transition-all duration-300 hover:border-gray-500 hover:-translate-y-2">
            <h3 className="text-2xl font-bold mb-3">{title}</h3>
            <p className="text-gray-400 mb-6 flex-grow">{description}</p>
            
            <div className="mb-4">
                <div className="flex justify-between items-end text-sm text-gray-300 mb-1">
                    <span>${raised.toLocaleString()} <span className="text-gray-500">Raised</span></span>
                    <span className="text-gray-500">Target: ${target.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div className={`bg-gradient-to-r ${gradient} h-2.5 rounded-full shadow-lg`} style={{ width: `${progress}%` }}></div>
                </div>
            </div>

            <div className="flex items-center justify-between mt-auto pt-4">
                <button 
                    onClick={onDonateClick}
                    className={`bg-gradient-to-r ${gradient} text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105`}
                >
                    Donate
                </button>
                <button className="text-gray-400 font-semibold py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors">
                    View Details
                </button>
            </div>
        </div>
    );
};

// --- 3. Testimonials Section ---
const TestimonialsSection = () => {
    const sectionRef = useRef(null);

    const testimonials = [
        {
            quote: "Contributing to the scholarship fund was my way of giving back. I'm proud to see the next generation of leaders thrive.",
            name: "Jane Doe",
            class: "Class of '98",
            image: "https://placehold.co/100x100/4C00FF/FFFFFF?text=JD"
        },
        {
            quote: "The new research labs, funded by alumni, are incredible. They're a game-changer for student projects and faculty research.",
            name: "John Smith",
            class: "Class of '05",
            image: "https://placehold.co/100x100/FF0033/FFFFFF?text=JS"
        }
    ];

    useLayoutEffect(() => {
        if (!window.gsap) return;

        const cards = sectionRef.current?.querySelectorAll('.testimonial-card');
        if (cards) {
            window.gsap.set(cards, { opacity: 0, x: -100 });
            
            window.gsap.to(cards, {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                },
                opacity: 1,
                x: 0,
                stagger: 0.3,
                duration: 1,
                ease: "power2.out"
            });
        }
    }, []);

    return (
        <section ref={sectionRef} className="testimonials-section py-20 md:py-28 bg-gray-900/60">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">The Impact of Your Giving</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="testimonial-card bg-black border border-gray-800 p-8 rounded-xl">
                            <p className="text-lg italic text-gray-300 mb-6">"{testimonial.quote}"</p>
                            <div className="flex items-center">
                                <img src={testimonial.image} alt={testimonial.name} className="w-14 h-14 rounded-full mr-4 border-2 border-blue-500" />
                                <div>
                                    <p className="font-bold text-white">{testimonial.name}</p>
                                    <p className="text-sm text-gray-400">{testimonial.class}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// --- 4. Donation Modal ---
const DonationModal = ({ isOpen, onClose, category }) => {
    const modalRef = useRef(null);
    const backdropRef = useRef(null);
    const [amount, setAmount] = useState('');

    useLayoutEffect(() => {
        if (!window.gsap) return;

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            
            // Set initial states
            window.gsap.set(backdropRef.current, { autoAlpha: 0 });
            window.gsap.set(modalRef.current, { 
                scale: 0.7, 
                opacity: 0, 
                y: 50,
                rotation: -5
            });
            
            // Animate in
            const tl = window.gsap.timeline();
            tl.to(backdropRef.current, { 
                autoAlpha: 1, 
                duration: 0.3 
            })
            .to(modalRef.current, { 
                scale: 1, 
                opacity: 1, 
                y: 0,
                rotation: 0,
                duration: 0.6, 
                ease: 'back.out(1.2)' 
            }, "-=0.1");
            
        } else if (modalRef.current && backdropRef.current) {
            // Animate out
            const tl = window.gsap.timeline();
            tl.to(modalRef.current, { 
                scale: 0.8, 
                opacity: 0, 
                y: -30,
                rotation: 3,
                duration: 0.4, 
                ease: 'power2.in' 
            })
            .to(backdropRef.current, { 
                autoAlpha: 0, 
                duration: 0.3 
            }, "-=0.2")
            .call(() => {
                document.body.style.overflow = 'auto';
            });
        }
    }, [isOpen]);

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <>
            <div
                ref={backdropRef}
                onClick={handleBackdropClick}
                className="fixed inset-0 bg-black bg-opacity-80 z-40 flex items-center justify-center p-4"
                style={{ visibility: 'hidden', opacity: 0 }}
            />
            
            <div
                ref={modalRef}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                style={{ transform: 'scale(0.7)', opacity: 0, willChange: 'transform' }}
            >
                <div className="bg-gray-900 text-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden pointer-events-auto border border-gray-700">
                    <div className="p-8 overflow-y-auto max-h-[90vh]">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Make a Donation</h2>
                            <button 
                                onClick={onClose} 
                                className="text-gray-400 text-2xl hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-full"
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                                <input 
                                    type="text" 
                                    value="Alex Ryder" 
                                    readOnly 
                                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-400 cursor-not-allowed"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                                <input 
                                    type="email" 
                                    value="alex.ryder@example.com" 
                                    readOnly 
                                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-400 cursor-not-allowed"
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="purpose" className="block text-sm font-medium text-gray-400 mb-2">Purpose</label>
                                <input 
                                    type="text" 
                                    id="purpose" 
                                    value={category} 
                                    readOnly 
                                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-not-allowed text-white font-medium"
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="amount" className="block text-sm font-medium text-gray-400 mb-2">Amount ($)</label>
                                <input 
                                    type="number" 
                                    id="amount" 
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Enter amount" 
                                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                                />
                            </div>
                        </div>

                        <div className="border-t border-gray-700 pt-6">
                            <p className="text-lg font-semibold text-center mb-2">Complete Your Donation</p>
                            <p className="text-sm text-center text-gray-400 mb-4">
                                Scan the QR code with your UPI app and enter the amount
                            </p>
                            <div className="bg-white p-4 rounded-xl flex justify-center">
                                <img 
                                    src="https://placehold.co/200x200/FFFFFF/000000?text=College+UPI+QR" 
                                    alt="College UPI QR Code" 
                                    className="w-40 h-40 object-contain"
                                />
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button 
                                    onClick={onClose}
                                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
                                >
                                    Confirm Donation
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default App;