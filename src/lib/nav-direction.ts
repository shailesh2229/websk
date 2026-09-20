// Tiny module-level store for navigation direction.
// Used by PageNavigator.tsx (writer) and template.tsx (reader).
type Direction = "next" | "prev" | "none";
let _direction: Direction = "none";

export const navDirection = {
  get(): Direction {
    return _direction;
  },
  set(d: Direction) {
    _direction = d;
  },
};
