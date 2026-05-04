import React, { useId } from 'react';
import styled from 'styled-components';

interface CustomCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  checked,
  onChange,
  label,
  className = ""
}) => {
  const id = useId();

  return (
    <StyledWrapper className={className}>
      <div className="checkbox-wrapper">
        <input 
          id={id} 
          name="checkbox" 
          type="checkbox" 
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <label className="terms-label" htmlFor={id}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 200 200" className="checkbox-svg">
            <mask fill="white" id={`path-mask-${id}`}>
              <rect height={200} width={200} />
            </mask>
            <rect 
              mask={`url(#path-mask-${id})`} 
              strokeWidth={40} 
              className="checkbox-box" 
              height={200} 
              width={200} 
            />
            <path strokeWidth={15} d="M52 111.018L76.9867 136L149 64" className="checkbox-tick" />
          </svg>
          {label && <span className="label-text">{label}</span>}
        </label>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;

  .checkbox-wrapper input[type="checkbox"] {
    display: none;
  }

  .checkbox-wrapper .terms-label {
    cursor: pointer;
    display: flex;
    align-items: center;
    user-select: none;
  }

  .checkbox-wrapper .terms-label .label-text {
    margin-left: 10px;
    font-weight: 500;
    color: #4b5563;
    transition: color 0.3s ease;
  }

  .checkbox-wrapper input[type="checkbox"]:checked + .terms-label .label-text {
    color: #f97316;
  }

  .checkbox-wrapper .checkbox-svg {
    width: 32px;
    height: 32px;
  }

  .checkbox-wrapper .checkbox-box {
    fill: rgba(207, 205, 205, 0.25);
    stroke: #f97316;
    stroke-dasharray: 800;
    stroke-dashoffset: 800;
    transition: stroke-dashoffset 0.6s ease-in-out;
  }

  .checkbox-wrapper .checkbox-tick {
    stroke: #f97316;
    stroke-dasharray: 172;
    stroke-dashoffset: 172;
    transition: stroke-dashoffset 0.6s ease-in-out;
  }

  .checkbox-wrapper input[type="checkbox"]:checked + .terms-label .checkbox-box,
  .checkbox-wrapper input[type="checkbox"]:checked + .terms-label .checkbox-tick {
    stroke-dashoffset: 0;
  }

  .checkbox-wrapper:hover .checkbox-box {
    stroke-dashoffset: 740;
  }
`;

export default CustomCheckbox;