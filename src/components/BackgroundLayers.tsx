export function BackgroundLayers() {
  return (
    <>
      <div className="az-aurora" aria-hidden>
        <div className="az-aurora__blob az-aurora__blob--1" />
        <div className="az-aurora__blob az-aurora__blob--2" />
        <div className="az-aurora__blob az-aurora__blob--3" />
      </div>
      <div className="az-mesh"    aria-hidden />
      <div className="az-vignette" aria-hidden />
      <div className="az-grain"   aria-hidden />
    </>
  );
}
