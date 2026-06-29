import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, isAuthed } from "@/lib/admin";

/**
 * Diagnoses the GitHub publishing setup so the admin gets a plain answer
 * (token valid? repo found? write access?) instead of cryptic 401/403s.
 */
export const runtime = "nodejs";

type Status = "ok" | "no" | "invalid" | "missing" | "notfound" | "unknown";

function result(data: {
  ok: boolean;
  token: Status;
  repo: Status;
  write: Status;
  repo_name: string;
  branch?: string;
  message: string;
}) {
  return NextResponse.json(data);
}

export async function GET() {
  if (!isAuthed(cookies().get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";

  if (!token) {
    return result({
      ok: false,
      token: "missing",
      repo: "unknown",
      write: "unknown",
      repo_name: repo || "(not set)",
      message: "GITHUB_TOKEN is not set in your environment variables.",
    });
  }
  if (!repo || !repo.includes("/")) {
    return result({
      ok: false,
      token: "unknown",
      repo: "missing",
      write: "unknown",
      repo_name: repo || "(not set)",
      message: 'GITHUB_REPO must be "owner/name", e.g. LyraHK-Nikers/healthy-logs.',
    });
  }

  const [owner, name] = repo.split("/");
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "healthy-logs-admin",
  };

  let res: Response;
  try {
    res = await fetch(`https://api.github.com/repos/${owner}/${name}`, { headers });
  } catch {
    return result({
      ok: false,
      token: "unknown",
      repo: "unknown",
      write: "unknown",
      repo_name: repo,
      message: "Could not reach GitHub. Try again in a moment.",
    });
  }

  if (res.status === 401) {
    return result({
      ok: false,
      token: "invalid",
      repo: "unknown",
      write: "unknown",
      repo_name: repo,
      message:
        "Token rejected (401). The GITHUB_TOKEN value is wrong, expired, or a placeholder — generate a new token and paste the full value, then redeploy.",
    });
  }
  if (res.status === 404) {
    return result({
      ok: false,
      token: "ok",
      repo: "notfound",
      write: "unknown",
      repo_name: repo,
      branch,
      message:
        "Token works but can't see this repo (404). Check GITHUB_REPO spelling and that the token includes this repository.",
    });
  }
  if (res.status === 403) {
    return result({
      ok: false,
      token: "ok",
      repo: "no",
      write: "no",
      repo_name: repo,
      message:
        "Forbidden (403). If the owner is an organization, the token needs org approval — or use a classic token with the 'repo' scope.",
    });
  }
  if (!res.ok) {
    return result({
      ok: false,
      token: "unknown",
      repo: "unknown",
      write: "unknown",
      repo_name: repo,
      message: `GitHub returned ${res.status}.`,
    });
  }

  const json = await res.json();
  const canWrite = json?.permissions?.push === true;

  if (canWrite) {
    return result({
      ok: true,
      token: "ok",
      repo: "ok",
      write: "ok",
      repo_name: repo,
      branch,
      message: "All good — publishing should work.",
    });
  }

  return result({
    ok: false,
    token: "ok",
    repo: "ok",
    write: "no",
    repo_name: repo,
    branch,
    message:
      "Token can read the repo but not write to it. Fine-grained token → set Contents: Read and write. Or use a classic token with the 'repo' scope. Redeploy after changing it.",
  });
}
