import config from '../config';

/**
 * Get build numbers from the API endpoint.
 *
 * This will fetch all release builds including shipped, aborted, and not
 * started yet.
 */
export async function getBuildNumbers(product, branch, version) {
  const url = new URL(`${config.API_URL}/releases`);
  const params = new URLSearchParams({
    product,
    branch,
    version,
    status: 'shipped,aborted,scheduled',
  });
  url.search = params;
  const res = await fetch(url);
  const releases = await res.json();
  return releases.map(release => release.build_number);
}

/**
 * Get shipped releases
 *
 * This will fetch only shipped releases for a specific branch-product
 * combination. Optionally the version can be specified.
 */
export async function getShippedReleases(product, branch, version = null) {
  const url = new URL(`${config.API_URL}/releases`);
  const params = new URLSearchParams({
    product,
    branch,
    status: 'shipped',
  });
  if (version !== null) {
    params.version = version;
  }
  url.search = params;
  const res = await fetch(url);
  const data = await res.json();
  return data.reverse().map(r => `${r.version}build${r.build_number}`);
}
