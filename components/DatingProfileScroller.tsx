"use client"
import React from "react";

const profiles = [
  { name: 'Jessica', age: 28, image: 'https://images.unsplash.com/photo-1515405295579-ba7b45403062?q=80&w=1760&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { name: 'Amanda', age: 25, image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1345&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { name: 'Chloe', age: 29, image: 'https://images.unsplash.com/photo-1577083165633-14ebcdb0f658?q=80&w=1288&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { name: 'Olivia', age: 26, image: 'https://plus.unsplash.com/premium_photo-1676668708126-39b12a0e9d96?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { name: 'Sophia', age: 27, image: 'https://images.unsplash.com/photo-1549289524-06cf8837ace5?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { name: 'Emily', age: 24, image: 'https://images.unsplash.com/photo-1578926314433-e2789279f4aa?q=80&w=1310&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { name: 'Madison', age: 30, image: 'https://images.unsplash.com/photo-1688223953516-6ec8d25745a7?q=80&w=1263&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
];

const InfiniteMovingCards = ({ items, direction = "up", speed = "normal" }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);
  const [start, setStart] = React.useState(false);

  React.useEffect(() => {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);
      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        scrollerRef.current.appendChild(duplicatedItem);
      });

      const getDirection = () => containerRef.current!.style.setProperty("--animation-direction", direction === "up" ? "forwards" : "reverse");
      const getSpeed = () => {
        let duration = speed === "fast" ? "20s" : speed === "normal" ? "40s" : "80s";
        containerRef.current!.style.setProperty("--animation-duration", duration);
      };

      getDirection();
      getSpeed();
      setStart(true);
    }
  }, [direction, speed]);

  return (
    <div
      ref={containerRef}
      className="scroller relative z-20 h-full max-h-[800px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,white_20%,white_80%,transparent)]"
    >
      <ul ref={scrollerRef} className={`flex min-w-full shrink-0 flex-col items-center justify-center gap-4 py-4 ${start ? "animate-scroll-vertical" : ""} hover:[animation-play-state:paused]`}>
        {items.map((item, idx) => (
          <li className="relative h-[350px] w-[280px] overflow-hidden rounded-2xl shadow-lg" key={`${item.name}-${idx}`}>
            <img src={item.image} alt={item.name} className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/280x350/fecaca/991b1b?text=Image+Not+Found' }} />
            <div className="absolute bottom-0 left-0 flex h-1/3 w-full flex-col justify-end bg-gradient-to-t from-black/80 to-transparent p-4">
              <h3 className="text-xl font-bold text-white">{item.name}, {item.age}</h3>
              <p className="text-sm text-white/80">New York, USA</p>
            </div>
          </li>
        ))}
      </ul>
      <style jsx global>{`
        @keyframes scroll-vertical { to { transform: translateY(calc(-50% - 0.5rem)); } }
        .animate-scroll-vertical { animation: scroll-vertical var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite; }
      `}</style>
    </div>
  );
};

export default function DatingProfileScroller() {
  const firstColumn = profiles.slice(0, 3);
  const secondColumn = profiles.slice(3, 6);
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-rose-50 p-4 rounded-lg">
      <div className="flex justify-center gap-4">
        <InfiniteMovingCards items={firstColumn} direction="up" speed="slow" />
        <div className="mt-[-150px] hidden sm:block">
          <InfiniteMovingCards items={secondColumn} direction="down" speed="normal" />
        </div>
      </div>
    </div>
  );
}