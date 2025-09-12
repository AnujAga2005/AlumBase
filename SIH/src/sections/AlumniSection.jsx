import AnimatedHeaderSection from "../components/AnimatedHeaderSection";
import AlumniCard from '../components/AlumniCard';

const AlumniSection = () => {

  const text = `alumni: our pride, our inspiration, our family
    your memories keep our
    tradition alive.`;

  return (
    <section id="work" className="bg-black flex flex-col min-h-screen">
      <AnimatedHeaderSection
   
        title={"Meet Our Alumni"}
        text={text}
        textColor={"text-white"}
        withScrollTrigger={true}
      />
     <div className="flex justify-center"> 
     <AlumniCard 
    textAutoHide={true}
    enableStars={true}
    enableSpotlight={true}
    enableBorderGlow={true}
    enableTilt={true}
    enableMagnetism={true}
    clickEffect={true}
    spotlightRadius={400}
    particleCount={12}
    glowColor="45, 7, 211"
  />
     </div>
    </section>
  );
};

export default AlumniSection;
