// Module-level store: did the user arrive at Home from About (fly-out)?
let _fromAbout = false;

export const homeEntry = {
  get fromAbout(): boolean { return _fromAbout; },
  setFromAbout(v: boolean) { _fromAbout = v; },
};
