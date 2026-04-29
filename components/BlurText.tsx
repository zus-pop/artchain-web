import { Easing } from 'motion/react';

type BlurTextProps = {
  text?: string;
  delay?: number;
  className?: string;
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom';
  threshold?: number;
  rootMargin?: string;
  animationFrom?: Record<string, string | number>;
  animationTo?: Array<Record<string, string | number>>;
  easing?: Easing | Easing[];
  onAnimationComplete?: () => void;
  stepDuration?: number;
};

const BlurText: React.FC<BlurTextProps> = ({
  text = '',
  className = '',
  animateBy = 'words'
}) => {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');
  return (
    <p className={`blur-text ${className} flex flex-wrap`}>
      {elements.map((segment, index) => {
        return (
          <span
            key={index}
            style={{
              display: 'inline-block'
            }}
          >
            {segment === ' ' ? '\u00A0' : segment}
            {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
          </span>
        );
      })}
    </p>
  );
};

export default BlurText;
