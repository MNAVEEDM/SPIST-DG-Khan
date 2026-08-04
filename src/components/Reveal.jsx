import { useReveal } from '../hooks/useReveal';

/**
 * Wraps children in a fade-and-rise-on-scroll container.
 * `delay` staggers siblings (ms).
 */
export default function Reveal({ children, delay = 0, className = '', as: Tag = 'div' }) {
  const [ref, visible] = useReveal();

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
