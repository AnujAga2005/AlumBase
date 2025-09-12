import { useGSAP } from "@gsap/react";
import { alumni } from "../constants";
import gsap from "gsap";
import { useRef } from "react";
import { useMediaQuery } from "react-responsive";
import { FollowerPointerCard } from "../components/AlumniCard";

const CardSlider = () => {
  const sliderRef = useRef();

  const isTablet = useMediaQuery({
    query: "(max-width: 1024px)",
  });

  useGSAP(() => {
    const scrollAmount = sliderRef.current.scrollWidth - window.innerWidth;

    if (!isTablet) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".flavor-section",
          start: "2% top",
          end: `+=${scrollAmount + 1500}px`,
          scrub: true,
          pin: true,
        },
      });

      tl.to(".flavor-section", {
        x: `-${scrollAmount + 1500}px`,
        ease: "power1.inOut",
      });
    }

    const titleTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".flavor-section",
        start: "top top",
        end: "bottom 80%",
        scrub: true,
      },
    });

    titleTl
      .to(".first-text-split", {
        xPercent: -30,
        ease: "power1.inOut",
      })
      .to(
        ".flavor-text-scroll",
        {
          xPercent: -22,
          ease: "power1.inOut",
        },
        "<"
      )
      .to(
        ".second-text-split",
        {
          xPercent: -10,
          ease: "power1.inOut",
        },
        "<"
      );
  });



  const blogContent = {
    name: "Kumar Aditya",
    batch:
      "2021-2025",
    company:
      "Keysight",
    image: "https://images.pexels.com/photos/7972735/pexels-photo-7972735.jpeg",
    authorAvatar: "/manu.png",
  };
  

  const TitleComponent = ({
    title,
    avatar
  }) => (
    <div className="flex items-center space-x-2">
      <img
        src={avatar}
        height="20"
        width="20"
        alt="thumbnail"
        className="rounded-full border-2 border-white" />
      <p>{title}</p>
    </div>
  );

  return (
    <div ref={sliderRef} className="slider-wrapper">
      <div className="flavors">
        {alumni.map((flavor) => (
          <div className="mx-auto w-80">
          
            
            <div
              className="group relative h-full overflow-hidden rounded-2xl border border-zinc-100 bg-white transition duration-200 hover:shadow-xl">
              <div
                className="relative aspect-[16/10] w-full overflow-hidden h-64 rounded-tl-lg rounded-tr-lg bg-gray-100">
                <img
                  src={blogContent.image}
                  alt="thumbnail"
                  className="h-full transform object-cover transition duration-200 group-hover:scale-95 group-hover:rounded-2xl" />
              </div>
              <div className="p-4">
                <h2 className="my-1 text-lg font-bold text-zinc-700">
                  {blogContent.name}
                </h2>
                <h2 className="my-1 text-sm font-normal text-zinc-500">
                  Batch: {blogContent.batch}
                </h2>
                <h2 className="my-1 text-sm font-normal text-zinc-500">
                  Organisation: {blogContent.company}
                </h2>
                <div className="mt-5 flex flex-row items-center justify-center">
                  <div
                    className="relative z-10 block rounded-xl bg-black px-6 py-2 text-xs font-bold text-white">
                    View All Alumni
                  </div>
                </div>
              </div>
            </div>
          
        </div>
        ))}
      </div>
    </div>
  );
};

export default CardSlider;





