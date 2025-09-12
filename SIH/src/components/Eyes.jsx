import React, { useEffect, useState } from "react";
import './Eyes.css';


const Eyes = () => {
    const [rotate, setRotate] = useState(0);

useEffect(() => {
  window.addEventListener("mousemove", (e) => {
    let mouseX = e.clientX;
    let mouseY = e.clientY;

    let deltaX = mouseX - window.innerWidth / 2;
    let deltaY = mouseY - window.innerHeight / 2;

    var angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    setRotate(angle-180);
  });
});

  return (
    
      <div className="inner_eyes" data-scroll data-scroll-speed="0.7" >
        <div className="white_part">
          <div className="black_part">
            <div
              className="line"
              style={{
                transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
              }}
            >
              <div className="small_white"></div>
            </div>
          </div>
        </div>
        <div className="white_part">
          <div className="black_part">
            <div
              className="line"
              style={{
                transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
              }}
            >
              <div className="small_white"></div>
            </div>
          </div>
        </div>
      </div>
    
  );
};

export default Eyes;
