import { useEffect, useState } from "react";
import { Github, Code2, Radio } from "lucide-react";

type GithubStats = { repos: number; followers: number };
type CodeforcesStats = { solved: number; rating?: number };
export function DeveloperStats() {
  const [github, setGithub] = useState<GithubStats | null>(null);
  const [codeforces, setCodeforces] = useState<CodeforcesStats | null>(null);
  const [updated, setUpdated] = useState(false);
  useEffect(() => { let live = true; Promise.allSettled([
    fetch("https://api.github.com/users/Ahmed77khaled").then((r) => r.ok ? r.json() : Promise.reject()),
    Promise.all([fetch("https://codeforces.com/api/user.info?handles=Ahmed_Elfalah"), fetch("https://codeforces.com/api/user.status?handles=Ahmed_Elfalah")]).then(async ([info, submissions]) => {
      if (!info.ok || !submissions.ok) throw new Error("Codeforces request failed");
      const [profile, status] = await Promise.all([info.json(), submissions.json()]);
      if (profile.status !== "OK" || status.status !== "OK") throw new Error("Codeforces response failed");
      const solved = new Set(status.result.filter((submission: { verdict: string }) => submission.verdict === "OK").map((submission: { problem: { contestId?: number; index?: string; name?: string } }) => `${submission.problem.contestId}-${submission.problem.index}-${submission.problem.name}`)).size;
      return { solved, rating: profile.result[0]?.rating };
    }),
  ]).then(([gh, cf]) => { if (!live) return; if (gh.status === "fulfilled") setGithub({ repos: gh.value.public_repos, followers: gh.value.followers }); if (cf.status === "fulfilled") setCodeforces(cf.value); setUpdated(true); }); return () => { live = false; }; }, []);
  return <section id="developer-stats" className="relative py-20" data-testid="developer-stats-section"><div className="max-w-5xl mx-auto px-6"><div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-7"><Radio size={12} className={updated ? "text-primary" : "animate-pulse"}/>{updated ? "Live data · refreshed on visit" : "Loading live developer metrics"}</div><div className="grid md:grid-cols-2 gap-6">
    <a href="https://github.com/Ahmed77khaled" target="_blank" rel="noopener noreferrer" className="glass-card rounded-2xl p-7 hover:-translate-y-1 transition-transform"><div className="flex items-center gap-3"><Github className="text-primary"/><div><p className="font-bold">GitHub</p><p className="text-xs text-muted-foreground">Open-source activity</p></div></div><div className="flex gap-8 mt-7"><Metric value={github?.repos} label="Public repos"/><Metric value={github?.followers} label="Followers"/></div></a>
    <a href="https://codeforces.com" target="_blank" rel="noopener noreferrer" className="glass-card rounded-2xl p-7 hover:-translate-y-1 transition-transform"><div className="flex items-center gap-3"><Code2 className="text-primary"/><div><p className="font-bold">Codeforces & ACPC</p><p className="text-xs text-muted-foreground">Competitive programming</p></div></div><div className="flex gap-8 mt-7"><Metric value={codeforces?.solved} label="Problems solved"/><Metric value={codeforces?.rating ?? "G2"} label={codeforces?.rating ? "Current rating" : "ACPC division"}/></div></a>
  </div></div></section>;
}
function Metric({ value, label }: { value?: number | string; label: string }) { return <div><p className="text-2xl font-black text-primary">{value ?? "—"}</p><p className="text-xs text-muted-foreground mt-1">{label}</p></div>; }
