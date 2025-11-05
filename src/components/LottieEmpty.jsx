import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const DEFAULT_SRC =
  'https://lottie.host/f6052d25-1140-4e80-9a1f-b625e5352a19/FmrnTTtT4U.lottie'
/**
 * @param {{ src?: string, loop?: boolean, autoplay?: boolean, className?: any, style?: any }} props
 */
const LottieEmpty = ({
  src = DEFAULT_SRC,
  loop = true,
  autoplay = true,
  className = undefined,
  style = undefined,
}) => {
  return (
    <div className={className} aria-busy="true" aria-live="polite">
      <DotLottieReact src={src} loop={loop} autoplay={autoplay} />
    </div>
  );
};

export default LottieEmpty;


