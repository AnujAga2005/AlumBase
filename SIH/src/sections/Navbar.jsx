import React, { useState, useLayoutEffect, useRef, useEffect } from 'react';
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Link } from "react-router-dom";
import Button from "../components/Button";

// --- Authentication Modal Component ---
const AuthModal = ({ isOpen, onClose, userType }) => {
    const [isSignup, setIsSignup] = useState(true);
    const modalRef = useRef(null);
    const backdropRef = useRef(null);

    useLayoutEffect(() => {
        if (!gsap) return;

        const tl = gsap.timeline({ paused: true });
        tl.to(backdropRef.current, { autoAlpha: 1, duration: 0.3 })
          .fromTo(modalRef.current, 
              { scale: 0.8, opacity: 0, y: 50 }, 
              { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, 
              "-=0.2")
          .eventCallback('onReverseComplete', () => {
              document.body.style.overflow = 'auto';
          });

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            tl.play();
        } else {
            tl.reverse();
        }

        return () => { tl.kill(); };
    }, [isOpen]);

    const studentSignupFields = [
        { name: 'fullName', placeholder: 'Full Name', type: 'text' },
        { name: 'email', placeholder: 'Email', type: 'email' },
        { name: 'password', placeholder: 'Password', type: 'password' },
        { name: 'branch', placeholder: 'Branch / Department', type: 'text' },
        { name: 'yearOfStudy', placeholder: 'Current Year of Study', type: 'text' },
        { name: 'skills', placeholder: 'Skills / Interests', type: 'text' },
    ];

    const alumniSignupFields = [
        { name: 'fullName', placeholder: 'Full Name', type: 'text' },
        { name: 'email', placeholder: 'Email', type: 'email' },
        { name: 'password', placeholder: 'Password', type: 'password' },
        { name: 'batch', placeholder: 'Batch (Year of Graduation)', type: 'text' },
        { name: 'branch', placeholder: 'Branch / Department', type: 'text' },
        { name: 'company', placeholder: 'Current Company / Organization', type: 'text' },
        { name: 'jobTitle', placeholder: 'Job Title / Role', type: 'text' },
        { name: 'location', placeholder: 'Location (City, Country)', type: 'text' },
        { name: 'linkedin', placeholder: 'LinkedIn Profile (optional)', type: 'url' },
        { name: 'phone', placeholder: 'Phone (optional)', type: 'tel' },
    ];

    const loginFields = [
        { name: 'email', placeholder: 'Email', type: 'email' },
        { name: 'password', placeholder: 'Password', type: 'password' },
    ];

    const fields = isSignup ? (userType === 'student' ? studentSignupFields : alumniSignupFields) : loginFields;
    const title = `${isSignup ? 'Sign Up' : 'Log In'} as ${userType === 'student' ? 'a Student' : 'an Alumnus'}`;

    if (!isOpen) return null;

    return (
        <div ref={backdropRef} onClick={onClose} className="fixed inset-0 bg-black bg-opacity-80 z-[100] flex items-center justify-center p-4" style={{ opacity: 0, visibility: 'hidden' }}>
            <div ref={modalRef} onClick={(e) => e.stopPropagation()} className="bg-gray-900 text-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-purple-500/50 p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 text-3xl hover:text-white transition-colors">&times;</button>
                </div>
                
                <form className="space-y-4">
                    {fields.map(field => (
                        <input
                            key={field.name}
                            type={field.type}
                            placeholder={field.placeholder}
                            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    ))}
                    <button type="submit" className="w-full text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                        {isSignup ? 'Create Account' : 'Log In'}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <button onClick={() => setIsSignup(!isSignup)} className="text-sm text-gray-400 hover:text-white transition-colors">
                        {isSignup ? `Already have an account? Log In` : `Don't have an account? Sign Up`}
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- Navbar Component ---
export const Navbar = () => {
    const navRef = useRef(null);
    const linksRef = useRef([]);
    const contactRef = useRef(null);
    const topLineRef = useRef(null);
    const bottomLineRef = useRef(null);
    const tl = useRef(null);
    const iconTl = useRef(null);
    const subMenuRef = useRef(null);
    const subLinksRef = useRef([]);
    const subTl = useRef(null);

    const [isOpen, setIsOpen] = useState(false);
    const [showBurger, setShowBurger] = useState(true);
    const [openSub, setOpenSub] = useState(false);
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalUserType, setModalUserType] = useState('student');

    const navLinks = [
        { name: "home", path: "/" },
        {
            name: "Events",
            sub: [
                { name: "registered events", path: "/events" },
                { name: "all events", path: "/events" },
            ],
        },
        { name: "alumni directory", path: "/alumni" }, // Corrected path
        { name: "jobs/internship", path: "/guides" },
        { name: "donations", path: "/donations" }, // Corrected path
    ];
    
    const openAuthModal = (userType) => {
        setModalUserType(userType);
        setIsModalOpen(true);
        // Close nav menu if open
        if (isOpen) {
            toggleMenu();
        }
    };

    useGSAP(() => {
        gsap.set(navRef.current, { xPercent: 100 });
        gsap.set([linksRef.current, contactRef.current], { autoAlpha: 0, x: -20 });

        tl.current = gsap.timeline({ paused: true })
            .to(navRef.current, { xPercent: 0, duration: 0.5, ease: "power3.out" })
            .to(linksRef.current, { autoAlpha: 1, x: 0, stagger: 0.2, duration: 0.45, ease: "power2.out" }, "<")
            .to(contactRef.current, { autoAlpha: 1, x: 0, duration: 0.45, ease: "power2.out" }, "<+0.15");

        iconTl.current = gsap.timeline({ paused: true })
            .to(topLineRef.current, { rotate: 45, y: 3.3, duration: 0.25, ease: "power2.inOut" })
            .to(bottomLineRef.current, { rotate: -45, y: -3.3, duration: 0.25, ease: "power2.inOut" }, "<");

        gsap.set(subMenuRef.current, { height: 0, autoAlpha: 0, overflow: "hidden" });
        gsap.set(subLinksRef.current, { autoAlpha: 0, x: -20 });

        subTl.current = gsap.timeline({ paused: true })
            .to(subMenuRef.current, { height: "auto", autoAlpha: 1, duration: 0.35, ease: "power2.out" })
            .to(subLinksRef.current, { autoAlpha: 1, x: 0, stagger: 0.12, duration: 0.3, ease: "power2.out" }, "-=0.2");
    }, []);

    useEffect(() => {
        let lastScrollY = window.scrollY;
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setShowBurger(currentScrollY <= lastScrollY || currentScrollY < 10);
            lastScrollY = currentScrollY;
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleMenu = () => {
        if (isOpen) {
            tl.current.reverse();
            iconTl.current.reverse();
            if (openSub) {
                subTl.current.reverse();
                setOpenSub(false);
            }
        } else {
            tl.current.play();
            iconTl.current.play();
        }
        setIsOpen(!isOpen);
    };

    const toggleSubMenu = () => {
        if (openSub) {
            subTl.current.reverse();
        } else {
            subLinksRef.current = subLinksRef.current.filter(Boolean);
            subTl.current.play();
        }
        setOpenSub(!openSub);
    };

    const handleSubLinkClick = () => {
        subTl.current.reverse();
        setOpenSub(false);
        tl.current.reverse();
        iconTl.current.reverse();
        setIsOpen(false);
    };

    const Button = ({ data, onClick }) => (
        <button onClick={onClick} className="bg-gray-800 border border-gray-700 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors">
            {data}
        </button>
    );

    return (
        <>
            <nav
                ref={navRef}
                className="fixed z-50 flex flex-col justify-between w-full h-full px-8 uppercase bg-black text-white/90 py-24 gap-y-8 md:w-1/2 md:left-1/2"
            >
                <div className="flex flex-col text-3xl gap-y-2 md:text-5xl lg:text-3xl">
                    {navLinks.map((item, index) => (
                        <div key={index} ref={(el) => (linksRef.current[index] = el)}>
                            {item.sub ? (
                                <div>
                                    <div
                                        className="flex items-center justify-between cursor-pointer hover:text-white transition-all duration-200"
                                        onClick={toggleSubMenu}
                                    >
                                        <span className="select-none">{item.name}</span>
                                        <span className={`transform transition-transform duration-200 text-2xl ${openSub ? "rotate-180" : "rotate-0"}`}>▼</span>
                                    </div>
                                    <div ref={subMenuRef} className="ml-6 flex flex-col gap-y-2 text-xl">
                                        {item.sub.map((subItem, subIndex) => (
                                            <Link
                                                key={subIndex}
                                                ref={(el) => (subLinksRef.current[subIndex] = el)}
                                                className="transition-all duration-200 cursor-pointer hover:text-white"
                                                to={subItem.path}
                                                onClick={handleSubLinkClick}
                                            >
                                                {subItem.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <Link className="transition-all duration-200 cursor-pointer hover:text-white" to={item.path}>
                                    {item.name}
                                </Link>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex justify-center gap-x-10 md:gap-x-20">
                    <Button data={'Student Login'} onClick={() => openAuthModal('student')} />
                    <Button data={'Alumni Login'} onClick={() => openAuthModal('alumni')} />
                </div>

                <div ref={contactRef} className="flex flex-col flex-wrap justify-between gap-4 md:flex-row">
                    <div className="font-light">
                        <p className="tracking-wider text-white/50">Website</p>
                        <p className="text-lg tracking-widest lowercase text-pretty">yourcollege.edu</p>
                    </div>
                </div>
            </nav>

            <div
                className="fixed z-[60] flex flex-col items-center justify-center gap-1 transition-all duration-300 bg-black rounded-full cursor-pointer w-14 h-14 md:w-20 md:h-20 top-4 right-10"
                onClick={toggleMenu}
                style={showBurger ? { clipPath: "circle(50% at 50% 50%)" } : { clipPath: "circle(0% at 50% 50%)" }}
                aria-label="Toggle menu"
            >
                <span ref={topLineRef} className="block w-8 h-0.5 bg-white rounded-full origin-center"></span>
                <span ref={bottomLineRef} className="block w-8 h-0.5 bg-white rounded-full origin-center"></span>
            </div>
            
            <AuthModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                userType={modalUserType} 
            />
        </>
    );
};
