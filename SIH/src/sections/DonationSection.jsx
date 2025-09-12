import { useGSAP } from "@gsap/react";
import ClipPathTitle from "../components/ClipPathTitle";
import gsap from "gsap";
import VideoPinSection from "../components/VideoPinSection";
import { StickyScrollCard } from '../sections/DonationCardSection';

const DonationSection = () => {
  useGSAP(() => {
    const revealTl = gsap.timeline({
      delay: 1,
      scrollTrigger: {
        trigger: ".benefit-section",
        start: "top 60%",
        end: "top top",
        scrub: 1.5,
      },
    });

    revealTl
      .to(".benefit-section .first-title", {
        duration: 1,
        opacity: 1,
        clipPath: "polygon(0% 0%, 100% 0, 100% 100%, 0% 100%)",
        ease: "circ.out",
      })
      .to(".benefit-section .second-title", {
        duration: 1,
        opacity: 1,
        clipPath: "polygon(0% 0%, 100% 0, 100% 100%, 0% 100%)",
        ease: "circ.out",
      })
      .to(".benefit-section .third-title", {
        duration: 1,
        opacity: 1,
        clipPath: "polygon(0% 0%, 100% 0, 100% 100%, 0% 100%)",
        ease: "circ.out",
      })
      .to(".benefit-section .fourth-title", {
        duration: 1,
        opacity: 1,
        clipPath: "polygon(0% 0%, 100% 0, 100% 100%, 0% 100%)",
        ease: "circ.out",
      });
  });

  return (
    <>
    <section className="benefit-section">
      <div className="container mx-auto pt-20">
        <div className="col-center">
          <p>
            Unlock the Advantages: <br />
            Discover the Impact of Your Support
          </p>

          <div className="mt-20 col-center">
            <ClipPathTitle
              title={"FUEL THE FUTURE"}
              color={"#ffffff"}
              className="first-title text-white font-bold 
              bg-gradient-to-r from-[#0D0D2A] via-[#4C00FF] to-[#0066FF] 
              shadow-[0_0_20px_rgba(76,0,255,0.7)]"
              borderColor={"#ffffff"}
            />
            <ClipPathTitle
              title={"Support. Inspire. Transform."}
              color={"#ffffff"}
              className="second-title text-white font-bold 
              bg-gradient-to-r from-[#1A0000] via-[#FF0033] to-[#FF6600] 
              shadow-[0_0_20px_rgba(255,51,0,0.7)]"
              borderColor={"#ffffff"}
            />
            <ClipPathTitle
              title={"Legacy Through Giving"}
              color={"#ffffff"}
              className="third-title text-white font-bold 
              bg-gradient-to-r from-[#0A001A] via-[#3D0075] to-[#FFB700] 
              shadow-[0_0_20px_rgba(255,183,0,0.6)]"
              borderColor={"#ffffff"}
            />
            <ClipPathTitle
              title={"Together We Rise"}
              color={"#ffffff"}
              className="fourth-title text-white font-bold 
              bg-gradient-to-r from-[#001A1A] via-[#0088CC] to-[#00FF55] 
              shadow-[0_0_20px_rgba(0,255,85,0.6)]"
              borderColor={"#ffffff"}
            />
          </div>

          <div className="md:mt-0 mt-10">
            <p>And much more ...</p>
          </div>
        </div>
      </div>

      <div className="relative overlay-box">
        <VideoPinSection />
      </div>
      <StickyScrollCard/>
            
    </section>
    
          
    </>
  );
};

export default DonationSection;
