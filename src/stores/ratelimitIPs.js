export let ratelimitIPs = new Map();

/**
 * Save the IP address of the client in the ratelimitIPs map.
 * @param {string} stringEntriesIP string of IPs to add to the ratelimitIPs map
 * @return {void}
 */
export function saveEntriesIP(stringEntriesIP) {
    ratelimitIPs = new Map([
        ...ratelimitIPs.entries(),
        ...Object.entries(JSON.parse(stringEntriesIP)),
    ]);
    return;
}
