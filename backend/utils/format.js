/**
 * Utility functions to format Prisma results for Mongoose-compatible API responses.
 * Adds _id field (from id) and restructures User profile fields.
 */

/**
 * Format a Prisma User record to match the Mongoose response format.
 * Moves flat profile fields into a nested profile object and renames id to _id.
 */
/**
 * Safely parse a JSON string field into an array. Returns the value as-is if
 * it's already an array, or an empty array on failure.
 */
export function parseJsonArray(val) {
    if (Array.isArray(val)) return val;
    if (!val || typeof val !== 'string') return [];
    try { return JSON.parse(val); } catch { return []; }
}

export function formatUser(user) {
    if (!user) return null;
    return {
        _id: user.id,
        fullname: user.fullname,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        profile: {
            bio: user.bio || '',
            skills: parseJsonArray(user.skills),
            resume: user.resume || '',
            resumeOriginalName: user.resumeOriginalName || '',
            company: user.companyId || null,
            profilePhoto: user.profilePhoto || '',
        },
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
}

/**
 * Add _id field to a Prisma result object (copies from id).
 * Recursively handles nested objects and arrays for relation includes.
 */
// Fields stored as JSON strings that should be parsed to arrays in responses
const JSON_ARRAY_FIELDS = new Set(['skills', 'requirements']);

export function addId(obj) {
    if (!obj || typeof obj !== 'object' || obj instanceof Date) return obj;
    if (Array.isArray(obj)) return obj.map(addId);

    const result = {};
    for (const [key, val] of Object.entries(obj)) {
        if (JSON_ARRAY_FIELDS.has(key) && typeof val === 'string') {
            result[key] = parseJsonArray(val);
        } else if (Array.isArray(val)) {
            result[key] = val.map(item =>
                (item && typeof item === 'object' && !(item instanceof Date))
                    ? addId(item)
                    : item
            );
        } else if (val && typeof val === 'object' && !(val instanceof Date)) {
            result[key] = addId(val);
        } else {
            result[key] = val;
        }
    }
    if (result.id !== undefined) result._id = result.id;
    return result;
}
