// src https://dev.to/michalczaplinski/super-easy-react-mount-unmount-animations-with-hooks-4foj

import React, { useEffect, useState } from "react";

const Reveal = ({ on , children } : {on : any, children : JSX.Element}) => {
  const [shouldRender, setRender] = useState(on);

  useEffect(() => {
    if (on) setRender(true);
  }, [on]);

  const onAnimationEnd = () => {
    if (!on) setRender(false);
  };

  return (
    shouldRender && (
      <div
        style={{ animation: `${on ? "fadeIn" : "fadeOut"} 1s` }}
        onAnimationEnd={onAnimationEnd}>
        {children}
      </div>
    )
  );
};

export default Reveal;