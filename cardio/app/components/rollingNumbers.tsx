import { useEffect, useRef } from "react";
import {
  motion,
  useInView,
  useSpring,
  useTransform,
} from "framer-motion";
interface RollingNumberProps {
  value: number;
  delay?: number;
}

const RollingNumber = ({
  value,
  delay = 0,
}: RollingNumberProps) => {
  const ref = useRef<HTMLSpanElement | null>(null);

  const isInView = useInView(ref, {
    once: true,
    margin: "0px",
  });

  const springValue = useSpring(0, {
    mass: 1,
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const displayValue = useTransform(springValue, (latest) =>
    Math.round(latest),
  );

  useEffect(() => {
    if (!isInView) return;

    const timer = setTimeout(() => {
      springValue.set(value);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [value, delay, isInView, springValue]);

  return (
    <motion.span ref={ref} className="inline-block">
      {displayValue}
    </motion.span>
  );
};

export default RollingNumber;