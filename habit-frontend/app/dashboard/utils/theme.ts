export const T = {
  bg: "#f4eefc",
  white: "#fff9ff",
  border: "#e5dcf2",
  text: "#2d2a26",
  text2: "#6b6560",
  text3: "#a09990",
  lavender: "#b8a9d9",
  lavL: "#ede8f7",
  lavD: "#8b77c2",
  pink: "#f4a7b9",
  pinkL: "#fde8ed",
  pinkD: "#e8798f",
  mint: "#90cfc0",
  mintL: "#ddf2ed",
  mintD: "#4db6a0",
  peach: "#f7c5a0",
  peachL: "#fef0e6",
  peachD: "#e8925a",
  sky: "#a8cff0",
  skyL: "#deeefa",
  skyD: "#5aabde",
  lemon: "#f5e090",
  lemonL: "#fdf7d6",
  lemonD: "#c9a830",
};

export const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const MONTHS_S = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export const PALETTE = [
  { dot: T.lavender, fill: T.lavender, text: T.lavD },
  { dot: T.pink, fill: T.pink, text: T.pinkD },
  { dot: T.mint, fill: T.mint, text: T.mintD },
  { dot: T.peach, fill: T.peach, text: T.peachD },
  { dot: T.sky, fill: T.sky, text: T.skyD },
  { dot: T.lemon, fill: T.lemon, text: T.lemonD },
];

export const DASHBOARD_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
.page-wrap{max-width:1560px;margin:0 auto;padding:32px 28px 72px}
.hero,.mid-grid{display:grid;gap:20px}
.hero{grid-template-columns:1fr 1fr}
.mid-grid{grid-template-columns:1fr 320px}
.kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.week-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:10px}
.m-scroll{overflow-x:auto;padding:16px 20px 20px}
.m-inner{min-width:860px}
.top-row:hover,.m-row:hover{background:${T.bg}}
.m-cell:hover{transform:scale(1.35)}
.month-gradient{
  background: linear-gradient(115deg, #7f63b7 0%, #e87797 45%, #5ca8dc 100%);
  -webkit-background-clip:text;
  background-clip:text;
  color:transparent;
}
.kpi-card:hover .kpi-value{animation:kpiGlow 1.9s ease-in-out infinite}
@keyframes kpiGlow{
  0%,100%{filter:drop-shadow(0 0 0 rgba(129,99,179,0))}
  50%{filter:drop-shadow(0 0 10px rgba(129,99,179,.36))}
}
.reveal{
  opacity:0;
  transform:translateY(14px);
  animation:fadeUp .62s cubic-bezier(.22,1,.36,1) forwards;
  animation-delay:var(--d,0ms);
}
@keyframes fadeUp{
  to{
    opacity:1;
    transform:translateY(0);
  }
}
@media (max-width:1100px){.hero,.mid-grid{grid-template-columns:1fr}}
@media (max-width:760px){
  .page-wrap{padding:16px 10px 28px}
  .topbar{flex-wrap:wrap;gap:10px}
  .topnav{display:none}
  .kpi-grid{grid-template-columns:repeat(2,1fr)}
  .week-grid{grid-template-columns:repeat(4,1fr)}
  .hero-card{padding:20px 16px!important}
  .section-pad{padding:16px!important}
  .rings-wrap{display:grid!important;grid-template-columns:repeat(2,1fr);gap:10px}
}
@media (max-width:430px){
  .kpi-grid{grid-template-columns:1fr}
  .week-grid{grid-template-columns:repeat(2,1fr)}
}
`;

