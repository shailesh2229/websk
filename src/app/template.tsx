// template.tsx: pass-through only.
// Page transitions are now driven by CSS on #page-shell
// via html[data-nav] attributes set by PageNavigator.
export default function Template({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
