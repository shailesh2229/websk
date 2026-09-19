

export function WorkSection() {
  return (
    <section className="bg-transparent text-white pt-[108px] pb-24 w-full flex flex-col min-h-full px-4 md:px-8">
      <div className="container mx-auto max-w-[1400px]">
        <h1 className="text-8xl md:text-[12rem] font-bold tracking-tighter opacity-80 mb-12">3 WORK</h1>
        <div className="max-w-2xl text-2xl md:text-4xl font-light leading-relaxed opacity-60 space-y-12">
          <p>This is a dummy layer for the Work section.</p>
          <p>It exists solely to prove that the zoom engine works and that the camera passes through the nested wireframe shells seamlessly.</p>
          <p>Notice how the background is completely transparent, allowing you to clearly see the wireframes moving behind the text.</p>
          <p>We are adding enough text here so that the layer becomes tall enough to trigger native scrolling. Go ahead and scroll down.</p>
          <p>If you reach the bottom of this container and keep scrolling (pulling by 80px), the engine will not advance because this is the last layer.</p>
          <p>Dummy line to ensure height.</p>
          <p>Dummy line to ensure height.</p>
          <p>Dummy line to ensure height.</p>
          <p>Bottom of the dummy Work page.</p>
        </div>
      </div>
    </section>
  );
}
