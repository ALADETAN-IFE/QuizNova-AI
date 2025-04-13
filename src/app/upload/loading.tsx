export default function Loading() {
  return (
    <main className="container mx-auto px-4 py-20">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center gradient-text">
          Upload Your Study Material
        </h1>
        <div className="card border-2 border-dashed border-holographic-silver">
          <div className="text-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-midnight-gray animate-pulse"></div>
              <p className="text-cool-white/70">Loading upload interface...</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 