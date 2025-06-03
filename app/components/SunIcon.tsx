export const SunIcon = () => (
  <div className="relative">
    {/* Container that clips the bottom half */}
    <div className="w-20 h-10 overflow-hidden relative">
      <div className="w-20 h-20 rounded-full bg-gradient-to-b from-orange-400 via-orange-300 to-yellow-200 flex items-center justify-center relative">
        {/* Sun rays - all rays for natural look */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-6 bg-white rounded-full opacity-90"
              style={{
                top: '8px',
                left: '50%',
                transformOrigin: '50% 32px',
                transform: `translateX(-50%) rotate(${i * 45}deg)`,
              }}
            />
          ))}
        </div>
        {/* Inner sun circle */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-b from-yellow-200 to-yellow-300 relative z-10 shadow-inner" />
      </div>
    </div>
    {/* Horizon line */}
    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent"></div>
  </div>
) 