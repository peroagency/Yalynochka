interface SnowflakeSpec {
  left: string;
  size: number;
  fallDuration: string;
  fallDelay: string;
  shakeDuration: string;
  shakeDelay: string;
  opacity: number;
}

const SNOWFLAKES: SnowflakeSpec[] = [
  { left: '3%', size: 5, fallDuration: '8.5s', fallDelay: '-2.1s', shakeDuration: '3.4s', shakeDelay: '-0.5s', opacity: 0.75 },
  { left: '9%', size: 8, fallDuration: '10.5s', fallDelay: '-6.4s', shakeDuration: '4.1s', shakeDelay: '-1.2s', opacity: 0.85 },
  { left: '15%', size: 4, fallDuration: '7.5s', fallDelay: '-1.5s', shakeDuration: '3.2s', shakeDelay: '-0.8s', opacity: 0.65 },
  { left: '21%', size: 7, fallDuration: '9.8s', fallDelay: '-4.8s', shakeDuration: '3.9s', shakeDelay: '-2.0s', opacity: 0.8 },
  { left: '27%', size: 6, fallDuration: '11.2s', fallDelay: '-8.2s', shakeDuration: '4.4s', shakeDelay: '-1.1s', opacity: 0.7 },
  { left: '34%', size: 9, fallDuration: '9.0s', fallDelay: '-3.3s', shakeDuration: '3.7s', shakeDelay: '-2.5s', opacity: 0.88 },
  { left: '41%', size: 5, fallDuration: '8.0s', fallDelay: '-5.7s', shakeDuration: '3.5s', shakeDelay: '-0.4s', opacity: 0.72 },
  { left: '47%', size: 7, fallDuration: '10.8s', fallDelay: '-2.9s', shakeDuration: '4.2s', shakeDelay: '-1.9s', opacity: 0.82 },
  { left: '53%', size: 4, fallDuration: '7.8s', fallDelay: '-6.1s', shakeDuration: '3.3s', shakeDelay: '-1.4s', opacity: 0.65 },
  { left: '59%', size: 8, fallDuration: '9.6s', fallDelay: '-1.2s', shakeDuration: '4.0s', shakeDelay: '-2.7s', opacity: 0.86 },
  { left: '66%', size: 6, fallDuration: '11.5s', fallDelay: '-7.4s', shakeDuration: '4.5s', shakeDelay: '-0.9s', opacity: 0.76 },
  { left: '72%', size: 5, fallDuration: '8.3s', fallDelay: '-4.2s', shakeDuration: '3.6s', shakeDelay: '-2.1s', opacity: 0.74 },
  { left: '78%', size: 9, fallDuration: '10.1s', fallDelay: '-9.0s', shakeDuration: '4.3s', shakeDelay: '-1.6s', opacity: 0.9 },
  { left: '84%', size: 4, fallDuration: '7.6s', fallDelay: '-3.8s', shakeDuration: '3.1s', shakeDelay: '-0.7s', opacity: 0.68 },
  { left: '90%', size: 7, fallDuration: '9.4s', fallDelay: '-5.2s', shakeDuration: '3.8s', shakeDelay: '-2.3s', opacity: 0.82 },
  { left: '95%', size: 6, fallDuration: '10.6s', fallDelay: '-1.9s', shakeDuration: '4.0s', shakeDelay: '-1.0s', opacity: 0.75 },
];

export function SnowOverlay() {
  return (
    <div className="snowflakes-overlay" aria-hidden="true">
      {SNOWFLAKES.map((flake, idx) => (
        <div
          key={idx}
          className="snowflake-item"
          style={{
            left: flake.left,
            animationDuration: flake.shakeDuration,
            animationDelay: flake.shakeDelay,
            opacity: flake.opacity,
          }}
        >
          <div
            className="snowflake-inner"
            style={{
              animationDuration: flake.fallDuration,
              animationDelay: flake.fallDelay,
            }}
          >
            <div
              className="snowflake-orb"
              style={{
                width: `${flake.size}px`,
                height: `${flake.size}px`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
