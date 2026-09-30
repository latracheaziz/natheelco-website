const WaveLinesBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none bg-[#0a1128] z-0">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-90 mix-blend-screen"
        src="/blue-lines-bg.mp4"
      />
      {/* Optional fallback gradient if video takes time to load */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary to-transparent opacity-80" />
    </div>
  );
};

export default WaveLinesBackground;
