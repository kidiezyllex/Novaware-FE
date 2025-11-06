import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const DEFAULT_SRC =
  'https://lottie.host/3b1fcf27-8ddd-4b39-9bb1-0930cc3ceaca/Mg0srF2Fsh.lottie'
/**
 * @param {{ src?: string, loop?: boolean, autoplay?: boolean, className?: any, style?: any }} props
 */
const LottieLoading = ({
  src = DEFAULT_SRC,
  loop = true,
  autoplay = true,
  className = undefined,
  style = undefined,
}) => {
  return (
    <div className={className} style={{transform: 'scale(0.75)'}} aria-busy="true" aria-live="polite">
      <DotLottieReact src={src} loop={loop} autoplay={autoplay} />
    </div>
  );
};

export default LottieLoading;


