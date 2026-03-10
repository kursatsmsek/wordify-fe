const BASE = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080").replace(/\/+$/, "");
const inFlightRequests = new Map();

function buildRequestKey(url, options = {}) {
    const method = (options.method || "GET").toUpperCase();
    const body = typeof options.body === "string" ? options.body : JSON.stringify(options.body || "");
    return `${method}::${url}::${body}`;
}

async function request(url, options = {}) {
    const requestUrl = `${BASE}${url}`;
    const dedupe = options.dedupe !== false;
    const key = dedupe ? buildRequestKey(requestUrl, options) : null;

    if (key && inFlightRequests.has(key)) {
        return inFlightRequests.get(key);
    }

    const promise = (async () => {
        const res = await fetch(requestUrl, {
            headers: { "Content-Type": "application/json", ...options.headers },
            ...options,
        });
        if (res.status === 204) return null;
        if (!res.ok) {
            const text = await res.text().catch(() => "");
            throw new Error(`API ${res.status}: ${text || res.statusText}`);
        }
        return res.json();
    })();

    if (!key) return promise;

    inFlightRequests.set(key, promise);
    return promise.finally(() => {
        inFlightRequests.delete(key);
    });
}

// ─── Words ────────────────────────────────────────────────────────────────────

export const wordsApi = {
    /** GET /api/words — paginated */
    getAll: ({ q, level, page = 0, size = 20, sort = "created_at" } = {}) => {
        const params = new URLSearchParams();
        if (q) params.set("q", q);
        if (level) params.set("level", level);
        params.set("page", page);
        params.set("size", size);
        params.set("sort", sort);
        return request(`/api/words?${params}`);
    },

    /** GET /api/words/:id */
    getById: (id) => request(`/api/words/${id}`),

    /** POST /api/words */
    create: (body) =>
        request("/api/words", { method: "POST", body: JSON.stringify(body) }),

    /** PUT /api/words/:id */
    update: (id, body) =>
        request(`/api/words/${id}`, { method: "PUT", body: JSON.stringify(body) }),

    /** DELETE /api/words/:id → 204 */
    delete: (id) => request(`/api/words/${id}`, { method: "DELETE" }),

    /** GET /api/words/quiz?type=RECENT&count=10 → WordResponse[] */
    getQuizWords: (type, count = 10) =>
        request(`/api/words/quiz?type=${type}&count=${count}`),
};

// ─── Quizzes ──────────────────────────────────────────────────────────────────

export const quizzesApi = {
    /** POST /api/quizzes */
    create: (body) =>
        request("/api/quizzes", { method: "POST", body: JSON.stringify(body) }),

    /** GET /api/quizzes — paginated */
    getAll: ({ page = 0, size = 20 } = {}) =>
        request(`/api/quizzes?page=${page}&size=${size}`),

    /** GET /api/quizzes/:id */
    getById: (id) => request(`/api/quizzes/${id}`),

    /** GET /api/quizzes/stats */
    getStats: () => request("/api/quizzes/stats"),
};

// ─── Readings ─────────────────────────────────────────────────────────────────

export const readingsApi = {
    /** GET /api/readings — paginated */
    getAll: ({ page = 0, size = 20 } = {}) =>
        request(`/api/readings?page=${page}&size=${size}`),

    /** GET /api/readings/:id */
    getById: (id) => request(`/api/readings/${id}`),

    /** POST /api/readings/create */
    create: (body = {}) =>
        request("/api/readings/create", {
            method: "POST",
            body: JSON.stringify(body),
        }),
};
