export default function ChameleonBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#030712] z-0">
      {/* 
        Extremely low-contrast, dark animated gradient fields.
        They shift slowly to create a 'chameleon' effect that absorbs the bright LiquidFluid colors.
      */}
      <div 
        className="absolute w-[150%] h-[150%] top-[-25%] left-[-25%] opacity-40 blur-[120px] mix-blend-screen"
        style={{
          background: 'radial-gradient(circle at center, #1a0b2e 0%, #0d1b2a 40%, transparent 80%)',
          animation: 'chameleonShift 20s ease-in-out infinite alternate'
        }}
      />
      <div 
        className="absolute w-[120%] h-[120%] bottom-[-10%] right-[-10%] opacity-30 blur-[100px] mix-blend-screen"
        style={{
          background: 'radial-gradient(circle at center, #2a0808 0%, #051923 50%, transparent 80%)',
          animation: 'chameleonShift2 25s ease-in-out infinite alternate-reverse'
        }}
      />

      <style>{`
        @keyframes chameleonShift {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(5%, 8%) scale(1.1); }
          100% { transform: translate(-5%, -4%) scale(0.95); }
        }
        @keyframes chameleonShift2 {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-8%, -5%) scale(1.05); }
          100% { transform: translate(6%, 7%) scale(1.15); }
        }
      `}</style>
    </div>
  );
}
