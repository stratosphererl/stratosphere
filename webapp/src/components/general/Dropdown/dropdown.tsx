import React, { useState} from 'react';
import './dropdown.css';

// ** Dropdown.tsx **
// This component is a dropdown menu that can be used to display a list of options.
function Dropdown({DropdownButton, children}: {DropdownButton: React.ReactNode, children: JSX.Element[]}) {
  const [isActive, setIsActive] = useState(false);

  const toggleDropdown = () => {
    setIsActive(!isActive);
  };

  return (
    <div className={`dropdown ${isActive ? 'dropdown-active' : ''}`}>
      <div onClick={toggleDropdown}>{DropdownButton}</div>
      <div className={`dropdown-menu`}>
        {children}
      </div>
    </div>
  );
}

export default Dropdown;