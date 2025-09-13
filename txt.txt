import React from 'react'
import HeroSection from '../sections/HeroSection'
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import MessageSection from '../sections/MessageSection';
import EventSection from '../sections/EventSection';
import DonationSection from '../sections/DonationSection';
import AlumniSection from '../sections/AlumniSection';


gsap.registerPlugin(ScrollTrigger)

export const Home = () => {
  return (
    <div id="smooth-wrapper">
       <div id="smooth-content">
        
        <HeroSection/>
        <MessageSection/>
        <AlumniSection/>
        <EventSection/>
        <DonationSection/>
       </div>
    </div>
  )
}

