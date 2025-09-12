import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/all";
import { useMediaQuery } from "react-responsive";
import DarkVeil from '../components/DarkVeil';
import Eyes from '../components/Eyes';


const HeroSection = () => {
  const isMobile = useMediaQuery({
    query: "(max-width: 768px)",
  });

  const isTablet = useMediaQuery({
    query: "(max-width: 1024px)",
  });

  useGSAP(() => {
  const titleSplit = SplitText.create(".hero-title", {
      type: "chars",
    });

    const tl = gsap.timeline({
      delay: 1,
    });

    tl.to(".hero-content", {
      opacity: 1,
      y: 0,
      ease: "power1.inOut",
    })
      .to(
        ".hero-text-scroll",
        {
          duration: 1,
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          ease: "circ.out",
        },
        "-=0.5"
      )
      .from(titleSplit.chars, {
        yPercent: 200,
        opacity: 0,
        stagger: 0.02,
        ease: "power2.out",
        }, "-=0.5");


    const heroTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".hero-container",
        start: "1% top",
        end: "bottom top",
        scrub: true,
      },
    });
    heroTl.to(".hero-container", {
    //rotate: 7,
      scale: 0.9,
      yPercent: 30,
      ease: "power1.inOut",
    });
  });

  return (
    <section className="relative w-full h-screen overflow-hidden">
      
          <DarkVeil />
          <div className="hero-container bg-transparent absolute inset-0 flex items-center justify-center">
            <div className="hero-content">
          
            <h1 className="hero-title text-white">Your College.Your Network.</h1>
          
          <div
            style={{
              clipPath: "polygon(50% 0, 50% 0, 50% 100%, 50% 100%)",
            }}
            className="hero-text-scroll border-white "
          >
            <div className="hero-subtitle bg-black">
              <h1 className="text-white">Stronger Together</h1>
            </div>

          </div>
          
          <h2 className="text-white">
            Stay connected with your college community. Share experiences, explore opportunities, and grow with a network that lasts a lifetime.
          </h2>
          <Eyes/>
          {/* <div className="hero-button">
            <p>Join the Network</p>
          </div> */}
        </div>
          </div>

          
          
    
      
    </section>
  );
};

export default HeroSection;
